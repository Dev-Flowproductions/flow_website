import { Link } from '@/i18n/routing';

export type BreadcrumbItem = { name: string; href: string };

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            key={item.href}
            className="flex items-center gap-x-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <span aria-hidden className="text-gray-300">/</span>}
            {index < items.length - 1 ? (
              <Link href={item.href} className="hover:text-black transition-colors" itemProp="item">
                <span itemProp="name">{item.name}</span>
              </Link>
            ) : (
              <Link
                href={item.href}
                className="text-gray-700 font-medium no-underline cursor-default pointer-events-none"
                itemProp="item"
                aria-current="page"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
