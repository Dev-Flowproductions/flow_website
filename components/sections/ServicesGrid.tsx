'use client';

import { StaggerContainer } from '@/components/ui/AnimateIn';
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  key: string;
  title: Record<string, string>;
  order: number;
  service_items: Array<{
    id: string;
    label: Record<string, string>;
    order: number;
  }>;
}

interface ServicesGridProps {
  services: Service[];
  locale: string;
}

const serviceNumbers = ['01', '02', '03', '04'];

export default function ServicesGrid({ services, locale }: ServicesGridProps) {
  const sortedServices = [...services].sort((a, b) => a.order - b.order);

  return (
    <StaggerContainer className="max-w-4xl mx-auto space-y-16">
      {sortedServices.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          locale={locale}
          number={serviceNumbers[index] || `0${index + 1}`}
        />
      ))}
    </StaggerContainer>
  );
}
