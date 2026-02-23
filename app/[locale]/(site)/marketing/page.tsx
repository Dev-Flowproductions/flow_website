import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { fetchProjectsByCategory } from '@/lib/projects';
import CategoryProjectsGrid from '@/components/sections/CategoryProjectsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Marketing - Flow Productions',
    description: 'Projetos de Marketing da Flow Productions',
  };
}

export default async function MarketingProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchProjectsByCategory('marketing');

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
                tanto no digital como no offline, e conteúdos que fazem a comunicação fluir em todas as
                direções.
              </p>
              <p>
                Marcas mais fortes, mais visíveis e mais humanas.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-10">
              Redes <span className="text-gray-300">Sociais</span>
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryProjectsGrid
              projects={projects}
              locale={locale}
              emptyMessage="Em breve, novos projetos de marketing..."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
