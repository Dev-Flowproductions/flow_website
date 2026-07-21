import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isBlogDeleteEvent, isBlogSyncEvent } from '@/lib/blogCms';
import { syncBlogPostFromCms } from '@/lib/blogWebhookSync';

const WEBHOOK_SECRET = process.env.CMS_WEBHOOK_SECRET?.trim();

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[blog-webhook] CMS_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const incoming = req.headers.get('x-webhook-secret');
  if (incoming !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    console.error('[blog-webhook] Supabase service role key not configured');
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const bodyAction = body.action as string | undefined;
  const bodyEvent = body.event as string | undefined;

  if (isBlogDeleteEvent(bodyEvent, bodyAction)) {
    const bodyPost = body.post as Record<string, unknown> | undefined;
    const slug = (body.slug ?? bodyPost?.slug) as string | undefined;
    const cmsId = (body.id ?? bodyPost?.id) as string | undefined;

    if (!slug && !cmsId) {
      return NextResponse.json({ error: 'Missing slug or id' }, { status: 400 });
    }

    const rowIds = new Set<string>();

    if (cmsId) {
      const { data, error: lookupError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('cms_id', cmsId);
      if (lookupError) {
        console.error('[blog-webhook] Delete lookup error:', lookupError.message);
        return NextResponse.json(
          { error: 'DB lookup failed', detail: lookupError.message },
          { status: 500 },
        );
      }
      for (const row of data ?? []) rowIds.add(row.id);
    }

    if (slug) {
      for (const l of ['pt', 'en', 'fr']) {
        const { data } = await supabase
          .from('blog_posts')
          .select('id')
          .eq(`slug->>${l}`, slug);
        for (const row of data ?? []) rowIds.add(row.id);
      }
    }

    if (rowIds.size === 0) {
      console.warn(`[blog-webhook] Delete: no post found for cmsId="${cmsId}" slug="${slug}"`);
      return NextResponse.json({ ok: true, action: 'not_found' });
    }

    const ids = [...rowIds];
    const { error } = await supabase.from('blog_posts').delete().in('id', ids);
    if (error) {
      console.error('[blog-webhook] Delete error:', error.message);
      return NextResponse.json({ error: 'DB delete failed', detail: error.message }, { status: 500 });
    }

    console.log(`[blog-webhook] Deleted ${ids.length} post row(s) slug="${slug}" cmsId="${cmsId}"`);
    return NextResponse.json({ ok: true, action: 'deleted', deleted: slug, count: ids.length });
  }

  if (!isBlogSyncEvent(bodyEvent, bodyAction)) {
    return NextResponse.json({ ok: true, message: 'Event ignored', event: bodyEvent });
  }

  const result = await syncBlogPostFromCms(supabase, {
    event: bodyEvent,
    post: body.post as Record<string, unknown> | undefined,
  });

  if ('error' in result) {
    console.error(`[blog-webhook] ${result.error}:`, result.detail ?? '');
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: result.status },
    );
  }

  console.log(
    `[blog-webhook] ${result.action} post "${result.slug ?? ''}" (event: ${bodyEvent ?? bodyAction})`,
  );
  return NextResponse.json({ ok: true, action: result.action, slug: result.slug });
}
