'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GoldHeroProps {
  config?: Record<string, any>;
}

export default function GoldHero({ config }: GoldHeroProps) {
  const c = config || {};

  // Headline & Subtitle matching the reference capture structure
  const rawTitle = c.title;
  const title = rawTitle || "L'excellence de l'or physique, votre patrimoine en sécurité .";
  const highlight = c.highlight || "sécurité .";

  const rawTagline = c.tagline;
  const tagline = rawTagline || "OR & ARGENT — INVESTISSEMENT EN TOUTE CONFIANCE";

  const rawSubtitle = c.subtitle;
  const subtitle = rawSubtitle || "Négoce de pièces d'or cotées et lingots d'or et d'argent purs 999.9. Produits certifiés, scellés avec traçabilité et livraison assurée à 100%.";

  const btnText = c.btnText || "Demander un devis";
  const btnUrl = c.btnUrl || "/contact";
  const whatsappNumber = c.whatsappNumber || "33617264705";

  // 3 Floating Cards (Bottom right, matching capture 3: Maritime / Aérien / Routier)
  const card1Title = c.card1_title || "Pièces d'Or";
  const card1Desc = c.card1_desc || "Napoléon, Krugerrand, Souverains, Maple Leaf... Scellées et cotées en continu.";

  const card2Title = c.card2_title || "Lingots d'Or";
  const card2Desc = c.card2_desc || "Or pur 999.9 certifié LBMA de 1g à 1kg, livrés sous blister sécurisé.";

  const card3Title = c.card3_title || "Argent Fin";
  const card3Desc = c.card3_desc || "Lingots et pièces d'argent d'investissement, fiscalité avantageuse et stock vérifié.";

  // Background image
  const bgImage = c.bgImage || '/images/hero-bg-luxury.jpg';
  const showBgImage = c.SHOW_BG_IMAGE !== 'false';
  const bgOpacity = typeof c.BG_OVERLAY !== 'undefined' ? Number(c.BG_OVERLAY) / 100 : 0.65;

  // Hero Height
  const rawHeight = c.HERO_HEIGHT || c.heroHeight || '820px';
  const minHeightStyle = String(rawHeight).endsWith('px') || String(rawHeight).endsWith('vh') ? String(rawHeight) : `${rawHeight}px`;

  // Render title with orange badge on the highlight word (matching Capture 3)
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="bg-[#ea580c] px-3 sm:px-4 py-0.5 sm:py-1 rounded-xl text-white inline-block shadow-md mx-1">
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
      className="relative w-full text-white overflow-hidden flex flex-col justify-between"
      style={{ minHeight: minHeightStyle }}
    >
      {/* Background Artwork */}
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
          {/* Dual-gradient vignette for total contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060a12]/95 via-[#060a12]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 w-full flex-1 flex flex-col justify-between">
        
        {/* Left Column Text Content */}
        <div className="max-w-3xl pt-4 sm:pt-8">
          
          {/* Tagline / Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gray-200 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
            <span>{tagline}</span>
          </div>

          {/* Large Serif Title with Orange Badge Highlight */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight text-white leading-[1.15]">
            {renderTitle()}
          </h1>

          {/* Subtitle Description */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-gray-200 font-light leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Dual Action Buttons (Demander un devis + Écrire sur WhatsApp) */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            
            {/* Button 1: Demander un devis */}
            <Link
              href={btnUrl}
              className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#d44e07] text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-xl shadow-orange-600/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{btnText}</span>
              <span className="text-lg">↗</span>
            </Link>

            {/* Button 2: Écrire sur WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-black/60 hover:bg-black/90 text-white font-medium text-sm sm:text-base px-7 py-4 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-5 h-5 text-emerald-400 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12 19.82c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.88 7.88 0 0 1-1.2-4.16c0-4.36 3.55-7.91 7.91-7.91 2.11 0 4.1.82 5.6 2.31a7.86 7.86 0 0 1 2.31 5.6c0 4.36-3.55 7.92-7.93 7.92zm4.33-5.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
              </svg>
              <span>Écrire sur WhatsApp</span>
            </a>

          </div>

        </div>

        {/* Bottom Right: 3 Floating Cards (Matching Capture 3 Maritime / Aérien / Routier) */}
        <div className="mt-14 sm:mt-16 flex justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-3xl">
            
            {/* Card 1: Pièces d'Or */}
            <div className="bg-[#0b1220]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-2xl hover:border-[#ea580c]/60 transition-all duration-300">
              <h3 className="font-serif font-bold text-lg text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                {card1Title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {card1Desc}
              </p>
            </div>

            {/* Card 2: Lingots d'Or */}
            <div className="bg-[#0b1220]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-2xl hover:border-[#ea580c]/60 transition-all duration-300">
              <h3 className="font-serif font-bold text-lg text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                {card2Title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {card2Desc}
              </p>
            </div>

            {/* Card 3: Argent Fin */}
            <div className="bg-[#0b1220]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-2xl hover:border-[#ea580c]/60 transition-all duration-300">
              <h3 className="font-serif font-bold text-lg text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                {card3Title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {card3Desc}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
