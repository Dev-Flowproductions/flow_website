import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import { getPageMetadata, serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'socialProjects' });
  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'projetos-sociais',
    image: `${SITE_URL}/images/hero/social-projects-og.jpg`,
  });
}

const socialProjects = [
  { slug: 'liga-portuguesa-contra-o-cancro', title: 'Liga Portuguesa Contra o Cancro', img: '/images/projects/social-carousel/liga-portuguesa-contra-o-cancro.jpg' },
  { slug: 'aequum',                          title: 'AeQuum',                          img: '/images/projects/social-carousel/aequum.jpg' },
  { slug: 'hackathon',                       title: 'Hackathon Green',                 img: '/images/projects/social-carousel/hackathon.jpg' },
  { slug: 'social-hackathon',               title: 'Social Hackathon',                img: '/images/projects/social-carousel/social-hackathon.jpg' },
  { slug: 'refood',                          title: 'ReFood',                          img: '/images/projects/social-carousel/refood.jpg' },
];

const logos = [
  { name: 'ZION',                    src: '/images/logos/zion.png' },
  { name: 'Albufeira Digital Nomads', src: '/images/logos/albufeira-dn.png' },
  { name: 'CM Albufeira',            src: '/images/logos/cm-albufeira.png' },
  { name: 'Fujifilm',                src: '/images/logos/fujifilm.png' },
  { name: 'Faro',                    src: '/images/logos/faro.png' },
  { name: 'Inframoura',              src: '/images/logos/inframoura.png' },
  { name: 'CCDR',                    src: '/images/logos/ccdr.png' },
  { name: 'Nature Soul Food',        src: '/images/logos/nature.png' },
  { name: 'New Balance',             src: '/images/logos/new-balance.png' },
];

const serviceSchema = serviceJsonLd({
  name: 'Projetos Sociais e Comunicação para Causas',
  description: 'Apoio criativo a associações, iniciativas e eventos com impacto social — design, vídeo e comunicação ao serviço de causas que importam.',
  url: `${SITE_URL}/pt/projetos-sociais`,
  serviceType: 'Social Impact Communication',
});

const faqSchema = faqJsonLd([
  {
    question: 'A Flow Productions trabalha com associações sem fins lucrativos?',
    answer: 'Sim. Através do Flow Social, apoiamos associações e iniciativas com impacto social, disponibilizando serviços de design, vídeo e comunicação a preços especiais ou pro-bono, consoante o caso.',
  },
  {
    question: 'Que tipo de projetos sociais já apoiaram?',
    answer: 'Apoiámos projetos como a Liga Portuguesa Contra o Cancro, a ReFood, Hackathons de sustentabilidade e iniciativas de inclusão social. Cada projeto é abordado com o mesmo rigor criativo dos projetos comerciais.',
  },
]);

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Flow Productions', url: `${SITE_URL}/pt` },
  { name: 'Projetos Sociais', url: `${SITE_URL}/pt/projetos-sociais` },
]);

export default async function ProjetosSociaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'socialProjects' });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative h-[60vh] lg:h-screen w-full overflow-hidden bg-gray-100">
        <Image
          src="/images/hero/social-projects.png"
          alt={t('imageAlt')}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              {t('pageLabel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              {t('title')} <span className="text-gray-300">{t('titleHighlight')}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div
              className="space-y-6 text-gray-700 leading-relaxed text-center md:text-left"
              dangerouslySetInnerHTML={{
                __html: [
                  `<p>${t.raw('paragraph1')}</p>`,
                  `<p>${t.raw('paragraph2')}</p>`,
                  `<p>${t.raw('paragraph3')}</p>`,
                  `<p>${t.raw('paragraph4')}</p>`,
                ].join(''),
              }}
            />
          </AnimateIn>
        </div>
      </section>

      <ProjectCarousel projects={socialProjects} />

      <section className="bg-black py-16 overflow-hidden">
        <div className="animate-marquee">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center flex-shrink-0 mx-8 relative"
              style={{ height: '110px', width: '220px' }}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="220px"
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
