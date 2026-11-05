'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

interface CtaBannerProps {
  config?: Record<string, string>;
}

export default function CtaBanner({ config }: CtaBannerProps) {
  const c = config || {};
  const t = useTranslations('Landing.CtaBanner');
  const locale = useLocale();
  const isFrench = locale === 'fr';

  const title = (isFrench && c.title) || t('title');
  const subtitle = (isFrench && c.subtitle) || t('subtitle');
  const btnText = (isFrench && c.btnText) || t('btnText');
  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';
  const rawBtnUrl = c.btnUrl || '/shop';
  const btnUrl = rawBtnUrl.startsWith('/') ? `${localePrefix}${rawBtnUrl}` : rawBtnUrl;

  const image = typeof c.image !== 'undefined' ? c.image : '/images/gold-banner-cta.jpg';
  const hasImage = Boolean(image && typeof image === 'string' && image.trim() !== '');

  const bgColor = c.bgColor || '#fcfbf9';
  const btnBgColor = c.btnBgColor || '#c59a3f';
  const btnTextColor = c.btnTextColor || '#000000';

  return (
    <section className="w-full py-6 md:py-10 transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 min-h-[160px] md:min-h-[190px] flex items-center bg-[#151515]">
          
          {/* Background Image with Dark Vignette Overlay (if defined and not deleted) */}
          {hasImage && (
            <Image 
              src={image}
              alt="Investissement Or et Argent - Gold Invest"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          <div className={`absolute inset-0 ${hasImage ? 'bg-gradient-to-r from-black/85 via-black/70 to-black/60 md:to-black/40' : 'bg-gradient-to-r from-[#181818] via-[#222222] to-[#141414]'}`} />

          {/* Banner Content */}
          <div className="relative z-10 w-full p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-200 font-light">
                {subtitle}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link 
                href={btnUrl} 
                style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                className="inline-flex items-center gap-3 font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#c59a3f]/30 group cursor-pointer"
              >
                <span>{btnText}</span>
                <LuxuryArrow className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
