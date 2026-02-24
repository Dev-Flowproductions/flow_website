import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import ProjectCarousel from '@/components/sections/ProjectCarousel';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Marketing - Flow Productions',
    description: 'Projetos de Marketing da Flow Productions',
  };
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

export default async function MarketingProjectsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/marketing.jpg"
          alt="Marketing Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Intro */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              ESTRATÉGIA E CRIATIVIDADE A MOVER MARCAS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              Flow <span className="text-gray-300">Marketing</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                O <strong>Marketing</strong> na Flow é pensado para ligar marcas e pessoas com propósito.
                Planeamos e desenvolvemos <strong>estratégias personalizadas</strong>, campanhas que vivem
                tanto no digital como no offline, e conteúdos que fazem a comunicação fluir em todas as direções.
              </p>
              <p>
                O resultado? Marcas mais fortes, mais visíveis e mais humanas.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Redes Sociais carousel */}
      <section className="bg-white pb-4">
        <div className="px-4 pb-2 text-center">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold">
              Redes <span className="text-gray-300">Sociais</span>
            </h2>
          </AnimateIn>
        </div>
        <ProjectCarousel projects={redesSociais} />
      </section>

      {/* Content Writing carousel */}
      <section className="bg-gray-50 pb-4">
        <div className="px-4 pt-12 pb-2 text-center">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold">
              Content <span className="text-gray-300">Writing</span>
            </h2>
          </AnimateIn>
        </div>
        <ProjectCarousel projects={contentWriting} />
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
