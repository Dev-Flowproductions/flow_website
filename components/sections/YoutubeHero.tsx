'use client';

interface Props {
  videoId: string;
  label?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
}

export default function YoutubeHero({ videoId, label, title, titleAccent, description }: Props) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1`;

  const hasOverlayText = label || title || description;

  return (
    <section className="hidden md:block relative w-full overflow-hidden bg-gray-900">
      {/* Responsive container with 16:9 aspect ratio cropped to ~40% height */}
      <div className="relative w-full" style={{ paddingBottom: '40%' }}>
        {/* YouTube iframe — scaled to cover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <iframe
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.78%]"
            style={{
              transform: 'translate(-50%, -50%)',
              border: 'none',
            }}
          />
        </div>

        {/* Gradient fade at the bottom — always present */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {hasOverlayText && (
          <>
            {/* Dark overlay so text is legible */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Text — centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              {label && <p className="text-xs uppercase tracking-widest text-white/50 mb-4">{label}</p>}
              {title && (
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                  {title} {titleAccent && <span className="text-white/25">{titleAccent}</span>}
                </h1>
              )}
              {description && <p className="text-white/60 text-base leading-relaxed max-w-xl">{description}</p>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
