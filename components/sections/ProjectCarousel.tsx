'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import {
  projectDetailHref,
  type ProjectNavigationCategory,
} from '@/lib/projectCategoryNavigation';

export interface CarouselProject {
  slug: string;
  title: string;
  img: string;
}

interface Props {
  projects: CarouselProject[];
  navigationCategory?: ProjectNavigationCategory;
}

const SLIDE_W = 55;
const OFFSET = (100 - SLIDE_W) / 2;

const carouselNavBtn =
  'flex-shrink-0 flex h-11 w-11 md:h-12 md:w-12 touch-manipulation items-center justify-center rounded-full border border-white/50 bg-black/45 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/60 hover:border-white/80 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function ProjectCarousel({ projects, navigationCategory }: Props) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);

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
    if (hoveringRef.current || projects.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % projects.length);
    }, 3000);
  }, [clearAutoplay, projects.length]);

  const scheduleAutoplayResume = useCallback(() => {
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      if (!hoveringRef.current) startAutoplay();
    }, 5000);
  }, [clearResumeTimeout, startAutoplay]);

  const goTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (projects.length <= 1) return;
      clearAutoplay();
      clearResumeTimeout();
      setCurrent((c) =>
        direction === 'next'
          ? (c + 1) % projects.length
          : (c - 1 + projects.length) % projects.length
      );
      scheduleAutoplayResume();
    },
    [clearAutoplay, clearResumeTimeout, projects.length, scheduleAutoplayResume]
  );

  const handleNav = useCallback(
    (direction: 'next' | 'prev') => {
      goTo(direction);
    },
    [goTo]
  );

  useEffect(() => {
    startAutoplay();
    return () => {
      clearAutoplay();
      clearResumeTimeout();
    };
  }, [startAutoplay, clearAutoplay, clearResumeTimeout]);

  if (projects.length === 0) return null;

  const num = String(current + 1).padStart(2, '0');
  const canScroll = projects.length > 1;

  return (
    <div
      className="py-12 px-4 md:px-8"
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
      <div className="flex items-center gap-3 md:gap-4 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => handleNav('prev')}
          aria-label="Previous"
          disabled={!canScroll}
          className={carouselNavBtn}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(calc(-${current * SLIDE_W}% + ${OFFSET}%))` }}
          >
            {projects.map((p, i) => {
              const isActive = i === current;
              return (
                <div
                  key={`${p.slug}-${i}`}
                  className="flex-shrink-0 px-2 flex flex-col"
                  style={{ width: `${SLIDE_W}%` }}
                >
                  <Link
                    href={projectDetailHref(p.slug, navigationCategory)}
                    className="group block relative"
                    draggable={false}
                  >
                    <div
                      className="relative overflow-hidden bg-gray-50 transition-transform duration-500"
                      style={{
                        aspectRatio: '4/3',
                        transform: isActive ? 'scale(1)' : 'scale(0.92)',
                        transformOrigin: 'center center',
                      }}
                    >
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      sizes="55vw"
                      draggable={false}
                      priority={i === 0}
                      className="object-cover transition-opacity duration-500 select-none"
                        style={{ opacity: isActive ? 1 : 0.45 }}
                      />
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  <div
                    className="mt-4 flex items-baseline justify-between min-h-[2rem]"
                    aria-hidden={!isActive}
                  >
                    <h3
                      className={`text-lg md:text-xl font-bold text-black transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {p.title}
                    </h3>
                    <span
                      className={`text-gray-400 text-sm font-light ml-4 flex-shrink-0 transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {num}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleNav('next')}
          aria-label="Next"
          disabled={!canScroll}
          className={carouselNavBtn}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
