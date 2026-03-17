import { ReactNode } from 'react';
import { AnimateIn } from '@/components/ui/AnimateIn';

interface MartechDiagnosticCtaProps {
  title: string;
  description: string;
  cta: ReactNode;
  /** Optional extra content below the CTA (e.g. "What you'll receive" list) */
  children?: ReactNode;
}

export default function MartechDiagnosticCta({ title, description, cta, children }: MartechDiagnosticCtaProps) {
  return (
    <AnimateIn delay={0.1}>
      <div className="relative rounded-2xl bg-gradient-to-br from-[#5b54a0]/10 via-[#5b54a0]/5 to-white border border-[#5b54a0]/20 p-8 md:p-10 shadow-lg shadow-[#5b54a0]/5">
        <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#5b54a0] to-[#7c75b8]" aria-hidden />
        <p className="font-semibold text-lg text-gray-900 mb-2">{title}</p>
        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
        <div className="mb-0">{cta}</div>
        {children && (
          <div className="mt-8 pt-8 border-t border-[#5b54a0]/15">
            {children}
          </div>
        )}
      </div>
    </AnimateIn>
  );
}
