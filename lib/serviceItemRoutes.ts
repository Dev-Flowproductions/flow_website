/**
 * Maps Supabase `services.key` + `service_items.order` to internal paths (no locale prefix).
 *
 * Expected keys: `design`, `marketing`, `audiovisual`, `animacao` (see `services.key` in Supabase).
 * Order values must match `service_items.order` for each category (1-based, as returned by the API).
 * No seed for these tables ships in this repo—after deploy, confirm ordering in Supabase Studio
 * or the public `/servicos` grid and adjust this map if items were reordered.
 */
export const SERVICE_ITEM_HREF: Record<string, Record<number, string>> = {
  design: {
    1: '/servicos/branding',
    2: '/servicos/web-design',
    3: '/servicos/packaging-design',
    4: '/servicos/ilustracao',
    5: '/servicos/design-editorial',
    6: '/servicos/ux-ui-design',
    7: '/servicos/social-media-design',
    8: '/servicos/space-branding',
  },
  marketing: {
    1: '/servicos/content-strategy',
    2: '/servicos/copywriting',
    3: '/servicos/blog-content-writing',
    4: '/servicos/storytelling',
    5: '/servicos/brand-strategy',
    6: '/servicos/social-media-content',
    7: '/servicos/digital-advertising',
    8: '/servicos/consultoria',
  },
  audiovisual: {
    1: '/servicos/storytelling-audiovisual',
    2: '/servicos/fotografia',
    3: '/servicos/video',
    4: '/servicos/cobertura-eventos',
  },
  animacao: {
    1: '/servicos/motion-graphics',
    2: '/servicos/animacao-corporativa-educativa',
    3: '/servicos/efeitos-especiais',
    4: '/servicos/animacao-produto',
    5: '/servicos/animacao-publicitaria-social',
  },
};

export const SERVICE_PAGE_SLUGS = [
  'branding',
  'web-design',
  'packaging-design',
  'ilustracao',
  'design-editorial',
  'ux-ui-design',
  'social-media-design',
  'space-branding',
  'content-strategy',
  'copywriting',
  'blog-content-writing',
  'storytelling',
  'brand-strategy',
  'social-media-content',
  'digital-advertising',
  'consultoria',
  'storytelling-audiovisual',
  'fotografia',
  'video',
  'cobertura-eventos',
  'motion-graphics',
  'animacao-corporativa-educativa',
  'efeitos-especiais',
  'animacao-produto',
  'animacao-publicitaria-social',
] as const;

export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number];

export function isServicePageSlug(s: string): s is ServicePageSlug {
  return (SERVICE_PAGE_SLUGS as readonly string[]).includes(s);
}

export function getServiceItemHref(serviceKey: string, order: number): string | null {
  const map = SERVICE_ITEM_HREF[serviceKey];
  if (!map) return null;
  return map[order] ?? null;
}
