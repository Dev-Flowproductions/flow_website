'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('nav');
  const tCat = useTranslations('categories');
  const pathname = usePathname();

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
    `text-lg font-medium transition-colors ${
      isActive(href) ? 'text-black border-b-2 border-black pb-0.5' : 'hover:text-gray-600'
    }`;

  const projectCategories = [
    { key: 'design',           labelKey: 'design'          },
    { key: 'marketing',        labelKey: 'marketing'       },
    { key: 'audiovisual',      labelKey: 'audiovisual'     },
    { key: 'animacao',         labelKey: 'animacao'        },
    { key: 'projetos-sociais', labelKey: 'projetosSociais' },
  ];

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 top-20 bg-white z-[9999] p-6 overflow-y-auto">
      <nav className="flex flex-col space-y-4">
        <Link href="/" onClick={onClose} className={linkClass('/')}>
          {t('home')}
        </Link>
        <Link href="/sobre-nos" onClick={onClose} className={linkClass('/sobre-nos')}>
          {t('about')}
        </Link>
        <Link href="/servicos" onClick={onClose} className={linkClass('/servicos')}>
          {t('services')}
        </Link>

        <div>
          <Link
            href="/projetos"
            onClick={onClose}
            className={`${linkClass('/projetos')} block mb-2`}
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

        <Link href="/blog" onClick={onClose} className={linkClass('/blog')}>
          {t('blog')}
        </Link>
        <Link href="/contactos" onClick={onClose} className={linkClass('/contactos')}>
          {t('contact')}
        </Link>

      </nav>
    </div>
  );
}
