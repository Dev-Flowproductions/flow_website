'use client';

interface Props {
  videoId: string;
  label: string;
  title: string;
  titleAccent: string;
  description: string;
}

export default function YoutubeHero({ videoId, label, title, titleAccent, description }: Props) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1`;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* YouTube iframe — scaled to cover full viewport */}
      <div className="absolute inset-0 pointer-events-none">
        <iframe
          src={embedUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="absolute top-1/2 left-1/2"
          style={{
            width: '100vw',
            height: '56.25vw',   /* 16:9 — fills width */
            minHeight: '100vh',
            minWidth: '177.78vh', /* 16:9 — fills height */
            transform: 'translate(-50%, -50%)',
            border: 'none',
          }}
        />
      </div>

      {/* Dark overlay so text is legible */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Text — centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
        <p className="text-xs uppercase tracking-widest text-white/50 mb-4">{label}</p>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
          {title} <span className="text-white/25">{titleAccent}</span>
        </h1>
        <p className="text-white/60 text-base leading-relaxed max-w-xl">{description}</p>
      </div>
    </section>
  );
}
