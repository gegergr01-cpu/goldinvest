'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GoldHeroProps {
  config?: Record<string, any>;
}

export default function GoldHero({ config }: GoldHeroProps) {
  const c = config || {};

  // Smart defaults matching the reference capture
  const rawTitle = c.title;
  const title = (rawTitle && rawTitle !== 'Investissez dans la valeur sûre') ? rawTitle : 'Or & Argent';
  const highlight = c.highlight || '&';

  const rawSubtitle = c.subtitle;
  const subtitle = (rawSubtitle && rawSubtitle !== "Pièces d'or, lingots d'or et d'argent au meilleur prix") 
    ? rawSubtitle 
    : 'INVESTISSEZ EN TOUTE CONFIANCE';

  const rawBtnText = c.btnText;
  const btnText = (rawBtnText && rawBtnText !== 'Découvrir notre gamme') 
    ? rawBtnText 
    : 'Découvrez notre sélection';

  const btnUrl = c.btnUrl || '/shop';

  // 3 Reassurance Features (Capture: Qualité Garantie, Prix Compétitifs, Livraison Sécurisée)
  const showFeatures = c.showFeatures !== 'false' && c.showFeatures !== false;
  const feature1Title = c.feature1_title || 'Qualité';
  const feature1Sub = c.feature1_sub || 'Garantie';
  const feature2Title = c.feature2_title || 'Prix';
  const feature2Sub = c.feature2_sub || 'Compétitifs';
  const feature3Title = c.feature3_title || 'Livraison';
  const feature3Sub = c.feature3_sub || 'Sécurisée';

  // Explicit deletion support
  const image = typeof c.image !== 'undefined' ? c.image : '/images/hero-gold-silver.jpg';
  const bgImage = typeof c.bgImage !== 'undefined' ? c.bgImage : '/images/hero-bg-luxury.jpg';

  const showBgImage = c.SHOW_BG_IMAGE !== 'false';
  const showMainImage = c.SHOW_MAIN_IMAGE !== 'false';

  const hasImage = Boolean(showMainImage && image && typeof image === 'string' && image.trim() !== '');
  const hasBgImage = Boolean(showBgImage && bgImage && typeof bgImage === 'string' && bgImage.trim() !== '');

  // Background & Overlay
  const bgColor = c.bgColor || c.BG_COLOR || '#0a0a0a';
  const overlayPercent = typeof c.BG_OVERLAY !== 'undefined' ? Number(c.BG_OVERLAY) : (typeof c.bgOpacity !== 'undefined' ? Number(c.bgOpacity) * 100 : 45);
  const bgOpacity = overlayPercent / 100;

  // Colors & Styles
  const highlightColor = c.CATEGORY_COLOR || c.highlightColor || '#c59a3f';
  const titleColor = c.TITLE_COLOR || '#ffffff';
  const subtitleColor = c.SUBTITLE_COLOR || '#e5e7eb';
  const btnBgColor = c.BTN_BG_COLOR || c.btnBgColor || '#c59a3f';
  const btnTextColor = c.BTN_TEXT_COLOR || c.btnTextColor || '#000000';

  // Button radius
  const btnStyle = c.BTN_STYLE || 'pill';
  const btnRadiusClass = btnStyle === 'square' ? 'rounded-none' : btnStyle === 'rounded' ? 'rounded-xl' : 'rounded-full';

  // Hero Height (Customizable via admin or tall luxury default)
  const rawHeight = c.HERO_HEIGHT || c.heroHeight || c.minHeight;
  const minHeightStyle = rawHeight 
    ? (String(rawHeight).endsWith('px') || String(rawHeight).endsWith('vh') ? String(rawHeight) : `${rawHeight}px`) 
    : '780px';

  // Alignment (3x3 Grid)
  const hAlign = c.CONTENT_ALIGN || 'left';
  const vAlign = c.CONTENT_VALIGN || 'center';

  const alignContainerClass = 
    hAlign === 'center' ? 'text-center items-center' :
    hAlign === 'right' ? 'text-right items-end' :
    'text-left items-start';

  const vAlignClass =
    vAlign === 'top' ? 'items-start' :
    vAlign === 'bottom' ? 'items-end' :
    'items-center';

  // Render title with gold '&' or highlight
  const renderTitle = () => {
    if (title.includes('&')) {
      const parts = title.split('&');
      return (
        <>
          {parts[0]}
          <span className="text-[#c59a3f] font-serif font-light mx-1 sm:mx-1.5">&</span>
          {parts.slice(1).join('&')}
        </>
      );
    }
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span style={{ color: highlightColor }}>{highlight}</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section 
      className="relative w-full text-white overflow-hidden transition-colors duration-300 flex items-center min-h-[520px] md:min-h-[680px]"
      style={{ backgroundColor: bgColor, minHeight: minHeightStyle }}
    >
      {/* Background Image (BG) */}
      {hasBgImage && (
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
          {/* Subtle dark vignette overlay to blend edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 pointer-events-none" />
        </div>
      )}

      {/* Radial gradient warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c59a3f]/15 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 w-full">
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-10 lg:gap-12 ${vAlignClass}`}>

          {/* Left Text Column */}
          <div className={`${hasImage ? 'lg:col-span-7 xl:col-span-6' : 'w-full'} z-10 flex flex-col ${alignContainerClass}`}>
            
            {/* Main Title: Or & Argent */}
            <h1 
              style={{ color: titleColor }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-none"
            >
              {renderTitle()}
            </h1>

            {/* Tagline: INVESTISSEZ EN TOUTE CONFIANCE */}
            <p 
              style={{ color: subtitleColor }}
              className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-gray-200 uppercase font-sans select-none"
            >
              {subtitle}
            </p>

            {/* Gold separator line */}
            <div className="w-20 sm:w-28 h-[2px] bg-[#c59a3f] mt-4 mb-6 sm:mb-8" />

            {/* 3 Reassurance Features (Icons + 2-line labels) */}
            {showFeatures && (
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 md:gap-8 my-1">
                {/* 1. Qualité Garantie */}
                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c59a3f] transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature1Title}</span>
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature1Sub}</span>
                  </div>
                </div>

                {/* 2. Prix Compétitifs */}
                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c59a3f] transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature2Title}</span>
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature2Sub}</span>
                  </div>
                </div>

                {/* 3. Livraison Sécurisée */}
                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c59a3f] transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 17a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature3Title}</span>
                    <span className="text-xs sm:text-sm font-medium text-white leading-tight">{feature3Sub}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button: Découvrez notre sélection > */}
            <div className="mt-8 sm:mt-10">
              <Link
                href={btnUrl}
                style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                className={`inline-flex items-center gap-2.5 font-semibold text-xs sm:text-sm px-7 py-3.5 ${btnRadiusClass} transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#c59a3f]/30 cursor-pointer group`}
              >
                <span>{btnText}</span>
                <svg 
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Image Visual Column */}
          {hasImage && (
            <div className="lg:col-span-5 xl:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[620px] aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
