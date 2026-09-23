'use client';

import { useTranslations } from 'next-intl';
import HomeHowWeWork from '@/components/sections/HomeHowWeWork';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import ClientLogosCarousel from '@/components/sections/ClientLogosCarousel';
import HomeFaqSection from '@/components/sections/HomeFaqSection';
import HomeFinalIntro from '@/components/sections/HomeFinalIntro';
import ContactCTA from '@/components/sections/ContactCTA';

interface Props {
  locale: string;
}

export default function HomeBelowFoldSections({ locale }: Props) {
  const t = useTranslations('home.finalCta');

  return (
    <>
      <HomeHowWeWork />
      <ProjectsPreview locale={locale} variant="categories" />
      <ClientLogosCarousel />
      <HomeFaqSection />
      <HomeFinalIntro />
      <ContactCTA submitLabel={t('ctaPrimary')} />
    </>
  );
}
