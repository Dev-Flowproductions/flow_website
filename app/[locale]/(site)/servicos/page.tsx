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
    <div>
      {/* Hero Video Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero/services.mp4" type="video/mp4" />
        </video>
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
