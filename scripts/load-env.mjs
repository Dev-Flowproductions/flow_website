import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Load .env then .env.local into process.env (does not override existing vars).
 * Call from one-off maintenance scripts — never hardcode service keys.
 */
export function loadEnvFiles(fromDir = process.cwd()) {
  for (const name of ['.env', '.env.local']) {
    const filePath = path.join(fromDir, name);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

export function requireSupabaseServiceEnv() {
  loadEnvFiles(path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

  const url =
    process.env.LEGACY_SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.LEGACY_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or LEGACY_*) in .env.local',
    );
  }

  const hostname = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return { url: url.startsWith('http') ? url : `https://${hostname}`, hostname, key };
}
