/**
 * Maps Supabase `services.key` + `service_items.order` to internal paths (no locale prefix).
 *
 * Keys: design, marketing, audiovisual, animacao, martech (synthetic items in ServicesGrid).
 * Order must match `service_items.order` in Supabase and the EN item lists under
 * `services` in messages (en.json: design.items, marketing.items, etc.).
 */
export const SERVICE_ITEM_HREF: Record<string, Record<number, string>> = {
  design: {
    1: '/servicos/branding',
    2: '/servicos/design-editorial',
    3: '/servicos/web-design',
    4: '/servicos/ux-ui-design',
    5: '/servicos/packaging-design',
    6: '/servicos/social-media-design',
    7: '/servicos/ilustracao',
    8: '/servicos/space-branding',
  },
  marketing: {
    1: '/servicos/content-strategy',
    2: '/servicos/brand-strategy',
    3: '/servicos/copywriting',
    4: '/servicos/social-media-content',
    5: '/servicos/blog-content-writing',
    6: '/servicos/digital-advertising',
    7: '/servicos/storytelling',
    8: '/servicos/consultoria',
  },
  audiovisual: {
    1: '/servicos/storytelling-audiovisual',
    2: '/servicos/video',
    3: '/servicos/fotografia',
    4: '/servicos/cobertura-eventos',
  },
  animacao: {
    1: '/servicos/motion-graphics',
    2: '/servicos/animacao-produto',
    3: '/servicos/animacao-corporativa-educativa',
    4: '/servicos/animacao-publicitaria-social',
    5: '/servicos/efeitos-especiais',
  },
  martech: {
    1: '/martech/aeo-seo-geo',
    2: '/martech/non-gated-demand-gen',
    3: '/martech/go-to-market',
    4: '/martech/paid-media',
    5: '/martech/landing-pages',
    6: '/martech/ai-agents',
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
