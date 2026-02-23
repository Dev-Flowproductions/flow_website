import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { fetchProjectsByCategory } from '@/lib/projects';
import CategoryProjectsGrid from '@/components/sections/CategoryProjectsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Animação - Flow Productions',
    description: 'Projetos de Animação 2D e Motion Graphics da Flow Productions',
  };
}

export default async function AnimacaoProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchProjectsByCategory('animacao');

  return (
    <div>
      {/* Hero — dark until a hero image is provided */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900" />

      {/* Intro — same structure as all other category pages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              QUANDO A IMAGINAÇÃO GANHA MOVIMENTO
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              Flow <span className="text-gray-300">Animação</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Na <strong>Animação</strong>, damos vida a ideias que não cabem na realidade.
              </p>
              <p>
                Criamos <strong>animações 2D, 3D e motion graphics</strong> que explicam conceitos complexos,
                contam histórias e conquistam públicos em segundos.
              </p>
              <p>
                Seja em vídeos animados explicativos, peças para redes sociais ou campanhas institucionais,
                misturamos criatividade e técnica para que cada frame flua com energia e impacto. Aqui, o
                impossível torna-se visível.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Animações Promocionais */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-10">
              Animações <span className="text-gray-300">Promocionais</span>
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryProjectsGrid
              projects={projects}
              locale={locale}
              emptyMessage="Em breve, novos projetos de animação..."
            />
          </div>
        </div>
      </section>

      {/* Cobertura de Eventos — placeholder */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Cobertura de <span className="text-gray-300">Eventos</span>
            </h2>
            <p className="text-gray-500">Em breve, novos trabalhos de cobertura de eventos...</p>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
