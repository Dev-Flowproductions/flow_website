'use client';

import dynamic from 'next/dynamic';

const TestimonialCarousel = dynamic(
  () => import('@/components/sections/TestimonialCarousel'),
  { ssr: false }
);

const ContactCTA = dynamic(
  () => import('@/components/sections/ContactCTA'),
  { ssr: false }
);

const ProjectsPreview = dynamic(
  () => import('@/components/sections/ProjectsPreview'),
  { ssr: false }
);

interface Testimonial {
  id: string;
  quote: Record<string, string>;
  person_name: string;
  company_name: string;
  avatar_path?: string;
  order: number;
}

interface Props {
  testimonials: Testimonial[];
  locale: string;
}

export default function HomeBelowFoldSections({ testimonials, locale }: Props) {
  return (
    <>
      <TestimonialCarousel testimonials={testimonials} locale={locale} />
      <ProjectsPreview projects={[]} locale={locale} columns={2} showTitles={false} />
      <ContactCTA />
    </>
  );
}
