import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowproductions.pt';
const SITE_NAME = 'Flow Productions';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

const descriptions: Record<string, string> = {
  pt: 'Flow Productions — agência criativa em Faro, Portugal. Especializados em Design, Marketing Digital, Audiovisual e Animação 2D/3D.',
  en: 'Flow Productions — creative agency based in Faro, Portugal. Specialists in Design, Digital Marketing, Audiovisual Production and 2D/3D Animation.',
  fr: 'Flow Productions — agence créative basée à Faro, Portugal. Spécialisés en Design, Marketing Digital, Audiovisuel et Animation 2D/3D.',
};

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  locale?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function getPageMetadata(locale: string, options: PageMetadataOptions = {}): Metadata {
  const {
    title,
    description = descriptions[locale] || descriptions.pt,
    path = '',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = options;

  const canonicalUrl = `${SITE_URL}/${locale}${path ? `/${path}` : ''}`;
  const resolvedTitle = title
    ? { absolute: `${title} | ${SITE_NAME}` }
    : { default: SITE_NAME, template: `%s | ${SITE_NAME}` };

  return {
    metadataBase: new URL(SITE_URL),
    title: resolvedTitle,
    description,
    keywords: ['design', 'marketing digital', 'audiovisual', 'animação', 'agência criativa', 'Faro', 'Portugal', 'flow productions'],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pt': `${SITE_URL}/pt${path ? `/${path}` : ''}`,
        'en': `${SITE_URL}/en${path ? `/${path}` : ''}`,
        'fr': `${SITE_URL}/fr${path ? `/${path}` : ''}`,
        'x-default': `${SITE_URL}/pt${path ? `/${path}` : ''}`,
      },
    },
    openGraph: {
      type,
      locale,
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: title || SITE_NAME,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title || SITE_NAME }],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@flowproductions',
      creator: '@flowproductions',
      title: title || SITE_NAME,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function getSEOConfig(locale: string): Metadata {
  return getPageMetadata(locale);
}

// ─── JSON-LD Structured Data Helpers ─────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo.png`,
    },
    image: DEFAULT_OG_IMAGE,
    description: descriptions.pt,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Edifício UAlg Tec Campus, Campus da Penha',
      addressLocality: 'Faro',
      addressRegion: 'Algarve',
      postalCode: '8005-139',
      addressCountry: 'PT',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@flowproductions.pt',
      availableLanguage: ['Portuguese', 'English', 'French'],
    },
    sameAs: [
      'https://www.instagram.com/flowproductions.pt',
      'https://www.linkedin.com/company/flow-productions-pt',
      'https://www.facebook.com/flowproductions.pt',
      'https://www.youtube.com/@flowproductions',
    ],
    foundingDate: '2018',
    areaServed: ['PT', 'EU'],
    knowsAbout: ['Design', 'Marketing Digital', 'Audiovisual', 'Animação 2D', 'Motion Graphics', 'Branding'],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: descriptions.pt,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['pt-PT', 'en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/pt/projetos?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Portugal' },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function creativeWorkJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  dateCreated?: string;
  client?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.dateCreated ? { dateCreated: opts.dateCreated } : {}),
    creator: { '@id': `${SITE_URL}/#organization` },
    ...(opts.client ? { funder: { '@type': 'Organization', name: opts.client } } : {}),
  };
}
