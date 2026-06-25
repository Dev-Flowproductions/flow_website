'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomeHeroVideo() {
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
  );
}
