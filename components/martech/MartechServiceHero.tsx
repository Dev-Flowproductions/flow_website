import { AnimateIn } from '@/components/ui/AnimateIn';

interface MartechServiceHeroProps {
  label: string;
  title: string;
  subtitle: string;
  intro?: string;
}

export default function MartechServiceHero({ label, title, subtitle, intro }: MartechServiceHeroProps) {
  return (
    <section className="relative py-24 px-4 overflow-hidden md:py-28">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#5b54a0]/[0.03] via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="relative max-w-4xl mx-auto text-center md:text-left">
        <AnimateIn>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5b54a0] font-semibold mb-4">
              {label}
            </p>
            <div className="border-l-4 border-[#5b54a0] pl-6 md:pl-8 -ml-px">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </AnimateIn>
        {intro && (
          <AnimateIn delay={0.1}>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">{intro}</p>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
