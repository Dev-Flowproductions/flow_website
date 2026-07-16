// Run with: node scripts/update-av-animation-copy.mjs
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';
import { ANIMACAO_PROJECTS, AUDIOVISUAL_PROJECTS } from './data/av-animacao-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('Missing .env.local with Supabase credentials');
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

const TAGS = {
  animacao: 'cc4a08d5-7c9f-4f2a-9f46-78dbec7e72d7',
  video: '009724b4-1e7b-49a1-bb16-ed0d54f13a54',
};

const CATS = {
  animacao: '663e84b9-1300-454a-be62-d971e8921067',
  audiovisual: '09380c9b-e06e-48d7-bb6b-337ec26a2214',
};

const ANIMACAO_SECTION_ID = '7d166e45-a074-48e4-b874-a9a401443641';

function request(host, key, method, reqPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: host,
        path: reqPath,
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
        res.on('end', () => {
          resolve({ status: res.statusCode ?? 0, body: data });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getProjectBySlug(host, key, slug) {
  const res = await request(
    host,
    key,
    'GET',
    `/rest/v1/projects?slug->>pt=eq.${encodeURIComponent(slug)}&select=id,slug,gallery,featured_image_path`
  );
  const rows = JSON.parse(res.body || '[]');
  return rows[0] ?? null;
}

async function getAudiovisualSectionId(host, key) {
  const res = await request(
    host,
    key,
    'GET',
    `/rest/v1/project_category_sections?category_id=eq.${CATS.audiovisual}&select=id&order=1&limit=1`
  );
  const rows = JSON.parse(res.body || '[]');
  return rows[0]?.id ?? null;
}

async function ensureCategoryLink(host, key, projectId, categoryKey, sectionId, order) {
  const check = await request(
    host,
    key,
    'GET',
    `/rest/v1/category_section_projects?project_id=eq.${projectId}&category_section_id=eq.${sectionId}&select=id`
  );
  const existing = JSON.parse(check.body || '[]');
  if (existing.length > 0) return;

  await request(host, key, 'POST', '/rest/v1/category_section_projects', {
    category_section_id: sectionId,
    project_id: projectId,
    order,
  });
  console.log(`    linked to ${categoryKey}`);
}

async function ensureTags(host, key, projectId, tagKeys) {
  for (const rawKey of tagKeys) {
    const tagKey = rawKey === 'animation' ? 'animacao' : rawKey;
    const tagId = TAGS[tagKey];
    if (!tagId) continue;
    const check = await request(
      host,
      key,
      'GET',
      `/rest/v1/project_project_tags?project_id=eq.${projectId}&tag_id=eq.${tagId}&select=id`
    );
    const existing = JSON.parse(check.body || '[]');
    if (existing.length > 0) continue;
    await request(host, key, 'POST', '/rest/v1/project_project_tags', {
      project_id: projectId,
      tag_id: tagId,
    });
  }
}

async function upsertProject(host, key, entry, sectionIds) {
  const existing = await getProjectBySlug(host, key, entry.slug);
  const gallery = entry.videoUrl
    ? { ...(existing?.gallery ?? {}), video_url: entry.videoUrl }
    : (existing?.gallery ?? null);
  const patch = {
    title: entry.title,
    slug: { pt: entry.slug, en: entry.slug, fr: entry.slug },
    summary: entry.summary,
    content: entry.content,
    client_name: entry.client,
    year_label: entry.year ?? null,
    status: 'published',
    ...(entry.featuredImage && !existing?.featured_image_path
      ? { featured_image_path: entry.featuredImage }
      : {}),
    ...(gallery ? { gallery } : {}),
  };

  if (existing) {
    const res = await request(host, key, 'PATCH', `/rest/v1/projects?id=eq.${existing.id}`, patch);
    if (res.status >= 300) {
      throw new Error(`Failed to update ${entry.slug}: ${res.body}`);
    }
    console.log(`  ✓ updated ${entry.slug}`);
    var projectId = existing.id;
  } else {
    const res = await request(host, key, 'POST', '/rest/v1/projects', {
      ...patch,
      is_featured: false,
      published_at: new Date().toISOString(),
      featured_image_path: entry.featuredImage ?? null,
    });
    if (res.status !== 201) {
      throw new Error(`Failed to create ${entry.slug}: ${res.body}`);
    }
    projectId = JSON.parse(res.body)[0].id;
    console.log(`  ✓ created ${entry.slug}`);
  }

  const categories = entry.categories ?? [];
  const tags = entry.tags ?? [];

  if (categories.includes('audiovisual') && sectionIds.audiovisual) {
    await ensureCategoryLink(host, key, projectId, 'audiovisual', sectionIds.audiovisual, 50);
    await ensureTags(host, key, projectId, tags.length ? tags : ['video']);
  }
  if (categories.includes('animacao') && sectionIds.animacao) {
    await ensureCategoryLink(host, key, projectId, 'animacao', sectionIds.animacao, 50);
    await ensureTags(host, key, projectId, tags.length ? tags : ['animacao']);
  }
}

function mergeEntries() {
  const map = new Map();
  for (const entry of AUDIOVISUAL_PROJECTS) {
    map.set(entry.slug, {
      ...entry,
      categories: entry.categories ?? ['audiovisual'],
      tags: entry.tags ?? ['video'],
    });
  }
  for (const entry of ANIMACAO_PROJECTS) {
    const prev = map.get(entry.slug);
    map.set(entry.slug, {
      ...entry,
      categories: [...new Set([...(prev?.categories ?? []), ...(entry.categories ?? ['animacao'])])],
      tags: entry.tags ?? prev?.tags ?? ['animacao'],
      gallery: prev?.gallery,
      videoUrl: entry.videoUrl ?? prev?.videoUrl,
    });
  }
  return [...map.values()];
}

async function main() {
  const env = loadEnv();
  const host = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  const sectionIds = {
    animacao: ANIMACAO_SECTION_ID,
    audiovisual: await getAudiovisualSectionId(host, key),
  };

  if (!sectionIds.audiovisual) {
    console.warn('Warning: audiovisual category section not found — project copy will still update.');
  }

  console.log('Updating audiovisual & animação project copy...\n');
  const entries = mergeEntries();

  for (const entry of entries) {
    await upsertProject(host, key, entry, sectionIds);
  }

  console.log(`\nDone. Updated ${entries.length} projects.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
