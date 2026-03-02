'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const navLinkBase =
  'text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full';

function navLinkClass(href: string, pathname: string): string {
  const isHome = href === '/';
  const isProjects = href === '/projetos';
  const isProjectCategory =
    pathname === '/design' ||
    pathname === '/marketing' ||
    pathname === '/audiovisual' ||
    pathname === '/animacao' ||
    pathname === '/projetos-sociais';

  let active = false;
  if (isHome) active = pathname === '/' || pathname === '';
  else if (isProjects) active = pathname === '/projetos' || isProjectCategory;
  else active = pathname === href || pathname.startsWith(href + '/');

  const showLine = active ? 'after:w-full' : 'after:w-0';
  return `${navLinkBase} ${showLine}`;
}

export default function MainNav() {
  const t = useTranslations('nav');
  const tCat = useTranslations('categories');
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const projectCategories = [
    { key: 'design',          labelKey: 'design'          },
    { key: 'marketing',       labelKey: 'marketing'       },
    { key: 'audiovisual',     labelKey: 'audiovisual'     },
    { key: 'animacao',        labelKey: 'animacao'        },
    { key: 'projetos-sociais', labelKey: 'projetosSociais' },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProjectsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProjectsOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="flex items-center space-x-8">
      <Link href="/" className={navLinkClass('/', pathname)}>
        {t('home')}
      </Link>
      <Link href="/sobre-nos" className={navLinkClass('/sobre-nos', pathname)}>
        {t('about')}
      </Link>
      <Link href="/servicos" className={navLinkClass('/servicos', pathname)}>
        {t('services')}
      </Link>

      {/* Projects with Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href="/projetos"
          className={`${navLinkClass('/projetos', pathname)} flex items-center gap-1`}
        >
          {t('projects')}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        {projectsOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="w-56 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
              {projectCategories.map((category) => (
                <Link
                  key={category.key}
                  href={`/${category.key}`}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {tCat(category.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link href="/blog" className={navLinkClass('/blog', pathname)}>
        {t('blog')}
      </Link>
    </nav>
  );
}
