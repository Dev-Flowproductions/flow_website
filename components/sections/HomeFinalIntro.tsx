'use client';

import { useTranslations } from 'next-intl';
import ScrollNavButton from '@/components/ui/ScrollNavButton';
import { AnimateIn } from '@/components/ui/AnimateIn';

const primaryBtnClass =
  'inline-flex items-center justify-center px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium';
const secondaryBtnClass =
  'inline-flex items-center justify-center px-8 py-3 border-2 border-[#5b54a0] text-[#5b54a0] rounded-full hover:bg-[#5b54a0] hover:text-white transition-colors font-medium';

export default function HomeFinalIntro() {
  const t = useTranslations('home.finalCta');

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <AnimateIn>
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">{t('label')}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('title')}</h2>
          <div className="space-y-4 text-gray-700 max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed">{t('description')}</p>
            <p className="text-lg leading-relaxed text-gray-600">{t('description2')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <ScrollNavButton href="#home-contact-form" center={false} className={primaryBtnClass}>
              {t('ctaPrimary')}
            </ScrollNavButton>
            <ScrollNavButton href="/martech#diagnostico" center className={secondaryBtnClass}>
              {t('ctaSecondary')}
            </ScrollNavButton>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
