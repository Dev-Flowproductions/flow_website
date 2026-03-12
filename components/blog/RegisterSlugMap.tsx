'use client';

import { useEffect } from 'react';
import { useSlugMap } from '@/components/context/SlugMapContext';

export default function RegisterSlugMap({ slugMap }: { slugMap: Record<string, string> }) {
  const { setSlugMap } = useSlugMap();

  useEffect(() => {
    setSlugMap(slugMap);
    return () => setSlugMap(null);
  }, [slugMap, setSlugMap]);

  return null;
}
