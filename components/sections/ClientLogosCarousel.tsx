import Image from 'next/image';
import { CLIENT_LOGOS } from '@/lib/clientLogos';

type Props = {
  className?: string;
};

export default function ClientLogosCarousel({ className = '' }: Props) {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className={`bg-white py-14 md:py-16 overflow-hidden border-t border-gray-100 ${className}`.trim()}>
      <div className="animate-marquee-slow">
        {logos.map((logo, i) => (
          <div
            key={`${logo.slug}-${i}`}
            className="inline-flex items-center justify-center flex-shrink-0 mx-5 md:mx-10 h-12 w-28 md:h-16 md:w-40 relative"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              sizes="160px"
              className="object-contain opacity-80"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
