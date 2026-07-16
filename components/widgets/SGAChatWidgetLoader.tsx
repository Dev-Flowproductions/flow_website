'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { installOpenSgaChatBridge } from '@/lib/openSgaChat';

const SGAChatWidget = dynamic(
  () => import('@/components/widgets/SGAChatWidget'),
  { ssr: false }
);

export default function SGAChatWidgetLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return installOpenSgaChatBridge();
  }, []);

  useEffect(() => {
    const enable = () => setReady(true);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 3500 });
      return () => window.cancelIdleCallback(id);
    }

    const timeoutId = setTimeout(enable, 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!ready) {
    return null;
  }

  return <SGAChatWidget />;
}
