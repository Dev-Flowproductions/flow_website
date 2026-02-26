import type { Metadata } from 'next';
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
  return getPageMetadata(locale, {
    title: 'Design Gráfico e Identidade Visual',
    description: 'Flow Productions — design gráfico, branding, identidade visual e criação de logótipos em Portugal. Damos rosto às marcas com criatividade e propósito.',
    path: 'design',
    image: `${SITE_URL}/images/hero/design-og.jpg`,
  });
}

const logos = [
  { name: 'ZION',                   src: '/images/logos/zion.png' },
  { name: 'Albufeira Digital Nomads', src: '/images/logos/albufeira-dn.png' },
  { name: 'CM Albufeira',            src: '/images/logos/cm-albufeira.png' },
  { name: 'Fujifilm',               src: '/images/logos/fujifilm.png' },
  { name: 'Faro',                   src: '/images/logos/faro.png' },
  { name: 'Inframoura',             src: '/images/logos/inframoura.png' },
  { name: 'CCDR',                   src: '/images/logos/ccdr.png' },
  { name: 'Nature Soul Food',        src: '/images/logos/nature.png' },
  { name: 'New Balance',            src: '/images/logos/new-balance.png' },
];

const designProjects = [
  { slug: 'zion-creative-artisans',   title: 'ZION Creative Artisans',   img: '/images/projects/design-carousel/zion-carousel.webp' },
  { slug: 'dom-jose-beach-hotel',     title: 'Dom José Beach Hotel',     img: '/images/projects/design-carousel/dom-jose-carousel.png' },
  { slug: '100lixo',                  title: '100LIXO',                  img: '/images/projects/design-carousel/100lixo-carousel.png' },
  { slug: 'witfy',                    title: 'Witfy',                    img: '/images/projects/design-carousel/witfy-carousel.png' },
  { slug: 'albufeira-digital-nomads', title: 'Albufeira Digital Nomads', img: '/images/projects/design-carousel/albufeira-dn-carousel.png' },
  { slug: 'urlegfix',                 title: 'URLEGFIX',                 img: '/images/projects/design-carousel/urlegfix-carousel.jpg' },
  { slug: 'cesarius',                 title: 'Cesarius',                 img: '/images/projects/design-carousel/cesarius-carousel.png' },
  { slug: 'jardim-aurora',            title: 'Jardim Aurora',            img: '/images/projects/design-carousel/jardim-aurora-carousel.png' },
  { slug: 'nature-soul-food',         title: 'Nature Soul Food',         img: '/images/projects/design-carousel/nature-sf-carousel.jpg' },
  { slug: 'rocket-booster',           title: 'Rocket Booster',           img: '/images/projects/design-carousel/rocket-booster-carousel.png' },
  { slug: 'pizza-lab',                title: 'Pizza Lab',                img: '/images/projects/design-carousel/pizza-lab-carousel.jpg' },
];

const serviceSchema = serviceJsonLd({
  name: 'Design Gráfico e Identidade Visual',
  description: 'Criação de identidades visuais, logótipos, materiais gráficos e websites para marcas com consistência e impacto.',
  url: `${SITE_URL}/pt/design`,
  serviceType: 'Graphic Design',
});

const faqSchema = faqJsonLd([
  {
    question: 'O que inclui um projeto de identidade visual?',
    answer: 'Um projeto de identidade visual inclui a criação do logótipo, definição da paleta de cores, tipografia, padrões gráficos e manual de marca. O objetivo é garantir consistência em todos os pontos de contacto da marca.',
  },
  {
    question: 'A Flow Productions cria websites?',
    answer: 'Sim. Desenvolvemos websites modernos e responsivos para empresas e marcas, com foco em experiência do utilizador, performance e identidade visual.',
  },
  {
    question: 'Quanto custa criar um logótipo com a Flow Productions?',
    answer: 'O custo varia consoante o âmbito do projeto. Contacte-nos para um orçamento personalizado em info@flowproductions.pt.',
  },
]);

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Flow Productions', url: `${SITE_URL}/pt` },
  { name: 'Design', url: `${SITE_URL}/pt/design` },
]);

export default async function DesignProjectsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative h-[60vh] lg:h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/design.png"
          alt="Design Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              ONDE AS IDEIAS GANHAM FORMA
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 text-center">
              Flow <span className="text-gray-300">Design</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                O <strong>Design</strong> é onde tudo começa. É aqui que damos rosto às marcas através de{' '}
                <strong>identidades visuais, logótipos, websites ou materiais gráficos</strong> criados para serem lembrados.
              </p>
              <p>
                Do primeiro rascunho à peça final, misturamos criatividade com propósito, garantindo que a comunicação flui com consistência.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      <ProjectCarousel projects={designProjects} />

      <section className="bg-black py-16 overflow-hidden">
        <div className="animate-marquee">
          {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="inline-flex items-center justify-center flex-shrink-0 mx-4 md:mx-8 h-16 w-36 md:h-[110px] md:w-[220px]"
          >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
