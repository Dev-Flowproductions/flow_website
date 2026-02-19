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
  const supabase = await createClient();

  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .contains('categories', ['design'])
        .order('published_at', { ascending: false});
      projects = data;
    } catch (error) {
      console.error('Error fetching design projects:', error);
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Image Placeholder */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm uppercase tracking-wider">Design Hero Image Placeholder</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
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
                <p className="text-gray-500">Em breve, novos projetos de design...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
