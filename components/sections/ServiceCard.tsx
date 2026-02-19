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
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Number - 2 columns */}
          <div className="col-span-2">
            <span className="text-7xl font-bold text-gray-200">
              {number}
            </span>
          </div>

          {/* Title - 3 columns */}
          <div className="col-span-3">
            <h2 className="text-3xl font-bold pt-4">{title}</h2>
          </div>

          {/* Items in 2 columns - 7 columns total */}
          <div className="col-span-7">
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
