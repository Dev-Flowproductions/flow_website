'use client';

import { Link } from '@/i18n/routing';
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn';

interface Tag {
  key: string;
  label: Record<string, string>;
}

interface Project {
  id: string;
  title: Record<string, string>;
  slug: Record<string, string>;
  client_name?: string;
  featured_image_path?: string;
  gallery?: { video_url?: string } | null;
  // Supabase returns project_tags as object or array depending on relationship cardinality
  project_project_tags?: { project_tags: Tag | Tag[] }[];
}

interface ProjectsPreviewProps {
  projects: Project[];
  locale: string;
}

export default function ProjectsPreview({ projects, locale }: ProjectsPreviewProps) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-gray-600 mb-2">
              Trabalhos que falam por si
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Projetos com Flow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Do conceito à execução, fazemos as ideias ganhar forma e movimento.
            </p>
          </div>
        </AnimateIn>

        {projects.length > 0 ? (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.slice(0, 6).map((project) => {
                const title = project.title?.[locale] || project.title?.['pt'] || 'Untitled';
                const slug  = project.slug?.[locale]  || project.slug?.['pt']  || project.id;
                const tags  = project.project_project_tags
                  ?.flatMap(r => Array.isArray(r.project_tags) ? r.project_tags : [r.project_tags])
                  .filter((t): t is Tag => t != null) ?? [];
                const hasVideo = !!project.gallery?.video_url;

                return (
                  <StaggerItem key={project.id}>
                    <Link href={`/projetos/${slug}`} className="group block">
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
                          {tags.map((tag) => (
                            <span key={tag.key} className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                              {tag.label?.[locale] || tag.label?.['pt'] || tag.key}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors mb-1">
                        {title}
                      </h3>
                      {project.client_name && (
                        <p className="text-gray-500 text-sm">{project.client_name}</p>
                      )}
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <AnimateIn delay={0.4}>
              <div className="text-center">
                <Link href="/projetos">
                  <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                    Ver Todos os Projetos
                  </button>
                </Link>
              </div>
            </AnimateIn>
          </>
        ) : (
          <AnimateIn>
            <div className="text-center py-12">
              <p className="text-gray-500">Em breve, novos projetos...</p>
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
