'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  videoId: string;
  label?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
}

export default function YoutubeHero({ videoId, label, title, titleAccent, description }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1`;
  const hasOverlayText = label || title || description;

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
      {hasOverlayText && (
        <section className="md:hidden py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            {label && <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">{label}</p>}
            {title && (
              <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-6">
                {title} {titleAccent && <span className="text-gray-300">{titleAccent}</span>}
              </h1>
            )}
            {description && <p className="text-gray-700 text-base leading-relaxed max-w-xl mx-auto">{description}</p>}
          </div>
        </section>
      )}

      <section className="relative w-full max-w-full overflow-hidden bg-gray-900">
        <div ref={containerRef} className="relative w-full max-w-full aspect-video lg:aspect-auto lg:pb-[56.25%]">
          <div className="absolute inset-0 overflow-hidden">
            {shouldLoad ? (
              <iframe
                src={embedUrl}
                title={title || 'Hero video'}
                loading="lazy"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 border-0 lg:h-auto lg:w-[177.78%] lg:min-h-full lg:min-w-[177.78%]"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900" aria-hidden />
            )}
          </div>

          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none hidden lg:block" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {hasOverlayText && (
            <div className="absolute inset-0 hidden lg:flex flex-col justify-center text-left px-12 xl:px-20 max-w-3xl">
              {label && <p className="text-xs uppercase tracking-widest text-white/60 mb-4">{label}</p>}
              {title && (
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                  {title} {titleAccent && <span className="text-white/30">{titleAccent}</span>}
                </h1>
              )}
              {description && <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">{description}</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
