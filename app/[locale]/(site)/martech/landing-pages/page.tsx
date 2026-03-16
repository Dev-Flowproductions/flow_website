import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import LandingPagesDiagnostic from '@/components/martech/LandingPagesDiagnostic';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';
import ActionPlanModal from '@/components/martech/ActionPlanModal';

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

  const forWhoItems = t.raw('forWho.items') as string[];
  const actionPlanItems = t.raw('actionPlan.items') as string[];
  const actionPlanSections = t.raw('actionPlan.sections') as Array<{ title: string; points: string[] }>;
  const deliversItems = t.raw('delivers.items') as string[];

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Intro Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
                {t('hero.label')}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('hero.subtitle')}
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <p className="text-gray-700 text-lg mb-10">{t('intro.text')}</p>
          </AnimateIn>
        </div>
      </section>

      {/* What is an AI Offer */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <div className="border-l-4 border-[#5b54a0] pl-6">
              <h2 className="text-2xl font-bold mb-3">{t('whatIsAiOffer.title')}</h2>
              <p className="text-gray-700 text-lg">{t('whatIsAiOffer.text')}</p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('forWho.title')}</h2>
            <p className="text-lg text-gray-600 mb-6">{t('forWho.subtitle')}</p>
            <ul className="space-y-3 mb-10">
              {forWhoItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#5b54a0] mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="bg-[#5b54a0]/5 border border-[#5b54a0]/20 rounded-2xl p-8 mb-8">
              <p className="font-semibold text-lg mb-3">{t('diagnostic.title')}</p>
              <p className="text-gray-700 mb-6">{t('diagnostic.description')}</p>
              <ScrollToDiagnostic className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium">
                {t('diagnostic.cta')}
              </ScrollToDiagnostic>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="font-semibold text-lg mb-6">{t('actionPlan.title')}</p>
              <ul className="space-y-3 mb-6">
                {actionPlanItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-[#5b54a0] mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ActionPlanModal
                sectionTitle={t('actionPlan.sectionTitle')}
                sectionSubtitle={t('actionPlan.sectionSubtitle')}
                sections={actionPlanSections}
                triggerLabel={t('actionPlan.cta')}
                generatingLabel={t('actionPlan.generating')}
                closeLabel={t('actionPlan.close')}
                triggerClassName="inline-block px-8 py-3 border-2 border-[#5b54a0] text-[#5b54a0] rounded-full hover:bg-[#5b54a0] hover:text-white transition-colors font-medium"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Delivers */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('delivers.title')}</h2>
            <ul className="space-y-3">
              {deliversItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#5b54a0] mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      <LandingPagesDiagnostic locale={locale} />
    </div>
  );
}
