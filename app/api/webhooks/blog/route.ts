import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';

const WEBHOOK_SECRET = process.env.CMS_WEBHOOK_SECRET;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function mdToHtml(md: string): Promise<string> {
  if (!md) return '';
  if (md.trimStart().startsWith('<')) return md; // already HTML
  return await marked(md, { gfm: true, breaks: true });
}

export async function POST(req: NextRequest) {
  // Verify secret
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get('x-webhook-secret');
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    console.error('[blog-webhook] Supabase service role key not configured');
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const bodyAction = body.action as string | undefined;
  const bodyEvent  = body.event  as string | undefined;

  // ── DELETE ────────────────────────────────────────────────────────────────
  // Supports: { action: "delete", slug: "..." }
  //       or: { event: "cms.post.deleted", post: { id, slug } }
  const isDelete = bodyAction === 'delete' || bodyEvent === 'cms.post.deleted';

  if (isDelete) {
    const bodyPost  = body.post as Record<string, unknown> | undefined;
    const slug      = (body.slug  ?? bodyPost?.slug)  as string | undefined;
    const cmsId     = (body.id    ?? bodyPost?.id)    as string | undefined;

    if (!slug && !cmsId) {
      return NextResponse.json({ error: 'Missing slug or id' }, { status: 400 });
    }

    let rowId: string | null = null;

    if (cmsId) {
      const byCmsId = await supabase
        .from('blog_posts').select('id').eq('cms_id', cmsId).maybeSingle();
      if (byCmsId.data) rowId = byCmsId.data.id;
    }

    if (!rowId && slug) {
      for (const l of ['pt', 'en', 'fr']) {
        const bySlug = await supabase
          .from('blog_posts').select('id').eq(`slug->>${l}`, slug).maybeSingle();
        if (bySlug.data) { rowId = bySlug.data.id; break; }
      }
    }

    if (!rowId) {
      console.warn(`[blog-webhook] Delete: no post found for cmsId="${cmsId}" slug="${slug}"`);
      return NextResponse.json({ ok: true, action: 'not_found' });
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', rowId);
    if (error) {
      console.error('[blog-webhook] Delete error:', error.message);
      return NextResponse.json({ error: 'DB delete failed', detail: error.message }, { status: 500 });
    }

    console.log(`[blog-webhook] Deleted post id="${rowId}" slug="${slug}"`);
    return NextResponse.json({ ok: true, action: 'deleted', deleted: slug });
  }

  // ── PUBLISH ───────────────────────────────────────────────────────────────
  if (bodyEvent !== 'cms.post.published') {
    return NextResponse.json({ ok: true, message: 'Event ignored' });
  }

  const post = body.post as Record<string, unknown> | undefined;
  if (!post) {
    return NextResponse.json({ error: 'Missing post object' }, { status: 400 });
  }

  const cmsId     = post.id    as string | undefined;
  const cmsSlug   = post.slug  as string | undefined;
  const coverImage = post.cover_image_url as string | null | undefined;

  // ── Multi-locale payload: { post: { translations: { pt: {...}, en: {...} } } }
  const translations = post.translations as Record<string, Record<string, unknown>> | undefined;

  const title:           Record<string, string>  = {};
  const slug:            Record<string, string>  = {};
  const excerpt:         Record<string, string>  = {};
  const content:         Record<string, string>  = {};
  const seo_title:       Record<string, string>  = {};
  const meta_description:Record<string, string>  = {};
  const json_ld:         Record<string, unknown> = {};

  if (translations && Object.keys(translations).length > 0) {
    // New multi-locale format: all languages in one webhook call
    for (const locale of Object.keys(translations)) {
      const t = translations[locale];
      title[locale]   = (t.title   as string) ?? '';
      slug[locale]    = (t.slug    as string) ?? cmsSlug ?? '';
      excerpt[locale] = (t.excerpt as string) ?? '';
      content[locale] = await mdToHtml((t.content_md as string) ?? '');
      if (t.seo_title)        seo_title[locale]        = t.seo_title        as string;
      if (t.meta_description) meta_description[locale] = t.meta_description as string;
      if (t.json_ld)          json_ld[locale]           = t.json_ld;
    }
  } else {
    // Legacy single-locale format: { post: { locale, title, slug, content_md, ... } }
    const locale  = (post.locale as string) || 'pt';
    title[locale]   = (post.title   as string) ?? '';
    slug[locale]    = (post.slug    as string) ?? '';
    excerpt[locale] = (post.excerpt as string) ?? '';
    content[locale] = await mdToHtml((post.content_md as string) ?? '');
    if (post.seo_title)        seo_title[locale]        = post.seo_title        as string;
    if (post.meta_description) meta_description[locale] = post.meta_description as string;
    if (post.json_ld)          json_ld[locale]           = post.json_ld as unknown;
  }

  const now = new Date().toISOString();

  // Find existing row to merge (preserves locales we're not updating)
  let existing: {
    id: string;
    slug: Record<string, string>;
    title: Record<string, string>;
    content: Record<string, string>;
    excerpt: Record<string, string>;
    seo_title: Record<string, string> | null;
    meta_description: Record<string, string> | null;
    json_ld: Record<string, unknown> | null;
    featured_image_path: string | null;
    published_at: string | null;
  } | null = null;

  if (cmsId) {
    const byCmsId = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, excerpt, seo_title, meta_description, json_ld, featured_image_path, published_at')
      .eq('cms_id', cmsId)
      .maybeSingle();
    if (byCmsId.data) existing = byCmsId.data;
  }

  if (!existing && cmsSlug) {
    for (const l of ['pt', 'en', 'fr']) {
      const bySlug = await supabase
        .from('blog_posts')
        .select('id, slug, title, content, excerpt, seo_title, meta_description, json_ld, featured_image_path, published_at')
        .eq(`slug->>${l}`, cmsSlug)
        .maybeSingle();
      if (bySlug.data) { existing = bySlug.data; break; }
    }
  }

  const mergedSeoTitle        = Object.keys(seo_title).length        ? { ...(existing?.seo_title        ?? {}), ...seo_title }        : (existing?.seo_title        ?? null);
  const mergedMetaDescription = Object.keys(meta_description).length ? { ...(existing?.meta_description ?? {}), ...meta_description } : (existing?.meta_description ?? null);
  const mergedJsonLd          = Object.keys(json_ld).length          ? { ...(existing?.json_ld          ?? {}), ...json_ld }          : (existing?.json_ld          ?? null);

  if (existing) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        cms_id:              cmsId,
        title:               { ...existing.title,   ...title },
        content:             { ...existing.content, ...content },
        excerpt:             { ...existing.excerpt, ...excerpt },
        slug:                { ...(existing.slug ?? {}), ...slug },
        featured_image_path: coverImage ?? existing.featured_image_path ?? null,
        seo_title:           mergedSeoTitle,
        meta_description:    mergedMetaDescription,
        json_ld:             mergedJsonLd,
        status:              'published',
        updated_at:          now,
      })
      .eq('id', existing.id);

    if (error) {
      console.error('[blog-webhook] Update error:', error.message);
      return NextResponse.json({ error: 'DB update failed', detail: error.message }, { status: 500 });
    }

    console.log(`[blog-webhook] Updated post "${cmsSlug}" (locales: ${Object.keys(title).join(', ')})`);
    return NextResponse.json({ ok: true, action: 'updated', slug: cmsSlug });
  }

  const { error } = await supabase
    .from('blog_posts')
    .insert({
      cms_id:              cmsId,
      title,
      content,
      excerpt,
      slug,
      featured_image_path: coverImage ?? null,
      seo_title:           mergedSeoTitle,
      meta_description:    mergedMetaDescription,
      json_ld:             mergedJsonLd,
      status:              'published',
      published_at:        now,
      updated_at:          now,
    });

  if (error) {
    console.error('[blog-webhook] Insert error:', error.message);
    return NextResponse.json({ error: 'DB insert failed', detail: error.message }, { status: 500 });
  }

  console.log(`[blog-webhook] Inserted post "${cmsSlug}" (locales: ${Object.keys(title).join(', ')})`);
  return NextResponse.json({ ok: true, action: 'inserted', slug: cmsSlug });
}
