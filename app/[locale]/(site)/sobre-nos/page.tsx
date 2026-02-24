import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div>
      {/* Hero Section with Image */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-200">
        <img
          src="/images/hero/about-us.jpg"
          alt="Flow Productions Team"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* History Section - "Onde o Flow Começou" */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
                {t('history.label')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-12">
                {t('history.title')} <span className="text-gray-300">{t('history.titleHighlight')}</span>
              </h2>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-base md:text-lg">
                {t('history.paragraph1')}
              </p>
              <p className="text-base md:text-lg">
                {t('history.paragraph2')}
              </p>
              <p className="text-base md:text-lg">
                {t('history.paragraph3')}
              </p>
              <p className="text-base md:text-lg">
                {t('history.paragraph4')}
              </p>
              <p className="text-base md:text-lg">
                {t('history.paragraph5')}
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Mission, Vision & Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
                {t('mission.label')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-12">
                {t('mission.title')} <span className="text-gray-300">{t('mission.titleHighlight')}</span>
              </h2>
            </div>
          </AnimateIn>

          {/* Divider Line */}
          <div className="border-t border-gray-300 mb-16" />

          {/* Mission, Vision, Values Grid */}
          <div className="space-y-16">
            {/* Mission */}
            <AnimateIn delay={0.1}>
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="flex items-start gap-6">
                    <span className="text-6xl font-bold text-gray-200">01</span>
                    <h3 className="text-2xl font-bold pt-3">{t('mission.mission.title')}</h3>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-700 leading-relaxed">
                    {t('mission.mission.description')}
                  </p>
                </div>
              </div>
            </AnimateIn>

            {/* Vision */}
            <AnimateIn delay={0.2}>
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="flex items-start gap-6">
                    <span className="text-6xl font-bold text-gray-200">02</span>
                    <h3 className="text-2xl font-bold pt-3">{t('mission.vision.title')}</h3>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-700 leading-relaxed">
                    {t('mission.vision.description')}
                  </p>
                </div>
              </div>
            </AnimateIn>

            {/* Values */}
            <AnimateIn delay={0.3}>
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="flex items-start gap-6">
                    <span className="text-6xl font-bold text-gray-200">03</span>
                    <h3 className="text-2xl font-bold pt-3">{t('mission.values.title')}</h3>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-700 leading-relaxed">
                    {t('mission.values.items')}
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Team Section - 9 Members Grid */}
      <section className="py-20 px-4 bg-white">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider leading-tight">FLOW</p>
                    <p className="text-[8px] leading-tight">Creative</p>
                    <p className="text-[8px] leading-tight">Team</p>
                  </div>
                </div>
              </div>
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-bold">
                {t('team.title')} <span className="text-gray-300">{t('team.titleHighlight')}</span>
              </h2>
            </div>
          </AnimateIn>

          {/* 3x3 Grid of Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { name: 'Ricardo Pedro', role: 'CEO | 2D Animator', slug: 'ricardo-pedro' },
              { name: 'Verónica Guerreiro', role: 'Design Thinker | Project Manager', slug: 'veronica-guerreiro' },
              { name: 'José Carvalho', role: 'CXO & UI Designer | AI Specialist', slug: 'jose-carvalho' },
              { name: 'Mariana Rocha', role: 'CMO | Social Media Manager', slug: 'mariana-rocha' },
              { name: 'Jéssica Sousa', role: 'Social Media Manager', slug: 'jessica-sousa' },
              { name: 'António Fernandes', role: 'Design & Branding', slug: 'antonio-fernandes' },
              { name: 'Maeva Ferrand', role: 'Branding & Design', slug: 'maeva-ferrand' },
              { name: 'Inês Navrat', role: 'Filmmaker & Photographer', slug: 'ines-navrat' },
              { name: 'Guilherme Bordoni', role: 'Video Producer', slug: 'guilherme-bordoni' },
            ].map((member, index) => (
              <AnimateIn key={index} delay={0.1 * (index + 1)}>
                <Link href={`/team/${member.slug}`} className="block group cursor-pointer">
                  {/* Photo */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={`/images/team/member-${index + 1}.jpg`}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Grey bar */}
                  <div className="bg-gray-300 h-8" />
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
