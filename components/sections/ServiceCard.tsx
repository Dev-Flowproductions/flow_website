'use client';

import { StaggerItem, StaggerContainer } from '@/components/ui/AnimateIn';
import { motion } from 'framer-motion';

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

interface ServiceCardProps {
  service: Service;
  locale: string;
  number: string;
}

export default function ServiceCard({ service, locale, number }: ServiceCardProps) {
  const title = service.title[locale] || service.title['pt'] || service.key;
  const sortedItems = [...service.service_items].sort((a, b) => a.order - b.order);

  return (
    <StaggerItem>
      <div className="border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-8 md:items-start">
          {/* Number */}
          <div className="md:col-span-2">
            <span className="text-5xl md:text-7xl font-bold text-gray-200">
              {number}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-3">
            <h2 className="text-2xl md:text-3xl font-bold md:pt-4">{title}</h2>
          </div>

          {/* Items */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {sortedItems.map((item) => {
                const label = item.label[locale] || item.label['pt'] || '';
                return (
                  <div
                    key={item.id}
                    className="text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
