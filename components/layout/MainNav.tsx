'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

export default function MainNav() {
  const t = useTranslations('nav');
  const [projectsOpen, setProjectsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const projectCategories = [
    { key: 'design', label: 'Design' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'audiovisual', label: 'Audiovisual' },
    { key: 'animacao', label: 'Animação' },
    { key: 'projetos-sociais', label: 'Projetos Sociais' },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setProjectsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setProjectsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="flex items-center space-x-8">
      <Link
        href="/"
        className="text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
      >
        {t('home')}
      </Link>
      <Link
        href="/sobre-nos"
        className="text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
      >
        {t('about')}
      </Link>
      <Link
        href="/servicos"
        className="text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
      >
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
          className="text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full flex items-center gap-1"
        >
          {t('projects')}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        {/* Dropdown Menu */}
        {projectsOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="w-56 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
            {projectCategories.map((category) => (
              <Link
                key={category.key}
                href={`/${category.key}`}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {category.label}
              </Link>
            ))}
            </div>
          </div>
        )}
      </div>

      <Link
        href="/blog"
        className="text-sm font-medium hover:text-gray-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
      >
        {t('blog')}
      </Link>
    </nav>
  );
}
