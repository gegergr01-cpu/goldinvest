'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GoldHeroProps {
  config?: Record<string, any>;
}

export default function GoldHero({ config }: GoldHeroProps) {
  const c = config || {};

  // Headline & Subtitle matching the reference capture & AZ Solutions template
  const rawTitle = c.title;
  const title = rawTitle || "Vos investissements prennent de la valeur, votre patrimoine en sécurité .";
  const highlight = c.highlight || "sécurité .";

  const rawTagline = c.tagline;
  const tagline = rawTagline || "IMPORT · EXPORT · GROUPAGE — OR & ARGENT PHYSIQUE";

  const rawSubtitle = c.subtitle;
  const subtitle = rawSubtitle || "Négoce et livraison sécurisée de pièces d'or cotées et lingots d'or et d'argent purs certifiés LBMA. Accompagnement sur-mesure de la commande à la livraison scellée.";

  const btnText = c.btnText || "Demander un devis";
  const btnUrl = c.btnUrl || "/contact";
  const whatsappNumber = c.whatsappNumber || "33617264705";

  // 3 Floating Cards (Bottom right showcase matching capture 3 Maritime / Aérien / Routier)
  const card1Title = c.card1_title || "Pièces d'Or";
  const card1Desc = c.card1_desc || "Napoléon, Krugerrand, Maple Leaf · 20F & 1oz disponibles";

  const card2Title = c.card2_title || "Lingots d'Or";
  const card2Desc = c.card2_desc || "Certifiés LBMA 999.9‰ · De 1g à 1kg scellés";

  const card3Title = c.card3_title || "Argent Fin";
  const card3Desc = c.card3_desc || "Pièces et lingots d'argent · Prix direct cours du marché";

  // Background artwork
  const bgImage = c.bgImage || '/images/hero-bg-luxury.jpg';
  const showBgImage = c.SHOW_BG_IMAGE !== 'false';
  const bgOpacity = typeof c.BG_OVERLAY !== 'undefined' ? Number(c.BG_OVERLAY) / 100 : 0.65;

  // Hero Height
  const rawHeight = c.HERO_HEIGHT || c.heroHeight || '780px';
  const minHeightStyle = String(rawHeight).endsWith('px') || String(rawHeight).endsWith('vh') ? String(rawHeight) : `${rawHeight}px`;

  // Render title with orange badge highlight matching AZ Solutions (.hero h1 em)
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <em className="not-italic bg-[#D2571E] text-white px-2.5 sm:px-3 py-0.5 rounded-[5px] inline-block shadow-md">
            {highlight}
          </em>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section 
      className="hero relative w-full text-white overflow-hidden flex flex-col justify-between pt-[130px] sm:pt-[150px] pb-14 sm:pb-16"
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
      <div className="relative z-[2] max-w-[1180px] mx-auto px-4 sm:px-7 w-full flex-1 flex flex-col justify-between">
        
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

          {/* Hero CTA Buttons (.hero-cta) */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            
            {/* Button 1: Demander un devis (.btn .btn-cargo) */}
            <Link
              href={btnUrl}
              className="inline-flex items-center justify-center gap-2 bg-[#D2571E] hover:bg-[#A8420F] text-white font-semibold text-[14.5px] px-6 py-3 rounded-[6px] shadow-lg shadow-[#D2571E]/30 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
            >
              <span>{btnText}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>

            {/* Button 2: Écrire sur WhatsApp (.btn .btn-outline-dark) */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/[0.08] text-white font-semibold text-[14.5px] px-6 py-3 rounded-[6px] border-[1.5px] border-white/35 hover:border-white transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 text-emerald-400 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12 19.82c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.88 7.88 0 0 1-1.2-4.16c0-4.36 3.55-7.91 7.91-7.91 2.11 0 4.1.82 5.6 2.31a7.86 7.86 0 0 1 2.31 5.6c0 4.36-3.55 7.92-7.93 7.92zm4.33-5.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
              </svg>
              <span>Écrire sur WhatsApp</span>
            </a>

          </div>

        </div>

        {/* Bottom Right: 3 Floating Cards Showcase (.hero-showcase matching Capture 3 & AZ Solutions) */}
        <div className="mt-12 sm:mt-16 flex justify-end">
          <div className="w-full lg:w-[620px] grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Card 1: Pièces d'Or */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#D2571E]/60 transition-all duration-200">
              <div className="font-serif font-bold text-[18px] text-white mb-1.5 tracking-[0.01em]">
                {card1Title}
              </div>
              <div className="text-[12px] leading-[1.45] text-white/65 font-normal">
                {card1Desc}
              </div>
            </div>

            {/* Card 2: Lingots d'Or */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#D2571E]/60 transition-all duration-200">
              <div className="font-serif font-bold text-[18px] text-white mb-1.5 tracking-[0.01em]">
                {card2Title}
              </div>
              <div className="text-[12px] leading-[1.45] text-white/65 font-normal">
                {card2Desc}
              </div>
            </div>

            {/* Card 3: Argent Fin */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#D2571E]/60 transition-all duration-200">
              <div className="font-serif font-bold text-[18px] text-white mb-1.5 tracking-[0.01em]">
                {card3Title}
              </div>
              <div className="text-[12px] leading-[1.45] text-white/65 font-normal">
                {card3Desc}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
