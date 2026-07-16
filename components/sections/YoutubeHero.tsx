'use client';

import { useEffect, useRef, useState } from 'react';
import { getGoogleDriveVideoSrc } from '@/lib/googleDrive';
import {
  createSeamlessLoopHandlers,
  loadYoutubeIframeApi,
  type YoutubePlayerInstance,
} from '@/lib/youtubeIframeApi';

interface Props {
  videoId?: string;
  videoSrc?: string;
  driveFileId?: string;
  label?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
}

const playerShellClass =
  'pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 [&_iframe]:pointer-events-none [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 lg:[&_iframe]:h-auto lg:[&_iframe]:w-[177.78%] lg:[&_iframe]:min-h-full lg:[&_iframe]:min-w-[177.78%]';

const driveVideoClass =
  'pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover lg:h-auto lg:w-[177.78%] lg:min-h-full lg:min-w-[177.78%]';

export default function YoutubeHero({
  videoId,
  videoSrc,
  driveFileId,
  label,
  title,
  titleAccent,
  description,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const driveVideoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<YoutubePlayerInstance | null>(null);
  const loopHandlersRef = useRef<ReturnType<typeof createSeamlessLoopHandlers> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const hasOverlayText = label || title || description;
  const usesLocalVideo = Boolean(videoSrc);
  const usesDrive = Boolean(driveFileId) && !usesLocalVideo;

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

  useEffect(() => {
    if (!shouldLoad || usesDrive || usesLocalVideo || !videoId || !playerMountRef.current) return;

    let cancelled = false;

    loadYoutubeIframeApi()
      .then((YT) => {
        if (cancelled || !playerMountRef.current) return;

        const loopHandlers = createSeamlessLoopHandlers(YT);
        loopHandlersRef.current = loopHandlers;

        playerRef.current = new YT.Player(playerMountRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: loopHandlers.onReady,
            onStateChange: loopHandlers.onStateChange,
          },
        });
      })
      .catch(() => {
        // Keep the black placeholder if the API fails to load.
      });

    return () => {
      cancelled = true;
      loopHandlersRef.current?.destroy();
      loopHandlersRef.current = null;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [shouldLoad, usesDrive, usesLocalVideo, videoId]);

  useEffect(() => {
    if (!shouldLoad || (!usesDrive && !usesLocalVideo)) return;

    const video = driveVideoRef.current;
    if (!video) return;

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.load();
    tryPlay();

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, [shouldLoad, usesDrive, usesLocalVideo, driveFileId, videoSrc]);

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
              <>
                {usesLocalVideo || usesDrive ? (
                  <video
                    ref={driveVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={title || 'Hero video'}
                    className={driveVideoClass}
                    src={usesLocalVideo ? videoSrc : getGoogleDriveVideoSrc(driveFileId!)}
                  />
                ) : (
                  <div
                    ref={playerMountRef}
                    className={playerShellClass}
                    aria-label={title || 'Hero video'}
                  />
                )}
                <div className="absolute inset-0 z-[1]" aria-hidden tabIndex={-1} />
              </>
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
