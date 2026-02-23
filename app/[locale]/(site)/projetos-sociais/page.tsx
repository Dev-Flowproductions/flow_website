import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { fetchProjectsByCategory } from '@/lib/projects';
import CategoryProjectsGrid from '@/components/sections/CategoryProjectsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projetos Sociais - Flow Productions',
    description: 'Projetos Sociais da Flow Productions — Criatividade com impacto social',
  };
}

export default async function ProjetosSociaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchProjectsByCategory('projetos-sociais');

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
                Transformamos <strong>mensagens importantes</strong> em conteúdos <strong>claros</strong> e{' '}
                <strong>envolventes</strong>, ajudando a dar <strong>visibilidade</strong> ao trabalho que
                muitas vezes acontece longe dos <strong>holofotes</strong>.
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
              emptyMessage="Em breve, novos projetos sociais..."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
