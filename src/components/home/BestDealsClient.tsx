'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BestDealsCard from './BestDealsCard';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';
import { RotatingCoin, RotatingIngot } from '@/components/ui/RotatingPreciousIcons';

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  products: any[];
  btnText: string;
  btnUrl: string;
}

export interface BestDealsClientProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  cardBadge?: string;
  hideMobile?: boolean;
  metal: 'gold' | 'silver';
  tab1: TabConfig;
  tab2: TabConfig;
  colsDesktop?: string | number;
  colsTablet?: string | number;
  colsMobile?: string | number;
}

export default function BestDealsClient({
  badge,
  title,
  highlight,
  subtitle,
  cardBadge = 'Investissement',
  hideMobile = false,
  metal = 'gold',
  tab1,
  tab2,
  colsDesktop = '4',
  colsTablet = '2',
  colsMobile = '1',
}: BestDealsClientProps) {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
  const isSilver = metal === 'silver';

  const currentTab = activeTab === 'tab1' ? tab1 : tab2;

  const dCols = String(colsDesktop || '4');
  const tCols = String(colsTablet || '2');
  const mCols = String(colsMobile || '1');

  const mClass = mCols === '2' ? 'grid-cols-2' : 'grid-cols-1';
  const tClass = tCols === '4' ? 'sm:grid-cols-2 md:grid-cols-4' : tCols === '2' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3';
  let dClass = 'lg:grid-cols-5';
  if (dCols === '4') dClass = 'lg:grid-cols-4';
  else if (dCols === '3') dClass = 'lg:grid-cols-3';
  else if (dCols === '6') dClass = 'lg:grid-cols-6';
  else if (dCols === '2') dClass = 'lg:grid-cols-2';

  const gridColsClass = `${mClass} ${tClass} ${dClass}`;
  const gapClass = dCols === '5' || dCols === '6' ? 'gap-4 sm:gap-4 lg:gap-5' : 'gap-6';

  // Render title with gold/silver highlight if specified
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className={isSilver ? 'text-[#334155] underline decoration-slate-300 underline-offset-4' : 'text-[#b8860b]'}>
            {highlight}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section
      className={`relative w-full py-16 md:py-24 ${
        isSilver ? 'bg-[#FAFBFD]' : 'bg-white'
      } text-gray-900 overflow-hidden font-sans${hideMobile ? ' hidden sm:block' : ''}`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Centered Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow / Badge */}
          {badge && (
            <div className="flex items-center justify-center gap-3 mb-3">
              <div
                className={`w-10 sm:w-14 h-px ${
                  isSilver
                    ? 'bg-gradient-to-r from-transparent to-slate-400/70'
                    : 'bg-gradient-to-r from-transparent to-[#c59a3f]/70'
                }`}
              />
              <span
                className={`text-xs uppercase font-serif tracking-[0.25em] font-semibold select-none ${
                  isSilver ? 'text-slate-600' : 'text-[#b8860b]'
                }`}
              >
                {badge}
              </span>
              <div
                className={`w-10 sm:w-14 h-px ${
                  isSilver
                    ? 'bg-gradient-to-l from-transparent to-slate-400/70'
                    : 'bg-gradient-to-l from-transparent to-[#c59a3f]/70'
                }`}
              />
            </div>
          )}

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-[1.2]">
            {renderTitle()}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3.5 text-gray-600 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Luxury Tab Switcher Pills */}
          <div className="flex items-center justify-center mt-7 sm:mt-9">
            <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('tab1')}
                className={`relative flex items-center gap-2 sm:gap-2.5 px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none group ${
                  activeTab === 'tab1'
                    ? isSilver
                      ? 'bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-slate-500/40'
                      : 'bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] text-white shadow-md shadow-[#9C4E0F]/30 border border-[#E8A63D]/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab1.icon && tab1.icon !== '🪙' ? (
                  <span className="text-sm sm:text-base">{tab1.icon}</span>
                ) : (
                  <RotatingCoin
                    metal={isSilver ? 'silver' : 'gold'}
                    size={21}
                    isActive={activeTab === 'tab1'}
                  />
                )}
                <span>{tab1.label}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tab2')}
                className={`relative flex items-center gap-2 sm:gap-2.5 px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none group ${
                  activeTab === 'tab2'
                    ? isSilver
                      ? 'bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white shadow-md shadow-slate-900/20 border border-slate-500/40'
                      : 'bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] text-white shadow-md shadow-[#9C4E0F]/30 border border-[#E8A63D]/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab2.icon && tab2.icon !== '🧱' ? (
                  <span className="text-sm sm:text-base">{tab2.icon}</span>
                ) : (
                  <RotatingIngot
                    metal={isSilver ? 'silver' : 'gold'}
                    size={21}
                    isActive={activeTab === 'tab2'}
                  />
                )}
                <span>{tab2.label}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Products Grid with transition */}
        <div key={activeTab} className={`grid ${gridColsClass} ${gapClass} mt-10 md:mt-12 transition-opacity duration-300`}>
          {currentTab.products.map((product) => (
            <BestDealsCard
              key={`${activeTab}-${product.id}`}
              product={product}
              badge={product.badge || cardBadge}
            />
          ))}
        </div>

        {/* 3. Bottom CTA with Flanking Lines */}
        <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 flex items-center justify-center">
          <div
            className={`flex-1 h-px ${
              isSilver
                ? 'bg-gradient-to-r from-transparent via-slate-300 to-slate-400'
                : 'bg-gradient-to-r from-transparent via-[#c59a3f]/50 to-[#c59a3f]'
            }`}
          />

          <Link
            href={currentTab.btnUrl}
            className={`mx-4 sm:mx-8 px-8 py-3.5 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-2.5 group whitespace-nowrap shadow-lg hover:-translate-y-0.5 active:translate-y-0 select-none cursor-pointer ${
              isSilver
                ? 'bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] hover:from-[#334155] hover:to-[#1E293B] shadow-slate-900/25 border border-slate-500/40'
                : 'bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] shadow-[#9C4E0F]/30 border border-[#E8A63D]/40'
            }`}
          >
            <span>{currentTab.btnText}</span>
            <LuxuryArrow className="w-3.5 h-3.5 text-white/90 group-hover:text-white group-hover:translate-x-1" />
          </Link>

          <div
            className={`flex-1 h-px ${
              isSilver
                ? 'bg-gradient-to-l from-transparent via-slate-300 to-slate-400'
                : 'bg-gradient-to-l from-transparent via-[#c59a3f]/50 to-[#c59a3f]'
            }`}
          />
        </div>

      </div>
    </section>
  );
}

