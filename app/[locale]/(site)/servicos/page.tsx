import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ServicesGrid from '@/components/sections/ServicesGrid';
import { AnimateIn } from '@/components/ui/AnimateIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteUrl}/${locale}/servicos`,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/servicos`,
      languages: {
        pt: `${siteUrl}/pt/servicos`,
        en: `${siteUrl}/en/services`,
        fr: `${siteUrl}/fr/services`,
      },
    },
  };
}

interface Service {
  id: string;
  key: string;
  title: Record<string, string>;
  order: number;
  service_items: Array<{
    id: string;
    label: Record<string, string>;
    order: number;
  }>;
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  const supabase = await createClient();

  let servicesData: Service[] = [];

  // Only fetch if Supabase is configured
  if (supabase) {
    try {
      const { data: services, error } = await supabase
        .from('services')
        .select(`
          *,
          service_items (*)
        `)
        .order('order', { ascending: true });

      if (services && !error) {
        servicesData = services;
      } else if (error) {
        console.error('Error fetching services:', error);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Video Section */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/20">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm uppercase tracking-wider">Services Hero Video Placeholder</p>
          </div>
        </div>
        {/* Uncomment when video is ready:
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/services-hero.mp4" type="video/mp4" />
        </video>
        */}
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <p className="text-sm uppercase tracking-wider text-center mb-4">
              {t('pageLabel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
              {t('title')}
            </h1>
          </AnimateIn>

          <ServicesGrid services={servicesData} locale={locale} />
        </div>
      </section>
    </div>
  );
}
