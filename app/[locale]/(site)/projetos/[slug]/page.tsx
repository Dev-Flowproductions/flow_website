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

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
  const content = project.content?.[locale] || project.content?.['pt'] || '';
  const yearLabel = project.year_label || '';

  const videoUrl: string | null = project.gallery?.video_url || null;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const tags: { key: string; label: Record<string, string> }[] =
    project.project_project_tags?.map((r: { project_tags: { key: string; label: Record<string, string> } }) => r.project_tags).filter(Boolean) ?? [];

  const publishedDate = project.published_at ? formatDate(project.published_at, locale) : '';

  return (
    <div className="bg-white min-h-screen">

      {/* Header: two-column — meta left, image right */}
      <section className="pt-32 pb-0 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Left: title + summary + meta */}
            <div className="md:col-span-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-6">
                {title}
              </h1>

              {summary && (
                <p className="text-base text-gray-500 leading-relaxed mb-8">
                  {summary}
                </p>
              )}

              {/* Meta: Cliente / Ano */}
              <div className="space-y-3">
                {project.client_name && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">Cliente</span>
                    <span className="text-sm text-gray-500">{project.client_name}</span>
                  </div>
                )}
                {yearLabel && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">Ano</span>
                    <span className="text-sm text-gray-500">{yearLabel}</span>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">Categoria</span>
                    <span className="text-sm text-gray-500">
                      {tags.map(tag => tag.label?.[locale] || tag.label?.['pt'] || tag.key).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: featured image + video + description stacked */}
            <div className="flex flex-col gap-4 md:col-span-2">
              {project.featured_image_path && (
                <div className="overflow-hidden">
                  <img
                    src={project.featured_image_path}
                    alt={title}
                    className="w-full object-cover"
                  />
                </div>
              )}

              {embedUrl && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <iframe
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              )}

              {content && (
                <p className="text-sm text-gray-600 leading-relaxed pt-2">
                  {content}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
