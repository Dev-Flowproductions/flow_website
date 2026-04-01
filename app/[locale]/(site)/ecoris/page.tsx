import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';
const ECORIS_URL = 'https://ecoris.pt/';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ecoris' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'ecoris',
    image: `${SITE_URL}/images/Banner01.png`,
  });
}

export default async function EcorisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ecoris' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: t('breadcrumbName'), url: `${SITE_URL}/${locale}/ecoris` },
  ]);

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="-mt-20 pt-20 w-full overflow-hidden bg-gray-100">
        <Image
          src="/images/Banner01.png"
          alt={t('bannerAlt')}
          width={1920}
          height={1080}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <AnimateIn>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center md:text-left">
            {t('title')}
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="space-y-10 text-gray-700 leading-relaxed text-base md:text-lg">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4">{t('whatIsTitle')}</h2>
              <p>{t('whatIsBody')}</p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4">{t('whatToDoTitle')}</h2>
              <p>{t('whatToDoBody')}</p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6">
            <a
              href={ECORIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-black rounded-full text-sm font-semibold bg-black text-white hover:bg-white hover:text-black transition-colors"
            >
              {t('cta')}
            </a>
            <p className="text-sm text-gray-500">{t('credit')}</p>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
