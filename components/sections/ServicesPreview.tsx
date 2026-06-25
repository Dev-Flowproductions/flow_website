'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn';
import { getServiceCategoryHref } from '@/lib/serviceCategoryHref';

interface ServiceItem {
  key: string;
  title: string;
  description: string;
}

export default function ServicesPreview() {
  const t = useTranslations('home.servicesPreview');
  const items = (t.raw('items') as ServiceItem[] | undefined) ?? [];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
              {t('title')}
            </h2>
          </div>
        </AnimateIn>

        <div className="border-t border-gray-200 mb-12" />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {items.map((service, index) => {
            const number = String(index + 1).padStart(2, '0');
            const href = getServiceCategoryHref(service.key) ?? '/servicos';

            return (
              <StaggerItem key={service.key}>
                <Link href={href} className="group block">
                  <div className="space-y-4 text-center sm:text-left">
                    <div className="text-6xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                      {number}
                    </div>
                    <h3 className="text-xl font-bold no-underline group-hover:underline group-hover:underline-offset-4 group-hover:decoration-current group-hover:text-gray-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
