'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PreciousMetalsTickerProps {
  config?: Record<string, any>;
}

// Cleans any price string to extract numbers, decimal commas/points
function formatCleanPrice(val: string | number): string {
  if (typeof val === 'number') {
    return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (!val) return '0,00';
  const cleaned = String(val).replace(/[^\d,\.\s]/g, '').trim();
  return cleaned || '0,00';
}

export default function PreciousMetalsTicker({ config }: PreciousMetalsTickerProps) {
  const c = config || {};

  const isManual = c.mode === 'manual';
  const title = c.title || 'Cours des métaux précieux';
  const subtitle = c.subtitle || 'Actualisé en temps réel';
  const btnText = c.btnText || 'Voir les cours en détail';
  const btnUrl = c.btnUrl || '/shop';

  // Unit toggle: 'oz' (Once de Troy) or 'g' (Gramme)
  const [unit, setUnit] = useState<'oz' | 'g'>((c.defaultUnit as 'oz' | 'g') || 'oz');

  // Live real-time market data state
  const [liveData, setLiveData] = useState<{
    goldOz: string;
    goldGram: string;
    goldChange: string;
    silverOz: string;
    silverGram: string;
    silverChange: string;
    lastUpdated: string;
  }>({
    goldOz: c.gold_price || '3 471,70',
    goldGram: '111,62',
    goldChange: c.gold_change || '+0,42%',
    silverOz: c.silver_price || '44,11',
    silverGram: '1,42',
    silverChange: c.silver_change || '+1,12%',
    lastUpdated: '',
  });

  useEffect(() => {
    if (isManual) return;

    let isMounted = true;

    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/metals');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success && isMounted) {
          setLiveData({
            goldOz: String(data.gold.priceOz ? data.gold.priceOz.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.gold.priceFormatted),
            goldGram: String(data.gold.priceGram ? data.gold.priceGram.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '111,62'),
            goldChange: data.gold.change || '+0,42%',
            silverOz: String(data.silver.priceOz ? data.silver.priceOz.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.silver.priceFormatted),
            silverGram: String(data.silver.priceGram ? data.silver.priceGram.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '1,42'),
            silverChange: data.silver.change || '+1,12%',
            lastUpdated: data.updatedAtFormatted || '',
          });
        }
      } catch {
        // Silently preserve current values
      }
    };

    fetchPrices();
    // Auto-refresh spot prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isManual]);

  const rawGoldPrice = isManual 
    ? (c.gold_price || '3 471,70') 
    : (unit === 'oz' ? liveData.goldOz : liveData.goldGram);
    
  const rawSilverPrice = isManual 
    ? (c.silver_price || '44,11') 
    : (unit === 'oz' ? liveData.silverOz : liveData.silverGram);

  const displayGoldPrice = formatCleanPrice(rawGoldPrice);
  const displaySilverPrice = formatCleanPrice(rawSilverPrice);

  const displayGoldChange = (isManual ? (c.gold_change || '+0,42%') : liveData.goldChange)
    .replace(/^[▲▼\s]+/, '')
    .trim();

  const displaySilverChange = (isManual ? (c.silver_change || '+1,12%') : liveData.silverChange)
    .replace(/^[▲▼\s]+/, '')
    .trim();

  // Design configs
  const bgColor = c.bgColor || '#fcfbf9';
  const showCharts = c.showCharts !== false && c.showCharts !== 'false';

  return (
    <section className="w-full py-6 md:py-10 transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main luxury card container */}
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-[0_4px_24px_-4px_rgba(197,154,63,0.10)] p-4 sm:p-6 md:px-8 flex flex-col xl:flex-row items-center justify-between gap-5 md:gap-7">
          
          {/* 1. Header Title & Live Badge */}
          <div className="flex items-center gap-3.5 flex-shrink-0 w-full xl:w-auto justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f8f1de] to-[#eed89f] text-[#9b7628] flex items-center justify-center flex-shrink-0 shadow-xs border border-[#e6c986]/40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
                  {title}
                </span>
                {!isManual && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    En direct
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {subtitle} {liveData.lastUpdated && !isManual ? `(${liveData.lastUpdated})` : ''}
              </p>
            </div>
          </div>

          {/* 2. Middle Row: Unit Toggle + Gold + Divider + Silver */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between xl:justify-center gap-5 sm:gap-8 md:gap-10 w-full xl:w-auto">
            
            {/* Unit selector pill [ 1 oz | 1 g ] */}
            {!isManual && (
              <div className="inline-flex items-center rounded-xl bg-gray-100 p-1 text-xs font-semibold flex-shrink-0 border border-gray-200/70 shadow-inner">
                <button
                  type="button"
                  onClick={() => setUnit('oz')}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap select-none cursor-pointer ${
                    unit === 'oz'
                      ? 'bg-white text-gray-900 shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Afficher en Once troy (31,10 g)"
                >
                  1&nbsp;oz
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('g')}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap select-none cursor-pointer ${
                    unit === 'g'
                      ? 'bg-white text-gray-900 shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Afficher en Gramme"
                >
                  1&nbsp;g
                </button>
              </div>
            )}

            {/* Gold Spot Price */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#c59a3f]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/70">
                    Or ({unit === 'oz' ? '1 oz' : '1 g'})
                  </span>
                </div>
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
                    {displayGoldPrice}&nbsp;€
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                    ▲ +{displayGoldChange.replace('+', '')}
                  </span>
                </div>
              </div>

              {/* Gold Mini Sparkline */}
              {showCharts && (
                <div className="w-16 sm:w-20 h-9 hidden sm:block flex-shrink-0">
                  <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="goldSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c59a3f" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#c59a3f" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 35 Q 25 38 45 22 T 80 15 L 100 8 L 100 45 L 0 45 Z" 
                      fill="url(#goldSparkGrad)" 
                    />
                    <path 
                      d="M 0 35 Q 25 38 45 22 T 80 15 L 100 8" 
                      fill="none" 
                      stroke="#c59a3f" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-10 bg-gray-200 flex-shrink-0" />

            {/* Silver Spot Price */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Argent ({unit === 'oz' ? '1 oz' : '1 g'})
                  </span>
                </div>
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
                    {displaySilverPrice}&nbsp;€
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                    ▲ +{displaySilverChange.replace('+', '')}
                  </span>
                </div>
              </div>

              {/* Silver Mini Sparkline */}
              {showCharts && (
                <div className="w-16 sm:w-20 h-9 hidden sm:block flex-shrink-0">
                  <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="silverSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 32 Q 30 20 50 28 T 85 12 L 100 6 L 100 45 L 0 45 Z" 
                      fill="url(#silverSparkGrad)" 
                    />
                    <path 
                      d="M 0 32 Q 30 20 50 28 T 85 12 L 100 6" 
                      fill="none" 
                      stroke="#64748b" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
              )}
            </div>

          </div>

          {/* 3. CTA Action Link Button */}
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-center xl:justify-end">
            <Link 
              href={btnUrl} 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-[#c59a3f] bg-white hover:bg-[#c59a3f]/5 text-gray-800 hover:text-[#c59a3f] font-semibold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>{btnText}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
