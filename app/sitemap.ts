import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';
const locales = ['pt', 'en', 'fr'];

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function buildUrls(
  path: string,
  priority: number,
  changeFrequency: ChangeFreq = 'weekly',
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path ? `/${path}` : ''}`,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    // Homepage
    ...buildUrls('', 1.0, 'daily'),
    // Core pages
    ...buildUrls('sobre-nos', 0.7, 'monthly'),
    ...buildUrls('servicos', 0.9, 'weekly'),
    ...buildUrls('contactos', 0.7, 'monthly'),
    // Project pages
    ...buildUrls('projetos', 0.8, 'weekly'),
    // Service category pages
    ...buildUrls('animacao', 0.9, 'weekly'),
    ...buildUrls('audiovisual', 0.9, 'weekly'),
    ...buildUrls('design', 0.9, 'weekly'),
    ...buildUrls('marketing', 0.9, 'weekly'),
    ...buildUrls('projetos-sociais', 0.8, 'monthly'),
    // Blog
    ...buildUrls('blog', 0.8, 'daily'),
  ];

  // Dynamic blog posts (from Supabase)
  let blogUrls: MetadataRoute.Sitemap = [];
  let projectUrls: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    if (supabase) {
      // Fetch published blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (posts) {
        blogUrls = posts.flatMap((post) => {
          const slugPt = typeof post.slug === 'object' && post.slug !== null ? (post.slug as Record<string, string>).pt : post.slug;
          const slugEn = typeof post.slug === 'object' && post.slug !== null ? (post.slug as Record<string, string>).en || slugPt : slugPt;
          const slugFr = typeof post.slug === 'object' && post.slug !== null ? (post.slug as Record<string, string>).fr || slugPt : slugPt;
          if (!slugPt || typeof slugPt !== 'string') return [];
          const lastMod = new Date(post.updated_at || post.published_at || Date.now());
          return [
            { url: `${SITE_URL}/pt/blog/${slugPt}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.7 },
            { url: `${SITE_URL}/en/blog/${slugEn}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.7 },
            { url: `${SITE_URL}/fr/blog/${slugFr}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.7 },
          ];
        });
      }

      // Fetch published projects
      const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (projects) {
        projectUrls = projects.flatMap((project) => {
          const slugPt = typeof project.slug === 'object' && project.slug !== null ? (project.slug as Record<string, string>).pt : project.slug;
          const slugEn = typeof project.slug === 'object' && project.slug !== null ? (project.slug as Record<string, string>).en || slugPt : slugPt;
          const slugFr = typeof project.slug === 'object' && project.slug !== null ? (project.slug as Record<string, string>).fr || slugPt : slugPt;
          if (!slugPt || typeof slugPt !== 'string') return [];
          const lastMod = new Date(project.updated_at || project.published_at || Date.now());
          return [
            { url: `${SITE_URL}/pt/projetos/${slugPt}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.8 },
            { url: `${SITE_URL}/en/projetos/${slugEn}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.8 },
            { url: `${SITE_URL}/fr/projetos/${slugFr}`, lastModified: lastMod, changeFrequency: 'monthly' as ChangeFreq, priority: 0.8 },
          ];
        });
      }
    }
  } catch {
    // Supabase unavailable during build — static URLs still included
  }

  return [...staticUrls, ...blogUrls, ...projectUrls];
}
