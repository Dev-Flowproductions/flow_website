import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import HomeHeroVideo from '@/components/sections/HomeHeroVideo';
import HomeBelowFoldSections from '@/components/sections/HomeBelowFoldSections';
import ServicesPreview from '@/components/sections/ServicesPreview';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const titles: Record<string, string> = {
    pt: 'Agência Criativa em Faro — Design, Marketing & Audiovisual',
    en: 'Creative Agency in Faro — Design, Marketing & Audiovisual',
    fr: 'Agence Créative à Faro — Design, Marketing & Audiovisuel',
  };

  return getPageMetadata(locale, {
    title: titles[locale] || titles.pt,
    description: t('hero.description'),
    path: '',
    keywords: ['agência criativa Faro', 'design gráfico', 'marketing digital', 'produção audiovisual', 'animação 2D 3D', 'branding', 'motion graphics', 'MarTech', 'Inteligência Artificial'],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div>
      <HomeHeroVideo />

      {/* Team Section - "Somos Flow" */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateIn priority>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden">
                <Image
                  src="/images/team/team-1.jpg"
                  alt="Flow Productions Team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2} priority>
              <div className="text-center lg:text-left">
                <p className="text-sm uppercase tracking-wider mb-2 text-gray-600">
                  {t('team.label')}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {t('team.title')}
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed mb-8">
                  <p>{t('team.description')}</p>
                  <p>{t('team.description2')}</p>
                  <p>{t('team.description3')}</p>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <Link
                    href="/sobre-nos"
                    className="inline-flex px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-colors text-lg font-medium"
                  >
                    {t('team.cta')}
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* MarTech & AI Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateIn priority>
              <div className="text-center lg:text-left">
                <p className="text-sm uppercase tracking-wider mb-4 text-gray-500">
                  {t('martech.label')}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('martech.title')}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {t('martech.intro')}
                </p>
                <ul className="text-lg text-gray-700 mb-6 space-y-3 inline-block text-left">
                  {(t.raw('martech.bullets') as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#5b54a0] mt-0.5 shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 mb-8">
                  {t('martech.paragraph')}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Link
                    href="/martech"
                    className="inline-flex px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors text-lg font-medium border-2 border-[#5b54a0] hover:border-[#4a4480]"
                  >
                    {t('martech.cta')}
                  </Link>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl overflow-hidden">
                <Image
                  src="/images/martech.jpg"
                  alt="MarTech & AI"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <ServicesPreview />

      <HomeBelowFoldSections locale={locale} />
    </div>
  );
}
