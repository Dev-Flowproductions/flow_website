import type { Metadata } from 'next';
import { getPageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    pt: 'Contactos — Fale Connosco',
    en: 'Contact — Get in Touch',
    fr: 'Contact — Contactez-nous',
  };
  const descs: Record<string, string> = {
    pt: 'Entre em contacto com a Flow Productions. Estamos em Faro, Portugal — prontos para dar vida ao seu próximo projeto criativo.',
    en: 'Get in touch with Flow Productions. Based in Faro, Portugal — ready to bring your next creative project to life.',
    fr: 'Contactez Flow Productions. Basés à Faro, Portugal — prêts à donner vie à votre prochain projet créatif.',
  };

  return getPageMetadata(locale, {
    title: titles[locale] || titles.pt,
    description: descs[locale] || descs.pt,
    path: 'contactos',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Flow Productions', url: `${SITE_URL}/${locale}` },
    { name: 'Contactos', url: `${SITE_URL}/${locale}/contactos` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ContactPageClient />
    </>
  );
}
