'use client';

import { useTranslations } from 'next-intl';
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn';

export default function HomeHowWeWork() {
  const t = useTranslations('home.howWeWork');
  const steps = t.raw('steps') as Array<{ title: string; description: string }>;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">{t('label')}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t('intro')}</p>
          </div>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <StaggerItem key={step.title}>
              <div className="space-y-4 text-center sm:text-left">
                <div className="text-6xl font-bold text-gray-200">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
