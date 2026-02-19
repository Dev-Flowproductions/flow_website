import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'Projetos Sociais - Flow Productions',
    description: 'Projetos Sociais da Flow Productions - Criatividade com impacto social',
  };
}

export default async function ProjetosSociaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .contains('categories', ['projetos-sociais'])
        .order('published_at', { ascending: false });
      projects = data;
    } catch (error) {
      console.error('Error fetching projetos sociais:', error);
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Image Placeholder */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-green-100 to-blue-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-sm uppercase tracking-wider">Projetos Sociais Hero Image Placeholder</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
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
                Na Flow, gostamos de criar com <strong>impacto</strong> e acreditamos que a <strong>criatividade</strong> também pode servir <strong>causas</strong>.
              </p>
              <p>
                O <strong>Flow Social</strong> é a nossa forma de apoiar <strong>associações</strong>, <strong>iniciativas</strong> e <strong>eventos</strong> que trabalham por um mundo mais <strong>justo</strong>, <strong>inclusivo</strong> e <strong>consciente</strong>.
              </p>
              <p>
                Através destas iniciativas, colocamos a nossa <strong>equipa</strong> e o nosso <strong>know-how</strong> ao serviço de projetos que merecem ser <strong>vistos</strong>, <strong>ouvidos</strong> e <strong>partilhados</strong>. Transformamos <strong>mensagens importantes</strong> em conteúdos <strong>claros</strong> e <strong>envolventes</strong>, ajudando a dar <strong>visibilidade</strong> ao trabalho que muitas vezes acontece longe dos <strong>holofotes</strong>.
              </p>
              <p>
                Porque quando uma <strong>causa importa</strong>, a <strong>comunicação</strong> também conta para <strong>informar</strong>, <strong>mobilizar</strong> e <strong>aproximar pessoas</strong>.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? (
              projects.map((project) => {
                const title = project.title[locale] || project.title['pt'] || 'Untitled';
                return (
                  <div key={project.id} className="group cursor-pointer">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {project.featured_image_path ? (
                        <img
                          src={project.featured_image_path}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    {project.client_name && (
                      <p className="text-gray-600 text-sm">{project.client_name}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Em breve, novos projetos sociais...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
