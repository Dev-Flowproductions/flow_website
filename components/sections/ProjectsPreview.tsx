'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn';
import { useTranslations } from 'next-intl';
import { HOME_PROJECT_SHOWCASE } from '@/lib/homeProjectShowcase';

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
  project_project_tags?: { project_tags: Tag | Tag[] }[];
}

interface ProjectsPreviewProps {
  projects?: Project[];
  locale?: string;
  columns?: 2 | 3;
  showTitles?: boolean;
  variant?: 'grid' | 'categories';
}

export default function ProjectsPreview({
  projects = [],
  locale = 'pt',
  columns = 3,
  showTitles = true,
  variant = 'categories',
}: ProjectsPreviewProps) {
  const t = useTranslations('home.projects');
  const categories = t.raw('categories') as Record<string, string>;

  if (variant === 'categories') {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                {t('label')}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl mx-auto">
                {t('title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('description')}
              </p>
            </div>
          </AnimateIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {HOME_PROJECT_SHOWCASE.map((item) => (
              <StaggerItem key={item.key}>
                <Link href={item.href} className="group block">
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative rounded-lg">
                    <Image
                      src={item.image}
                      alt={categories[item.key] || item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm md:text-base">
                        {categories[item.key]}
                      </p>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    );
  }

  const hasRealProjects = projects.length > 0;
  const gridClass = columns === 2
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
              {t('label')}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </AnimateIn>

        {hasRealProjects && (
          <StaggerContainer className={gridClass}>
            {projects.slice(0, 6).map((project) => {
              const title = project.title?.[locale] || project.title?.['pt'] || 'Untitled';
              const slug = project.slug?.[locale] || project.slug?.['pt'] || project.id;
              const tags = project.project_project_tags
                ?.flatMap(r => Array.isArray(r.project_tags) ? r.project_tags : [r.project_tags])
                .filter((tag): tag is Tag => tag != null) ?? [];
              const hasVideo = !!project.gallery?.video_url;

              return (
                <StaggerItem key={project.id}>
                  <Link href={`/projetos/${slug}`} className="group block">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                      {project.featured_image_path ? (
                        <Image
                          src={project.featured_image_path}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {hasVideo && (
                        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          {t('videoLabel')}
                        </span>
                      )}
                    </div>
                    {showTitles && (
                      <>
                        <h3 className="text-lg font-bold text-black group-hover:text-gray-500 transition-colors mb-1">
                          {title}
                        </h3>
                        {tags.length > 0 && (
                          <p className="text-xs text-gray-400 uppercase tracking-widest">
                            {tags.map((tag, i) => (
                              <span key={tag.key}>
                                {i > 0 && <span className="mx-1">·</span>}
                                {tag.label?.[locale] || tag.label?.['pt'] || tag.key}
                              </span>
                            ))}
                          </p>
                        )}
                      </>
                    )}
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
