'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';

export interface CarouselProject {
  slug: string;
  title: string;
  img: string;
}

interface Props {
  projects: CarouselProject[];
}

const SLIDE_W = 55;
const SCALE   = 0.84;
const OFFSET  = (100 - SLIDE_W) / 2;
const arrowPct = OFFSET + (SLIDE_W * (1 - SCALE)) / 4;

export default function ProjectCarousel({ projects }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setCurrent((c) => (c + 1) % projects.length);
  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, current]);

  const project = projects[current];
  const num     = String(current + 1).padStart(2, '0');

  return (
    <div
      className="py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${current * SLIDE_W}% + ${OFFSET}%))` }}
        >
          {projects.map((p, i) => {
            const isActive = i === current;
            return (
              <div
                key={`${p.slug}-${i}`}
                className="flex-shrink-0 px-2 transition-transform duration-500"
                style={{
                  width: `${SLIDE_W}%`,
                  transform: isActive ? `scale(${SCALE})` : 'scale(1)',
                  transformOrigin: 'center center',
                }}
              >
                <Link href={`/projetos/${p.slug}`} className="group block relative">
                  <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-opacity duration-500"
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
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={() => { prev(); setPaused(true); }}
          aria-label="Previous"
          className="absolute top-1/2 text-black hover:text-gray-400 transition-colors z-10"
          style={{ left: `${arrowPct}%`, transform: 'translate(-50%, -50%)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => { next(); setPaused(true); }}
          aria-label="Next"
          className="absolute top-1/2 text-black hover:text-gray-400 transition-colors z-10"
          style={{ right: `${arrowPct}%`, transform: 'translate(50%, -50%)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Title + number */}
      <div
        className="mt-4 flex items-baseline justify-between"
        style={{
          marginLeft:  `calc(${OFFSET}% + ${(SLIDE_W - SLIDE_W * SCALE) / 2}% + 0.5rem)`,
          width:       `calc(${SLIDE_W * SCALE}% - 1rem)`,
        }}
      >
        <h3 className="text-lg md:text-xl font-bold text-black">{project.title}</h3>
        <span className="text-gray-400 text-sm font-light ml-4 flex-shrink-0">{num}</span>
      </div>
    </div>
  );
}
