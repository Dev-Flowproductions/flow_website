import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  if (!supabase) return { title: 'Projeto' };

  const { data: project } = await supabase
    .from('projects')
    .select('title, summary')
    .eq(`slug->>${locale}`, slug)
    .eq('status', 'published')
    .single();

  if (!project) return { title: 'Projeto' };

  const title = project.title[locale] || project.title['pt'] || 'Projeto';
  const description = project.summary?.[locale] || project.summary?.['pt'] || '';

  return { title: `${title} – Flow Productions`, description };
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data: project } = await supabase!
    .from('projects')
    .select(`
      *,
      project_project_tags (
        project_tags ( key, label )
      )
    `)
    .eq(`slug->>${locale}`, slug)
    .eq('status', 'published')
    .single();

  if (!project) notFound();

  const title   = project.title?.[locale]   || project.title?.['pt']   || 'Projeto';
  const summary = project.summary?.[locale] || project.summary?.['pt'] || '';

  const videoUrl: string | null = project.gallery?.video_url || null;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const tags: { key: string; label: Record<string, string> }[] =
    project.project_project_tags?.map((r: { project_tags: { key: string; label: Record<string, string> } }) => r.project_tags).filter(Boolean) ?? [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero — featured image */}
      {project.featured_image_path && (
        <div className="w-full h-[55vh] overflow-hidden">
          <img
            src={project.featured_image_path}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/projetos" className="hover:text-black transition-colors">
            Projetos
          </Link>
          <span>/</span>
          <span className="text-gray-600">{title}</span>
        </nav>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag.key}
                className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 border border-gray-200 rounded-full px-3 py-1"
              >
                {tag.label?.[locale] || tag.label?.['pt'] || tag.key}
              </span>
            ))}
          </div>
        )}

        {/* Title + client */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-2">
          {title}
        </h1>
        {project.client_name && (
          <p className="text-gray-500 text-base mb-8">{project.client_name}</p>
        )}

        {/* Summary */}
        {summary && (
          <p className="text-lg text-gray-700 leading-relaxed mb-12">{summary}</p>
        )}

        {/* YouTube embed */}
        {embedUrl && (
          <div className="mb-12">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/projetos"
          className="inline-flex items-center gap-2 text-sm font-medium border-2 border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition-colors"
        >
          ← Todos os Projetos
        </Link>
      </div>
    </div>
  );
}
