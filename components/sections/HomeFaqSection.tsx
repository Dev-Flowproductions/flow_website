'use client';

import { useTranslations } from 'next-intl';
import MartechFaqSection from '@/components/martech/MartechFaqSection';

export default function HomeFaqSection() {
  const t = useTranslations('home.faqs');
  const faqs = t.raw('items') as Array<{ question: string; answer: string }>;

  return <MartechFaqSection faqs={faqs} sectionTitle={t('title')} />;
}
