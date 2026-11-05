'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SUPPORTED_LOCALES, LOCALE_DETAILS, type Locale } from '@/i18n/config';
import FlagIcon from '@/components/ui/FlagIcon';

interface LanguageSelectorProps {
  currentLocale?: string;
  variant?: 'header' | 'footer' | 'mobile';
  className?: string;
}

export default function LanguageSelector({
  currentLocale,
  variant = 'header',
  className = '',
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect current active locale from prop or pathname
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeCode: Locale = (pathMatch && (SUPPORTED_LOCALES as readonly string[]).includes(pathMatch[1]))
    ? (pathMatch[1] as Locale)
    : ((currentLocale && (SUPPORTED_LOCALES as readonly string[]).includes(currentLocale))
      ? (currentLocale as Locale)
      : 'fr');

  const activeDetail = LOCALE_DETAILS[activeCode] || LOCALE_DETAILS.fr;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (targetLocale: Locale) => {
    if (targetLocale === activeCode) {
      setIsOpen(false);
      return;
    }

    // Set cookie
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Compute new URL
    const currentPath = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const regex = new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(?=/|$)`);
    let newPath = currentPath;

    if (regex.test(currentPath)) {
      newPath = currentPath.replace(regex, `/${targetLocale}`);
    } else {
      newPath = `/${targetLocale}${currentPath === '/' ? '' : currentPath}`;
    }

    setIsOpen(false);
    window.location.href = `${newPath}${search}${hash}`;
  };

  // Header Variant (Compact luxury glass pill)
  if (variant === 'header') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white text-[13px] font-semibold transition-all duration-150 cursor-pointer shadow-sm select-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Changer de langue / Change language"
        >
          <span className="w-[18px] h-[13px] rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-white/20">
            <FlagIcon code={activeCode} className="w-full h-full object-cover" />
          </span>
          <span className="font-mono text-xs tracking-wider uppercase text-white/90">{activeDetail.code}</span>
          <svg
            className={`w-3 h-3 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0E2036] border border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.7)] py-2 z-[9999] text-white divide-y divide-white/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3.5 py-1.5 text-[10.5px] font-mono tracking-wider text-white/50 uppercase">
              Sélectionnez une langue
            </div>
            <div className="py-1 max-h-80 overflow-y-auto">
              {SUPPORTED_LOCALES.map((loc) => {
                const detail = LOCALE_DETAILS[loc];
                const isCurrent = loc === activeCode;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelectLanguage(loc)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${isCurrent
                        ? 'bg-[#C8732A]/25 text-[#E8A63D] font-bold'
                        : 'hover:bg-white/10 text-white/85 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-[20px] h-[14px] rounded-[2px] overflow-hidden shadow-sm shrink-0 flex items-center justify-center border border-white/15">
                        <FlagIcon code={loc} className="w-full h-full object-cover" />
                      </span>
                      <span className="text-xs font-medium">{detail.nativeName}</span>
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      {detail.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Footer Variant (Grid of flags & languages)
  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2 select-none ${className}`}>
        {SUPPORTED_LOCALES.map((loc) => {
          const detail = LOCALE_DETAILS[loc];
          const isCurrent = loc === activeCode;
          return (
            <button
              key={loc}
              onClick={() => handleSelectLanguage(loc)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${isCurrent
                  ? 'bg-[#C8732A] text-white font-bold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                }`}
              title={detail.nativeName}
            >
              <span className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 flex items-center justify-center border border-white/15">
                <FlagIcon code={loc} className="w-full h-full object-cover" />
              </span>
              <span className="uppercase text-[11px] font-mono tracking-wider">{detail.code}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Mobile Drawer Variant (Horizontal scroll or clean list)
  return (
    <div className={`w-full py-2 select-none ${className}`}>
      <div className="text-[11px] font-mono tracking-wider text-white/50 uppercase mb-2">
        Langue / Language
      </div>
      <div className="grid grid-cols-3 gap-2">
        {SUPPORTED_LOCALES.map((loc) => {
          const detail = LOCALE_DETAILS[loc];
          const isCurrent = loc === activeCode;
          return (
            <button
              key={loc}
              onClick={() => handleSelectLanguage(loc)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs transition-all cursor-pointer ${isCurrent
                  ? 'bg-[#C8732A] text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
            >
              <span className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 flex items-center justify-center border border-white/15">
                <FlagIcon code={loc} className="w-full h-full object-cover" />
              </span>
              <span className="uppercase font-mono text-[11px]">{detail.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
