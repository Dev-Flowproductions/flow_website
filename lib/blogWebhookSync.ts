import { marked } from 'marked';
import type { SupabaseClient } from '@supabase/supabase-js';
import { extractCoverImageUrl } from '@/lib/blogCms';
import { parseCmsAuthor, type BlogAuthorLocales } from '@/lib/blogAuthor';

async function mdToHtml(md: string): Promise<string> {
  if (!md) return '';
  if (md.trimStart().startsWith('<')) return md;
  return await marked(md, { gfm: true, breaks: true });
}

export type BlogWebhookPayload = {
  event?: string;
  post?: Record<string, unknown>;
};

function collectAuthorsFromPost(post: Record<string, unknown>): BlogAuthorLocales {
  const authors: BlogAuthorLocales = {};
  const translations = post.translations as Record<string, Record<string, unknown>> | undefined;
  const topAuthor = parseCmsAuthor(post.author);
  const primaryLocale = (post.locale as string) || 'en';

  if (translations && Object.keys(translations).length > 0) {
    for (const locale of Object.keys(translations)) {
      const t = translations[locale];
      const fromTranslation = parseCmsAuthor(t.author);
      if (fromTranslation) {
        authors[locale] = fromTranslation;
      } else if (locale === primaryLocale && topAuthor) {
        authors[locale] = topAuthor;
      }
    }
  } else if (topAuthor) {
    authors[primaryLocale] = topAuthor;
  }

  if (topAuthor && !authors[primaryLocale]) {
    authors[primaryLocale] = topAuthor;
  }

  return authors;
}

function legacyAuthorColumns(authors: BlogAuthorLocales, primaryLocale: string) {
  const primary =
    authors[primaryLocale] ?? authors.en ?? authors.pt ?? authors.fr ?? Object.values(authors)[0];
  if (!primary) return {};
  return {
    author_name: primary.name ?? null,
    author_job_title: primary.jobTitle ?? null,
    author_bio: primary.bio ?? null,
    author_avatar_url: primary.avatarUrl ?? null,
  };
}

export async function syncBlogPostFromCms(
  supabase: SupabaseClient,
  body: BlogWebhookPayload,
): Promise<{ ok: true; action: 'inserted' | 'updated'; slug?: string } | { error: string; status: number; detail?: string }> {
  const post = body.post;
  if (!post) {
    return { error: 'Missing post object', status: 400 };
  }

  const cmsId = post.id as string | undefined;
  const cmsSlug = post.slug as string | undefined;
  const coverImage = extractCoverImageUrl(post);
  const primaryLocale = (post.locale as string) || 'en';
  const incomingAuthors = collectAuthorsFromPost(post);

  const translations = post.translations as Record<string, Record<string, unknown>> | undefined;

  const title: Record<string, string> = {};
  const slug: Record<string, string> = {};
  const excerpt: Record<string, string> = {};
  const content: Record<string, string> = {};
  const seo_title: Record<string, string> = {};
  const meta_description: Record<string, string> = {};
  const json_ld: Record<string, unknown> = {};

  if (translations && Object.keys(translations).length > 0) {
    for (const locale of Object.keys(translations)) {
      const t = translations[locale];
      title[locale] = (t.title as string) ?? '';
      slug[locale] = (t.slug as string) ?? cmsSlug ?? '';
      excerpt[locale] = (t.excerpt as string) ?? '';
      content[locale] = await mdToHtml((t.content_md as string) ?? '');
      if (t.seo_title) seo_title[locale] = t.seo_title as string;
      if (t.meta_description) meta_description[locale] = t.meta_description as string;
      if (t.json_ld) json_ld[locale] = t.json_ld;
    }
  } else {
    const locale = primaryLocale;
    title[locale] = (post.title as string) ?? '';
    slug[locale] = (post.slug as string) ?? '';
    excerpt[locale] = (post.excerpt as string) ?? '';
    content[locale] = await mdToHtml((post.content_md as string) ?? '');
    if (post.seo_title) seo_title[locale] = post.seo_title as string;
    if (post.meta_description) meta_description[locale] = post.meta_description as string;
    if (post.json_ld) json_ld[locale] = post.json_ld as unknown;
  }

  const now = new Date().toISOString();

  type ExistingPost = {
    id: string;
    slug: Record<string, string>;
    title: Record<string, string>;
    content: Record<string, string>;
    excerpt: Record<string, string>;
    seo_title: Record<string, string> | null;
    meta_description: Record<string, string> | null;
    json_ld: Record<string, unknown> | null;
    featured_image_path: string | null;
    author: BlogAuthorLocales | null;
    published_at: string | null;
  };

  let existing: ExistingPost | null = null;

  const existingSelect =
    'id, slug, title, content, excerpt, seo_title, meta_description, json_ld, featured_image_path, author, published_at';

  if (cmsId) {
    const byCmsId = await supabase
      .from('blog_posts')
      .select(existingSelect)
      .eq('cms_id', cmsId)
      .maybeSingle();
    if (byCmsId.data) existing = byCmsId.data as ExistingPost;
  }

  if (!existing && cmsSlug) {
    for (const l of ['pt', 'en', 'fr']) {
      const bySlug = await supabase
        .from('blog_posts')
        .select(existingSelect)
        .eq(`slug->>${l}`, cmsSlug)
        .maybeSingle();
      if (bySlug.data) {
        existing = bySlug.data as ExistingPost;
        break;
      }
    }
  }

  const mergedSeoTitle = Object.keys(seo_title).length
    ? { ...(existing?.seo_title ?? {}), ...seo_title }
    : (existing?.seo_title ?? null);
  const mergedMetaDescription = Object.keys(meta_description).length
    ? { ...(existing?.meta_description ?? {}), ...meta_description }
    : (existing?.meta_description ?? null);
  const mergedJsonLd = Object.keys(json_ld).length
    ? { ...(existing?.json_ld ?? {}), ...json_ld }
    : (existing?.json_ld ?? null);

  const featuredImagePath = coverImage ?? existing?.featured_image_path ?? null;

  const mergedAuthor: BlogAuthorLocales | null = Object.keys(incomingAuthors).length
    ? { ...(existing?.author ?? {}), ...incomingAuthors }
    : (existing?.author ?? null);

  const authorColumns = mergedAuthor
    ? legacyAuthorColumns(mergedAuthor, primaryLocale)
    : {};

  if (existing) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        cms_id: cmsId,
        title: { ...existing.title, ...title },
        content: { ...existing.content, ...content },
        excerpt: { ...existing.excerpt, ...excerpt },
        slug: { ...(existing.slug ?? {}), ...slug },
        featured_image_path: featuredImagePath,
        author: mergedAuthor,
        seo_title: mergedSeoTitle,
        meta_description: mergedMetaDescription,
        json_ld: mergedJsonLd,
        status: 'published',
        updated_at: now,
        ...authorColumns,
      })
      .eq('id', existing.id);

    if (error) {
      return { error: 'DB update failed', status: 500, detail: error.message };
    }

    return { ok: true, action: 'updated', slug: cmsSlug };
  }

  const { error } = await supabase.from('blog_posts').insert({
    cms_id: cmsId,
    title,
    content,
    excerpt,
    slug,
    featured_image_path: featuredImagePath,
    author: mergedAuthor,
    seo_title: mergedSeoTitle,
    meta_description: mergedMetaDescription,
    json_ld: mergedJsonLd,
    status: 'published',
    published_at: now,
    updated_at: now,
    ...authorColumns,
  });

  if (error) {
    return { error: 'DB insert failed', status: 500, detail: error.message };
  }

  return { ok: true, action: 'inserted', slug: cmsSlug };
}
