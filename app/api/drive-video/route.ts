import { NextRequest, NextResponse } from 'next/server';
import { resolveGoogleDriveVideoUrl } from '@/lib/resolveGoogleDriveVideoUrl';
import { getClientIp, rateLimit } from '@/lib/publicApiGuard';

export const dynamic = 'force-dynamic';

const FORWARDED_HEADERS = ['content-type', 'content-length', 'content-range', 'accept-ranges'] as const;
const FILE_ID_RE = /^[a-zA-Z0-9_-]{10,128}$/;

export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('fileId');

  if (!fileId || !FILE_ID_RE.test(fileId)) {
    return NextResponse.json({ error: 'Missing or invalid fileId' }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (!rateLimit(`drive-video:${ip}`, { limit: 60, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const videoUrl = await resolveGoogleDriveVideoUrl(fileId);
    const rangeHeader = request.headers.get('range');
    const upstream = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: upstream.status || 502 });
    }

    const headers = new Headers();
    for (const name of FORWARDED_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) {
        headers.set(name, value);
      }
    }
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to resolve Google Drive video' }, { status: 502 });
  }
}
