'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';

export interface CarouselProject {
  slug: string;
  title: string;
  img: string;
  tags?: string;
}

interface Props {
  projects: CarouselProject[];
  title: string;
  dark?: boolean;
  /** Color the dark gradient lands on — match the section below. */
  fadeTo?: 'white' | 'gray-50';
}

function getVisibleCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

const darkGradients = {
  white:
    'bg-[linear-gradient(to_bottom,#000_0%,#0f0f0f_15%,#3f3f3f_40%,#9ca3af_70%,#e5e7eb_88%,#fff_100%)]',
  'gray-50':
    'bg-[linear-gradient(to_bottom,#000_0%,#0f0f0f_15%,#3f3f3f_40%,#9ca3af_70%,#e5e7eb_88%,#f9fafb_100%)]',
} as const;

export default function MultiSlideCarousel({
  projects,
  title,
  dark = false,
  fadeTo = 'white',
}: Props) {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);

  const maxIndex = Math.max(0, projects.length - visibleCount);
  const canScroll = maxIndex > 0;

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setCurrent((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    if (hoveringRef.current || !canScroll) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 3000);
  }, [canScroll, clearAutoplay, maxIndex]);

  const scheduleAutoplayResume = useCallback(() => {
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      if (!hoveringRef.current) startAutoplay();
    }, 5000);
  }, [clearResumeTimeout, startAutoplay]);

  const goTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (!canScroll) return;
      clearAutoplay();
      clearResumeTimeout();
      setCurrent((c) =>
        direction === 'next'
          ? c >= maxIndex
            ? 0
            : c + 1
          : c <= 0
            ? maxIndex
            : c - 1
      );
      scheduleAutoplayResume();
    },
    [canScroll, clearAutoplay, clearResumeTimeout, maxIndex, scheduleAutoplayResume]
  );

  useEffect(() => {
    startAutoplay();
    return () => {
      clearAutoplay();
      clearResumeTimeout();
    };
  }, [startAutoplay, clearAutoplay, clearResumeTimeout]);

  const trackWidthPercent = (projects.length * 100) / visibleCount;
  const trackSlidePercent = 100 / projects.length;

  const navBtnClass =
    'flex h-11 w-11 md:h-12 md:w-12 touch-manipulation items-center justify-center rounded-full border border-white/50 bg-black/45 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/60 hover:border-white/80 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      className={`py-10 overflow-x-hidden max-w-full ${dark ? darkGradients[fadeTo] : 'bg-gray-50'}`}
      onMouseEnter={() => {
        hoveringRef.current = true;
        clearAutoplay();
        clearResumeTimeout();
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        startAutoplay();
      }}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:px-8 md:px-12 mb-6 max-w-full">
        <button
          type="button"
          onClick={() => goTo('prev')}
          aria-label="Previous"
          disabled={!canScroll}
          className={navBtnClass}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-center min-w-0 px-1 ${dark ? 'text-white' : 'text-black'}`}>
          {title}
        </h2>
        <button
          type="button"
          onClick={() => goTo('next')}
          aria-label="Next"
          disabled={!canScroll}
          className={navBtnClass}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="overflow-hidden px-4 sm:px-8 md:px-12 max-w-full">
        <div
          className="flex w-full transition-transform duration-500 ease-in-out"
          style={{
            width: `${trackWidthPercent}%`,
            transform: `translateX(-${current * trackSlidePercent}%)`,
          }}
        >
          {projects.map((p, i) => (
            <div
              key={`${p.slug}-${i}`}
              className="flex-shrink-0 box-border pr-3"
              style={{ width: `${trackSlidePercent}%` }}
            >
              <Link href={`/projetos/${p.slug}`} className="group block" draggable={false}>
                <div className="relative overflow-hidden bg-gray-800" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    draggable={false}
                    className="object-cover transition-transform duration-500 select-none"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-center px-4">
                    <p className="text-white font-bold text-base md:text-lg text-center leading-snug mb-1">
                      {p.title}
                    </p>
                    {p.tags && (
                      <p className="text-white/60 text-xs text-center">{p.tags}</p>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/20 border border-white/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
                <div className="md:hidden mt-3 text-center">
                  <p className={`font-bold text-sm leading-snug ${dark ? 'text-white' : 'text-black'}`}>
                    {p.title}
                  </p>
                  {p.tags && (
                    <p className={`text-xs mt-1 ${dark ? 'text-white/70' : 'text-gray-500'}`}>{p.tags}</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
