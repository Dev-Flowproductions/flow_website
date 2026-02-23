// Run with: node scripts/scrape-missing.mjs
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve);
      }
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function extractYouTubeUrl(html) {
  const m = html.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : null;
}

function extractOgImage(html) {
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  return m ? m[1] : null;
}

function downloadImage(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); try { fs.unlinkSync(destPath); } catch {}
        return downloadImage(res.headers.location, destPath, redirectCount + 1).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { try { fs.unlinkSync(destPath); } catch {} reject(err); });
  });
}

function supabasePatch(projectId, patch) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(patch);
    const req = https.request({
      hostname: 'olhprqgnxsbekxcijeuq.supabase.co',
      path: `/rest/v1/projects?id=eq.${projectId}`,
      method: 'PATCH',
      headers: {
        'apikey': KEY, 'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body),
      },
    }, res => { res.resume(); res.on('end', resolve); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getProjectBySlug(slug) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'olhprqgnxsbekxcijeuq.supabase.co',
      path: `/rest/v1/projects?slug->>pt=eq.${encodeURIComponent(slug)}&select=id,slug,featured_image_path`,
      headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY },
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)[0]));
    }).on('error', reject);
  });
}

// Correct WP slugs → our DB slugs
const FIXES = [
  { wpSlug: 'hotel-dom-jose-video',  dbSlug: 'dom-jose-beach-hotel' },
  { wpSlug: 'hotel-dom-jose',        dbSlug: 'dom-jose-beach-hotel' }, // design version
  { wpSlug: 'zion',                  dbSlug: 'zion-creative-artisans' },
  // medwater + neomarca not in sitemap — skip for now
];

async function run() {
  for (const { wpSlug, dbSlug } of FIXES) {
    console.log(`\nProcessing: ${wpSlug} → ${dbSlug}`);
    const html = await fetchHtml(`https://flowproductions.pt/portfolio/${wpSlug}/`);
    const youtubeUrl = extractYouTubeUrl(html);
    const imageUrl = extractOgImage(html);
    console.log(`  YouTube: ${youtubeUrl || 'none'}`);
    console.log(`  Image:   ${imageUrl || 'none'}`);

    const project = await getProjectBySlug(dbSlug);
    if (!project) { console.log(`  No DB record for ${dbSlug}`); continue; }

    const patch = {};

    if (imageUrl && !project.featured_image_path) {
      const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
      const destRel = `/images/projects/${dbSlug}.${safeExt}`;
      const destAbs = path.join(PUBLIC_DIR, 'images', 'projects', `${dbSlug}.${safeExt}`);
      try {
        await downloadImage(imageUrl, destAbs);
        patch.featured_image_path = destRel;
        console.log(`  ⬇ Downloaded: ${destRel}`);
      } catch (e) { console.log(`  ✗ Image download failed: ${e.message}`); }
    }

    if (youtubeUrl) patch.gallery = { video_url: youtubeUrl };

    if (Object.keys(patch).length > 0) {
      await supabasePatch(project.id, patch);
      console.log(`  ✓ Updated DB`);
    }
  }
  console.log('\n✅ Done!');
}

run().catch(err => { console.error(err); process.exit(1); });
