import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import ProjectCarousel from '@/components/sections/ProjectCarousel';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projetos Sociais - Flow Productions',
    description: 'Projetos Sociais da Flow Productions — Criatividade com impacto social',
  };
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

export default async function ProjetosSociaisPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/social-projects.jpg"
          alt="Projetos Sociais Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Intro */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              QUANDO A CRIATIVIDADE APOIA UMA CAUSA
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              Flow <span className="text-gray-300">Social</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Na Flow, gostamos de criar com <strong>impacto</strong> e acreditamos que a{' '}
                <strong>criatividade</strong> também pode servir <strong>causas</strong>.
              </p>
              <p>
                O <strong>Flow Social</strong> é a nossa forma de apoiar <strong>associações</strong>,{' '}
                <strong>iniciativas</strong> e <strong>eventos</strong> que trabalham por um mundo mais{' '}
                <strong>justo</strong>, <strong>inclusivo</strong> e <strong>consciente</strong>.
              </p>
              <p>
                Através destas iniciativas, colocamos a nossa <strong>equipa</strong> e o nosso{' '}
                <strong>know-how</strong> ao serviço de projetos que merecem ser <strong>vistos</strong>,{' '}
                <strong>ouvidos</strong> e <strong>partilhados</strong>. Transformamos{' '}
                <strong>mensagens importantes</strong> em conteúdos <strong>claros</strong> e{' '}
                <strong>envolventes</strong>, ajudando a dar <strong>visibilidade</strong> ao trabalho que
                muitas vezes acontece longe dos <strong>holofotes</strong>.
              </p>
              <p>
                Porque quando uma <strong>causa importa</strong>, a <strong>comunicação</strong> também
                conta para <strong>informar</strong>, <strong>mobilizar</strong> e <strong>aproximar pessoas</strong>.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Projects Carousel */}
      <ProjectCarousel projects={socialProjects} />

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
