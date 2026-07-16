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
  const tMartech = useTranslations('martechNav');
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [martechOpen, setMartechOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const martechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const projectCategories = [
    { key: 'design',          labelKey: 'design'          },
    { key: 'marketing',       labelKey: 'marketing'       },
    { key: 'audiovisual',     labelKey: 'audiovisual'     },
    { key: 'animacao',        labelKey: 'animacao'        },
    { key: 'projetos-sociais', labelKey: 'projetosSociais' },
  ];

  const martechServices = [
    { key: 'aeo-seo-geo',          labelKey: 'aeoSeoGeo'        },
    { key: 'non-gated-demand-gen', labelKey: 'nonGatedDemandGen'},
    { key: 'go-to-market',         labelKey: 'goToMarket'       },
    { key: 'paid-media',           labelKey: 'paidMedia'        },
    { key: 'landing-pages',        labelKey: 'landingPages'     },
    { key: 'ai-agents',            labelKey: 'aiAgents'         },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProjectsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProjectsOpen(false), 200);
  };

  const handleMartechMouseEnter = () => {
    if (martechTimeoutRef.current) clearTimeout(martechTimeoutRef.current);
    setMartechOpen(true);
  };

  const handleMartechMouseLeave = () => {
    martechTimeoutRef.current = setTimeout(() => setMartechOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (martechTimeoutRef.current) clearTimeout(martechTimeoutRef.current);
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

      {/* MarTech with Dropdown */}
      <div
        className="relative flex items-center"
        onMouseEnter={handleMartechMouseEnter}
        onMouseLeave={handleMartechMouseLeave}
      >
        <Link
          href="/martech"
          className={`${navLinkClass('/martech', pathname)} flex items-center gap-1`}
        >
          {t('martech')}
        </Link>
        <button
          type="button"
          className="p-1 -ml-1 rounded hover:bg-black/5"
          aria-expanded={martechOpen}
          aria-label={`${t('martech')} submenu`}
          onClick={() => setMartechOpen((open) => !open)}
        >
          <svg
            className={`w-3 h-3 transition-transform ${martechOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {martechOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="w-64 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
              {martechServices.map((service) => (
                <Link
                  key={service.key}
                  href={`/martech/${service.key}`}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMartechOpen(false)}
                >
                  {tMartech(service.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects with Dropdown */}
      <div
        className="relative flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href="/projetos"
          className={`${navLinkClass('/projetos', pathname)} flex items-center gap-1`}
        >
          {t('projects')}
        </Link>
        <button
          type="button"
          className="p-1 -ml-1 rounded hover:bg-black/5"
          aria-expanded={projectsOpen}
          aria-label={`${t('projects')} submenu`}
          onClick={() => setProjectsOpen((open) => !open)}
        >
          <svg
            className={`w-3 h-3 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {projectsOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="w-56 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
              {projectCategories.map((category) => (
                <Link
                  key={category.key}
                  href={`/${category.key}`}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setProjectsOpen(false)}
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
      <Link href="/ecoris" className={navLinkClass('/ecoris', pathname)}>
        {t('ecoris')}
      </Link>
    </nav>
  );
}
