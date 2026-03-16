import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import PaidMediaDiagnostic from '@/components/martech/PaidMediaDiagnostic';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechPaidMedia' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/paid-media',
    keywords: ['paid media', 'LLM advertising', 'Google Ads', 'Meta Ads', 'campaign management', 'AI advertising'],
  });
}

export default async function PaidMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechPaidMedia' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/paid-media` },
  ]);

  const whatIncludesItems = t.raw('whatIncludes.items') as string[];
  const forWhoItems = t.raw('forWho.items') as string[];
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

      {/* What this includes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('whatIncludes.title')}</h2>
            <ul className="space-y-3">
              {whatIncludesItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#5b54a0] mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('forWho.title')}</h2>
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
            <div className="bg-[#5b54a0]/5 border border-[#5b54a0]/20 rounded-2xl p-8">
              <p className="font-semibold text-lg mb-3">{t('audit.title')}</p>
              <p className="text-gray-700 mb-6">{t('audit.description')}</p>
              <ScrollToDiagnostic className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium">
                {t('audit.cta')}
              </ScrollToDiagnostic>
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

      <PaidMediaDiagnostic locale={locale} />
    </div>
  );
}
