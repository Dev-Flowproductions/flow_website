import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import MultiSlideCarousel from '@/components/sections/MultiSlideCarousel';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Audiovisual - Flow Productions',
    description: 'Projetos Audiovisuais da Flow Productions',
  };
}

const videosPromocionais = [
  { slug: 'witfy',                    title: 'Witfy',                    img: '/images/projects/audiovisual-carousel/witfy.jpg' },
  { slug: 'pro-am-vilamoura',         title: 'PRO AM – Vilamoura',       img: '/images/projects/audiovisual-carousel/pro-am.jpeg' },
  { slug: 'dom-jose-beach-hotel',     title: 'Dom José Beach Hotel',     img: '/images/projects/audiovisual-carousel/dom-jose.jpg' },
  { slug: 'designer-outlet-algarve',  title: 'Designer Outlet Algarve',  img: '/images/projects/audiovisual-carousel/designer-outlet.jpg' },
  { slug: 'ibc-security',             title: 'IBC Security',             img: '/images/projects/audiovisual-carousel/ibc-security.jpg' },
  { slug: 'indasa',                   title: 'Indasa',                   img: '/images/projects/audiovisual-carousel/indasa.jpg' },
  { slug: 'rocamar-beach-hotel',      title: 'Rocamar Beach Hotel',      img: '/images/projects/audiovisual-carousel/rocamar.png' },
  { slug: 'kubidoce',                 title: 'Kubidoce',                 img: '/images/projects/audiovisual-carousel/kubidoce.jpg' },
  { slug: 'odyssea',                  title: 'Odyssea',                  img: '/images/projects/audiovisual-carousel/odyssea.jpg' },
  { slug: 'the-originals',            title: 'The Originals',            img: '/images/projects/audiovisual-carousel/the-originals.jpg' },
  { slug: 'ria-shopping',             title: 'Ria Shopping',             img: '/images/projects/audiovisual-carousel/ria-shopping.jpg' },
  { slug: 'albufeira-digital-nomads', title: 'Albufeira Digital Nomads', img: '/images/projects/audiovisual-carousel/albufeira-dn.jpg' },
  { slug: 'parque-mineiro-aljustrel', title: 'Parque Mineiro Aljustrel', img: '/images/projects/audiovisual-carousel/aljustrel.webp' },
  { slug: 'fujifilm',                 title: 'Fujifilm',                 img: '/images/projects/audiovisual-carousel/fujifilm.jpg' },
  { slug: 'algarseafood',             title: 'Algarseafood',             img: '/images/projects/audiovisual-carousel/algarseafood.webp' },
];

const fotografias = [
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-1.webp' },
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-2.webp' },
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-3.webp' },
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-4.webp' },
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-5.webp' },
  { slug: 'audiovisual', title: 'Fotografia', img: '/images/projects/audiovisual-carousel/foto-6.webp' },
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

export default async function AudiovisualProjectsPage() {
  return (
    <div>
      {/* Hero — dark with centered text + description overlaid */}
      <section className="relative h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-center px-8">
        <p className="text-xs uppercase tracking-widest text-white/50 mb-4">
          HISTÓRIAS QUE SE VÊEM, SE SENTEM E FICAM NA MEMÓRIA
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
          Flow <span className="text-white/25">Audiovisual</span>
        </h1>
        <p className="text-white/60 text-base leading-relaxed max-w-xl">
          No <strong className="text-white/80">Audiovisual</strong>, transformamos momentos em narrativas com impacto.
          Produzimos <strong className="text-white/80">vídeos e fotografias publicitários, institucionais,
          promocionais e de eventos</strong>, sempre com o objetivo de aproximar marcas de pessoas.
          Da pré-produção à edição final, cuidamos de cada detalhe para que a mensagem flua com emoção, ritmo e autenticidade.
        </p>
      </section>

      {/* Vídeos Promocionais — dark carousel, directly below hero */}
      <MultiSlideCarousel
        projects={videosPromocionais}
        title="Vídeos Promocionais"
        dark={true}
      />

      {/* Flow Fotografias — 2 rows × 3 columns grid */}
      <section className="bg-gray-50 py-16 px-8 md:px-12">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Flow <span className="text-gray-300">Fotografias</span>
          </h2>
        </AnimateIn>
        <div className="grid grid-cols-3 gap-3 max-w-6xl mx-auto">
          {fotografias.slice(0, 6).map((p, i) => (
            <div key={i} className="overflow-hidden bg-gray-200" style={{ aspectRatio: '4/3' }}>
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Brands Logo Marquee */}
      <section className="bg-black py-16 overflow-hidden">
        <div className="animate-marquee">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center flex-shrink-0 mx-8"
              style={{ height: '110px', width: '220px' }}
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
