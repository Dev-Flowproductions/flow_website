import { SERVICE_PAGE_SLUGS, type ServicePageSlug } from '@/lib/serviceItemRoutes';
import type { ServiceSeoBundle, ServiceSeoLang } from './types';
import { DESIGN_SERVICE_SEO } from './design';
import { MARKETING_SERVICE_SEO } from './marketing';
import { AUDIOVISUAL_SERVICE_SEO } from './audiovisual';
import { ANIMACAO_SERVICE_SEO } from './animacao';

const MERGED = {
  ...DESIGN_SERVICE_SEO,
  ...MARKETING_SERVICE_SEO,
  ...AUDIOVISUAL_SERVICE_SEO,
  ...ANIMACAO_SERVICE_SEO,
} as Record<ServicePageSlug, Record<ServiceSeoLang, ServiceSeoBundle>>;

for (const slug of SERVICE_PAGE_SLUGS) {
  if (!MERGED[slug]) {
    throw new Error(`servicePageSeo: missing SEO bundle for slug "${slug}"`);
  }
  for (const lang of ['pt', 'en', 'fr'] as const) {
    const b = MERGED[slug][lang];
    if (!b.metaTitle?.trim() || !b.metaDescription?.trim() || b.keywords.length < 3 || b.schemaFaqs.length < 3) {
      throw new Error(`servicePageSeo: incomplete SEO for "${slug}" (${lang})`);
    }
  }
}

export function getServicePageSeo(slug: ServicePageSlug, lang: ServiceSeoLang): ServiceSeoBundle {
  return MERGED[slug][lang];
}

export type { ServiceSeoBundle, ServiceSeoLang } from './types';
