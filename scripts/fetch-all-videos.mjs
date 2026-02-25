// Run with: node scripts/fetch-all-videos.mjs
// Fetches YouTube video URLs and featured images for all projects from
// flowproductions.pt and PATCHes Supabase — non-destructive (skips if already set).

import https from 'https';

const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';
const HOST = 'olhprqgnxsbekxcijeuq.supabase.co';

// WordPress slugs differ from our DB slugs for a handful of projects
const SLUG_OVERRIDES = {
  'dom-jose-beach-hotel': ['hotel-dom-jose-video', 'hotel-dom-jose'],
  'zion-creative-artisans': ['zion'],
  'pro-am-vilamoura': ['pro-am-vilamoura', 'pro-am'],
  'albufeira-digital-nomads': ['albufeira-digital-nomads'],
  'missao-conducao': ['missao-conducao'],
  'toma-la-da-ca': ['toma-la-da-ca'],
  'adm-24': ['adm-24'],
  'lets-communicate': ['lets-communicate'],
  '100lixo': ['100lixo'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fetchHtml(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve);
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
  });
}

function extractYouTubeUrl(html) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return `https://www.youtube.com/watch?v=${m[1]}`;
  }
  return null;
}

function extractOgImage(html) {
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  return m ? m[1] : null;
}

function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: HOST,
      path,
      headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Accept': 'application/json' },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve([]); }
      });
    }).on('error', reject);
  });
}

function supabasePatch(projectId, patch) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(patch);
    const req = https.request({
      hostname: HOST,
      path: `/rest/v1/projects?id=eq.${projectId}`,
      method: 'PATCH',
      headers: {
        'apikey': KEY, 'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => { res.resume(); res.on('end', resolve); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function tryFetchProject(slug) {
  const candidates = [
    `https://flowproductions.pt/projetos/${slug}/`,
    `https://flowproductions.pt/portfolio/${slug}/`,
    `https://flowproductions.pt/project/${slug}/`,
  ];
  // Also try override slugs
  const overrides = SLUG_OVERRIDES[slug] || [];
  for (const wpSlug of overrides) {
    if (wpSlug !== slug) {
      candidates.push(`https://flowproductions.pt/projetos/${wpSlug}/`);
      candidates.push(`https://flowproductions.pt/portfolio/${wpSlug}/`);
    }
  }

  for (const url of candidates) {
    const html = await fetchHtml(url);
    if (html && html.length > 500) {
      const youtube = extractYouTubeUrl(html);
      const image   = extractOgImage(html);
      if (youtube || image) {
        return { youtube, image, url };
      }
    }
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('Fetching all projects from Supabase...\n');

  const projects = await supabaseGet(
    '/rest/v1/projects?select=id,slug,gallery,featured_image_path&status=eq.published&order=published_at.desc'
  );

  if (!Array.isArray(projects) || projects.length === 0) {
    console.error('No projects found or Supabase error.');
    process.exit(1);
  }

  console.log(`Found ${projects.length} projects.\n`);

  let updated = 0;
  let skipped = 0;
  let failed  = 0;

  for (const project of projects) {
    const slugPt = project.slug?.pt || project.slug;
    if (!slugPt) { console.log(`  ⚠  No slug for ${project.id}`); failed++; continue; }

    const alreadyHasVideo = !!project.gallery?.video_url;
    const alreadyHasImage = !!project.featured_image_path;

    if (alreadyHasVideo && alreadyHasImage) {
      console.log(`  ⏭  ${slugPt} — already complete`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ↓  ${slugPt} ... `);
    const result = await tryFetchProject(slugPt);

    if (!result) {
      console.log('not found on WP site');
      failed++;
      continue;
    }

    const patch = {};

    if (!alreadyHasVideo && result.youtube) {
      patch.gallery = { ...(project.gallery || {}), video_url: result.youtube };
    }

    if (!alreadyHasImage && result.image) {
      patch.featured_image_path = result.image;
    }

    if (Object.keys(patch).length === 0) {
      console.log('nothing new to patch');
      skipped++;
      continue;
    }

    await supabasePatch(project.id, patch);
    const parts = [];
    if (patch.gallery?.video_url)      parts.push(`video: ${patch.gallery.video_url}`);
    if (patch.featured_image_path) parts.push(`image: ${patch.featured_image_path}`);
    console.log(`✓  (${parts.join(', ')})`);
    updated++;

    // Polite delay to avoid hammering the WP site
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n✅ Done — ${updated} updated, ${skipped} skipped, ${failed} not found.`);
}

run().catch(err => { console.error(err); process.exit(1); });
