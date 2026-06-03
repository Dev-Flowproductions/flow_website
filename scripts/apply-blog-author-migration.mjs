/**
 * Apply blog_posts.author jsonb migration via Supabase Management API.
 *
 * Requires SUPABASE_ACCESS_TOKEN (PAT from https://supabase.com/dashboard/account/tokens)
 *
 *   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
 *   node scripts/apply-blog-author-migration.mjs
 */
import { readFileSync } from 'fs';

const PROJECT_REF = 'crydojpfcuukrimyiosi';
const SQL = 'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author jsonb;';

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

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error('Set SUPABASE_ACCESS_TOKEN (Personal Access Token from Supabase dashboard).');
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: SQL }),
});

const body = await res.text();
if (!res.ok) {
  console.error('Migration failed:', res.status, body);
  process.exit(1);
}

console.log('Migration applied on', PROJECT_REF);
console.log(body || '(ok)');
