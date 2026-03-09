'use client';

import dynamic from 'next/dynamic';

const SGAChatWidget = dynamic(
  () => import('@/components/widgets/SGAChatWidget'),
  { ssr: false }
);

export default function SGAChatWidgetLoader() {
  return <SGAChatWidget />;
}
