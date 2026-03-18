import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'websiteCampaign' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '30-days-website-campanha',
    keywords: ['website assessment', 'free audit', 'website performance', 'SEO', 'accessibility', '30 days', 'Flow Productions'],
  });
}

export default async function ThirtyDaysWebsiteCampanhaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'websiteCampaign' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/30-days-website-campanha` },
  ]);

  const whatAnalyzesItems = t.raw('whatAnalyzes.items') as string[];
  const forWhoItems = t.raw('forWho.items') as string[];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <MartechServiceHero
        label={t('hero.label')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        intro={t('intro')}
      />

      <MartechSection variant="muted">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('whatAnalyzes.title')}</h2>
          <p className="text-gray-600 mb-6">{t('whatAnalyzes.intro')}</p>
          <MartechContentList items={whatAnalyzesItems} icon="check" className="mb-4" />
          <p className="text-gray-700">{t('whatAnalyzes.outro')}</p>
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList
            title={t('forWho.title')}
            subtitle={t('forWho.intro')}
            items={forWhoItems}
            icon="check"
            className="mb-4"
          />
          <p className="text-gray-700 font-medium">{t('forWho.outro')}</p>
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="muted">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t('afterReport.title')}</h2>
          <p className="text-gray-700 mb-4">{t('afterReport.paragraph1')}</p>
          <p className="text-gray-700 mb-4">{t('afterReport.paragraph2')}</p>
          <p className="text-gray-700 mb-4">{t('afterReport.paragraph3')}</p>
          <p className="text-gray-900 font-semibold mb-8">{t('afterReport.paragraph4')}</p>
          <p className="text-gray-700 mb-6">{t('afterReport.cta')}</p>
          <a
            href="https://sga.flowproductions.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg"
          >
            {t('ctaButton')}
          </a>
        </AnimateIn>
      </MartechSection>
    </div>
  );
}
