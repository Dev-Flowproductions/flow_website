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
    <>
      {/* Mobile: Text only (no video) */}
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

      {/* Desktop: Video with text overlay */}
      <section className="hidden md:block relative w-full overflow-hidden bg-gray-900">
        {/* Responsive container - 16:9 aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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

          {/* Netflix-style gradient overlays */}
          {/* Left side gradient - dark to transparent */}
          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {hasOverlayText && (
            <>
              {/* Text — left aligned like Netflix */}
              <div className="absolute inset-0 flex flex-col justify-center text-left px-12 lg:px-20 max-w-3xl">
                {label && <p className="text-xs uppercase tracking-widest text-white/60 mb-4">{label}</p>}
                {title && (
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                    {title} {titleAccent && <span className="text-white/30">{titleAccent}</span>}
                  </h1>
                )}
                {description && <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">{description}</p>}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
