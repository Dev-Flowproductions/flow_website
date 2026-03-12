import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_SECRET = process.env.CMS_WEBHOOK_SECRET;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  // Verify secret
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get('x-webhook-secret');
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    console.error('[blog-webhook] Supabase service role key not configured');
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  // Supports both:
  //   { action: "delete", slug: "..." }          (CMS format)
  //   { event: "cms.post.deleted", post: {...} } (event format)
  const isDelete =
    body.action === 'delete' ||
    body.event === 'cms.post.deleted';

  if (isDelete) {
    const slug: string | undefined = body.slug ?? body.post?.slug;
    const cmsId: string | undefined = body.id ?? body.post?.id;

    if (!slug && !cmsId) {
      return NextResponse.json({ error: 'Missing slug or id' }, { status: 400 });
    }

    let rowId: string | null = null;

    // Try cms_id first (stable across locales)
    if (cmsId) {
      const byCmsId = await supabase
        .from('blog_posts')
        .select('id')
        .eq('cms_id', cmsId)
        .maybeSingle();
      if (byCmsId.data) rowId = byCmsId.data.id;
    }

    // Fall back to matching slug across all locales
    if (!rowId && slug) {
      for (const l of ['pt', 'en', 'fr']) {
        const bySlug = await supabase
          .from('blog_posts')
          .select('id')
          .eq(`slug->>${l}`, slug)
          .maybeSingle();
        if (bySlug.data) { rowId = bySlug.data.id; break; }
      }
    }

    if (!rowId) {
      console.warn(`[blog-webhook] Delete: no post found for cmsId="${cmsId}" slug="${slug}"`);
      return NextResponse.json({ ok: true, action: 'not_found' });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', rowId);

    if (error) {
      console.error('[blog-webhook] Delete error:', error.message);
      return NextResponse.json({ error: 'DB delete failed', detail: error.message }, { status: 500 });
    }

    console.log(`[blog-webhook] Deleted post id="${rowId}" slug="${slug}"`);
    return NextResponse.json({ ok: true, action: 'deleted', deleted: slug });
  }

  // ── PUBLISH ───────────────────────────────────────────────────────────────
  if (body.event !== 'cms.post.published') {
    return NextResponse.json({ ok: true, message: 'Event ignored' });
  }

  const post = body.post;
  const locale: string = post?.locale || 'pt';

  // Find an existing row — try by cms_id first (stable across locales),
  // then fall back to searching every locale slug so EN/FR additions merge into the PT row.
  const selectFields = 'id, slug, title, content, excerpt, featured_image_path';

  let existing: {
    id: string;
    slug: Record<string, string>;
    title: Record<string, string>;
    content: Record<string, string>;
    excerpt: Record<string, string>;
    featured_image_path: string | null;
  } | null = null;

  if (post?.id) {
    const byCmsId = await supabase
      .from('blog_posts')
      .select(selectFields)
      .eq('cms_id', post.id)
      .maybeSingle();
    if (byCmsId.data) existing = byCmsId.data;
  }

  if (!existing && post?.slug) {
    for (const l of ['pt', 'en', 'fr']) {
      const bySlug = await supabase
        .from('blog_posts')
        .select(selectFields)
        .eq(`slug->>${l}`, post.slug)
        .maybeSingle();
      if (bySlug.data) { existing = bySlug.data; break; }
    }
  }

  const now = new Date().toISOString();

  if (existing) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        cms_id:              post.id,
        title:               { ...existing.title,   [locale]: post.title },
        content:             { ...existing.content, [locale]: post.content_md },
        excerpt:             { ...existing.excerpt, [locale]: post.excerpt },
        slug:                { ...(existing.slug ?? {}), [locale]: post.slug },
        featured_image_path: post.cover_image_url ?? existing.featured_image_path ?? null,
        seo_title:           post.seo_title ?? null,
        meta_description:    post.meta_description ?? null,
        json_ld:             post.json_ld ?? null,
        status:              'published',
        updated_at:          now,
      })
      .eq('id', existing.id);

    if (error) {
      console.error('[blog-webhook] Update error:', error.message);
      return NextResponse.json({ error: 'DB update failed', detail: error.message }, { status: 500 });
    }

    console.log(`[blog-webhook] Updated post "${post.slug}" (${locale})`);
    return NextResponse.json({ ok: true, action: 'updated', slug: post.slug });
  }

  const { error } = await supabase
    .from('blog_posts')
    .insert({
      cms_id:              post.id,
      title:               { [locale]: post.title },
      content:             { [locale]: post.content_md },
      excerpt:             { [locale]: post.excerpt },
      slug:                { [locale]: post.slug },
      featured_image_path: post.cover_image_url ?? null,
      seo_title:           post.seo_title ?? null,
      meta_description:    post.meta_description ?? null,
      json_ld:             post.json_ld ?? null,
      status:              'published',
      published_at:        now,
      updated_at:          now,
    });

  if (error) {
    console.error('[blog-webhook] Insert error:', error.message);
    return NextResponse.json({ error: 'DB insert failed', detail: error.message }, { status: 500 });
  }

  console.log(`[blog-webhook] Inserted post "${post.slug}" (${locale})`);
  return NextResponse.json({ ok: true, action: 'inserted', slug: post.slug });
}
