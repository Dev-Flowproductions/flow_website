import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { getPageMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(s: string): boolean {
  return UUID_REGEX.test(s);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();

  if (supabase) {
    let post: { title: Record<string, string>; excerpt: Record<string, string> | null; slug?: Record<string, string>; featured_image_path: string | null; published_at: string | null; updated_at: string | null } | null = null;

    const bySlug = await supabase
      .from('blog_posts')
      .select('title, excerpt, slug, featured_image_path, published_at, updated_at')
      .eq(`slug->>${locale}`, slug)
      .eq('status', 'published')
      .maybeSingle();
    post = bySlug.data;

    if (!post && isUuid(slug)) {
      const byId = await supabase
        .from('blog_posts')
        .select('title, excerpt, slug, featured_image_path, published_at, updated_at')
        .eq('id', slug)
        .eq('status', 'published')
        .maybeSingle();
      post = byId.data;
    }

    if (post) {
      const title = post.title?.[locale] || post.title?.pt || '';
      const description = post.excerpt?.[locale] || post.excerpt?.pt || '';
      const canonicalSlug = post.slug?.[locale] || post.slug?.pt || post.slug?.en || post.slug?.fr || slug;
      return getPageMetadata(locale, {
        title,
        description,
        path: `blog/${canonicalSlug}`,
        image: post.featured_image_path || undefined,
        type: 'article',
        publishedTime: post.published_at || undefined,
        modifiedTime: post.updated_at || undefined,
      });
    }
  }

  return { title: 'Blog Flow' };
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === 'pt' ? 'pt-PT' : locale === 'fr' ? 'fr-FR' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const supabase = await createClient();

  let post: {
    id?: string;
    slug?: Record<string, string>;
    title: Record<string, string>;
    excerpt: Record<string, string> | null;
    content: Record<string, string> | null;
    featured_image_path: string | null;
    published_at: string | null;
    updated_at: string | null;
    author_name: string | null;
  } | null = null;

  let allPosts: { id: string; slug: Record<string, string>; title: Record<string, string>; featured_image_path: string | null }[] = [];

  if (supabase) {
    const selectFields = 'id, title, excerpt, content, featured_image_path, published_at, updated_at, author_name, slug';
    const bySlug = await supabase
      .from('blog_posts')
      .select(selectFields)
      .eq(`slug->>${locale}`, slug)
      .eq('status', 'published')
      .maybeSingle();
    post = bySlug.data;

    if (!post && isUuid(slug)) {
      const byId = await supabase
        .from('blog_posts')
        .select(selectFields)
        .eq('id', slug)
        .eq('status', 'published')
        .maybeSingle();
      post = byId.data;
    }

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, slug, title, featured_image_path')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);
    allPosts = (posts || []) as { id: string; slug: Record<string, string>; title: Record<string, string>; featured_image_path: string | null }[];
  }

  if (!post) notFound();

  const title = post.title?.[locale] || post.title?.pt || '';
  const excerpt = post.excerpt?.[locale] || post.excerpt?.pt || '';
  const content = post.content?.[locale] || post.content?.pt || '';
  const image = post.featured_image_path || '/images/og-default.jpg';

  const currentIndex = allPosts.findIndex((p) =>
    isUuid(slug) ? p.id === slug : (p.slug?.[locale] === slug || p.slug?.pt === slug)
  );
  const nextPost = allPosts[(currentIndex + 1) % allPosts.length] || null;
  const alsoLike = allPosts.filter((_, i) => i !== currentIndex).slice(0, 2);

  const canonicalSlug = post.slug?.[locale] || post.slug?.pt || post.slug?.en || post.slug?.fr || slug;

  const articleSchema = articleJsonLd({
    title,
    description: excerpt,
    url: `${SITE_URL}/${locale}/blog/${canonicalSlug}`,
    image,
    datePublished: post.published_at || new Date().toISOString(),
    dateModified: post.updated_at || post.published_at || new Date().toISOString(),
    authorName: post.author_name || undefined,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
    { name: title, url: `${SITE_URL}/${locale}/blog/${canonicalSlug}` },
  ]);

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero image */}
      <div className="w-full pt-16 overflow-hidden relative aspect-[16/10] max-h-[70vh]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <Breadcrumb
          items={[
            { name: tNav('home'), href: '/' },
            { name: tNav('blog'), href: '/blog' },
            { name: title, href: `/blog/${canonicalSlug}` },
          ]}
        />
        {post.published_at && (
          <p className="text-sm text-gray-400 mb-4">{formatDate(post.published_at, locale)}</p>
        )}
        <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-10">
          {title}
        </h1>

        {locale !== 'pt' && !post.content?.[locale] && post.content?.pt && (
          <p className="text-sm text-gray-400 italic mb-6 border-l-2 border-gray-200 pl-3">
            {t('contentLanguageNotice')}
          </p>
        )}
        {content ? (
          <div
            className="blog-content prose prose-base max-w-none text-gray-700 leading-relaxed
              prose-headings:font-bold prose-headings:text-black
              prose-p:mb-4 prose-strong:text-black"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : excerpt ? (
          <p className="text-gray-600 text-lg leading-relaxed">{excerpt}</p>
        ) : (
          <p className="text-gray-400">{t('contentComingSoon')}</p>
        )}
      </div>

      {/* Post navigation */}
      {nextPost && (() => {
        const nextSlug = nextPost.slug?.[locale] || nextPost.slug?.pt || nextPost.slug?.en || nextPost.slug?.fr;
        return nextSlug ? (
          <div className="border-t border-gray-100 py-8 px-4">
            <div className="max-w-3xl mx-auto flex justify-end">
              <Link
                href={`/blog/${nextSlug}`}
                className="group flex flex-col items-end gap-1"
              >
              <span className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1">
                {t('next')} <span className="text-gray-400">›</span>
              </span>
              <span className="text-sm font-bold text-black group-hover:text-gray-500 transition-colors text-right max-w-xs leading-snug">
                {nextPost.title?.[locale] || nextPost.title?.pt}
              </span>
            </Link>
          </div>
        </div>
        ) : null;
      })()}

      {/* You May Also Like */}
      {alsoLike.length > 0 && (
        <div className="border-t border-gray-100 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-8">{t('youMayAlsoLike')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {alsoLike.map((p) => {
                const pSlug = p.slug?.[locale] || p.slug?.pt || p.slug?.en || p.slug?.fr;
                const pTitle = p.title?.[locale] || p.title?.pt;
                return pSlug ? (
                  <Link key={p.id} href={`/blog/${pSlug}`} className="group block">
                    <div className="aspect-[16/10] overflow-hidden mb-3 bg-gray-100 relative">
                      {p.featured_image_path && (
                        <Image
                          src={p.featured_image_path}
                          alt={pTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-black group-hover:text-gray-500 transition-colors leading-snug">
                      {pTitle}
                    </h4>
                  </Link>
                ) : (
                  <div key={p.id} className="group block opacity-90">
                    <div className="aspect-[16/10] overflow-hidden mb-3 bg-gray-100 relative">
                      {p.featured_image_path && (
                        <Image
                          src={p.featured_image_path}
                          alt={pTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-black leading-snug">{pTitle}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
