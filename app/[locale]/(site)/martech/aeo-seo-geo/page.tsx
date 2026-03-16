import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import AeoSeoGeoDiagnostic from '@/components/martech/AeoSeoGeoDiagnostic';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

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

  const whatIsItems = t.raw('whatIs.items') as Array<{ term: string; description: string }>;
  const forWhoItems = t.raw('forWho.items') as string[];
  const deliversItems = t.raw('delivers.items') as string[];
  const improvementsItems = t.raw('improvements.items') as string[];

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

      {/* What is SEO/AEO/GEO */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('whatIs.title')}</h2>
            <div className="space-y-6">
              {whatIsItems.map((item, i) => (
                <div key={i} className="border-l-4 border-[#5b54a0] pl-6">
                  <p className="font-bold text-lg mb-1">{item.term}</p>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
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
            <ul className="space-y-3">
              {forWhoItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#5b54a0] mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="mt-10 bg-[#5b54a0]/5 border border-[#5b54a0]/20 rounded-2xl p-8">
              <p className="font-semibold text-lg mb-3">{t('audit.title')}</p>
              <p className="text-gray-700 mb-6">{t('audit.description')}</p>
              <ScrollToDiagnostic className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium">
                {t('audit.cta')}
              </ScrollToDiagnostic>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Delivers + Improvements */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <AnimateIn>
              <h2 className="text-2xl font-bold mb-6">{t('delivers.title')}</h2>
              <ul className="space-y-3">
                {deliversItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-[#5b54a0] mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h2 className="text-2xl font-bold mb-6">{t('improvements.title')}</h2>
              <ul className="space-y-3">
                {improvementsItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <AnimateIn>
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <Link
                href="/contactos"
                className="px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium"
              >
                {t('cta1')}
              </Link>
              <ScrollToDiagnostic className="px-8 py-3 border-2 border-[#5b54a0] text-[#5b54a0] rounded-full hover:bg-[#5b54a0] hover:text-white transition-colors font-medium">
                {t('cta2')}
              </ScrollToDiagnostic>
            </div>
          </AnimateIn>
        </div>
      </section>

      <AeoSeoGeoDiagnostic locale={locale} />
    </div>
  );
}
