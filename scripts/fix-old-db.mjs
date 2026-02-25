// Run with: node scripts/fix-old-db.mjs
// De-duplicates and adds YouTube videos to olhprqgnxsbekxcijeuq (old project)
import https from 'https';

const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';
const HOST = 'olhprqgnxsbekxcijeuq.supabase.co';

const VIDEOS = {
  'ultima-gota':                   'https://www.youtube.com/watch?v=Mt-9bDmBWSs',
  'likewise':                      'https://www.youtube.com/watch?v=SDvStpNqPj0',
  'dias-medievais-de-castro-marim':'https://www.youtube.com/watch?v=l0UanW6to3g',
  'one-select-properties':         'https://www.youtube.com/watch?v=rT2SFmrrw7M',
  'mia':                           'https://www.youtube.com/watch?v=owMpfJw_ZpA',
  'pro-am-vilamoura':              'https://www.youtube.com/watch?v=_eP8rm0hJyY',
  'barturs':                       'https://www.youtube.com/watch?v=VO1hzdaoCko',
  'lets-communicate':              'https://www.youtube.com/watch?v=8E_JVIPPbTo',
  'kipt':                          'https://www.youtube.com/watch?v=XED6X-89kUs',
  'emjogo':                        'https://www.youtube.com/watch?v=yGjXcnerzm4',
  'travel-tech-partners':          'https://www.youtube.com/watch?v=7vSNeYAN-dE',
  'toma-la-da-ca':                 'https://www.youtube.com/watch?v=HdHOsaQ6SoE',
  'dom-jose-beach-hotel':          'https://www.youtube.com/watch?v=zWBOUXfvMQE',
  'designer-outlet-algarve':       'https://www.youtube.com/watch?v=BfTxZDY4TGk',
  'ibc-security':                  'https://www.youtube.com/watch?v=z7n4p7au7Yc',
  'indasa':                        'https://www.youtube.com/watch?v=ToAr4Gbu2gk',
  'rocamar-beach-hotel':           'https://www.youtube.com/watch?v=TX5assyouVs',
  'odyssea':                       'https://www.youtube.com/watch?v=oAiOIBIs3pw',
  'the-originals':                 'https://www.youtube.com/watch?v=5673i4LDkKE',
  'ria-shopping':                  'https://www.youtube.com/watch?v=0gBMaWBaCwk',
  'parque-mineiro-aljustrel':      'https://www.youtube.com/watch?v=gTg8LeCRj0w',
  'fujifilm':                      'https://www.youtube.com/watch?v=NWEPCClqDrw',
  'algarseafood':                  'https://www.youtube.com/watch?v=CVUtLS4WXW0',
  'aequum':                        'https://www.youtube.com/watch?v=c2Xn8B8Dhf4',
  'hackathon':                     'https://www.youtube.com/watch?v=86FgEIoor4I',
  'refood':                        'https://www.youtube.com/watch?v=PWIBs-amki4',
};

function rpc(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: HOST, path, method,
      headers: {
        'apikey': KEY, 'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json', 'Accept': 'application/json',
        'Prefer': 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  // 1. Get all projects (may include duplicates)
  const res = await rpc('GET', '/rest/v1/projects?select=id,slug,gallery,published_at&status=eq.published&order=published_at.asc&limit=200', null);
  const all = JSON.parse(res.body);
  console.log(`Total rows: ${all.length}`);

  // 2. Keep first occurrence per slug, collect IDs to delete
  const seen = new Map();
  const toDelete = [];
  for (const p of all) {
    const slug = p.slug?.pt;
    if (!slug) continue;
    if (!seen.has(slug)) {
      seen.set(slug, p.id);
    } else {
      toDelete.push(p.id);
    }
  }
  console.log(`Duplicates to delete: ${toDelete.length}`);

  // 3. Delete duplicates in batches
  for (const id of toDelete) {
    const r = await rpc('DELETE', `/rest/v1/projects?id=eq.${id}`, null);
    if (r.status !== 204 && r.status !== 200) {
      console.error(`  Failed to delete ${id}: ${r.status} ${r.body}`);
    }
  }
  console.log(`Deleted ${toDelete.length} duplicate rows`);

  // 4. Update videos
  let updated = 0;
  for (const [slugPt, videoUrl] of Object.entries(VIDEOS)) {
    const projectId = seen.get(slugPt);
    if (!projectId) { console.log(`  No record for ${slugPt}`); continue; }
    const r = await rpc('PATCH', `/rest/v1/projects?id=eq.${projectId}`, {
      gallery: { video_url: videoUrl }
    });
    if (r.status === 200 || r.status === 204) { updated++; }
    else { console.error(`  Failed to update ${slugPt}: ${r.status}`); }
  }
  console.log(`Videos updated: ${updated}`);
  console.log('Done!');
}

run().catch(console.error);
