'use client';

import type { ReactNode, MouseEvent } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import {
  defaultCenterForTarget,
  pathsMatch,
  queuePendingScroll,
  scrollToSection,
} from '@/lib/scrollToSection';

interface ScrollNavButtonProps {
  href: string;
  className?: string;
  center?: boolean;
  children: ReactNode;
}

export default function ScrollNavButton({
  href,
  className,
  center,
  children,
}: ScrollNavButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const hashIndex = href.indexOf('#');
    const pathPart = hashIndex === -1 ? href : href.slice(0, hashIndex);
    const targetId = hashIndex === -1 ? null : href.slice(hashIndex + 1);
    const shouldCenter = center ?? (targetId ? defaultCenterForTarget(targetId) : false);

    if (targetId && pathsMatch(pathname, pathPart)) {
      scrollToSection(targetId, shouldCenter);
      return;
    }

    if (targetId) {
      queuePendingScroll(targetId, shouldCenter);
    }

    router.push(href);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
