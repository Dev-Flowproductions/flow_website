'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  quote: Record<string, string>;
  person_name: string;
  company_name: string;
  avatar_path?: string;
  order: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  locale: string;
}

export default function TestimonialCarousel({
  testimonials,
  locale,
}: TestimonialCarouselProps) {
  const t = useTranslations('home.testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const sortedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sortedTestimonials.length) % sortedTestimonials.length
    );
  };

  if (sortedTestimonials.length === 0) {
    return null;
  }

  const currentTestimonial = sortedTestimonials[currentIndex];
  const quote = currentTestimonial.quote[locale] || currentTestimonial.quote['pt'];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <AnimateIn>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            {t('title')} <span className="text-gray-300">{t('titleHighlight')}</span>
          </h2>
        </AnimateIn>

        {/* Carousel */}
        <div className="relative px-8 sm:px-12 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Quote */}
              <div className="mb-12">
                <p className="text-lg sm:text-2xl md:text-3xl text-black font-normal leading-relaxed max-w-4xl mx-auto">
                  {quote}
                </p>
              </div>

              {/* Company Info */}
              <div className="flex flex-col items-center gap-4">
                {/* Avatar */}
                {currentTestimonial.avatar_path ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shrink-0 relative">
                    <Image
                      src={currentTestimonial.avatar_path}
                      alt={currentTestimonial.company_name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-100">
                    <span className="text-gray-400 text-2xl font-bold">
                      {currentTestimonial.company_name.charAt(0)}
                    </span>
                  </div>
                )}
                
                {/* Company and Person Name */}
                <div>
                  <p className="font-bold text-lg text-black">
                    {currentTestimonial.company_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {currentTestimonial.person_name}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {sortedTestimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Next Arrow (decorative) */}
        {sortedTestimonials.length > 1 && (
          <div className="flex justify-center mt-12">
            <div
              aria-hidden
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-default"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
