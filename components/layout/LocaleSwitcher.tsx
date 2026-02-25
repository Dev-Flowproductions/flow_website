'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition, useState, useEffect, useRef } from 'react';

const locales = [
  { code: 'pt', label: 'PT', flag: 'https://flagcdn.com/w20/pt.png' },
  { code: 'en', label: 'EN', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'fr', label: 'FR', flag: 'https://flagcdn.com/w20/fr.png' },
];

export default function LocaleSwitcher({ locale }: { locale: string }) {
  const router        = useRouter();
  const pathname      = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = locales.find((l) => l.code === locale) ?? locales[0];
  const others = locales.filter((l) => l.code !== locale);

  function switchLocale(nextLocale: string) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  /* close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-1">
      {/* Other locales — slide up when open */}
      <div
        className={`flex flex-col gap-1 transition-all duration-200 overflow-hidden ${
          open ? 'max-h-40 opacity-100 mb-1' : 'max-h-0 opacity-0'
        }`}
      >
        {others.map((loc) => (
          <button
            key={loc.code}
            onClick={() => switchLocale(loc.code)}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-800 rounded-full shadow-md text-xs font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <img src={loc.flag} alt={loc.label} width={20} height={14} className="rounded-sm object-cover" />
            <span>{loc.label}</span>
          </button>
        ))}
      </div>

      {/* Active locale trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-800 rounded-full shadow-md text-xs font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap border border-gray-200"
      >
        <img src={active.flag} alt={active.label} width={20} height={14} className="rounded-sm object-cover" />
        <span>{active.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
