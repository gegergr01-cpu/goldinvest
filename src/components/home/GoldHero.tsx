'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GoldHeroProps {
  config?: Record<string, any>;
}

export default function GoldHero({ config }: GoldHeroProps) {
  const c = config || {};

  const title = c.title || 'Investissez dans la valeur sûre';
  const highlight = c.highlight || 'valeur sûre';
  const subtitle = c.subtitle || "Pièces d'or, lingots d'or et d'argent au meilleur prix";
  const btnText = c.btnText || 'Découvrir notre gamme';
  const btnUrl = c.btnUrl || '/shop';

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
  const subtitleColor = c.SUBTITLE_COLOR || '#d1d5db';
  const btnBgColor = c.BTN_BG_COLOR || c.btnBgColor || '#c59a3f';
  const btnTextColor = c.BTN_TEXT_COLOR || c.btnTextColor || '#000000';

  // Button radius
  const btnStyle = c.BTN_STYLE || 'pill';
  const btnRadiusClass = btnStyle === 'square' ? 'rounded-none' : btnStyle === 'rounded' ? 'rounded-xl' : 'rounded-full';

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

  // If the title contains the highlight text, render with gold span
  const renderTitle = () => {
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
      className="relative w-full text-white overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-12 ${vAlignClass}`}>

          {/* Left Text Column */}
          <div className={`${hasImage ? 'lg:col-span-6' : 'w-full'} z-10 flex flex-col ${alignContainerClass}`}>
            <h1 
              style={{ color: titleColor }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]"
            >
              {renderTitle()}
            </h1>

            <p 
              style={{ color: subtitleColor }}
              className={`mt-5 text-lg sm:text-xl font-light leading-relaxed ${hasImage ? 'max-w-lg' : 'max-w-2xl'}`}
            >
              {subtitle}
            </p>

            <div className="mt-8">
              <Link
                href={btnUrl}
                style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                className={`inline-flex items-center gap-3 font-semibold text-base px-8 py-4 ${btnRadiusClass} transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#c59a3f]/25 cursor-pointer group`}
              >
                <span>{btnText}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Image Visual Column */}
          {hasImage && (
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[580px] aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
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
