'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GoldHeroProps {
  config?: {
    title?: string;
    highlight?: string;
    subtitle?: string;
    btnText?: string;
    btnUrl?: string;
    image?: string;
    bgImage?: string;
    bgColor?: string;
    bgOpacity?: string | number;
    highlightColor?: string;
    btnBgColor?: string;
    btnTextColor?: string;
  };
}

export default function GoldHero({ config }: GoldHeroProps) {
  const title = config?.title || 'Investissez dans la valeur sûre';
  const highlight = config?.highlight || 'valeur sûre';
  const subtitle = config?.subtitle || "Pièces d'or, lingots d'or et d'argent au meilleur prix";
  const btnText = config?.btnText || 'Découvrir notre gamme';
  const btnUrl = config?.btnUrl || '/shop';

  // Support explicit deletion: if property is defined and set to '', it means deleted!
  const image = typeof config?.image !== 'undefined' ? config.image : '/images/hero-gold-silver.jpg';
  const bgImage = typeof config?.bgImage !== 'undefined' ? config.bgImage : '/images/hero-bg-luxury.jpg';

  const hasImage = Boolean(image && typeof image === 'string' && image.trim() !== '');
  const hasBgImage = Boolean(bgImage && typeof bgImage === 'string' && bgImage.trim() !== '');

  const bgColor = config?.bgColor || '#0a0a0a';
  const highlightColor = config?.highlightColor || '#c59a3f';
  const btnBgColor = config?.btnBgColor || '#c59a3f';
  const btnTextColor = config?.btnTextColor || '#000000';
  const bgOpacity = typeof config?.bgOpacity !== 'undefined' ? Number(config.bgOpacity) : 0.45;

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
      {/* Background Image (BG) - only if defined and not deleted */}
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
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto text-center'} gap-12 items-center`}>

          {/* Left Text Column */}
          <div className={`${hasImage ? 'lg:col-span-6 items-start text-left' : 'w-full items-center text-center'} z-10 flex flex-col`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              {renderTitle()}
            </h1>

            <p className={`mt-5 text-lg sm:text-xl text-gray-300 font-light leading-relaxed ${hasImage ? 'max-w-lg' : 'max-w-2xl'}`}>
              {subtitle}
            </p>

            <div className="mt-8">
              <Link
                href={btnUrl}
                style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                className="inline-flex items-center gap-3 font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#c59a3f]/25 cursor-pointer group"
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

          {/* Right Image Visual Column - only if defined and not deleted */}
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
