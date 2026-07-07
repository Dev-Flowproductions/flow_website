'use client';

import Script from 'next/script';
import { usePathname } from '@/i18n/routing';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_GA4_MEASUREMENT_ID = 'G-1051059133566371';

function resolveMeasurementId(rawId: string | undefined): string | undefined {
  if (!rawId) {
    return DEFAULT_GA4_MEASUREMENT_ID;
  }

  const trimmed = rawId.trim();
  if (!trimmed) {
    return DEFAULT_GA4_MEASUREMENT_ID;
  }

  if (/^(G|GT|AW|DC)-/.test(trimmed)) {
    return trimmed;
  }

  return `G-${trimmed}`;
}

/**
 * GA4 / Google tag ID (format `G-XXXXXXXXXX`), from:
 * Admin → Property → Data streams → Web → Measurement ID.
 *
 * Override in hosting env via `NEXT_PUBLIC_GA4_MEASUREMENT_ID` if needed.
 */
export default function GoogleAnalytics() {
  const measurementId = resolveMeasurementId(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
  const pathname = usePathname();
  const isFirstPathEffect = useRef(true);

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return;

    const path = `${window.location.pathname}${window.location.search}`;
    if (isFirstPathEffect.current) {
      isFirstPathEffect.current = false;
      return;
    }

    const gtag = window.gtag;
    if (typeof gtag !== 'function') return;
    gtag('config', measurementId, { page_path: path });
  }, [pathname, measurementId]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname + window.location.search,
          });
        `}
      </Script>
    </>
  );
}
