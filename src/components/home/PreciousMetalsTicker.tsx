'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PreciousMetalsTickerProps {
  config?: Record<string, any>;
}

export default function PreciousMetalsTicker({ config }: PreciousMetalsTickerProps) {
  const c = config || {};

  const isManual = c.mode === 'manual';
  const title = c.title || 'Cours des métaux précieux';
  const subtitle = c.subtitle || 'Actualisé en temps réel';
  const btnText = c.btnText || 'Voir les cours en détail';
  const btnUrl = c.btnUrl || '/shop';

  // Unit toggle: 'oz' or 'g'
  const [unit, setUnit] = useState<'oz' | 'g'>((c.defaultUnit as 'oz' | 'g') || 'oz');

  // Live data state
  const [liveData, setLiveData] = useState<{
    goldOz: string;
    goldGram: string;
    goldChange: string;
    silverOz: string;
    silverGram: string;
    silverChange: string;
    lastUpdated: string;
  }>({
    goldOz: c.gold_price || '€ 2 720,45',
    goldGram: '€ 87,46',
    goldChange: c.gold_change || '+0,42%',
    silverOz: c.silver_price || '€ 32,17',
    silverGram: '€ 1,03',
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
            goldOz: data.gold.priceFormatted,
            goldGram: data.gold.priceGram.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €',
            goldChange: data.gold.change,
            silverOz: data.silver.priceFormatted,
            silverGram: data.silver.priceGram.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €',
            silverChange: data.silver.change,
            lastUpdated: data.updatedAtFormatted || '',
          });
        }
      } catch (e) {
        // Silently use cached/default fallback values
      }
    };

    fetchPrices();
    // Auto-refresh every 60s
    const interval = setInterval(fetchPrices, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isManual]);

  const displayGoldPrice = isManual 
    ? (c.gold_price || '€ 2 720,45') 
    : (unit === 'oz' ? liveData.goldOz : liveData.goldGram);
    
  const displaySilverPrice = isManual 
    ? (c.silver_price || '€ 32,17') 
    : (unit === 'oz' ? liveData.silverOz : liveData.silverGram);

  const displayGoldChange = isManual ? (c.gold_change || '+0,42%') : liveData.goldChange;
  const displaySilverChange = isManual ? (c.silver_change || '+1,12%') : liveData.silverChange;

  // Design configs
  const bgColor = c.bgColor || '#fcfbf9';
  const showCharts = c.showCharts !== false && c.showCharts !== 'false';

  return (
    <section className="w-full py-8 md:py-12 transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Label with Trending Icon and Live badge */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-[#c59a3f]/10 text-[#c59a3f] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  {title}
                </span>
                {!isManual && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En direct
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {subtitle} {liveData.lastUpdated && !isManual ? `(${liveData.lastUpdated})` : ''}
              </p>
            </div>
          </div>

          {/* Unit Switcher & Tickers */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-6 md:gap-10 w-full lg:w-auto">
            
            {/* Unit selector buttons (Oz / Gramme) */}
            {!isManual && (
              <div className="inline-flex rounded-lg bg-gray-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnit('oz')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    unit === 'oz' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  1 oz
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('g')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    unit === 'g' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  1 g
                </button>
              </div>
            )}

            {/* Gold Ticker */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                  Or ({unit === 'oz' ? '1 oz' : '1 g'})
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg md:text-xl font-extrabold text-gray-900 font-sans tracking-tight">
                    {displayGoldPrice}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ▲ {displayGoldChange}
                  </span>
                </div>
              </div>

              {/* Gold Mini Sparkline Chart */}
              {showCharts && (
                <div className="w-20 h-10 hidden sm:block">
                  <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="goldSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c59a3f" stopOpacity="0.3" />
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

            <div className="hidden sm:block w-[1px] h-10 bg-gray-200" />

            {/* Silver Ticker */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                  Argent ({unit === 'oz' ? '1 oz' : '1 g'})
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg md:text-xl font-extrabold text-gray-900 font-sans tracking-tight">
                    {displaySilverPrice}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ▲ {displaySilverChange}
                  </span>
                </div>
              </div>

              {/* Silver Mini Sparkline Chart */}
              {showCharts && (
                <div className="w-20 h-10 hidden sm:block">
                  <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="silverSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 32 Q 30 20 50 28 T 85 12 L 100 6 L 100 45 L 0 45 Z" 
                      fill="url(#silverSparkGrad)" 
                    />
                    <path 
                      d="M 0 32 Q 30 20 50 28 T 85 12 L 100 6" 
                      fill="none" 
                      stroke="#9ca3af" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
              )}
            </div>

          </div>

          {/* CTA Action */}
          <div className="flex-shrink-0">
            <Link 
              href={btnUrl} 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-[#c59a3f] text-gray-700 hover:text-[#c59a3f] font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-[#c59a3f]/5 cursor-pointer"
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
