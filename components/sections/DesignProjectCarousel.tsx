'use client';

import ProjectCarousel from '@/components/sections/ProjectCarousel';
import { designCarouselProjects } from '@/lib/designCarouselProjects';

export default function DesignProjectCarousel() {
  return <ProjectCarousel projects={designCarouselProjects} />;
}
