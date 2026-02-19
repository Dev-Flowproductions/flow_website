'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import MainNav from './MainNav';
import MobileMenu from './MobileMenu';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale }: { locale: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDEDED] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex flex-col leading-tight">
              <span className="text-3xl font-bold tracking-tight">FLOW</span>
              <span className="text-[10px] tracking-widest uppercase">PRODUCTIONS</span>
            </div>
          </Link>

          {/* Center Navigation + CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <MainNav />
            <Link
              href="/contactos"
              className="px-6 py-2 border-2 border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
            >
              Flow With Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} locale={locale} />
    </header>
  );
}
