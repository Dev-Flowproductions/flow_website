import { NextRequest, NextResponse } from 'next/server';
import { resolveGoogleDriveVideoUrl } from '@/lib/resolveGoogleDriveVideoUrl';

export const dynamic = 'force-dynamic';

const FORWARDED_HEADERS = ['content-type', 'content-length', 'content-range', 'accept-ranges'] as const;

export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('fileId');

  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
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
