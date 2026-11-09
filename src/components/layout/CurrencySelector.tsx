'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/components/CurrencyProvider';
import { CurrencyCode } from '@/lib/currencies';
import { useLocale } from 'next-intl';
import FlagIcon from '@/components/ui/FlagIcon';

interface CurrencySelectorProps {
  variant?: 'header' | 'footer' | 'mobile' | 'topbar';
  className?: string;
}

export default function CurrencySelector({
  variant = 'header',
  className = '',
}: CurrencySelectorProps) {
  const { currentCurrency, currencyConfig, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isFrench = locale === 'fr';

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

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  // TopBar Variant (Left-anchored luxury glass pill in the ticker bar)
  if (variant === 'topbar') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white text-[12px] sm:text-[12.5px] font-semibold transition-all duration-150 cursor-pointer shadow-xs select-none backdrop-blur-md"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={isFrench ? "Changer de devise" : "Change currency"}
        >
          <span className="w-[18px] h-[13px] rounded-[2px] overflow-hidden shadow-xs flex items-center justify-center shrink-0 border border-white/25">
            <FlagIcon code={currencyConfig.flagCode} className="w-full h-full object-cover" />
          </span>
          <span className="font-mono tracking-wide text-xs font-bold text-white/95">{currencyConfig.code}</span>
          <span className="text-[#E8A63D] text-[11px] font-sans font-medium">({currencyConfig.symbol})</span>
          <svg
            className={`w-2.5 h-2.5 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#0E2036]/98 backdrop-blur-md border border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.8)] z-[9999] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {isFrench ? 'Sélectionner la devise' : 'Select currency'}
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {currencies.map((curr) => {
                const isSelected = curr.code === currentCurrency;
                const displayName = isFrench ? curr.nameFr : curr.nameEn;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelectCurrency(curr.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#C8732A]/25 text-[#E8A63D] font-bold'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-[20px] h-[14px] rounded-[2px] overflow-hidden shadow-sm shrink-0 flex items-center justify-center border border-white/15">
                        <FlagIcon code={curr.flagCode} className="w-full h-full object-cover" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold tracking-wider">{curr.code}</span>
                          <span className="text-white/60 text-[11px]">({curr.symbol})</span>
                        </div>
                        <span className="text-[11px] text-white/50 truncate font-sans">
                          {displayName}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A63D] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Header Variant (Compact luxury glass pill matching LanguageSelector)
  if (variant === 'header') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white text-[13px] font-semibold transition-all duration-150 cursor-pointer shadow-sm select-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={isFrench ? "Changer de devise" : "Change currency"}
        >
          <span className="w-[18px] h-[13px] rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-white/20">
            <FlagIcon code={currencyConfig.flagCode} className="w-full h-full object-cover" />
          </span>
          <span className="font-mono tracking-wide text-xs">{currencyConfig.code}</span>
          <span className="text-white/60 text-[11px] font-sans">({currencyConfig.symbol})</span>
          <svg
            className={`w-3 h-3 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0E2036]/95 backdrop-blur-md border border-white/15 shadow-2xl z-[9999] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {isFrench ? 'Sélectionner la devise' : 'Select currency'}
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {currencies.map((curr) => {
                const isSelected = curr.code === currentCurrency;
                const displayName = isFrench ? curr.nameFr : curr.nameEn;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelectCurrency(curr.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#C8732A]/25 text-[#E8A63D] font-bold'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-[20px] h-[14px] rounded-[2px] overflow-hidden shadow-sm shrink-0 flex items-center justify-center border border-white/15">
                        <FlagIcon code={curr.flagCode} className="w-full h-full object-cover" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold tracking-wider">{curr.code}</span>
                          <span className="text-white/60 text-[11px]">({curr.symbol})</span>
                        </div>
                        <span className="text-[11px] text-white/50 truncate font-sans">
                          {displayName}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A63D] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Drawer Variant
  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          {isFrench ? 'Devise' : 'Currency'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {currencies.map((curr) => {
            const isSelected = curr.code === currentCurrency;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleSelectCurrency(curr.code)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#C8732A]/10 border-[#C8732A] text-[#9C4E0F] font-bold'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="w-[20px] h-[14px] rounded-[2px] overflow-hidden shadow-xs shrink-0 flex items-center justify-center border border-gray-300">
                  <FlagIcon code={curr.flagCode} className="w-full h-full object-cover" />
                </span>
                <span className="font-mono">{curr.code}</span>
                <span className="text-gray-400 text-[11px]">({curr.symbol})</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Footer Variant
  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-medium transition-all"
      >
        <span className="w-[18px] h-[13px] rounded-[2px] overflow-hidden shadow-xs shrink-0 flex items-center justify-center border border-white/20">
          <FlagIcon code={currencyConfig.flagCode} className="w-full h-full object-cover" />
        </span>
        <span className="font-mono font-bold">{currencyConfig.code}</span>
        <span>({currencyConfig.symbol})</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-56 rounded-xl bg-[#0E2036] border border-white/15 shadow-2xl z-[9999] py-1">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => handleSelectCurrency(curr.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                curr.code === currentCurrency
                  ? 'bg-[#C8732A]/20 text-[#E8A63D] font-bold'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-[18px] h-[13px] rounded-[2px] overflow-hidden shadow-xs shrink-0 flex items-center justify-center border border-white/15">
                  <FlagIcon code={curr.flagCode} className="w-full h-full object-cover" />
                </span>
                <span className="font-mono font-bold">{curr.code}</span>
                <span className="text-white/50">({curr.symbol})</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

