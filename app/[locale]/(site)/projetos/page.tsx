import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'projetos',
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const supabase = await createClient();

  type TagRecord = { key: string; label: Record<string, string> };
  type Project = {
    id: string;
    title: Record<string, string>;
    slug: Record<string, string>;
    featured_image_path: string | null;
    project_project_tags: { project_tags: TagRecord | null }[];
  };

  let projects: Project[] = [];

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select(`
          id, title, slug, featured_image_path,
          project_project_tags (
            project_tags ( key, label )
          )
        `)
        .eq('status', 'published')
        .order('display_order', { ascending: true, nullsFirst: false });
      projects = (data ?? []) as unknown as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: t('metaTitle'), url: `${SITE_URL}/${locale}/projetos` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Image Section */}
      <section className="relative h-[60vh] lg:h-screen w-full overflow-hidden bg-gray-100">
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
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 py-12">—</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => {
                const title = project.title?.[locale] || project.title?.['pt'] || '';
                const slug  = project.slug?.[locale]  || project.slug?.['pt']  || '';
                const tags: TagRecord[] = project.project_project_tags
                  ?.map((r) => r.project_tags)
                  .filter((t): t is TagRecord => t !== null) ?? [];
                const tagLabel = tags
                  .map((tag) => tag.label?.[locale] || tag.label?.['pt'] || tag.key)
                  .join(', ');

                return (
                  <Link
                    key={project.id}
                    href={`/projetos/${slug}`}
                    className="group block relative overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-gray-900 overflow-hidden relative">
                      {project.featured_image_path ? (
                        <img
                          src={project.featured_image_path}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{title}</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center px-8">
                        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">
                          {tagLabel ? `-, ${tagLabel}` : '-,'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
