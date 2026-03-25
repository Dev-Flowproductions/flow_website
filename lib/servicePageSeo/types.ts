import type { ServicePageSlug } from '@/lib/serviceItemRoutes';

export type ServiceSeoLang = 'pt' | 'en' | 'fr';

export type ServiceSeoBundle = {
  /** Shorter title segment; final tag is `${metaTitle} | Flow Productions` via getPageMetadata. */
  metaTitle: string;
  /** ~150–160 chars: primary keyword, benefit, location where relevant. */
  metaDescription: string;
  /** Merged into page metadata keywords + base site terms. */
  keywords: string[];
  /** FAQPage JSON-LD + on-page FAQ — tuned for answer engines (direct, extractable answers). */
  schemaFaqs: Array<{ question: string; answer: string }>;
};

export type ServicePageSeoMap = Record<ServicePageSlug, Record<ServiceSeoLang, ServiceSeoBundle>>;
