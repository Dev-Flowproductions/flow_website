import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';
import PaidMediaWasteAudit from '@/components/martech/PaidMediaWasteAudit';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechPaidMedia' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/paid-media',
    keywords: ['paid media', 'LLM advertising', 'Google Ads', 'Meta Ads', 'campaign management', 'AI advertising'],
  });
}

export default async function PaidMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechPaidMedia' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/paid-media` },
  ]);
  const schemaFaqs = t.raw('schemaFaqs') as Array<{ question: string; answer: string }>;
  const faqSchema = faqJsonLd(schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: t('hero.title'),
    description: t('metaDescription'),
    url: `${SITE_URL}/${locale}/martech/paid-media`,
    serviceType: 'Paid Media',
  });

  const whatIncludesItems = t.raw('whatIncludes.items') as string[];
  const forWhoItems = t.raw('forWho.items') as string[];
  const deliversItems = t.raw('delivers.items') as string[];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <MartechServiceHero label={t('hero.label')} title={t('hero.title')} subtitle={t('hero.subtitle')} intro={t('intro.text')} />

      <MartechSection variant="muted">
        <AnimateIn>
          <MartechContentList title={t('whatIncludes.title')} items={whatIncludesItems} icon="arrow" />
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList title={t('forWho.title')} items={forWhoItems} icon="check" className="mb-10" />
        </AnimateIn>
        <MartechDiagnosticCta
          title={t('audit.title')}
          description={t('audit.description')}
          cta={
            <ScrollToDiagnostic targetId="paid-media-waste-audit" className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg">
              {t('audit.cta')}
            </ScrollToDiagnostic>
          }
        />
      </MartechSection>

      <MartechSection variant="muted">
        <AnimateIn>
          <MartechContentList title={t('delivers.title')} items={deliversItems} icon="arrow" />
        </AnimateIn>
      </MartechSection>

      <MartechFaqSection faqs={schemaFaqs} sectionTitle={t('faqSectionTitle')} />

      <PaidMediaWasteAudit locale={locale} />
    </div>
  );
}
