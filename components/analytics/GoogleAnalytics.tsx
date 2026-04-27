'use client';

import Script from 'next/script';
import { usePathname } from '@/i18n/routing';
import { useEffect, useRef } from 'react';

/**
 * GA4 web stream Measurement ID (format `G-XXXXXXXXXX`), from:
 * Admin → Property → Data streams → Web → Measurement ID.
 * This is NOT the numeric Property ID (e.g. 393702295) shown in the account picker.
 *
 * Set in hosting env as `NEXT_PUBLIC_GA4_MEASUREMENT_ID` and redeploy — if unset,
 * this component renders nothing and no hits are sent.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const pathname = usePathname();
  const isFirstPathEffect = useRef(true);

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return;

    const path = `${window.location.pathname}${window.location.search}`;
    if (isFirstPathEffect.current) {
      isFirstPathEffect.current = false;
      return;
    }

    if (typeof window.gtag !== 'function') return;
    window.gtag('config', measurementId, { page_path: path });
  }, [pathname, measurementId]);

  if (!measurementId) {
    return null;
  }

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
