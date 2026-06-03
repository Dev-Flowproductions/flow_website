/**
 * Backfill blog_posts.featured_image_path from Supabase Storage covers/{cms_id}/.
 * Run: node scripts/backfill-blog-covers.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  try {
    const raw = readFileSync('.env.local', 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function resolveCoverFromStorage(cmsId) {
  const { data: files, error } = await supabase.storage
    .from('covers')
    .list(cmsId, { limit: 20, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !files?.length) return null;
  const coverFile = files.find((f) => f.name?.startsWith('cover-') || f.name?.startsWith('cover.'));
  if (!coverFile?.name) return null;
  const { data } = supabase.storage.from('covers').getPublicUrl(`${cmsId}/${coverFile.name}`);
  return data.publicUrl || null;
}

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('id, cms_id, slug, featured_image_path, title')
  .eq('status', 'published');

if (error) {
  console.error(error.message);
  process.exit(1);
}

let updated = 0;
let skipped = 0;

for (const post of posts || []) {
  if (post.featured_image_path?.trim()) {
    skipped++;
    continue;
  }
  if (!post.cms_id) {
    console.warn('No cms_id:', post.title?.pt || post.title?.en || post.id);
    continue;
  }
  const coverUrl = await resolveCoverFromStorage(post.cms_id);
  if (!coverUrl) {
    console.warn('No cover in storage for cms_id=', post.cms_id);
    continue;
  }
  const { error: upErr } = await supabase
    .from('blog_posts')
    .update({ featured_image_path: coverUrl, updated_at: new Date().toISOString() })
    .eq('id', post.id);
  if (upErr) {
    console.error('Update failed', post.id, upErr.message);
    continue;
  }
  console.log('Updated:', post.title?.pt || post.title?.en, '->', coverUrl);
  updated++;
}

console.log(`Done. Updated ${updated}, already had cover ${skipped}.`);
