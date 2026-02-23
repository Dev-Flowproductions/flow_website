import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { fetchProjectsByCategory } from '@/lib/projects';
import CategoryProjectsGrid from '@/components/sections/CategoryProjectsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Design - Flow Productions',
    description: 'Projetos de Design da Flow Productions',
  };
}

export default async function DesignProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchProjectsByCategory('design');

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/design.jpg"
          alt="Design Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Intro */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              ONDE AS IDEIAS GANHAM FORMA
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
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

      {/* Projects Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryProjectsGrid
              projects={projects}
              locale={locale}
              emptyMessage="Em breve, novos projetos de design..."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
