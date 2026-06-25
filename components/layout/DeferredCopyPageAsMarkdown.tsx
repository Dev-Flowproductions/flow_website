'use client';

import dynamic from 'next/dynamic';

const CopyPageAsMarkdown = dynamic(
  () => import('@/components/layout/CopyPageAsMarkdown'),
  { ssr: false }
);

export default function DeferredCopyPageAsMarkdown() {
  return <CopyPageAsMarkdown />;
}
