import type { Metadata } from 'next';
import MultiSlideCarousel from '@/components/sections/MultiSlideCarousel';
import YoutubeHero from '@/components/sections/YoutubeHero';
import { getPageMetadata, serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, {
    title: 'Animação 2D e Motion Graphics',
    description: 'Flow Productions — animação 2D, 3D e motion graphics em Portugal. Criamos animações explicativas, peças para redes sociais e campanhas institucionais que conquistam audiências.',
    path: 'animacao',
    image: `${SITE_URL}/images/hero/animacao-og.jpg`,
  });
}

const animacoesPromocionais = [
  { slug: 'ultima-gota',           title: 'Última Gota',          tags: 'Animação',                  img: '/images/projects/animacao-carousel/ultima-gota.webp' },
  { slug: 'likewise',              title: 'Likewise',             tags: 'Animação',                  img: '/images/projects/animacao-carousel/likewise.jpg' },
  { slug: 'medwater',              title: 'Medwater',             tags: 'Animação',                  img: '/images/projects/animacao-carousel/medwater.webp' },
  { slug: 'one-select-properties', title: 'One Select Properties',tags: 'Animação',                  img: '/images/projects/animacao-carousel/one-select.jpg' },
  { slug: 'mia',                   title: 'MIA',                  tags: 'Animação, Content Writing', img: '/images/projects/animacao-carousel/mia.webp' },
  { slug: 'barturs',               title: 'Barturs',              tags: 'Animação',                  img: '/images/projects/animacao-carousel/barturs.png' },
  { slug: 'lets-communicate',      title: "Let's Communicate",    tags: 'Animação',                  img: '/images/projects/animacao-carousel/lets-communicate.jpg' },
  { slug: 'kipt',                  title: 'KIPT',                 tags: 'Animação',                  img: '/images/projects/animacao-carousel/kipt.webp' },
  { slug: 'emjogo',                title: 'EmJogo',               tags: 'Animação',                  img: '/images/projects/animacao-carousel/emjogo.webp' },
  { slug: 'travel-tech-partners',  title: 'Travel Tech Partners', tags: 'Animação',                  img: '/images/projects/animacao-carousel/travel-tech-partners.webp' },
  { slug: 'toma-la-da-ca',         title: 'Toma lá, dá cá',      tags: 'Animação',                  img: '/images/projects/animacao-carousel/toma-la-da-ca.webp' },
];

const serviceSchema = serviceJsonLd({
  name: 'Animação 2D e Motion Graphics',
  description: 'Criação de animações 2D, 3D e motion graphics para marcas, campanhas institucionais e redes sociais.',
  url: `${SITE_URL}/pt/animacao`,
  serviceType: 'Animation Production',
});

const faqSchema = faqJsonLd([
  {
    question: 'O que é animação 2D e motion graphics?',
    answer: 'Animação 2D é a criação de personagens e cenários em duas dimensões. Motion graphics é a animação de elementos gráficos como texto, logótipos e formas para comunicar mensagens de forma dinâmica e apelativa.',
  },
  {
    question: 'Quanto tempo demora a produção de uma animação?',
    answer: 'O tempo de produção varia consoante a complexidade do projeto. Um vídeo animado de 60 segundos pode demorar entre 2 a 4 semanas, incluindo conceito, storyboard, animação e revisões.',
  },
  {
    question: 'A Flow Productions faz animações para redes sociais?',
    answer: 'Sim. Criamos animações otimizadas para Instagram, TikTok, YouTube e outras plataformas digitais, com formatos adaptados a cada canal.',
  },
]);

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Flow Productions', url: `${SITE_URL}/pt` },
  { name: 'Animação', url: `${SITE_URL}/pt/animacao` },
]);

export default async function AnimacaoProjectsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <YoutubeHero
        videoId="QEThcEBF8kY"
        label="QUANDO A IMAGINAÇÃO GANHA MOVIMENTO"
        title="Flow"
        titleAccent="Animação"
        description="Na Animação, damos vida a ideias que não cabem na realidade. Criamos animações 2D, 3D e motion graphics que explicam conceitos complexos, contam histórias e conquistam públicos em segundos. Seja em vídeos animados explicativos, peças para redes sociais ou campanhas institucionais, misturamos criatividade e técnica para que cada frame flua com energia e impacto. Aqui, o impossível torna-se visível."
      />

      <MultiSlideCarousel
        projects={animacoesPromocionais}
        title="Animações Promocionais"
        dark={true}
      />
    </div>
  );
}
