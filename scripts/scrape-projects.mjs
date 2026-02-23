// Run with: node scripts/scrape-projects.mjs
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SLUGS = [
  'likewise', 'medwater', 'one-select-properties', 'mia', 'barturs',
  'lets-communicate', 'kipt', 'emjogo', 'travel-tech-partners', 'toma-la-da-ca',
  'dias-medievais-de-castro-marim', 'neomarca', 'pro-am-vilamoura',
  'designer-outlet-algarve', 'ibc-security', 'indasa', 'rocamar-beach-hotel',
  'kubidoce', 'odyssea', 'the-originals', 'ria-shopping',
  'albufeira-digital-nomads', 'parque-mineiro-aljustrel', 'fujifilm',
  'algarseafood', 'witfy', 'dom-jose-beach-hotel', 'dental-hpa',
  'rb-woodfinish', 'missao-conducao', 'adm-24', 'nature-soul-food',
  'jardim-aurora', 'zion-creative-artisans', '100lixo', 'urlegfix',
  'cesarius', 'rocket-booster', 'pizza-lab',
];

function fetchPage(slug) {
  return new Promise((resolve) => {
    const url = `https://flowproductions.pt/portfolio/${slug}/`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        const loc = res.headers.location;
        https.get(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res2 => {
          let d = ''; res2.on('data', c => d += c); res2.on('end', () => resolve({ slug, html: d, status: res2.statusCode }));
        }).on('error', () => resolve({ slug, html: '', status: 0 }));
        return;
      }
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ slug, html: d, status: res.statusCode }));
    });
    req.on('error', () => resolve({ slug, html: '', status: 0 }));
  });
}

function extractYouTubeUrl(html) {
  // Look for YouTube watch URLs or embed URLs in the HTML
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g,
  ];
  const ids = new Set();
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(html)) !== null) ids.add(m[1]);
  }
  if (ids.size === 0) return null;
  return `https://www.youtube.com/watch?v=${[...ids][0]}`;
}

function extractFeaturedImage(html) {
  // Look for og:image meta tag first (most reliable)
  const ogMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  if (ogMatch) return ogMatch[1];

  // Portfolio featured image
  const featMatch = html.match(/class="[^"]*portfolio[^"]*"[^>]*>\s*<img[^>]+src="([^"]+)"/i)
    || html.match(/<div[^>]*portfolio-thumb[^>]*>[^<]*<img[^>]+src="([^"]+)"/i);
  if (featMatch) return featMatch[1];

  return null;
}

function downloadImage(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const lib = url.startsWith('https') ? https : null;
    if (!lib) return reject(new Error('Only https supported'));
    const file = fs.createWriteStream(destPath);
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        return downloadImage(res.headers.location, destPath, redirectCount + 1).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { try { fs.unlinkSync(destPath); } catch {} reject(err); });
  });
}

async function run() {
  const results = {};
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';

  // Fetch all pages concurrently (in batches of 10)
  console.log('Fetching project pages...\n');
  const BATCH = 10;
  for (let i = 0; i < SLUGS.length; i += BATCH) {
    const batch = SLUGS.slice(i, i + BATCH);
    const pages = await Promise.all(batch.map(fetchPage));
    for (const { slug, html, status } of pages) {
      if (status !== 200) {
        console.log(`  ✗ ${slug} (${status})`);
        results[slug] = { youtubeUrl: null, imageUrl: null };
        continue;
      }
      const youtubeUrl = extractYouTubeUrl(html);
      const imageUrl = extractFeaturedImage(html);
      results[slug] = { youtubeUrl, imageUrl };
      console.log(`  ✓ ${slug}`);
      if (youtubeUrl) console.log(`      YouTube: ${youtubeUrl}`);
      if (imageUrl)   console.log(`      Image:   ${imageUrl}`);
    }
  }

  console.log('\nDownloading images and updating Supabase...\n');

  // Get all projects from Supabase to map slug → id
  const projectsRes = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'olhprqgnxsbekxcijeuq.supabase.co',
      path: '/rest/v1/projects?select=id,slug,featured_image_path',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const projectMap = {};
  for (const p of projectsRes) {
    const slug = p.slug?.pt || p.slug?.en;
    if (slug) projectMap[slug] = p;
  }

  for (const [slug, { youtubeUrl, imageUrl }] of Object.entries(results)) {
    const project = projectMap[slug];
    if (!project) { console.log(`  No DB record for slug: ${slug}`); continue; }

    let localImagePath = project.featured_image_path;

    // Download image if we have one and don't have a local one yet
    if (imageUrl && !localImagePath) {
      const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
      const destRelative = `/images/projects/${slug}.${safeExt}`;
      const destAbsolute = path.join(PUBLIC_DIR, 'images', 'projects', `${slug}.${safeExt}`);
      try {
        await downloadImage(imageUrl, destAbsolute);
        localImagePath = destRelative;
        console.log(`  ⬇ Downloaded image: ${destRelative}`);
      } catch (e) {
        console.log(`  ✗ Image download failed for ${slug}: ${e.message}`);
      }
    }

    // Update Supabase record
    if (youtubeUrl || localImagePath !== project.featured_image_path) {
      const patch = {};
      if (localImagePath) patch.featured_image_path = localImagePath;
      if (youtubeUrl) patch.gallery = { video_url: youtubeUrl };

      await new Promise((resolve, reject) => {
        const body = JSON.stringify(patch);
        const req = https.request({
          hostname: 'olhprqgnxsbekxcijeuq.supabase.co',
          path: `/rest/v1/projects?id=eq.${project.id}`,
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body),
          },
        }, res => { res.resume(); res.on('end', resolve); });
        req.on('error', reject);
        req.write(body);
        req.end();
      });
      console.log(`  ✓ Updated DB: ${slug}${youtubeUrl ? ' + YouTube' : ''}${localImagePath ? ' + image' : ''}`);
    }
  }

  console.log('\n✅ Done!');
  console.log('\nSummary:');
  const withVideo = Object.values(results).filter(r => r.youtubeUrl).length;
  const withImage = Object.values(results).filter(r => r.imageUrl).length;
  console.log(`  YouTube URLs found: ${withVideo}/${SLUGS.length}`);
  console.log(`  Images found:       ${withImage}/${SLUGS.length}`);
}

run().catch(err => { console.error(err); process.exit(1); });
