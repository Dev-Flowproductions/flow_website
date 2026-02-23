import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const supabase = await createClient();

  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select(`
          *,
          project_project_tags (
            project_tags ( key, label )
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      projects = data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  return (
    <div>
      {/* Hero Image Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-100">
        <img
          src="/images/hero/project.jpg"
          alt="Projetos Flow Productions"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Text Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('pageLabel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              {t('title')} <span className="text-gray-300">{t('titleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('description')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? (
              projects.map((project) => {
                const title = project.title?.[locale] || project.title?.['pt'] || 'Untitled';
                const projectSlug = project.slug?.[locale] || project.slug?.['pt'] || project.id;
                const tags = project.project_project_tags
                  ?.map((r: { project_tags: { key: string; label: Record<string, string> } }) => r.project_tags)
                  .filter(Boolean) ?? [];
                const hasVideo = !!project.gallery?.video_url;

                return (
                  <Link key={project.id} href={`/projetos/${projectSlug}`} className="group block">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                      {project.featured_image_path ? (
                        <img
                          src={project.featured_image_path}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Video badge */}
                      {hasVideo && (
                        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          Vídeo
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tags.map((tag: { key: string; label: Record<string, string> }) => (
                          <span key={tag.key} className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            {tag.label?.[locale] || tag.label?.['pt'] || tag.key}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors mb-1">{title}</h3>
                    {project.client_name && (
                      <p className="text-gray-500 text-sm">{project.client_name}</p>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Em breve, novos projetos...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
