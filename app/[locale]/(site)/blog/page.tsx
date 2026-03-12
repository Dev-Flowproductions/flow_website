import type { Metadata } from 'next';
import Image from 'next/image';
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
    keywords: ['blog criatividade', 'artigos design', 'marketing digital', 'tendências criativas', 'flow productions blog'],
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Banner — matches other pages */}
      <section className="relative h-[60vh] lg:h-screen w-full overflow-hidden bg-gray-900">
        <Image
          src="/images/hero/blog.png"
          alt="Blog Flow Productions"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-4">{t('heroLabel')}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Blog Flow</h1>
        </div>
      </section>

      {/* Posts Grid */}
      <div className="py-16 px-4 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => {
              /* Pick best available locale — requested first, then any fallback */
              const title =
                post.title?.[locale] ||
                post.title?.pt ||
                post.title?.en ||
                post.title?.fr ||
                '';
              const slug =
                post.slug?.[locale] ||
                post.slug?.pt ||
                post.slug?.en ||
                post.slug?.fr ||
                null;
              const href = slug ? `/blog/${slug}` : null;

              const card = (
                <>
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    {post.featured_image_path ? (
                      <Image
                        src={post.featured_image_path}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  <div className="pt-3 pb-2">
                    {post.published_at && (
                      <p className="text-xs text-gray-400 mb-1">{formatDate(post.published_at, locale)}</p>
                    )}
                    <h3 className="text-lg font-bold text-black group-hover:text-gray-500 transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>
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
    </div>
  );
}
