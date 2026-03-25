import type { ServicePageCategory } from '@/lib/servicePagesMessages';
import type { ServicePageSlug } from '@/lib/serviceItemRoutes';

export type L3 = { pt: string; en: string; fr: string };

export type SlugSelectBlock = {
  label: L3;
  /** Exactly five options per locale */
  options: L3[];
};

export type SlugDiagnosticDefinition = {
  slug: ServicePageSlug;
  category: ServicePageCategory;
  useWebsiteSuggest: boolean;
  /** Four multiple-choice steps shown after context + industry */
  selects: readonly [SlugSelectBlock, SlugSelectBlock, SlugSelectBlock, SlugSelectBlock];
};

export const SELECT_KEYS = ['q1', 'q2', 'q3', 'q4'] as const;
export type SlugSelectKey = (typeof SELECT_KEYS)[number];
