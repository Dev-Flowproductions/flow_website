import { ReactNode } from 'react';

interface MartechSectionProps {
  children: ReactNode;
  /** 'default' = white, 'muted' = gray-50 */
  variant?: 'default' | 'muted';
  className?: string;
  /** Optional class for the inner content wrapper (e.g. max-w-6xl for wider) */
  contentClassName?: string;
}

export default function MartechSection({
  children,
  variant = 'default',
  className = '',
  contentClassName = '',
}: MartechSectionProps) {
  const bg = variant === 'muted' ? 'bg-gray-50' : 'bg-white';
  return (
    <section className={`py-20 px-4 ${bg} ${className}`}>
      <div className={`max-w-4xl mx-auto text-center md:text-left ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}
