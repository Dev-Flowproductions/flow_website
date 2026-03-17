import { ReactNode } from 'react';

interface MartechContentListProps {
  title?: string;
  subtitle?: string;
  items: string[];
  /** 'arrow' (→) or 'check' (✓) */
  icon?: 'arrow' | 'check';
  iconClassName?: string;
  className?: string;
}

export default function MartechContentList({
  title,
  subtitle,
  items,
  icon = 'arrow',
  iconClassName = 'text-[#5b54a0]',
  className = '',
}: MartechContentListProps) {
  const Icon = icon === 'check' ? '✓' : '→';
  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 break-words">{title}</h2>
      )}
      {subtitle && (
        <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
      )}
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-gray-700">
            <span className={`shrink-0 w-7 h-7 rounded-full bg-[#5b54a0]/10 flex items-center justify-center text-sm font-semibold ${iconClassName} mt-0.5`} aria-hidden>
              {Icon}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
