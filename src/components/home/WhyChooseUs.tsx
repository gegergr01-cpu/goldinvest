'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

interface WhyChooseUsProps {
  config?: Record<string, string>;
}

interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  ctaText: string;
  url: string;
  iconType: 'purchase' | 'storage' | 'delivery' | 'pickup' | 'buyback';
}

const SERVICES: ServiceItem[] = [
  {
    id: 'purchase',
    title: 'Purchase',
    tag: 'Authenticité & Pureté',
    desc: 'Buy bullion bars and coins from certified, globally recognized refiners, guaranteeing the authenticity, purity, and quality of precious metals. Enjoy a wide selection of products at the best price.',
    ctaText: 'Learn more',
    url: '/services#purchase',
    iconType: 'purchase',
  },
  {
    id: 'storage',
    title: 'Storage',
    tag: 'Coffres Haute Sécurité',
    desc: 'Store your precious metals outside the banking system in highly secure vaults located in free-trade zones in Zurich, Singapore, New York, or Toronto.',
    ctaText: 'Learn more',
    url: '/services#storage',
    iconType: 'storage',
  },
  {
    id: 'delivery',
    title: 'Delivery',
    tag: 'Livraison Assurée 100%',
    desc: 'Receive your precious metals directly at home with a fast, secure, and discreet delivery service. Package delivery with real-time tracking.',
    ctaText: 'Learn more',
    url: '/services#delivery',
    iconType: 'delivery',
  },
  {
    id: 'pickup',
    title: 'Pickup',
    tag: 'Retrait en Main Propre',
    desc: 'Visit one of our storage vaults to collect your precious metals order in person in complete discretion, security, and confidentiality.',
    ctaText: 'Learn more',
    url: '/services#pickup',
    iconType: 'pickup',
  },
  {
    id: 'buyback',
    title: 'Buyback',
    tag: 'Liquidité Immédiate',
    desc: 'Easily sell your bars and coins stored in the vaults. Through our buyback service, you can sell all or part of your precious metals quickly, transparently, and without having to move them physically.',
    ctaText: 'Learn more',
    url: '/services#buyback',
    iconType: 'buyback',
  },
];

