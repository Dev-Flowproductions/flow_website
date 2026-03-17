import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { getPageMetadata, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import MartechFaqSection from '@/components/martech/MartechFaqSection';
import MartechServiceHero from '@/components/martech/MartechServiceHero';
import MartechSection from '@/components/martech/MartechSection';
import MartechContentList from '@/components/martech/MartechContentList';
import MartechDiagnosticCta from '@/components/martech/MartechDiagnosticCta';
import AiAgentOpportunityDiagnostic from '@/components/martech/AiAgentOpportunityDiagnostic';
import ScrollToDiagnostic from '@/components/martech/ScrollToDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechAiAgents' });

  return getPageMetadata(locale, {
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: 'martech/ai-agents',
    keywords: ['AI agents', 'marketing automation', 'sales agents', 'AI chatbot', 'lead qualification'],
  });
}

export default async function AiAgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'martechAiAgents' });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'MarTech', url: `${SITE_URL}/${locale}/martech` },
    { name: t('hero.title'), url: `${SITE_URL}/${locale}/martech/ai-agents` },
  ]);
  const schemaFaqs = t.raw('schemaFaqs') as Array<{ question: string; answer: string }>;
  const faqSchema = faqJsonLd(schemaFaqs);
  const serviceSchema = serviceJsonLd({
    name: t('hero.title'),
    description: t('metaDescription'),
    url: `${SITE_URL}/${locale}/martech/ai-agents`,
    serviceType: 'AI Agent',
  });

  const whatIsItems = t.raw('whatIsAgent.items') as string[];
  const forWhoItems = t.raw('forWho.items') as string[];
  const diagnosticReceivesItems = t.raw('diagnostic.receives.items') as string[];
  const deliversItems = t.raw('delivers.items') as string[];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <MartechServiceHero label={t('hero.label')} title={t('hero.title')} subtitle={t('hero.subtitle')} intro={t('intro.text')} />

      <MartechSection variant="muted">
        <AnimateIn>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('whatIsAgent.title')}</h2>
          <p className="text-lg text-gray-600 mb-6">{t('whatIsAgent.subtitle')}</p>
          <MartechContentList items={whatIsItems} icon="arrow" />
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList title={t('forWho.title')} subtitle={t('forWho.subtitle')} items={forWhoItems} icon="check" />
        </AnimateIn>
      </MartechSection>

      <MartechSection variant="muted">
        <MartechDiagnosticCta
          title={t('diagnostic.title')}
          description={t('diagnostic.description')}
          cta={
            <ScrollToDiagnostic targetId="ai-agent-opportunity-diagnostic" className="inline-block px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium shadow-md hover:shadow-lg">
              {t('diagnostic.cta')}
            </ScrollToDiagnostic>
          }
        >
          <p className="font-semibold mb-4">{t('diagnostic.receives.title')}</p>
          <ul className="space-y-2">
            {diagnosticReceivesItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#5b54a0]/10 flex items-center justify-center text-sm font-semibold text-[#5b54a0]">→</span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </MartechDiagnosticCta>
      </MartechSection>

      <MartechSection variant="default">
        <AnimateIn>
          <MartechContentList title={t('delivers.title')} items={deliversItems} icon="arrow" />
        </AnimateIn>
      </MartechSection>

      <MartechFaqSection faqs={schemaFaqs} sectionTitle={t('faqSectionTitle')} />

      <AiAgentOpportunityDiagnostic locale={locale} />
    </div>
  );
}
