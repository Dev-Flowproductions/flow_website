# Flow Productions

Website for Flow Productions — creative agency (design, marketing, audiovisual, animation) in Faro, Portugal.

## Stack

- **Next.js** (App Router)
- **next-intl** (i18n: PT, EN, FR)
- **Tailwind CSS**
- **Supabase** (CMS: projects, blog, team)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Set `NEXT_PUBLIC_SITE_URL` and Supabase keys in `.env.local`.

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Environment

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (e.g. `https://flowproductions.pt`)
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and server key if using protected APIs)