function ServiceIcon({ type }: { type: ServiceItem['iconType'] }) {
  switch (type) {
    case 'purchase':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none">
          <defs>
            <linearGradient id="srvIconGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path d="M3.5 17L6.8 7H17.2L20.5 17H3.5Z" fill="url(#srvIconGrad)" fillOpacity="0.25" stroke="url(#srvIconGrad)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7 10.5H17M8.5 13.5H15.5" stroke="url(#srvIconGrad)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="url(#srvIconGrad)" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="url(#srvIconGrad)" fillOpacity="0.18" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="1.4" />
          <path d="M12 9v6M9 12h6" strokeLinecap="round" />
          <circle cx="17.5" cy="7.5" r="1" fill="url(#srvIconGrad)" stroke="none" />
        </svg>
      );
    case 'delivery':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="url(#srvIconGrad)" strokeWidth="1.6">
          <rect x="2" y="7" width="14" height="11" rx="1.5" fill="url(#srvIconGrad)" fillOpacity="0.18" />
          <path d="M16 10h4l2 3.5V18h-6v-8Z" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2" fill="#0E2036" />
          <circle cx="17.5" cy="18" r="2" fill="#0E2036" />
        </svg>
      );
    case 'pickup':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="url(#srvIconGrad)" strokeWidth="1.6">
          <path d="M12 21c4-4.5 7-8.5 7-12a7 7 0 1 0-14 0c0 3.5 3 7.5 7 12Z" fill="url(#srvIconGrad)" fillOpacity="0.18" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case 'buyback':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="url(#srvIconGrad)" strokeWidth="1.6">
          <path d="M4 12a8 8 0 0 1 14-5.3L20 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 12a8 8 0 0 1-14 5.3L4 16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

// Single Luxury Service Card (matching Hero Card styling with rotating beam)
function LuxuryServiceCard({ service, delay = '0s' }: { service: ServiceItem; delay?: string }) {
  return (
    <Link
      href={service.url}
      className="relative group rounded-[20px] p-[1.5px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 block text-left h-full w-full"
    >
      {/* Base outline border */}
      <div className="absolute inset-0 rounded-[20px] border border-white/[0.08] pointer-events-none" />

      {/* Soft Golden Halo */}
      <div
        className="absolute left-1/2 top-1/2 w-[340%] aspect-square pointer-events-none blur-[9px] opacity-75 animate-beam-spin"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(201,106,43,0.3) 330deg, rgba(214,162,58,0.7) 356deg, transparent 360deg)',
          animationDelay: delay,
        }}
      />

      {/* Traveling Light Beam & Copper Trail #C96A2B */}
      <div
        className="absolute left-1/2 top-1/2 w-[340%] aspect-square pointer-events-none animate-beam-spin"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(201,106,43,0.08) 290deg, rgba(201,106,43,0.45) 322deg, #C96A2B 345deg, #FFF0B8 357deg, rgba(201,106,43,0.6) 360deg)',
          animationDelay: delay,
        }}
      />

      {/* Inner Card (Navy #0E2036/94 with backdrop blur) */}
      <div className="relative z-10 flex flex-col justify-between bg-[#0E2036]/94 backdrop-blur-[14px] rounded-[18.5px] p-6 sm:p-7 h-full w-full">
        {/* Top: Icon + Tag */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <ServiceIcon type={service.iconType} />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.07] text-[#E8A63D] border border-[#E8A63D]/30">
              {service.tag}
            </span>
          </div>

          {/* Service Title */}
          <h3 className="font-serif font-bold text-[21px] sm:text-[23px] text-white tracking-[0.01em] group-hover:text-[#FFE599] transition-colors mb-2.5">
            {service.title}
          </h3>

          {/* Service Description */}
          <p className="text-[13px] sm:text-[13.5px] text-white/75 leading-relaxed font-normal">
            {service.desc}
          </p>
        </div>

        {/* Bottom Link: Learn More */}
        <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-[#E8A63D] group-hover:text-[#FFE599] font-semibold text-[13px] transition-colors">
          <span>{service.ctaText}</span>
          <span className="w-6 h-6 rounded-full bg-white/[0.06] group-hover:bg-[#C8732A] group-hover:text-white flex items-center justify-center transition-all duration-200">
            <LuxuryArrow className="w-2.5 h-2.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function WhyChooseUs({ config }: WhyChooseUsProps) {
  const c = config || {};

  const badge = c.badge || 'NOS SERVICES EXCLUSIFS';
  const title = c.title || 'Nos services';
  const subtitle = c.subtitle || "L'excellence et la maîtrise de vos investissements en métaux précieux.";
  const description = c.description || "De l'achat de lingots et pièces certifiés au gardiennage en coffre sécurisé hors système bancaire, nous vous offrons un écosystème haut de gamme complet, liquide et transparent.";
  const btnText = c.btnText || 'Découvrir nos solutions';
  const btnUrl = c.btnUrl || '/services';

  // Height of each card slot in pixels for exact mathematical translation
  const CARD_HEIGHT = 350;

  // Seamless Odometer Reel: 5 items + clone of index 0 at position 5
  // Col 1 items: [0, 1, 2, 3, 4, 0]
  // Col 2 items: [1, 2, 3, 4, 0, 1]
  const col1Items = [...SERVICES, SERVICES[0]];
  const col2Items = [...SERVICES.slice(1), SERVICES[0], SERVICES[1]];

  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isHandlingTransition = useRef(false);

  const nextStep = () => {
    if (isHandlingTransition.current) return;
    setIsTransitioning(true);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (isHandlingTransition.current) return;
    if (step === 0) {
      // Instantly jump to clone position without transition, then animate to step 4
      isHandlingTransition.current = true;
      setIsTransitioning(false);
      setStep(SERVICES.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setStep(SERVICES.length - 1);
          isHandlingTransition.current = false;
        });
      });
    } else {
      setIsTransitioning(true);
      setStep((prev) => prev - 1);
    }
  };

  // When step hits 5 (the clone), silently reset to 0 without transition
  const handleTransitionEnd = () => {
    if (step >= SERVICES.length) {
      isHandlingTransition.current = true;
      setIsTransitioning(false);
      setStep(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isHandlingTransition.current = false;
        });
      });
    }
  };

  // Automatic odometer tick every 5.5s (paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextStep();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, step]);

  const activeNumber = (step % SERVICES.length) + 1;

  return (
    <section 
      id="services"
      className="relative w-full text-white py-20 lg:py-28 overflow-hidden bg-[#0A1828] border-t border-b border-white/[0.08]"
    >
      {/* Background Cinematic Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(200, 115, 42, 0.28), transparent 60%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 20px)'
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ================= LEFT COLUMN: Text Copy, Description, CTA, Counter ================= */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">
            
            {/* Eyebrow with gold accent lines */}
            <div className="inline-flex items-center gap-3 mb-3.5">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
              <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.18em] text-[#E8A63D] uppercase">
                {badge}
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
            </div>

            {/* Title */}
            <h2 className="font-serif font-bold text-[34px] sm:text-[44px] lg:text-[48px] text-white tracking-tight leading-[1.1] mb-4">
              {title.includes('services') ? (
                <>
                  Nos{' '}
                  <span className="bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(232,166,61,0.4)] italic">
                    services
                  </span>
                </>
              ) : title}
            </h2>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[18px] text-[#FFE599] font-serif italic mb-4 leading-snug">
              {subtitle}
            </p>

            {/* Description */}
            <p className="text-[14.5px] sm:text-[15px] text-white/75 font-normal leading-relaxed mb-7 max-w-[48ch]">
              {description}
            </p>

            {/* Mechanical Odometer Counter Display (Borderless & Clean) */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8A63D] animate-ping" />
                <span className="text-[11.5px] font-mono uppercase tracking-wider text-white/55">
                  Service
                </span>
              </div>
              <div className="flex items-baseline font-serif font-bold text-[#FFE599] tracking-wider text-[22px]">
                <span className="text-[#E8A63D]">0{activeNumber}</span>
                <span className="text-white/30 mx-1.5 font-light text-[14px]">/</span>
                <span className="text-white/45 text-[14px] font-normal">05</span>
              </div>
            </div>

            {/* CTA Button (Cuivre Doré Impérial) & Counter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={btnUrl}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-full shadow-lg shadow-[#9C4E0F]/35 border border-[#E8A63D]/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none group"
              >
                <span>{btnText}</span>
                <LuxuryArrow className="w-3 h-3 text-white/90 group-hover:translate-x-0.5" />
              </Link>

              {/* Vertical Counter Step Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#E8A63D] text-white/80 hover:text-[#FFE599] flex items-center justify-center transition-all cursor-pointer"
                  title="Service précédent (Défilement haut)"
                  aria-label="Service précédent"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#E8A63D] text-white/80 hover:text-[#FFE599] flex items-center justify-center transition-all cursor-pointer"
                  title="Service suivant (Défilement bas)"
                  aria-label="Service suivant"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pill Navigation Dots */}
            <div className="flex items-center gap-2 mt-5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setStep(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    (step % SERVICES.length) === idx ? 'w-7 bg-[#E8A63D]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Aller au service ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: 2 Cards Rolling Vertically (Borderless Floating Carousel) ================= */}
          <div 
            className="lg:col-span-7 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Dual Column Vertical Reels with borderless progressive alpha mask */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 overflow-hidden"
              style={{ 
                height: `${CARD_HEIGHT}px`,
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
              }}
            >
              {/* Reel Column 1 (Starts at index 0) */}
              <div className="relative h-full overflow-hidden">
                <div
                  className={`flex flex-col ${
                    isTransitioning 
                      ? 'transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]' 
                      : ''
                  }`}
                  style={{
                    transform: `translateY(-${step * CARD_HEIGHT}px)`,
                    transitionDelay: '0ms',
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {col1Items.map((service, idx) => (
                    <div 
                      key={`col1-${service.id}-${idx}`}
                      style={{ height: `${CARD_HEIGHT}px` }}
                      className="p-1 pb-2 shrink-0"
                    >
                      <LuxuryServiceCard service={service} delay="0s" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reel Column 2 (Offset by 1, with subtle 90ms mechanical stagger) */}
              <div className="relative h-full overflow-hidden hidden sm:block">
                <div
                  className={`flex flex-col ${
                    isTransitioning 
                      ? 'transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]' 
                      : ''
                  }`}
                  style={{
                    transform: `translateY(-${step * CARD_HEIGHT}px)`,
                    transitionDelay: isTransitioning ? '90ms' : '0ms',
                  }}
                >
                  {col2Items.map((service, idx) => (
                    <div 
                      key={`col2-${service.id}-${idx}`}
                      style={{ height: `${CARD_HEIGHT}px` }}
                      className="p-1 pb-2 shrink-0"
                    >
                      <LuxuryServiceCard service={service} delay="-2.75s" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
