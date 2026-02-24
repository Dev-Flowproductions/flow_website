import type { Metadata } from 'next';
import MultiSlideCarousel from '@/components/sections/MultiSlideCarousel';
import YoutubeHero from '@/components/sections/YoutubeHero';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Animação - Flow Productions',
    description: 'Projetos de Animação 2D e Motion Graphics da Flow Productions',
  };
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

export default async function AnimacaoProjectsPage() {
  return (
    <div>
      <YoutubeHero
        videoId="QEThcEBF8kY"
        label="QUANDO A IMAGINAÇÃO GANHA MOVIMENTO"
        title="Flow"
        titleAccent="Animação"
        description="Na Animação, damos vida a ideias que não cabem na realidade. Criamos animações 2D, 3D e motion graphics que explicam conceitos complexos, contam histórias e conquistam públicos em segundos. Seja em vídeos animados explicativos, peças para redes sociais ou campanhas institucionais, misturamos criatividade e técnica para que cada frame flua com energia e impacto. Aqui, o impossível torna-se visível."
      />

      {/* Animações Promocionais — dark carousel directly below hero */}
      <MultiSlideCarousel
        projects={animacoesPromocionais}
        title="Animações Promocionais"
        dark={true}
      />
    </div>
  );
}
