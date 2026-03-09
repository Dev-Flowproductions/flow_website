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
  const t = await getTranslations({ locale, namespace: 'marketing' });
  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'marketing',
    image: `${SITE_URL}/images/hero/marketing-og.jpg`,
  });
}

const redesSociais = [
  { slug: 'dental-hpa',               title: 'DENTAL HPA',               img: '/images/projects/marketing-carousel/sociais-dental-hpa.jpg' },
  { slug: 'albufeira-digital-nomads', title: 'Albufeira Digital Nomads',  img: '/images/projects/marketing-carousel/sociais-albufeira-dn.png' },
  { slug: 'kubidoce',                 title: 'Kubidoce',                  img: '/images/projects/marketing-carousel/sociais-kubidoce.png' },
  { slug: 'rb-woodfinish',            title: 'RB Woodfinish',             img: '/images/projects/marketing-carousel/sociais-rb-woodfinish.jpg' },
  { slug: 'missao-conducao',          title: 'Missão Condução',           img: '/images/projects/marketing-carousel/sociais-missao-conducao.jpg' },
  { slug: 'adm-24',                   title: "ADM 24'",                   img: '/images/projects/marketing-carousel/sociais-adm-24.jpg' },
  { slug: 'nature-soul-food',         title: 'Nature Soul Food',          img: '/images/projects/marketing-carousel/sociais-nature-soul-food.jpg' },
  { slug: 'jardim-aurora',            title: 'Jardim Aurora',             img: '/images/projects/marketing-carousel/sociais-jardim-aurora.jpg' },
];

const contentWriting = [
  { slug: 'dias-medievais-de-castro-marim', title: 'Dias Medievais de Castro Marim', img: '/images/projects/marketing-carousel/content-dias-medievais.webp' },
  { slug: 'mia',                            title: 'MIA',                             img: '/images/projects/marketing-carousel/content-mia.webp' },
  { slug: 'witfy',                          title: 'Witfy',                           img: '/images/projects/marketing-carousel/content-witfy.jpg' },
  { slug: 'pro-am-vilamoura',               title: 'PRO AM – Vilamoura',              img: '/images/projects/marketing-carousel/content-pro-am-vilamoura.jpeg' },
  { slug: 'dom-jose-beach-hotel',           title: 'Dom José Beach Hotel',            img: '/images/projects/marketing-carousel/content-dom-jose.jpg' },
  { slug: 'ria-shopping',                   title: 'Ria Shopping',                    img: '/images/projects/marketing-carousel/content-ria-shopping.jpg' },
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
  name: 'Marketing Digital e Gestão de Redes Sociais',
  description: 'Planeamento e desenvolvimento de estratégias de marketing digital, gestão de redes sociais, campanhas e content writing para marcas.',
  url: `${SITE_URL}/pt/marketing`,
  serviceType: 'Digital Marketing',
});

const faqSchema = faqJsonLd([
  {
    question: 'O que inclui a gestão de redes sociais?',
    answer: 'Inclui a criação de conteúdos (textos, imagens e vídeos), planeamento editorial, publicação e monitorização de resultados nas principais plataformas como Instagram, Facebook e LinkedIn.',
  },
  {
    question: 'A Flow Productions faz campanhas de publicidade paga?',
    answer: 'Sim. Gerimos campanhas de Meta Ads (Facebook e Instagram) e Google Ads, com segmentação de audiências e otimização contínua para maximizar o retorno do investimento.',
  },
  {
    question: 'O que é content writing e como ajuda a minha marca?',
    answer: 'Content writing é a criação de textos estratégicos para o seu website, blog, redes sociais ou newsletters. Conteúdo bem escrito melhora o SEO, aumenta a credibilidade da marca e aproxima clientes.',
  },
]);

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Flow Productions', url: `${SITE_URL}/pt` },
  { name: 'Marketing', url: `${SITE_URL}/pt/marketing` },
]);

export default async function MarketingProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing' });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative h-[60vh] md:h-screen w-full overflow-hidden bg-gray-100">
        <Image
          src="/images/hero/marketing.png"
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
              className="space-y-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: [
                  `<p>${t.raw('paragraph1')}</p>`,
                  `<p>${t.raw('paragraph2')}</p>`,
                ].join(''),
              }}
            />
          </AnimateIn>
        </div>
      </section>

      <section className="bg-white pb-4">
        <div className="px-4 pb-2 text-center">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('socialMediaTitle')} <span className="text-gray-300">{t('socialMediaTitleHighlight')}</span>
            </h2>
          </AnimateIn>
        </div>
        <ProjectCarousel projects={redesSociais} />
      </section>

      <section className="bg-gray-50 pb-4">
        <div className="px-4 pt-12 pb-2 text-center">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('contentWritingTitle')} <span className="text-gray-300">{t('contentWritingTitleHighlight')}</span>
            </h2>
          </AnimateIn>
        </div>
        <ProjectCarousel projects={contentWriting} />
      </section>

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
