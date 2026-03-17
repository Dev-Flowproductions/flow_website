import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';

const WEB_AUDIT_URL = 'https://webaudit.flowproductions.pt/';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechAeo' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/aeo-seo-geo',
    keywords: ['AEO', 'GEO', 'SEO', 'answer engine optimization', 'generative engine optimization', 'website optimization'],
  });
}

export default async function AeoSeoGeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechAeo' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/aeo-seo-geo` },
  ]);
  const schemaFaqs = t.raw('schemaFaqs') as Array<{ question: string; answer: string }>;
  const faqSchema = faqJsonLd(schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: t('hero.title'),
    description: t('metaDescription'),
    url: `${SITE_URL}/${locale}/martech/aeo-seo-geo`,
    serviceType: 'Search Engine Optimization',
  });

  const whatIsItems = t.raw('whatIs.items') as Array<{ term: string; description: string }>;
  const forWhoItems = t.raw('forWho.items') as string[];
  const deliversItems = t.raw('delivers.items') as string[];
  const improvementsItems = t.raw('improvements.items') as string[];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <MartechServiceHero label={t('hero.label')} title={t('hero.title')} subtitle={t('hero.subtitle')} intro={t('intro.text')} />

      <MartechSection variant="muted">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('whatIs.title')}</h2>
          <div className="space-y-6">
            {whatIsItems.map((item, i) => (
              <div key={i} className="border-l-4 border-[#5b54a0] pl-6 py-1">
                <p className="font-bold text-lg mb-1">{item.term}</p>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList title={t('forWho.title')} subtitle={t('forWho.subtitle')} items={forWhoItems} icon="check" className="mb-10" />
        </AnimateIn>
        <MartechDiagnosticCta
          title={t('audit.title')}
          description={t('audit.description')}
          cta={
            <a
              href={WEB_AUDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {t('audit.cta')}
            </a>
          }
        />
      </MartechSection>

      <MartechSection variant="muted" contentClassName="max-w-6xl">
        <div className="grid sm:grid-cols-2 gap-10 items-start">
          <AnimateIn className="min-w-0">
            <MartechContentList title={t('delivers.title')} items={deliversItems} icon="arrow" className="min-w-0" />
          </AnimateIn>
          <AnimateIn delay={0.1} className="min-w-0">
            <MartechContentList title={t('improvements.title')} items={improvementsItems} icon="check" iconClassName="text-green-600" className="min-w-0" />
          </AnimateIn>
        </div>
      </MartechSection>

      <MartechFaqSection faqs={schemaFaqs} sectionTitle={t('faqSectionTitle')} />
    </div>
  );
}
