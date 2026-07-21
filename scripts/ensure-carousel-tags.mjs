import fs from 'node:fs';
import https from 'node:https';

const ANIMACAO_SLUGS = [
  'ultima-gota',
  'likewise',
  'medwater',
  'one-select-properties',
  'mia',
  'barturs',
  'lets-communicate',
  'kipt',
  'emjogo',
  'travel-tech-partners',
  'toma-la-da-ca',
];

const AUDIOVISUAL_SLUGS = [
  'witfy',
  'dias-medievais-de-castro-marim',
  'details-old-course-vilamoura',
  'pro-am-vilamoura',
  'dom-jose-beach-hotel',
  'designer-outlet-algarve',
  'ibc-security',
  'indasa',
  'rocamar-beach-hotel',
  'kubidoce',
  'odyssea',
  'the-originals',
  'ria-shopping',
  'albufeira-digital-nomads',
  'parque-mineiro-aljustrel',
  'fujifilm',
  'algarseafood',
  'liga-portuguesa-contra-o-cancro',
];

const TAG_IDS = {
  animacao: 'cc4a08d5-7c9f-4f2a-9f46-78dbec7e72d7',
  video: '009724b4-1e7b-49a1-bb16-ed0d54f13a54',
};

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > -1) env[t.slice(0, i)] = t.slice(i + 1);
}

const host = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: host,
        path,
        method,
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: body ? 'return=representation' : 'return=minimal',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body: data }));
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getProjectsBySlugs(slugs) {
  const unique = [...new Set(slugs)];
  const filter = unique.map((slug) => `slug->>pt.eq.${encodeURIComponent(slug)}`).join(',');
  const res = await request(
    'GET',
    `/rest/v1/projects?or=(${filter})&select=id,slug,status,project_project_tags(project_tags(key,label))`
  );
  return JSON.parse(res.body || '[]');
}

async function ensureTag(projectId, tagId) {
  const check = await request(
    'GET',
    `/rest/v1/project_project_tags?project_id=eq.${projectId}&tag_id=eq.${tagId}&select=id`
  );
  const existing = JSON.parse(check.body || '[]');
  if (existing.length > 0) return false;
  const insert = await request('POST', '/rest/v1/project_project_tags', {
    project_id: projectId,
    tag_id: tagId,
  });
  if (insert.status >= 300) {
    throw new Error(`Failed to add tag ${tagId} to ${projectId}: ${insert.body}`);
  }
  return true;
}

function tagKeys(project) {
  return project.project_project_tags
    ?.map((row) => row.project_tags?.key)
    .filter(Boolean) ?? [];
}

const projects = await getProjectsBySlugs([...ANIMACAO_SLUGS, ...AUDIOVISUAL_SLUGS]);
const bySlug = new Map(projects.map((project) => [project.slug?.pt, project]));

let added = 0;
const missing = [];

for (const slug of ANIMACAO_SLUGS) {
  const project = bySlug.get(slug);
  if (!project) {
    missing.push(`${slug} (animacao: project not found)`);
    continue;
  }
  const keys = tagKeys(project);
  if (!keys.includes('animacao')) {
    const didAdd = await ensureTag(project.id, TAG_IDS.animacao);
    if (didAdd) {
      console.log(`+ animacao tag -> ${slug} (had: ${keys.join(', ') || 'none'})`);
      added += 1;
    }
  }
}

for (const slug of AUDIOVISUAL_SLUGS) {
  const project = bySlug.get(slug);
  if (!project) {
    missing.push(`${slug} (audiovisual: project not found)`);
    continue;
  }
  const keys = tagKeys(project);
  if (!keys.includes('video')) {
    const didAdd = await ensureTag(project.id, TAG_IDS.video);
    if (didAdd) {
      console.log(`+ video tag -> ${slug} (had: ${keys.join(', ') || 'none'})`);
      added += 1;
    }
  }
}

if (missing.length) {
  console.log('\nMissing projects:');
  for (const item of missing) console.log(`  - ${item}`);
}

console.log(`\nDone. Added ${added} tags.`);
