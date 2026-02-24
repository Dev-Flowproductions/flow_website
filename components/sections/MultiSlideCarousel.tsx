'use client';

import { useState, useEffect, useRef } from 'react';
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
}

export default function MultiSlideCarousel({ projects, title, dark = false }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleCount = 3;
  const maxIndex = projects.length - visibleCount;

  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  // Auto-advance (wraps around)
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, maxIndex]);

  const slideW = 100 / visibleCount; // 33.33%

  return (
    <div
      className={`py-10 ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header: title centered, arrows right */}
      <div className="flex items-center justify-between px-8 md:px-12 mb-6">
        <h2 className={`text-xl md:text-2xl font-bold flex-1 text-center ${dark ? 'text-white' : 'text-black'}`}>
          {title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => { prev(); setPaused(true); }}
            aria-label="Previous"
            disabled={current === 0}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors
              ${dark
                ? 'border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-30'
                : 'border-gray-300 text-gray-600 hover:bg-black hover:text-white disabled:opacity-30'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => { next(); setPaused(true); }}
            aria-label="Next"
            disabled={current >= maxIndex}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors
              ${dark
                ? 'border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-30'
                : 'border-gray-300 text-gray-600 hover:bg-black hover:text-white disabled:opacity-30'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="overflow-hidden px-8 md:px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * slideW}%)` }}
        >
          {projects.map((p, i) => (
            <div
              key={`${p.slug}-${i}`}
              className="flex-shrink-0 pr-3"
              style={{ width: `${slideW}%` }}
            >
              <Link href={`/projetos/${p.slug}`} className="group block">
                <div className="relative overflow-hidden bg-gray-800" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center px-4">
                    <p className="text-white font-bold text-base md:text-lg text-center leading-snug mb-1">
                      {p.title}
                    </p>
                    {p.tags && (
                      <p className="text-white/60 text-xs text-center">{p.tags}</p>
                    )}
                  </div>
                  {/* Arrow button — always visible on hover */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
