'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import CurrencySelector from './CurrencySelector';

interface MetalPrices {
  goldEur: number;
  silverEur: number;
  goldChange: string;
  silverChange: string;
}

const DEFAULT_PRICES: MetalPrices = {
  goldEur: 3471.70,
  silverEur: 44.11,
  goldChange: '+0,42%',
  silverChange: '+1,12%',
};

interface CurrencyConfig {
  code: string;
  label: string;
  rate: number;
  formatGold: (eur: number) => string;
  formatSilver: (eur: number) => string;
}

const CURRENCIES: CurrencyConfig[] = [
  {
    code: 'EUR',
    label: 'EUR (€)',
    rate: 1,
    formatGold: (v) => `${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
    formatSilver: (v) => `${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
  },
  {
    code: 'DKK',
    label: 'DKK (kr.)',
    rate: 7.46,
    formatGold: (v) => `${Math.round(v * 7.46).toLocaleString('fr-FR')} DKK`,
    formatSilver: (v) => `${(v * 7.46).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DKK`,
  },
  {
    code: 'HUF',
    label: 'FORINT (Ft)',
    rate: 410.5,
    formatGold: (v) => `${Math.round(v * 410.5).toLocaleString('fr-FR')} Ft`,
    formatSilver: (v) => `${Math.round(v * 410.5).toLocaleString('fr-FR')} Ft`,
  },
  {
    code: 'GBP',
    label: 'GBP (£)',
    rate: 0.835,
    formatGold: (v) => `${(v * 0.835).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} £`,
    formatSilver: (v) => `${(v * 0.835).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} £`,
  },
  {
    code: 'USD',
    label: 'USD ($)',
    rate: 1.085,
    formatGold: (v) => `${(v * 1.085).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`,
    formatSilver: (v) => `${(v * 1.085).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`,
  },
  {
    code: 'CAD',
    label: 'CAD (C$)',
    rate: 1.498,
    formatGold: (v) => `${(v * 1.498).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} C$`,
    formatSilver: (v) => `${(v * 1.498).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} C$`,
  },
];

export default function TopBarTicker() {
  const t = useTranslations('TopBar');
  const [prices, setPrices] = useState<MetalPrices>(DEFAULT_PRICES);

  useEffect(() => {
    // Live prices from /api/metals
    fetch('/api/metals')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.gold && data.silver) {
          setPrices({
            goldEur: data.gold.priceOz || DEFAULT_PRICES.goldEur,
            silverEur: data.silver.priceOz || DEFAULT_PRICES.silverEur,
            goldChange: data.gold.change || '+0,42%',
            silverChange: data.silver.change || '+1,12%',
          });
        }
      })
      .catch(() => {
        // Fallback already in place
      });
  }, []);

  const renderCurrencyItems = (keyPrefix: string) => {
    return CURRENCIES.map((cur) => (
      <div key={`${keyPrefix}-${cur.code}`} className="inline-flex items-center gap-4 sm:gap-6 px-4">
        {/* Currency Tag */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[#E8A63D] font-mono text-[10.5px] font-bold tracking-wider uppercase select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A] animate-pulse" />
          {cur.label}
        </span>

        {/* Gold item */}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="text-white/60 font-medium">{t('gold')}</span>
          <span className="font-semibold text-white tracking-wide">
            {cur.formatGold(prices.goldEur)}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            ▲ {prices.goldChange}
          </span>
        </div>

        <span className="text-white/20 text-xs">|</span>

        {/* Silver item */}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="text-white/60 font-medium">{t('silver')}</span>
          <span className="font-semibold text-white tracking-wide">
            {cur.formatSilver(prices.silverEur)}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            ▲ {prices.silverChange}
          </span>
        </div>

        {/* Diamond separator */}
        <span className="text-[#E8A63D]/40 text-[10px] select-none mx-2">◆</span>
      </div>
    ));
  };

  return (
    <div className="w-full bg-[#0B1A2C] text-gray-200 border-b border-white/10 overflow-visible py-1.5 sm:py-2 select-none relative z-50">
      
      {/* 1. FOREGROUND PINNED CURRENCY SELECTOR (Positioned in front, with smooth luxury fade gradient) */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-3 sm:pl-6 pr-6 sm:pr-10 bg-gradient-to-r from-[#0B1A2C] via-[#0B1A2C] via-75% to-transparent pointer-events-auto">
        <CurrencySelector variant="topbar" />
      </div>

      {/* 2. BACKGROUND MARQUEE TICKER (Passes smoothly behind the currency selector) */}
      <div className="w-full overflow-hidden pl-28 sm:pl-36">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {/* First loop copy */}
          <div className="flex items-center">
            {renderCurrencyItems('loop1')}
          </div>
          {/* Second loop copy for infinite seamless repeat */}
          <div className="flex items-center" aria-hidden="true">
            {renderCurrencyItems('loop2')}
          </div>
        </div>
      </div>

      {/* 3. Subtle right fade edge */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0B1A2C] to-transparent pointer-events-none z-10" />

    </div>
  );
}
