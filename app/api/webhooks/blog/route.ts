import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_SECRET = process.env.CMS_WEBHOOK_SECRET;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

type BlogPost = {
  event: string;
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content_md: string;
    seo_title: string | null;
    meta_description: string | null;
    json_ld: object | null;
    cover_image_url: string | null;
    locale: string;
  };
  timestamp: string;
};

export async function POST(req: NextRequest) {
  // Verify secret
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get('x-webhook-secret');
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: BlogPost;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.event !== 'cms.post.published') {
    return NextResponse.json({ ok: true, message: 'Event ignored' });
  }

  const { post } = body;
  const locale = post.locale || 'pt';

  const supabase = getServiceClient();
  if (!supabase) {
    console.error('[blog-webhook] Supabase service role key not configured');
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  // Find an existing row for this post — try by cms_id first (stable across locales),
  // then fall back to searching every locale slug so EN/FR additions merge into the PT row.
  const selectFields = 'id, slug, title, content, excerpt, featured_image_path';

  let existing: { id: string; slug: Record<string, string>; title: Record<string, string>; content: Record<string, string>; excerpt: Record<string, string>; featured_image_path: string | null } | null = null;

  // 1. Try cms_id column if it exists
  const byCmsId = await supabase
    .from('blog_posts')
    .select(selectFields)
    .eq('cms_id', post.id)
    .maybeSingle();
  if (byCmsId.data) existing = byCmsId.data;

  // 2. Try matching the slug in any locale
  if (!existing) {
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
    // Merge into the existing JSONB columns for this locale
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

  // No existing post — insert a new one
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
