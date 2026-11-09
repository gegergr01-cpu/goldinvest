'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

export default function ServicesClient() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';

  const servicesData = [
    {
      id: 'purchase',
      num: '01',
      navLabel: t('nav_purchase'),
      title: t('purchase_title'),
      tag: t('purchase_tag'),
      desc: t('purchase_desc'),
      fullDesc: t('purchase_full_desc'),
      highlights: [
        { label: t('purchase_hl_refiners'), value: t('purchase_hl_refiners_val') },
        { label: t('purchase_hl_purity'), value: t('purchase_hl_purity_val') },
        { label: t('purchase_hl_tax'), value: t('purchase_hl_tax_val') },
        { label: t('purchase_hl_transparency'), value: t('purchase_hl_transparency_val') },
      ],
      features: [
        t('purchase_feat_1'),
        t('purchase_feat_2'),
        t('purchase_feat_3'),
        t('purchase_feat_4'),
      ],
      ctaText: t('purchase_cta'),
      ctaUrl: `${localePrefix}/shop`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#C8732A]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      id: 'storage',
      num: '02',
      navLabel: t('nav_storage'),
      title: t('storage_title'),
      tag: t('storage_tag'),
      desc: t('storage_desc'),
      fullDesc: t('storage_full_desc'),
      highlights: [
        { label: t('storage_hl_location'), value: t('storage_hl_location_val') },
        { label: t('storage_hl_ownership'), value: t('storage_hl_ownership_val') },
        { label: t('storage_hl_insurance'), value: t('storage_hl_insurance_val') },
        { label: t('storage_hl_tax'), value: t('storage_hl_tax_val') },
      ],
      features: [
        t('storage_feat_1'),
        t('storage_feat_2'),
        t('storage_feat_3'),
        t('storage_feat_4'),
      ],
      ctaText: t('storage_cta'),
      ctaUrl: `${localePrefix}/contact?subject=storage`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#C8732A]">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      id: 'delivery',
      num: '03',
      navLabel: t('nav_delivery'),
      title: t('delivery_title'),
      tag: t('delivery_tag'),
      desc: t('delivery_desc'),
      fullDesc: t('delivery_full_desc'),
      highlights: [
        { label: t('delivery_hl_coverage'), value: t('delivery_hl_coverage_val') },
        { label: t('delivery_hl_discretion'), value: t('delivery_hl_discretion_val') },
        { label: t('delivery_hl_handover'), value: t('delivery_hl_handover_val') },
        { label: t('delivery_hl_delay'), value: t('delivery_hl_delay_val') },
      ],
      features: [
        t('delivery_feat_1'),
        t('delivery_feat_2'),
        t('delivery_feat_3'),
        t('delivery_feat_4'),
      ],
      ctaText: t('delivery_cta'),
      ctaUrl: `${localePrefix}/devis`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#C8732A]">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 'pickup',
      num: '04',
      navLabel: t('nav_pickup'),
      title: t('pickup_title'),
      tag: t('pickup_tag'),
      desc: t('pickup_desc'),
      fullDesc: t('pickup_full_desc'),
      highlights: [
        { label: t('pickup_hl_points'), value: t('pickup_hl_points_val') },
        { label: t('pickup_hl_confidentiality'), value: t('pickup_hl_confidentiality_val') },
        { label: t('pickup_hl_control'), value: t('pickup_hl_control_val') },
        { label: t('pickup_hl_appointment'), value: t('pickup_hl_appointment_val') },
      ],
      features: [
        t('pickup_feat_1'),
        t('pickup_feat_2'),
        t('pickup_feat_3'),
        t('pickup_feat_4'),
      ],
      ctaText: t('pickup_cta'),
      ctaUrl: `${localePrefix}/contact?subject=pickup`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#C8732A]">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'buyback',
      num: '05',
      navLabel: t('nav_buyback'),
      title: t('buyback_title'),
      tag: t('buyback_tag'),
      desc: t('buyback_desc'),
      fullDesc: t('buyback_full_desc'),
      highlights: [
        { label: t('buyback_hl_guarantee'), value: t('buyback_hl_guarantee_val') },
        { label: t('buyback_hl_delay'), value: t('buyback_hl_delay_val') },
        { label: t('buyback_hl_freight'), value: t('buyback_hl_freight_val') },
        { label: t('buyback_hl_quotation'), value: t('buyback_hl_quotation_val') },
      ],
      features: [
        t('buyback_feat_1'),
        t('buyback_feat_2'),
        t('buyback_feat_3'),
        t('buyback_feat_4'),
      ],
      ctaText: t('buyback_cta'),
      ctaUrl: `${localePrefix}/contact?subject=buyback`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#C8732A]">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-[#0E2036] min-h-screen selection:bg-[#C8732A] selection:text-white">
      
      {/* ================= 1. LUXURY SERVICES HERO (DEEP NAVY & GOLD) ================= */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16 overflow-hidden bg-gradient-to-b from-[#0E2036] via-[#0E2036] to-[#0A182A] text-white border-b border-[#C8732A]/30">
        
        {/* Ambient Gold Radial Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #C8732A 0%, #E8A63D 50%, transparent 80%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 115, 42, 0.4), transparent 70%)' }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
            <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#E8A63D] uppercase">
              {t('hero_eyebrow')}
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4 max-w-4xl mx-auto">
            {t('hero_title')}{' '}
            <span className="bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent italic drop-shadow-[0_2px_18px_rgba(232,166,61,0.35)]">
              {t('hero_highlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed mb-6">
            {t('hero_subtitle')}
          </p>

          {/* Quick Anchor Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto pt-1">
            {servicesData.map((srv) => (
              <a
                key={srv.id}
                href={`#${srv.id}`}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#C8732A] text-white/90 hover:text-white border border-white/15 hover:border-[#E8A63D] text-[12px] sm:text-[12.5px] font-medium transition-all duration-200 backdrop-blur-md shadow-xs hover:-translate-y-0.5"
              >
                <span className="text-[#E8A63D] font-mono mr-1.5 font-bold">{srv.num}.</span>
                <span>{srv.navLabel}</span>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 2. THE 5 SERVICE BLOCKS (LUMINOUS WHITE CARDS ON WARM BG) ================= */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        
        {/* Subtle decorative dot pattern watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#C8732A 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-24 relative rounded-3xl bg-white border border-[#E8E4DA] p-6 sm:p-8 lg:p-10 shadow-[0_12px_45px_rgba(14,32,54,0.05)] hover:shadow-[0_20px_50px_rgba(200,115,42,0.12)] hover:border-[#C8732A]/50 transition-all duration-300 overflow-hidden group"
              >
                {/* Background Large Number Watermark */}
                <span className="absolute -top-6 right-6 font-serif font-bold text-[120px] sm:text-[160px] text-[#0E2036]/[0.035] group-hover:text-[#C8732A]/[0.07] select-none pointer-events-none leading-none transition-colors duration-300">
                  {service.num}
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left (or Right) Content Column */}
                  <div className={`lg:col-span-7 flex flex-col items-start ${isEven ? 'lg:order-2' : ''}`}>
                    
                    {/* Top Tag & Icon */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0E2036]/5 border border-[#0E2036]/10 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#C8732A]/10 transition-colors">
                        {service.icon}
                      </div>
                      <div>
                        <span className="text-[10.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#C8732A]/10 text-[#C8732A] border border-[#C8732A]/25 inline-block">
                          {service.tag}
                        </span>
                        <div className="text-gray-400 text-[11px] font-mono mt-0.5">
                          {t('service_ref_prefix')}{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0E2036] tracking-tight mb-3">
                      {service.title}
                    </h2>

                    {/* Localized Sub-hook */}
                    <p className="text-[14px] sm:text-[15px] text-[#C8732A] font-serif italic mb-3 leading-snug">
                      {service.desc}
                    </p>

                    {/* Main Description */}
                    <p className="text-[13.5px] sm:text-[14.5px] text-gray-600 leading-relaxed mb-6 font-normal">
                      {service.fullDesc}
                    </p>

                    {/* Feature bullets */}
                    <ul className="space-y-2.5 mb-8 w-full">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action CTA with Luxury Arrow */}
                    <Link
                      href={service.ctaUrl}
                      className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full shadow-md shadow-[#9C4E0F]/20 border border-[#E8A63D]/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group/btn cursor-pointer"
                    >
                      <span>{service.ctaText}</span>
                      <LuxuryArrow className="w-3 h-3 text-white group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                  </div>

                  {/* Highlights Grid Card (Right or Left on alternate) */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                    <div className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-2xl p-6 sm:p-7 shadow-xs">
                      
                      <div className="text-[11px] font-mono tracking-wider uppercase text-[#C8732A] font-bold mb-4 border-b border-[#E8E4DA] pb-2.5 flex items-center justify-between">
                        <span>{t('key_points_title')}</span>
                        <span className="text-gray-400 font-normal">{t('sovereign_guarantee')}</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {service.highlights.map((hl, hIdx) => (
                          <div key={hIdx} className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-[#C8732A]/40 transition-colors">
                            <div>
                              <span className="block text-[11px] text-gray-500 mb-0.5">
                                {hl.label}
                              </span>
                              <span className="block font-serif font-bold text-[14px] sm:text-[15px] text-[#0E2036] leading-tight">
                                {hl.value}
                              </span>
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-[#FAF5EB] border border-[#E8A63D]/25 flex items-center justify-center text-[#C8732A] shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Seal / Trust notice */}
                      <div className="mt-5 pt-4 border-t border-[#E8E4DA] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <p className="text-[12px] text-gray-600 leading-snug">
                          {t('trust_seal_text')}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. BOTTOM ADVISOR REASSURANCE BANNER (DEEP NAVY & GOLD) ================= */}
      <section className="py-16 md:py-20 bg-[#0E2036] text-white border-t border-[#C8732A]/30 relative overflow-hidden">
        
        {/* Glow */}
        <div
          className="absolute -top-24 right-1/4 w-[400px] h-[300px] pointer-events-none opacity-20 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #E8A63D 0%, transparent 70%)' }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-white/[0.04] p-8 sm:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#E8A63D] font-bold block mb-2">
                {t('advisor_eyebrow')}
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
                {t('advisor_title')}
              </h3>
              <p className="text-[14px] text-white/70 max-w-xl leading-relaxed">
                {t('advisor_desc')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                href={`${localePrefix}/devis`}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-full shadow-lg shadow-[#9C4E0F]/30 border border-[#E8A63D]/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>{t('advisor_quote_btn')}</span>
                <LuxuryArrow className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`${localePrefix}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] border border-white/15 transition-colors"
              >
                <span>{t('advisor_contact_btn')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

