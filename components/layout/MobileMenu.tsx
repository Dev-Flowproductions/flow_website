'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LocaleSwitcher from './LocaleSwitcher';

export default function MobileMenu({
  isOpen,
  onClose,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}) {
  const t = useTranslations('nav');
  const tCat = useTranslations('categories');
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    if (href === '/projetos')
      return (
        pathname === '/projetos' ||
        ['/design', '/marketing', '/audiovisual', '/animacao', '/projetos-sociais'].includes(pathname)
      );
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkClass = (href: string) =>
    `block text-lg font-medium transition-colors py-2 ${
      isActive(href) ? 'text-white' : 'text-gray-400 hover:text-gray-200'
    }`;

  const projectCategories = [
    { key: 'design', labelKey: 'design' },
    { key: 'marketing', labelKey: 'marketing' },
    { key: 'audiovisual', labelKey: 'audiovisual' },
    { key: 'animacao', labelKey: 'animacao' },
    { key: 'projetos-sociais', labelKey: 'projetosSociais' },
  ];

  // Lock body scroll when menu is open so only the menu panel scrolls
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen dark panel from left */}
      <div
        className="lg:hidden fixed inset-0 z-[9999] bg-gray-900 flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal
        aria-label="Menu"
      >
        {/* Top: Logo + Language + Close */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-800">
          <Link href="/" onClick={onClose} className="flex-shrink-0">
            <Image
              src="/Logotipo/Logo Preto-01.png"
              alt="Flow Productions"
              width={140}
              height={36}
              className="h-9 w-auto invert"
            />
          </Link>
          <div className="[&_.rounded-full]:!bg-gray-800 [&_.rounded-full]:!text-white [&_img]:rounded-sm">
            <LocaleSwitcher locale={locale} />
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white text-sm font-medium hover:text-gray-300 transition-colors"
            aria-label={t('close')}
          >
            <span>{t('close')}</span>
            <span className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-6 flex flex-col gap-1">
          <Link href="/" onClick={onClose} className={linkClass('/')}>
            {t('home')}
          </Link>
          <Link href="/sobre-nos" onClick={onClose} className={linkClass('/sobre-nos')}>
            {t('about')}
          </Link>
          <Link href="/servicos" onClick={onClose} className={linkClass('/servicos')}>
            {t('services')}
          </Link>

          <div className="pt-1">
            <div className={`flex items-center gap-1 py-2 ${isActive('/projetos') ? 'text-white' : 'text-gray-400'}`}>
              <Link
                href="/projetos"
                onClick={onClose}
                className={`${linkClass('/projetos')} inline-block`}
              >
                {t('projects')}
              </Link>
              <button
                type="button"
                onClick={() => setProjectsOpen((o) => !o)}
                className="p-1 -m-1 text-gray-400 hover:text-gray-200 transition-colors shrink-0"
                aria-expanded={projectsOpen}
                aria-label={projectsOpen ? 'Fechar submenu' : 'Abrir submenu'}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${projectsOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {projectsOpen && (
              <div className="pl-4 mt-1 space-y-1 border-l border-gray-700 ml-2">
                {projectCategories.map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/${cat.key}`}
                    onClick={onClose}
                    className="block py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {tCat(cat.labelKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" onClick={onClose} className={linkClass('/blog')}>
            {t('blog')}
          </Link>
          <Link href="/contactos" onClick={onClose} className={linkClass('/contactos')}>
            {t('contact')}
          </Link>
        </nav>
      </div>
    </>
  );
}
