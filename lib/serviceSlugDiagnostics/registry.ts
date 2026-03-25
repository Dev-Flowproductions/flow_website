import { SERVICE_PAGE_SLUGS, type ServicePageSlug } from '@/lib/serviceItemRoutes';
import { getServicePageCategory } from '@/lib/servicePagesMessages';
import type { SlugDiagnosticDefinition, SlugSelectBlock } from './types';
import { DESIGN_SLUG_SELECTS } from './designSlugSelects';
import { MARKETING_SLUG_SELECTS } from './marketingSlugSelects';
import { AUDIOVISUAL_SLUG_SELECTS } from './audiovisualSlugSelects';
import { ANIMACAO_SLUG_SELECTS } from './animacaoSlugSelects';

type FourSelects = readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];

export const SERVICE_SLUG_DIAGNOSTIC_SELECTS = {
  ...DESIGN_SLUG_SELECTS,
  ...MARKETING_SLUG_SELECTS,
  ...AUDIOVISUAL_SLUG_SELECTS,
  ...ANIMACAO_SLUG_SELECTS,
} satisfies Record<ServicePageSlug, FourSelects>;

for (const slug of SERVICE_PAGE_SLUGS) {
  if (!(slug in SERVICE_SLUG_DIAGNOSTIC_SELECTS)) {
    throw new Error(`serviceSlugDiagnostics: missing select blocks for slug "${slug}"`);
  }
}

export const SERVICE_SLUG_DIAGNOSTIC_REGISTRY: Record<ServicePageSlug, SlugDiagnosticDefinition> =
  Object.fromEntries(
    SERVICE_PAGE_SLUGS.map((slug) => {
      const category = getServicePageCategory(slug);
      const useWebsiteSuggest = category === 'design' || category === 'marketing';
      return [
        slug,
        {
          slug,
          category,
          useWebsiteSuggest,
          selects: SERVICE_SLUG_DIAGNOSTIC_SELECTS[slug],
        },
      ];
    })
  ) as Record<ServicePageSlug, SlugDiagnosticDefinition>;

export function getServiceSlugDiagnostic(slug: ServicePageSlug): SlugDiagnosticDefinition {
  return SERVICE_SLUG_DIAGNOSTIC_REGISTRY[slug];
}
