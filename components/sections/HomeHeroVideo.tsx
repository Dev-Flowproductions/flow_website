'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ScrollNavButton from '@/components/ui/ScrollNavButton';

const primaryBtnClass =
  'inline-flex items-center justify-center px-8 py-3 bg-[#5b54a0] text-white rounded-full hover:bg-[#4a4480] transition-colors font-medium';
const secondaryBtnClass =
  'inline-flex items-center justify-center px-8 py-3 border-2 border-[#5b54a0] text-[#5b54a0] rounded-full hover:bg-[#5b54a0] hover:text-white transition-colors font-medium';

export default function HomeHeroVideo() {
  const t = useTranslations('home.hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="hidden md:block relative w-full overflow-hidden bg-gray-900">
        <div ref={containerRef} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {shouldLoad ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/hero/home.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-gray-900" aria-hidden />
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">{t('label')}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <ScrollNavButton href="/martech#diagnostico" center className={primaryBtnClass}>
              {t('ctaPrimary')}
            </ScrollNavButton>
            <ScrollNavButton href="/martech#services" center={false} className={secondaryBtnClass}>
              {t('ctaSecondary')}
            </ScrollNavButton>
          </div>
        </div>
      </section>
    </>
  );
}
