import { createServiceClient } from '@/lib/supabase/service';

const COVERS_BUCKET = 'covers';

type PostCoverFields = {
  featured_image_path?: string | null;
  cms_id?: string | null;
};

/**
 * Resolves the hero/cover image for a blog post.
 * 1. DB field from webhook sync
 * 2. Latest file in Supabase Storage `covers/{cms_id}/` (Witflow upload path)
 */
export async function resolveBlogCoverImage(post: PostCoverFields): Promise<string | null> {
  if (post.featured_image_path?.trim()) {
    return post.featured_image_path.trim();
  }

  if (!post.cms_id?.trim()) {
    return null;
  }

  return lookupCoverInStorage(post.cms_id.trim());
}

async function lookupCoverInStorage(cmsId: string): Promise<string | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: files, error } = await supabase.storage
    .from(COVERS_BUCKET)
    .list(cmsId, {
      limit: 20,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error || !files?.length) {
    return null;
  }

  const coverFile = files.find(
    (f) => f.name && (f.name.startsWith('cover-') || f.name.startsWith('cover.')),
  );
  if (!coverFile?.name) {
    return null;
  }

  const { data } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(`${cmsId}/${coverFile.name}`);
  return data.publicUrl || null;
}
