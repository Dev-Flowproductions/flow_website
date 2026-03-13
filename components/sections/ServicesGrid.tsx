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

const martechService: Service = {
  id: 'martech',
  key: 'martech',
  title: { pt: 'MarTech', en: 'MarTech', fr: 'MarTech' },
  order: 2,
  service_items: [
    { id: 'martech-1', label: { pt: 'Websites preparados para AEO, GEO e SEO', en: 'AEO, GEO & SEO-Ready Websites', fr: 'Sites Web AEO, GEO & SEO' }, order: 1 },
    { id: 'martech-2', label: { pt: 'Non-gated Demand Gen', en: 'Non-gated Demand Gen', fr: 'Non-gated Demand Gen' }, order: 2 },
    { id: 'martech-3', label: { pt: 'Estratégia "Go-to-Market"', en: 'Go-to-Market Strategy', fr: 'Stratégie Go-to-Market' }, order: 3 },
    { id: 'martech-4', label: { pt: 'LLM Advertisement & Paid Media', en: 'LLM Advertisement & Paid Media', fr: 'LLM Advertisement & Paid Media' }, order: 4 },
    { id: 'martech-5', label: { pt: 'Landing Pages & AI Offers', en: 'Landing Pages & AI Offers', fr: 'Landing Pages & AI Offers' }, order: 5 },
    { id: 'martech-6', label: { pt: 'AI Agents MKT e Vendas', en: 'AI Agents for MKT & Sales', fr: 'AI Agents MKT & Ventes' }, order: 6 },
  ],
};

export default function ServicesGrid({ services, locale }: ServicesGridProps) {
  const sortedDbServices = [...services].sort((a, b) => a.order - b.order);
  
  // Insert MarTech after Design (index 1)
  const allServices: Service[] = [];
  sortedDbServices.forEach((service, i) => {
    allServices.push(service);
    if (i === 0) {
      allServices.push(martechService);
    }
  });

  return (
    <StaggerContainer className="max-w-4xl mx-auto space-y-12">
      {allServices.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          locale={locale}
          number={String(index + 1).padStart(2, '0')}
        />
      ))}
    </StaggerContainer>
  );
}
