'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { HeroDailyCard } from '@/types/heroCards';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

interface GoldHeroProps {
  config?: Record<string, any>;
  dailyCards?: HeroDailyCard[];
}

function CategoryIcon({ type }: { type: 'gold-bar' | 'silver-bar' | 'gold-coin' | 'silver-coin' }) {
  switch (type) {
    case 'gold-bar':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <defs>
            <linearGradient id="heroGoldBarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path d="M3.5 17L6.8 7H17.2L20.5 17H3.5Z" fill="url(#heroGoldBarGrad)" fillOpacity="0.28" stroke="url(#heroGoldBarGrad)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7 10.5H17M8.5 13.5H15.5" stroke="url(#heroGoldBarGrad)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'silver-bar':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <defs>
            <linearGradient id="heroSilverBarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <path d="M3.5 17L6.8 7H17.2L20.5 17H3.5Z" fill="url(#heroSilverBarGrad)" fillOpacity="0.25" stroke="url(#heroSilverBarGrad)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7 10.5H17M8.5 13.5H15.5" stroke="url(#heroSilverBarGrad)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'gold-coin':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <defs>
            <linearGradient id="heroGoldCoinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="8.5" fill="url(#heroGoldCoinGrad)" fillOpacity="0.22" stroke="url(#heroGoldCoinGrad)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5.5" stroke="url(#heroGoldCoinGrad)" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M12 9v6m-2-4.5h4" stroke="url(#heroGoldCoinGrad)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'silver-coin':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <defs>
            <linearGradient id="heroSilverCoinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="8.5" fill="url(#heroSilverCoinGrad)" fillOpacity="0.2" stroke="url(#heroSilverCoinGrad)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5.5" stroke="url(#heroSilverCoinGrad)" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M12 9v6m-2-4.5h4" stroke="url(#heroSilverCoinGrad)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function GoldHero({ config, dailyCards }: GoldHeroProps) {
  const c = config || {};
  const t = useTranslations('Landing.Hero');
  const locale = useLocale();
  const isFrench = locale === 'fr';

  // Headline & Subtitle matching the reference capture & translations
  const rawTitle = isFrench && c.title ? c.title : t('title');
  const title = rawTitle || t('title');
  const highlight = (isFrench && c.highlight) || t('highlight');

  const rawTagline = isFrench && c.tagline ? c.tagline : t('tagline');
  const tagline = rawTagline || t('tagline');

  const rawSubtitle = isFrench && c.subtitle ? c.subtitle : t('subtitle');
  const subtitle = rawSubtitle || t('subtitle');

  const btnText = (isFrench && c.btnText) || t('btnText');
  const rawBtnUrl = c.btnUrl || "/shop";

  const btn2Text = (isFrench && c.btn2Text) || t('btn2Text');
  const rawBtn2Url = c.btn2Url || "/devis";

  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';
  const btnUrl = rawBtnUrl.startsWith('/') ? `${localePrefix}${rawBtnUrl}` : rawBtnUrl;
  const btn2Url = rawBtn2Url.startsWith('/') ? `${localePrefix}${rawBtn2Url}` : rawBtn2Url;

  // Daily Cards: only categories that actually contain real products in DB
  const activeCards = dailyCards || [];

  const categoryTitleMap: Record<string, string> = {
    'gold-bars': t('card_gold_bars'),
    'silver-bars': t('card_silver_bars'),
    'gold-coins': t('card_gold_coins'),
    'silver-coins': t('card_silver_coins'),
  };

  const titleMap: Record<string, string | undefined> = {
    'gold-bars': (isFrench && c.card1_title) || categoryTitleMap['gold-bars'],
    'silver-bars': (isFrench && c.card2_title) || categoryTitleMap['silver-bars'],
    'gold-coins': (isFrench && c.card3_title) || categoryTitleMap['gold-coins'],
    'silver-coins': (isFrench && c.card4_title) || categoryTitleMap['silver-coins'],
  };

  // Background artwork
  const bgImage = c.bgImage || '/images/hero-bg-luxury.jpg';
  const showBgImage = c.SHOW_BG_IMAGE !== 'false';
  const bgOpacity = typeof c.BG_OVERLAY !== 'undefined' ? Number(c.BG_OVERLAY) / 100 : 0.65;

  // Hero Height
  const rawHeight = c.HERO_HEIGHT || c.heroHeight || '780px';
  const minHeightStyle = String(rawHeight).endsWith('px') || String(rawHeight).endsWith('vh') ? String(rawHeight) : `${rawHeight}px`;

  // Render title with gold gradient highlight
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="not-italic bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(232,166,61,0.4)] font-serif italic">
            {highlight}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  const delays = ['0s', '-1.4s', '-2.8s', '-4.2s'];

  return (
    <section
      className="hero relative w-full text-white overflow-hidden flex flex-col justify-between pt-[130px] sm:pt-[150px] pb-12 sm:pb-14"
      style={{
        minHeight: minHeightStyle,
        background: 'linear-gradient(135deg, #1E3E5E 0%, #0E2036 55%, #A8420F 145%)',
      }}
    >
      {/* Background Photo & Repeating linear gradient stripes */}
      {showBgImage && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{ opacity: bgOpacity }}
          />
        </div>
      )}

      {/* Diagonal Grain Stripes Overlay matching AZ Solutions .hero::before */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-40"
        style={{
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 18px)'
        }}
      />

      {/* Cinematic Vignette Overlay matching AZ Solutions .hero::after */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(100deg, rgba(14,32,54,0.85) 0%, rgba(14,32,54,0.65) 45%, rgba(14,32,54,0.35) 78%, rgba(14,32,54,0.7) 100%)'
        }}
      />

      {/* Main Container Area matching .wrap */}
      <div className="relative z-[2] max-w-[1240px] mx-auto px-4 sm:px-7 w-full flex-1 flex flex-col justify-between">

        {/* Left Column Copy */}
        <div className="max-w-[680px]">

          {/* Eyebrow (.hero .eyebrow) */}
          <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-white font-semibold mb-3.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D2571E] animate-pulse" />
            <span>{tagline}</span>
          </div>

          {/* H1 Heading (.hero h1) */}
          <h1 className="font-serif font-semibold text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.08] text-white mb-5 max-w-[17ch]">
            {renderTitle()}
          </h1>

          {/* Subtitle (.hero p.lede) */}
          <p className="text-[17px] sm:text-[17.5px] text-white/85 leading-relaxed max-w-[52ch] mb-7 font-normal">
            {subtitle}
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">

            {/* Button 1: Découvrir notre gamme (Cuivre Doré Impérial) */}
            <Link
              href={btnUrl}
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14.5px] px-7 py-3 rounded-full shadow-lg shadow-[#9C4E0F]/35 border border-[#E8A63D]/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none group"
            >
              <span>{btnText}</span>
              <LuxuryArrow className="w-3 h-3 text-white/90 group-hover:translate-x-0.5" />
            </Link>

            {/* Button 2: Demander un devis (ou configurable depuis l'admin) */}
            <Link
              href={btn2Url}
              className="inline-flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-[#E8A63D]/15 text-[#FFE699] hover:text-white font-semibold text-[14.5px] px-7 py-3 rounded-full border border-[#E8A63D]/60 hover:border-[#E8A63D] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none shadow-sm group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-[#E8A63D] group-hover:scale-110 transition-transform"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>{btn2Text}</span>
            </Link>

          </div>

        </div>

        {/* Bottom Right: Floating Cards Showcase with Rotating Copper-Gold Beam (only shown for categories with real products) */}
        {activeCards.length > 0 && (
          <div className="mt-8 sm:mt-12 flex justify-end">
            <div
              className={`w-full grid gap-3 ${
                activeCards.length === 1
                  ? 'max-w-[280px] grid-cols-1'
                  : activeCards.length === 2
                  ? 'max-w-[560px] grid-cols-1 sm:grid-cols-2'
                  : activeCards.length === 3
                  ? 'max-w-[820px] grid-cols-1 sm:grid-cols-3'
                  : 'lg:max-w-[940px] xl:max-w-[980px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {activeCards.map((card, idx) => {
                const delay = delays[idx % delays.length];
                const title = titleMap[card.id] || card.title;
                const product = card.product;

                return (
                  <Link
                    key={card.id}
                    href={`${localePrefix}/product/${product.slug}`}
                    className="relative group rounded-[16px] p-[1.5px] overflow-hidden shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 block text-left"
                  >
                  {/* Outer base border */}
                  <div className="absolute inset-0 rounded-[16px] border border-white/[0.08] pointer-events-none" />

                  {/* Soft Golden Halo */}
                  <div
                    className="absolute left-1/2 top-1/2 w-[320%] aspect-square pointer-events-none blur-[8px] opacity-70 animate-beam-spin"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(201,106,43,0.3) 330deg, rgba(214,162,58,0.7) 356deg, transparent 360deg)',
                      animationDelay: delay,
                    }}
                  />

                  {/* Traveling Light Beam & Copper Trail #C96A2B */}
                  <div
                    className="absolute left-1/2 top-1/2 w-[320%] aspect-square pointer-events-none animate-beam-spin"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(201,106,43,0.08) 290deg, rgba(201,106,43,0.45) 322deg, #C96A2B 345deg, #FFF0B8 357deg, rgba(201,106,43,0.6) 360deg)',
                      animationDelay: delay,
                    }}
                  />

                  {/* Inner Card (Translucent Navy #0E2036) */}
                  <div className="relative z-10 flex flex-col justify-between bg-[#0E2036]/92 backdrop-blur-[12px] rounded-[14.5px] p-3 sm:p-3.5 h-full w-full">
                    
                    {/* Header: Icon + Category Title + 24h indicator */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <CategoryIcon type={card.iconType} />
                        <span className="font-serif font-bold text-[14px] sm:text-[15px] text-white tracking-[0.01em] truncate group-hover:text-[#FFE599] transition-colors">
                          {title}
                        </span>
                      </div>
                      <span className="shrink-0 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-white/[0.08] text-[#E8A63D] border border-[#E8A63D]/30 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#E8A63D] animate-ping" />
                        24h
                      </span>
                    </div>

                    {/* Product of the day */}
                    <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.08]">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/40">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11.5px] font-medium text-white/85 truncate group-hover:text-white transition-colors" title={product.title}>
                          {product.title}
                        </div>
                        <div className="text-[12.5px] font-bold text-[#F3BA2F] tracking-tight mt-0.5 font-mono">
                          {product.formattedPrice}
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        )}

      </div>
    </section>
  );
}
