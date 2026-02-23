import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { fetchProjectsByCategory } from '@/lib/projects';
import CategoryProjectsGrid from '@/components/sections/CategoryProjectsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Audiovisual - Flow Productions',
    description: 'Projetos Audiovisuais da Flow Productions',
  };
}

export default async function AudiovisualProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchProjectsByCategory('audiovisual');

  return (
    <div>
      {/* Hero — dark until a hero image is provided */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900" />

      {/* Intro — same structure as all other category pages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">
              HISTÓRIAS QUE SE VÊEM, SE SENTEM E FICAM NA MEMÓRIA
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              Flow <span className="text-gray-300">Audiovisual</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                No <strong>Audiovisual</strong>, transformamos momentos em narrativas com impacto.
              </p>
              <p>
                Produzimos <strong>vídeos e fotografias publicitários, institucionais, promocionais e de
                eventos</strong>, sempre com o objetivo de aproximar marcas de pessoas.
              </p>
              <p>
                Da pré-produção à edição final, cuidamos de cada detalhe para que a mensagem flua com emoção,
                ritmo e autenticidade.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Vídeos Promocionais */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-10">
              Vídeos <span className="text-gray-300">Promocionais</span>
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryProjectsGrid
              projects={projects}
              locale={locale}
              emptyMessage="Em breve, novos projetos audiovisuais..."
            />
          </div>
        </div>
      </section>

      {/* Flow Fotografias — placeholder until photo projects are added */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Flow <span className="text-gray-300">Fotografias</span>
            </h2>
            <p className="text-gray-500">Em breve, novos trabalhos de fotografia...</p>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
