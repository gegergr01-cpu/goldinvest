'use client';

import React from 'react';
import Link from 'next/link';

export default function PreciousMetalsTicker() {
  return (
    <section className="w-full bg-[#fcfbf9] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Label with Trending Icon */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-[#c59a3f]/10 text-[#c59a3f] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Cours des métaux précieux
              </span>
              <p className="text-xs text-gray-400">Actualisé en temps réel</p>
            </div>
          </div>

          {/* Gold & Silver Tickers */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-8 md:gap-14 w-full lg:w-auto">
            
            {/* Gold Ticker */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                  Or (1 oz)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg md:text-xl font-extrabold text-gray-900 font-sans">
                    € 2 720,45
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ▲ +0,42%
                  </span>
                </div>
              </div>

              {/* Gold Mini Sparkline Chart */}
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
            </div>

            <div className="hidden sm:block w-[1px] h-10 bg-gray-200" />

            {/* Silver Ticker */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                  Argent (1 oz)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg md:text-xl font-extrabold text-gray-900 font-sans">
                    € 32,17
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ▲ +1,12%
                  </span>
                </div>
              </div>

              {/* Silver Mini Sparkline Chart */}
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
            </div>

          </div>

          {/* CTA Action */}
          <div className="flex-shrink-0">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-[#c59a3f] text-gray-700 hover:text-[#c59a3f] font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-[#c59a3f]/5 cursor-pointer"
            >
              <span>Voir les cours en détail</span>
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

