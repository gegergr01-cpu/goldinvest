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
  const subtitle = rawSubtitle || "Pièces d'or, lingots d'or et d'argent d'investissement, sélectionnés au meilleur prix.";

  const btnText = c.btnText || "Découvrir notre gamme";
  const btnUrl = c.btnUrl || "/shop";
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

          {/* Hero CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">

            {/* Button 1: Découvrir notre gamme (Cuivre Doré Impérial) */}
            <Link
              href={btnUrl}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14.5px] px-7 py-3 rounded-full shadow-lg shadow-[#9C4E0F]/35 border border-[#E8A63D]/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
            >
              <span>{btnText}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>

            {/* Button 2: Create an account */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-[#E8A63D]/15 text-[#FFE699] hover:text-white font-semibold text-[14.5px] px-7 py-3 rounded-full border border-[#E8A63D]/60 hover:border-[#E8A63D] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-[#E8A63D]"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Create an account</span>
            </Link>

          </div>

        </div>

        {/* Bottom Right: 3 Floating Cards Showcase (.hero-showcase matching Capture 3 & AZ Solutions) */}
        <div className="mt-12 sm:mt-16 flex justify-end">
          <div className="w-full lg:w-[620px] grid grid-cols-1 sm:grid-cols-3 gap-3.5">

            {/* Card 1: Pièces d'Or */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#C8732A]/70 transition-all duration-200">
              <div className="font-serif font-bold text-[18px] text-white mb-1.5 tracking-[0.01em]">
                {card1Title}
              </div>
              <div className="text-[12px] leading-[1.45] text-white/65 font-normal">
                {card1Desc}
              </div>
            </div>

            {/* Card 2: Lingots d'Or */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#C8732A]/70 transition-all duration-200">
              <div className="font-serif font-bold text-[18px] text-white mb-1.5 tracking-[0.01em]">
                {card2Title}
              </div>
              <div className="text-[12px] leading-[1.45] text-white/65 font-normal">
                {card2Desc}
              </div>
            </div>

            {/* Card 3: Argent Fin */}
            <div className="flex flex-col justify-center bg-[#0E2036]/85 backdrop-blur-[8px] border border-white/10 rounded-[14px] p-[16px_18px] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:border-[#C8732A]/70 transition-all duration-200">
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
