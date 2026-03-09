'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type MobileMenuContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = useCallback((open: boolean) => setIsOpen(open), []);
  return (
    <MobileMenuContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) return { isOpen: false, setOpen: () => {} };
  return ctx;
}
