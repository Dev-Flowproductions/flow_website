/** Witflow CMS webhook event names (legacy + current). */
export const BLOG_SYNC_EVENTS = new Set([
  'cms.post.published',
  'cms.post.updated',
  'post.published',
  'post.updated',
]);

export const BLOG_DELETE_EVENTS = new Set([
  'cms.post.deleted',
  'post.deleted',
]);

export function isBlogSyncEvent(event: string | undefined, action: string | undefined): boolean {
  if (action === 'publish' || action === 'published') return true;
  return !!event && BLOG_SYNC_EVENTS.has(event);
}

export function isBlogDeleteEvent(event: string | undefined, action: string | undefined): boolean {
  if (action === 'delete') return true;
  return !!event && BLOG_DELETE_EVENTS.has(event);
}

/** Cover URL from Witflow webhook or Content API payload shapes. */
export function extractCoverImageUrl(post: Record<string, unknown>): string | null {
  const candidates = [
    post.cover_image_url,
    post.coverImageUrl,
    post.cover_image,
    post.coverImage,
    post.featured_image_url,
    post.featuredImageUrl,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}
