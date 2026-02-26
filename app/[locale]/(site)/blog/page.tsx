import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    pt: 'Blog — Artigos sobre Design, Marketing e Criatividade',
    en: 'Blog — Articles on Design, Marketing & Creativity',
    fr: 'Blog — Articles sur le Design, Marketing et Créativité',
  };
  const descs: Record<string, string> = {
    pt: 'Lê os artigos da Flow Productions sobre design, marketing digital, audiovisual, animação e criatividade. Insights e tendências do setor criativo.',
    en: 'Read Flow Productions articles on design, digital marketing, audiovisual, animation and creativity. Insights and trends from the creative industry.',
    fr: 'Lisez les articles de Flow Productions sur le design, marketing digital, audiovisuel, animation et créativité.',
  };
  return getPageMetadata(locale, {
    title: titles[locale] || titles.pt,
    description: descs[locale] || descs.pt,
    path: 'blog',
  });
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === 'pt' ? 'pt-PT' : locale === 'fr' ? 'fr-FR' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const supabase = await createClient();

  let posts: {
    id: string;
    title: Record<string, string>;
    slug: Record<string, string>;
    featured_image_path: string | null;
    published_at: string | null;
  }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, featured_image_path, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    posts = data || [];
  }

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
  ]);

  return (
    <div className="pt-24 pb-20 px-4 bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-16">Blog Flow</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => {
            const title = post.title?.[locale] || post.title?.pt || '';
            const slug =
              post.slug?.[locale] ||
              post.slug?.pt ||
              post.slug?.en ||
              post.slug?.fr ||
              null;
            const href = slug ? `/blog/${slug}` : null;

            const card = (
              <>
                <div className="aspect-[16/10] overflow-hidden mb-4 bg-gray-100">
                  {post.featured_image_path ? (
                    <img
                      src={post.featured_image_path}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  {post.published_at && (
                    <p className="text-xs text-gray-400">{formatDate(post.published_at, locale)}</p>
                  )}
                </div>

                <h2 className="text-lg font-bold text-black group-hover:text-gray-500 transition-colors leading-snug">
                  {title}
                </h2>
              </>
            );

            return href ? (
              <Link key={post.id} href={href} className="group block">
                {card}
              </Link>
            ) : (
              <div key={post.id} className="group block opacity-90 cursor-not-allowed" title={t('noSlugTitle')}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
