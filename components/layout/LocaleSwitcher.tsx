'use client';

import Image from 'next/image';
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
    <div ref={ref} className="relative flex items-center">
      {/* Active locale trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black/10 transition-colors whitespace-nowrap"
      >
        <Image src={active.flag} alt={active.label} width={20} height={14} className="rounded-sm object-cover" />
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

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1 flex flex-col gap-1 bg-white rounded-xl shadow-lg py-1 z-50 min-w-[80px]">
          {others.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-800 text-xs font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap w-full"
            >
              <Image src={loc.flag} alt={loc.label} width={20} height={14} className="rounded-sm object-cover" />
              <span>{loc.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
