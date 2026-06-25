/**
 * Remove duplicate Flow blog_posts rows for augmented-reality-marketing-2026.
 * Keeps the row with a cover image (or the newest row if none have covers).
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const cmsId = "c74e24c7-cd35-4a66-ad44-c547cff515b4";
const slug = "augmented-reality-marketing-2026";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: byCms, error: cmsErr } = await supabase
  .from("blog_posts")
  .select("id, cms_id, slug, featured_image_path, published_at, updated_at, title")
  .eq("cms_id", cmsId);

if (cmsErr) {
  console.error("cms_id query failed:", cmsErr.message);
  process.exit(1);
}

const { data: bySlugEn, error: slugErr } = await supabase
  .from("blog_posts")
  .select("id, cms_id, slug, featured_image_path, published_at, updated_at, title")
  .eq("slug->>en", slug);

if (slugErr) {
  console.error("slug query failed:", slugErr.message);
  process.exit(1);
}

const merged = new Map();
for (const row of [...(byCms ?? []), ...(bySlugEn ?? [])]) {
  merged.set(row.id, row);
}

const rows = [...merged.values()];
console.log(`Found ${rows.length} matching blog_posts row(s)`);
for (const row of rows) {
  const title = row.title?.en ?? row.title?.pt ?? row.id;
  console.log(
    `- ${row.id.slice(0, 8)}… cms_id=${row.cms_id ?? "null"} cover=${Boolean(row.featured_image_path)} title=${title}`,
  );
}

if (rows.length === 0) {
  console.log("Nothing to delete.");
  process.exit(0);
}

if (rows.length === 1) {
  console.log("Only one row — no duplicates to remove.");
  process.exit(0);
}

const withCover = rows.filter((r) => r.featured_image_path?.trim());
const keep =
  withCover.sort(
    (a, b) => new Date(b.updated_at ?? b.published_at ?? 0) - new Date(a.updated_at ?? a.published_at ?? 0),
  )[0] ??
  rows.sort(
    (a, b) => new Date(b.updated_at ?? b.published_at ?? 0) - new Date(a.updated_at ?? a.published_at ?? 0),
  )[0];

const deleteIds = rows.filter((r) => r.id !== keep.id).map((r) => r.id);
console.log(`Keeping ${keep.id} (cover=${Boolean(keep.featured_image_path)})`);
console.log(`Deleting ${deleteIds.length} duplicate row(s):`, deleteIds);

const { error: delErr } = await supabase.from("blog_posts").delete().in("id", deleteIds);
if (delErr) {
  console.error("Delete failed:", delErr.message);
  process.exit(1);
}

console.log("Deleted duplicates successfully.");
