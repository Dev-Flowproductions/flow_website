import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';
import GoToMarketReadinessDiagnostic from '@/components/martech/GoToMarketReadinessDiagnostic';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechGtm' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/go-to-market',
    keywords: ['go-to-market', 'GTM strategy', 'product launch', 'brand positioning', 'market entry'],
  });
}

export default async function GoToMarketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechGtm' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/go-to-market` },
  ]);
  const schemaFaqs = t.raw('schemaFaqs') as Array<{ question: string; answer: string }>;
  const faqSchema = faqJsonLd(schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: t('hero.title'),
    description: t('metaDescription'),
    url: `${SITE_URL}/${locale}/martech/go-to-market`,
    serviceType: 'Go-to-Market Strategy',
  });

  const whenItems = t.raw('whenItMakesSense.items') as string[];
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
          <MartechContentList title={t('whenItMakesSense.title')} items={whenItems} icon="arrow" className="mb-10" />
        </AnimateIn>
        <MartechDiagnosticCta
          title={t('diagnostic.title')}
          description={t('diagnostic.description')}
          cta={
            <ScrollToDiagnostic targetId="gtm-readiness-diagnostic" className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg">
              {t('diagnostic.cta')}
            </ScrollToDiagnostic>
          }
        />
      </MartechSection>

      <MartechSection variant="default" contentClassName="max-w-6xl">
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

      <GoToMarketReadinessDiagnostic locale={locale} />
    </div>
  );
}
