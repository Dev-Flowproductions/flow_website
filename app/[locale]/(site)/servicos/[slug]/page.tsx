import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';
import ServiceSlugAiTool from '@/components/services/ServiceSlugAiTool';
import { isServicePageSlug, SERVICE_PAGE_SLUGS } from '@/lib/serviceItemRoutes';
import { getServicosAiSectionIdForSlug, servicePagesByLocale } from '@/lib/servicePagesMessages';

const LOCALES = ['pt', 'en', 'fr'] as const;
type AppLocale = (typeof LOCALES)[number];

function isAppLocale(s: string): s is AppLocale {
  return (LOCALES as readonly string[]).includes(s);
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export function generateStaticParams() {
  return SERVICE_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServicePageSlug(slug) || !isAppLocale(locale)) {
    return {};
  }
  const page = servicePagesByLocale[locale][slug];

  return getPageMetadata(locale, {
    title: page.metaTitle,
    description: page.metaDescription,
    path: `servicos/${slug}`,
    keywords: [
      ...page.seoKeywords,
      slug.replace(/-/g, ' '),
      'Flow Productions',
      page.hero.title,
      page.hero.label,
    ],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isServicePageSlug(slug) || !isAppLocale(locale)) {
    notFound();
  }

  const page = servicePagesByLocale[locale][slug];

  const tServices = await getTranslations({ locale, namespace: 'services' });
  const aiSectionId = getServicosAiSectionIdForSlug(slug);

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: tServices('title'), url: `${SITE_URL}/${locale}/servicos` },
    { name: page.hero.title, url: `${SITE_URL}/${locale}/servicos/${slug}` },
  ]);

  const faqSchema = faqJsonLd(page.schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: page.hero.title,
    description: page.metaDescription,
    url: `${SITE_URL}/${locale}/servicos/${slug}`,
    serviceType: page.hero.title,
  });

  const whatIsItems = page.whatIs.items;
  const forWhoItems = page.forWho.items;
  const deliversItems = page.delivers.items;
  const improvementsItems = page.improvements.items;

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <MartechServiceHero
        label={page.hero.label}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        intro={page.intro.text}
      />

      <MartechSection variant="muted">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{page.whatIs.title}</h2>
          <div className="space-y-6">
            {whatIsItems.map((item, i) => (
              <div key={i} className="border-l-4 border-[#5b54a0] pl-6 py-1">
                <p className="font-bold text-lg mb-1">{item.term}</p>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList
            title={page.forWho.title}
            subtitle={page.forWho.subtitle}
            items={forWhoItems}
            icon="check"
            className="mb-10"
          />
        </AnimateIn>
        <MartechDiagnosticCta
          title={page.diagnostic.title}
          description={page.diagnostic.description}
          cta={
            <ScrollToDiagnostic
              targetId={aiSectionId}
              className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {page.diagnostic.cta}
            </ScrollToDiagnostic>
          }
        />
      </MartechSection>

      <MartechSection variant="muted">
        <div className="flex flex-col gap-12">
          <AnimateIn>
            <MartechContentList title={page.delivers.title} items={deliversItems} icon="arrow" />
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <MartechContentList
              title={page.improvements.title}
              items={improvementsItems}
              icon="check"
              iconClassName="text-green-600"
            />
          </AnimateIn>
        </div>
      </MartechSection>

      <MartechFaqSection faqs={page.schemaFaqs} sectionTitle={page.faqSectionTitle} />

      <ServiceSlugAiTool locale={locale} serviceSlug={slug} serviceTitle={page.hero.title} />
    </div>
  );
}
