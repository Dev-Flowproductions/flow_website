'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type SlugMapContextValue = {
  slugMap: Record<string, string> | null;
  setSlugMap: (map: Record<string, string> | null) => void;
};

const SlugMapContext = createContext<SlugMapContextValue>({
  slugMap: null,
  setSlugMap: () => {},
});

export function SlugMapProvider({ children }: { children: ReactNode }) {
  const [slugMap, setSlugMapState] = useState<Record<string, string> | null>(null);
  const setSlugMap = useCallback((map: Record<string, string> | null) => setSlugMapState(map), []);
  return (
    <SlugMapContext.Provider value={{ slugMap, setSlugMap }}>
      {children}
    </SlugMapContext.Provider>
  );
}

export function useSlugMap() {
  return useContext(SlugMapContext);
}
