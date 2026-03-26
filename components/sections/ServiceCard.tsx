'use client';

import { StaggerItem } from '@/components/ui/AnimateIn';
import { Link } from '@/i18n/routing';
import { getServiceItemHref } from '@/lib/serviceItemRoutes';
import { getServiceCategoryHref } from '@/lib/serviceCategoryHref';

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
  const categoryHref = getServiceCategoryHref(service.key);

  return (
    <StaggerItem>
      <div className="border-b border-gray-200 pb-12">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-8 md:items-baseline">
          {/* Number — baseline-aligned with title */}
          <div className="md:col-span-2 text-center md:text-left">
            <span className="text-5xl md:text-7xl font-bold text-gray-200 leading-none">
              {number}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-3 text-center md:text-left">
            {categoryHref ? (
              <h3 className="text-2xl md:text-3xl font-bold">
                <Link
                  href={categoryHref}
                  className="no-underline hover:underline hover:underline-offset-4 hover:decoration-[#5b54a0] hover:text-[#5b54a0] transition-colors"
                >
                  {title}
                </Link>
              </h3>
            ) : (
              <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            )}
          </div>

          {/* Items */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center md:text-left">
              {sortedItems.map((item) => {
                const label = item.label[locale] || item.label['pt'] || '';
                const itemHref = getServiceItemHref(service.key, item.order);
                if (itemHref) {
                  return (
                    <Link
                      key={item.id}
                      href={itemHref}
                      className="text-sm text-gray-700 no-underline hover:underline hover:underline-offset-2 hover:decoration-black hover:text-black transition-colors block"
                    >
                      {label}
                    </Link>
                  );
                }
                return (
                  <div key={item.id} className="text-sm text-gray-700">
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
