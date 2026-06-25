'use client';

import type { ReactNode } from 'react';
import { scrollToSection } from '@/lib/scrollToSection';

interface ScrollToSectionProps {
  children: ReactNode;
  className?: string;
  targetId: string;
  center?: boolean;
}

export default function ScrollToSection({
  children,
  className,
  targetId,
  center = true,
}: ScrollToSectionProps) {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(targetId, center)}
      className={className}
    >
      {children}
    </button>
  );
}
