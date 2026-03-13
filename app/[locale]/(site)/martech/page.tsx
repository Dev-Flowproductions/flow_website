import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martech' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech',
    keywords: ['martech', 'marketing technology', 'AI marketing', 'demand generation', 'SEO', 'AEO', 'GEO', 'AI agents'],
  });
}

export default async function MartechPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martech' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
  ]);

  const problems = t.raw('problems.items') as string[];
  const whatIsBullets = t.raw('whatIs.bullets') as string[];
  const whyNeedPoints = t.raw('whyNeed.points') as Array<{ title: string; description: string }>;
  const symptoms = t.raw('symptoms.items') as string[];
  const howWeWorkSteps = t.raw('howWeWork.steps') as Array<{ title: string; description: string }>;
  const faqs = t.raw('faqs.items') as Array<{ question: string; answer: string }>;

  const servicesData = [
    { key: 'aeo', hasDescription: false },
    { key: 'demandGen', hasDescription: true },
    { key: 'gtm', hasDescription: false },
    { key: 'paidMedia', hasDescription: false },
    { key: 'landingPages', hasDescription: false },
    { key: 'aiAgents', hasDescription: false },
  ];

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-[#5b54a0] to-[#3d3875] flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <AnimateIn>
            <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
              {t('hero.label')}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('intro.title')}</h2>
            <p className="text-xl text-[#5b54a0] font-medium mb-8">{t('intro.description')}</p>
            <p className="text-gray-700 text-lg mb-4">{t('intro.paragraph1')}</p>
            <p className="text-gray-700 text-lg mb-8">{t('intro.paragraph2')}</p>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">{t('problems.title')}</h3>
              <ul className="space-y-3">
                {problems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/contactos">
                <button className="px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium">
                  {t('ctaPrimary')}
                </button>
              </Link>
              <a href="#services">
                <button className="px-8 py-3 border-2 border-[#5b54a0] text-[#5b54a0] rounded-full hover:bg-[#5b54a0] hover:text-white transition-colors font-medium">
                  {t('ctaSecondary')}
                </button>
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* What is MarTech Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('whatIs.title')}</h2>
            <p className="text-gray-700 text-lg mb-6">{t('whatIs.description')}</p>
            <p className="text-lg font-semibold mb-4">{t('whatIs.subtitle')}</p>
            <ul className="space-y-2 mb-6">
              {whatIsBullets.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 italic border-l-4 border-[#5b54a0] pl-4">
              {t('whatIs.aiNote')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Why You Need Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t('whyNeed.title')}
            </h2>
            <p className="text-xl text-gray-500 mb-8">{t('whyNeed.subtitle')}</p>
            <p className="text-lg text-gray-700 mb-8">{t('whyNeed.intro')}</p>
          </AnimateIn>

          <div className="space-y-6">
            {whyNeedPoints.map((point, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm text-[#5b54a0] font-semibold mb-2">{i + 1})</p>
                  <h3 className="font-bold text-lg mb-2">{point.title}</h3>
                  <p className="text-gray-600">{point.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.5}>
            <p className="text-lg font-semibold text-gray-800 mt-8 p-4 bg-gray-50 rounded-xl">
              {t('whyNeed.conclusion')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-20 px-4 bg-[#5b54a0] text-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('symptoms.title')}</h2>
            <p className="text-xl text-white/80 mb-8">{t('symptoms.subtitle')}</p>
          </AnimateIn>

          <div className="space-y-4 mb-8">
            {symptoms.map((item, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <p className="text-lg text-white/90 pl-4 border-l-2 border-white/30">
                  {item}
                </p>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            <p className="text-xl font-semibold">{t('symptoms.cta')}</p>
            <Link href="/contactos">
              <button className="mt-6 px-8 py-3 bg-white text-[#5b54a0] rounded-full hover:bg-gray-100 transition-colors font-medium">
                {t('ctaPrimary')}
              </button>
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {t('servicesSection.title')}
            </h2>
          </AnimateIn>

          <div className="space-y-12">
            {servicesData.map((service, i) => {
              const deliverables = t.raw(`servicesSection.${service.key}.deliverables`) as string[];
              const items = t.has(`servicesSection.${service.key}.items`) 
                ? t.raw(`servicesSection.${service.key}.items`) as string[]
                : [];

              return (
                <AnimateIn key={service.key} delay={i * 0.1}>
                  <div className="bg-gray-50 p-8 rounded-2xl">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[#5b54a0] font-semibold mb-1">0{i + 1}</p>
                        <h3 className="text-2xl font-bold">{t(`servicesSection.${service.key}.title`)}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{t(`servicesSection.${service.key}.subtitle`)}</p>
                    
                    {service.hasDescription && (
                      <p className="text-gray-700 mb-4">{t(`servicesSection.${service.key}.description`)}</p>
                    )}

                    {items.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {items.map((item, j) => (
                          <li key={j} className="text-gray-700 flex items-start gap-2">
                            <span className="text-[#5b54a0]">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">O que entregamos:</p>
                    <ul className="space-y-2 mb-6">
                      {deliverables.map((item, j) => (
                        <li key={j} className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howWeWork.title')}</h2>
            <p className="text-lg text-gray-600 mb-12">{t('howWeWork.intro')}</p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howWeWorkSteps.map((step, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-sm text-[#5b54a0] font-bold mb-2">{i + 1}.</p>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t('faqs.title')}</h2>
          </AnimateIn>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <details className="group bg-gray-50 rounded-xl">
                  <summary className="p-6 cursor-pointer font-bold text-lg flex items-center justify-between">
                    {faq.question}
                    <span className="text-[#5b54a0] group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-[#5b54a0] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('caseStudyCta.title')}</h2>
            <p className="text-xl text-white/80 mb-8">{t('caseStudyCta.description')}</p>
            <Link href="/contactos">
              <button className="px-10 py-4 bg-white text-[#5b54a0] rounded-full hover:bg-gray-100 transition-colors font-semibold text-lg">
                {t('caseStudyCta.cta')}
              </button>
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
