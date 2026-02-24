import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
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
    title: 'Produção Audiovisual e Fotografia',
    description: 'Flow Productions — produção audiovisual, vídeo publicitário e fotografia profissional em Portugal. Transformamos momentos em narrativas com impacto para marcas e eventos.',
    path: 'audiovisual',
    image: `${SITE_URL}/images/hero/audiovisual-og.jpg`,
  });
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

const serviceSchema = serviceJsonLd({
  name: 'Produção Audiovisual e Fotografia',
  description: 'Produção de vídeos publicitários, institucionais, promocionais e de eventos, bem como fotografia profissional de produto e eventos.',
  url: `${SITE_URL}/pt/audiovisual`,
  serviceType: 'Audiovisual Production',
});

const faqSchema = faqJsonLd([
  {
    question: 'Que tipos de vídeo a Flow Productions produz?',
    answer: 'Produzimos vídeos publicitários, institucionais, promocionais, de eventos, entrevistas e conteúdos para redes sociais. Tratamos de toda a produção: pré-produção, filmagem e edição final.',
  },
  {
    question: 'A Flow Productions também faz fotografia profissional?',
    answer: 'Sim. Realizamos sessões de fotografia de produto, fotografia corporativa, fotografia de eventos e fotografia de arquitetura e espaços.',
  },
  {
    question: 'Trabalham em todo o Portugal ou apenas no Algarve?',
    answer: 'A nossa base é em Faro, no Algarve, mas realizamos produções em todo o território nacional e no estrangeiro.',
  },
]);

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Flow Productions', url: `${SITE_URL}/pt` },
  { name: 'Audiovisual', url: `${SITE_URL}/pt/audiovisual` },
]);

export default async function AudiovisualProjectsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <YoutubeHero
        videoId="GBRdrWdv6L8"
        label="HISTÓRIAS QUE SE VÊEM, SE SENTEM E FICAM NA MEMÓRIA"
        title="Flow"
        titleAccent="Audiovisual"
        description="No Audiovisual, transformamos momentos em narrativas com impacto. Produzimos vídeos e fotografias publicitários, institucionais, promocionais e de eventos, sempre com o objetivo de aproximar marcas de pessoas. Da pré-produção à edição final, cuidamos de cada detalhe para que a mensagem flua com emoção, ritmo e autenticidade."
      />

      <MultiSlideCarousel
        projects={videosPromocionais}
        title="Vídeos Promocionais"
        dark={true}
      />

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
