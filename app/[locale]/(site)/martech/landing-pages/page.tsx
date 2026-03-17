import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';
import LandingPageAndAiOfferPlanner from '@/components/martech/LandingPageAndAiOfferPlanner';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechLandingPages' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/landing-pages',
    keywords: ['landing pages', 'AI offers', 'conversion optimisation', 'CRO', 'lead capture'],
  });
}

export default async function LandingPagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechLandingPages' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/landing-pages` },
  ]);
  const schemaFaqs = t.raw('schemaFaqs') as Array<{ question: string; answer: string }>;
  const faqSchema = faqJsonLd(schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: t('hero.title'),
    description: t('metaDescription'),
    url: `${SITE_URL}/${locale}/martech/landing-pages`,
    serviceType: 'Landing Page Design',
  });

  const forWhoItems = t.raw('forWho.items') as string[];
  const actionPlanItems = t.raw('actionPlan.items') as string[];
  const deliversItems = t.raw('delivers.items') as string[];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <MartechServiceHero label={t('hero.label')} title={t('hero.title')} subtitle={t('hero.subtitle')} intro={t('intro.text')} />

      <MartechSection variant="muted">
        <AnimateIn>
          <div className="border-l-4 border-[#5b54a0] pl-6">
            <h2 className="text-2xl font-bold mb-3">{t('whatIsAiOffer.title')}</h2>
            <p className="text-gray-700 text-lg">{t('whatIsAiOffer.text')}</p>
          </div>
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList title={t('forWho.title')} subtitle={t('forWho.subtitle')} items={forWhoItems} icon="check" className="mb-10" />
        </AnimateIn>
        <MartechDiagnosticCta
          title={t('diagnostic.title')}
          description={t('diagnostic.description')}
          cta={
            <ScrollToDiagnostic targetId="landing-page-ai-offer-planner" className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg">
              {t('diagnostic.cta')}
            </ScrollToDiagnostic>
          }
        >
          <AnimateIn delay={0.1}>
            <p className="font-semibold mb-4">{t('actionPlan.title')}</p>
            <MartechContentList items={actionPlanItems} icon="arrow" />
          </AnimateIn>
        </MartechDiagnosticCta>
      </MartechSection>

      <MartechSection variant="muted">
        <AnimateIn>
          <MartechContentList title={t('delivers.title')} items={deliversItems} icon="arrow" />
        </AnimateIn>
      </MartechSection>

      <MartechFaqSection faqs={schemaFaqs} sectionTitle={t('faqSectionTitle')} />

      <LandingPageAndAiOfferPlanner locale={locale} />
    </div>
  );
}
