import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { getPageMetadata, creativeWorkJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import Breadcrumb from '@/components/ui/Breadcrumb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

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
    .select('title, summary, featured_image_path')
    .eq(`slug->>${locale}`, slug)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle();

  if (!project) return { title: 'Projeto' };

  const title       = project.title[locale]   || project.title['pt']   || 'Projeto';
  const description = project.summary?.[locale] || project.summary?.['pt'] || '';

  return getPageMetadata(locale, {
    title,
    description,
    path: `projetos/${slug}`,
    image: project.featured_image_path || undefined,
  });
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  const localeMap: Record<string, string> = {
    pt: 'pt-PT',
    en: 'en-GB',
    fr: 'fr-FR',
  };
  return date.toLocaleDateString(localeMap[locale] || 'en-GB', {
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
  const t = await getTranslations({ locale, namespace: 'projectDetail' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data: project } = await supabase!
    .from('projects')
    .select(`
      *,
      project_project_tags (
        project_tags ( id, key, label )
      )
    `)
    .eq(`slug->>${locale}`, slug)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle();

  if (!project) notFound();

  const title     = project.title?.[locale]   || project.title?.['pt']   || 'Projeto';
  const summary   = project.summary?.[locale] || project.summary?.['pt'] || '';
  const content   = project.content?.[locale] || project.content?.['pt'] || '';
  const yearLabel = project.year_label || '';

  const videoUrl: string | null = project.gallery?.video_url || null;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const tags: { id: string; key: string; label: Record<string, string> }[] =
    project.project_project_tags
      ?.map((r: { project_tags: { id: string; key: string; label: Record<string, string> } }) => r.project_tags)
      .filter(Boolean) ?? [];

  const publishedDate = project.published_at ? formatDate(project.published_at, locale) : '';

  // Fetch sibling projects sharing the first tag for prev/next navigation
  let prevProject: { title: Record<string, string>; slug: Record<string, string> } | null = null;
  let nextProject: { title: Record<string, string>; slug: Record<string, string> } | null = null;

  if (tags.length > 0) {
    const primaryTagId = tags[0].id;

    const { data: siblings } = await supabase!
      .from('projects')
      .select(`
        id,
        title,
        slug,
        published_at,
        project_project_tags!inner ( tag_id )
      `)
      .eq('project_project_tags.tag_id', primaryTagId)
      .eq('status', 'published')
      .order('published_at', { ascending: true });

    if (siblings && siblings.length > 1) {
      const currentIndex = siblings.findIndex((p) => p.id === project.id);
      if (currentIndex > 0) prevProject = siblings[currentIndex - 1];
      if (currentIndex < siblings.length - 1) nextProject = siblings[currentIndex + 1];
    }
  }

  const creativeWorkSchema = creativeWorkJsonLd({
    name: title,
    description: summary,
    url: `${SITE_URL}/${locale}/projetos/${slug}`,
    image: project.featured_image_path || undefined,
    dateCreated: project.published_at || undefined,
    client: project.client_name || undefined,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: t('backToProjects'), url: `${SITE_URL}/${locale}/projetos` },
    { name: title, url: `${SITE_URL}/${locale}/projetos/${slug}` },
  ]);

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header: title centered on top, then two-column — meta left, image right */}
      <section className="pt-24 md:pt-32 pb-0 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            items={[
              { name: tNav('home'), href: '/' },
              { name: t('backToProjects'), href: '/projetos' },
              { name: title, href: `/projetos/${slug}` },
            ]}
            />
          <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight text-center mb-8 md:mb-12">
            {title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Left: meta */}
            <div className="md:col-span-1">
              {/* Meta */}
              <div className="space-y-3">
                {project.client_name && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">{t('client')}</span>
                    <span className="text-sm text-gray-500">{project.client_name}</span>
                  </div>
                )}
                {yearLabel && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">{t('year')}</span>
                    <span className="text-sm text-gray-500">{yearLabel}</span>
                  </div>
                )}
                {!yearLabel && publishedDate && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">{t('year')}</span>
                    <span className="text-sm text-gray-500">{publishedDate}</span>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-black w-20">{t('category')}</span>
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

      {/* Prev / Next navigation within same category */}
      {(prevProject || nextProject) && (
        <nav className="border-t border-gray-100 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 flex items-stretch justify-between gap-4">
            {prevProject ? (
              <Link
                href={`/projetos/${prevProject.slug?.[locale] || prevProject.slug?.['pt'] || ''}`}
                className="group flex items-center gap-3 text-left max-w-[45%]"
              >
                <span className="shrink-0 text-gray-400 group-hover:text-black transition-colors text-xl leading-none">←</span>
                <span className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('previousProject')}</span>
                  <span className="text-sm font-semibold text-black group-hover:text-gray-500 transition-colors leading-snug line-clamp-2">
                    {prevProject.title?.[locale] || prevProject.title?.['pt'] || ''}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/projetos/${nextProject.slug?.[locale] || nextProject.slug?.['pt'] || ''}`}
                className="group flex items-center gap-3 text-right max-w-[45%] ml-auto"
              >
                <span className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('nextProject')}</span>
                  <span className="text-sm font-semibold text-black group-hover:text-gray-500 transition-colors leading-snug line-clamp-2">
                    {nextProject.title?.[locale] || nextProject.title?.['pt'] || ''}
                  </span>
                </span>
                <span className="shrink-0 text-gray-400 group-hover:text-black transition-colors text-xl leading-none">→</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
