// Run with: node scripts/scrape-videos-output.mjs
// Scrapes YouTube video URLs from flowproductions.pt for every project
// and prints ready-to-run SQL UPDATE statements (to run via Supabase MCP / SQL editor)
import https from 'https';

const SLUG_OVERRIDES = {
  'dom-jose-beach-hotel':   ['hotel-dom-jose-video', 'hotel-dom-jose'],
  'zion-creative-artisans': ['zion'],
  'pro-am-vilamoura':       ['pro-am-vilamoura', 'pro-am'],
};

const PROJECTS = [
  'ultima-gota','likewise','dias-medievais-de-castro-marim','medwater',
  'one-select-properties','neomarca','mia','witfy','pro-am-vilamoura',
  'barturs','lets-communicate','kipt','dental-hpa','emjogo',
  'albufeira-digital-nomads','travel-tech-partners','toma-la-da-ca',
  'kubidoce','rb-woodfinish','missao-conducao','adm-24',
  'nature-soul-food','jardim-aurora','dom-jose-beach-hotel',
  'designer-outlet-algarve','ibc-security','indasa','rocamar-beach-hotel',
  'odyssea','the-originals','ria-shopping','parque-mineiro-aljustrel',
  'fujifilm','algarseafood','zion-creative-artisans','100lixo','urlegfix',
  'cesarius','rocket-booster','pizza-lab','aequum','hackathon',
  'liga-portuguesa-contra-o-cancro','refood','social-hackathon',
];

function fetchHtml(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve);
      }
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
  });
}

function extractYouTubeId(html) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /data-videoid="([a-zA-Z0-9_-]{11})"/,
    /"videoId":"([a-zA-Z0-9_-]{11})"/,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

async function tryFetch(slug) {
  const candidates = [
    `https://flowproductions.pt/projetos/${slug}/`,
    `https://flowproductions.pt/portfolio/${slug}/`,
  ];
  const overrides = SLUG_OVERRIDES[slug] || [];
  for (const alt of overrides) {
    candidates.push(`https://flowproductions.pt/projetos/${alt}/`);
    candidates.push(`https://flowproductions.pt/portfolio/${alt}/`);
  }
  for (const url of candidates) {
    const html = await fetchHtml(url);
    if (html.length > 500) {
      const id = extractYouTubeId(html);
      if (id) return { id, url };
    }
  }
  return null;
}

async function run() {
  const results = [];
  for (const slug of PROJECTS) {
    process.stderr.write(`  Checking ${slug}...\n`);
    const found = await tryFetch(slug);
    if (found) {
      results.push({ slug, videoUrl: `https://www.youtube.com/watch?v=${found.id}` });
      process.stderr.write(`    ✓ ${found.videoUrl || found.id}\n`);
    } else {
      process.stderr.write(`    ✗ not found\n`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('-- SQL UPDATE statements for Supabase');
  console.log('-- Run these in the Supabase SQL editor or via MCP execute_sql\n');
  for (const { slug, videoUrl } of results) {
    const safe = videoUrl.replace(/'/g, "''");
    console.log(`UPDATE projects SET gallery = jsonb_build_object('video_url', '${safe}') WHERE slug->>'pt' = '${slug}' AND status = 'published';`);
  }
  console.log(`\n-- ${results.length} projects with video URLs found`);
}

run().catch(console.error);
