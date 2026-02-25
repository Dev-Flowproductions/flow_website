'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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
  const t    = useTranslations('nav');
  const tCat = useTranslations('categories');

  const projectCategories = [
    { key: 'design',           labelKey: 'design'          },
    { key: 'marketing',        labelKey: 'marketing'       },
    { key: 'audiovisual',      labelKey: 'audiovisual'     },
    { key: 'animacao',         labelKey: 'animacao'        },
    { key: 'projetos-sociais', labelKey: 'projetosSociais' },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6">
      <nav className="flex flex-col space-y-4">
        <Link
          href="/"
          onClick={onClose}
          className="text-lg font-medium hover:text-gray-600 transition-colors"
        >
          {t('home')}
        </Link>
        <Link
          href="/sobre-nos"
          onClick={onClose}
          className="text-lg font-medium hover:text-gray-600 transition-colors"
        >
          {t('about')}
        </Link>
        <Link
          href="/servicos"
          onClick={onClose}
          className="text-lg font-medium hover:text-gray-600 transition-colors"
        >
          {t('services')}
        </Link>

        <div>
          <Link
            href="/projetos"
            onClick={onClose}
            className="text-lg font-medium hover:text-gray-600 transition-colors block mb-2"
          >
            {t('projects')}
          </Link>
          <div className="pl-4 space-y-2">
            {projectCategories.map((cat) => (
              <Link
                key={cat.key}
                href={`/${cat.key}`}
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-black block"
              >
                {tCat(cat.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/blog"
          onClick={onClose}
          className="text-lg font-medium hover:text-gray-600 transition-colors"
        >
          {t('blog')}
        </Link>
        <Link
          href="/contactos"
          onClick={onClose}
          className="text-lg font-medium hover:text-gray-600 transition-colors"
        >
          {t('contact')}
        </Link>

        <div className="pt-4 border-t border-gray-200">
          <LocaleSwitcher locale={locale} />
        </div>
      </nav>
    </div>
  );
}
