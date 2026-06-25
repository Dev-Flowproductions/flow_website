'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import {
  consumePendingScroll,
  defaultCenterForTarget,
  scrollToSection,
} from '@/lib/scrollToSection';

export default function HashScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = consumePendingScroll();
    const hashTarget = window.location.hash ? window.location.hash.slice(1) : null;
    const targetId = pending?.targetId ?? hashTarget;

    if (!targetId) return;

    const center = pending?.center ?? defaultCenterForTarget(targetId);

    if (hashTarget && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const timer = window.setTimeout(() => {
      scrollToSection(targetId, center);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
