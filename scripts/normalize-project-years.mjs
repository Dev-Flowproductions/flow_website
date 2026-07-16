import fs from 'node:fs';
import https from 'node:https';

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

function normalizeYearLabel(value) {
  if (value == null || value === '') return null;
  const text = String(value).replace(/^"|"$/g, '').trim();
  if (/^\d{4}$/.test(text)) return text;
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : text;
}

const res = await request('GET', '/rest/v1/projects?select=id,slug,year_label');
const projects = JSON.parse(res.body || '[]');

let updated = 0;
for (const project of projects) {
  const current = project.year_label;
  if (current == null || current === '') continue;
  const normalized = normalizeYearLabel(current);
  if (!normalized || normalized === String(current).replace(/^"|"$/g, '').trim()) continue;

  const patch = await request('PATCH', `/rest/v1/projects?id=eq.${project.id}`, {
    year_label: normalized,
  });
  if (patch.status >= 300) {
    console.error('Failed', project.slug?.pt, patch.body);
    continue;
  }
  console.log(`${project.slug?.pt}: ${current} -> ${normalized}`);
  updated += 1;
}

console.log(`\nDone. Normalized ${updated} projects.`);
