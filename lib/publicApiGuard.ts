import { NextRequest, NextResponse } from 'next/server';

type RateEntry = { count: number; resetAt: number };

/** Best-effort in-memory limiter (per server instance). */
const hits = new Map<string, RateEntry>();

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function rateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function allowedOrigins(): Set<string> {
  const origins = new Set<string>([
    'https://flowproductions.pt',
    'https://www.flowproductions.pt',
  ]);

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (site) {
    try {
      origins.add(new URL(site).origin);
    } catch {
      origins.add(site);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return origins;
}

function requestOrigin(request: NextRequest): string | null {
  const origin = request.headers.get('origin')?.replace(/\/$/, '');
  if (origin) return origin;

  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/**
 * Guards public Martech tool APIs: same-site Origin/Referer + per-IP rate limit.
 * Returns a NextResponse to send immediately, or null if the request may proceed.
 */
export function assertPublicToolAccess(request: NextRequest): NextResponse | null {
  const origin = requestOrigin(request);
  if (!origin || !allowedOrigins().has(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const bucket = `${ip}:${request.nextUrl.pathname}`;
  if (!rateLimit(bucket, { limit: 8, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  return null;
}
