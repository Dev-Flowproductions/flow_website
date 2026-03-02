'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { ProjectWithTags, TagRecord } from '@/lib/projects';

interface Props {
  projects: ProjectWithTags[];
  locale: string;
  emptyMessage?: string;
}

export default function CategoryProjectsGrid({ projects, locale, emptyMessage }: Props) {
  if (!projects || projects.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500">{emptyMessage ?? 'Em breve, novos projetos...'}</p>
      </div>
    );
  }

  return (
    <>
      {projects.map((project) => {
        const title = project.title?.[locale] || project.title?.['pt'] || 'Untitled';
        const slug  = project.slug?.[locale]  || project.slug?.['pt']  || project.id;
        const tags = project.project_project_tags
          ?.flatMap(r => Array.isArray(r.project_tags) ? r.project_tags : [r.project_tags])
          .filter((t): t is TagRecord => t != null) ?? [];
        const hasVideo = !!project.gallery?.video_url;

        return (
          <Link key={project.id} href={`/projetos/${slug}`} className="group block">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
              {project.featured_image_path ? (
                <Image
                  src={project.featured_image_path}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
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
        );
      })}
    </>
  );
}
