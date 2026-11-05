'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

interface SelectionGridProps {
  config?: Record<string, string>;
}

export default function SelectionGrid({ config }: SelectionGridProps) {
  const c = config || {};
  const t = useTranslations('Landing.Selection');
  const locale = useLocale();
  const isFrench = locale === 'fr';

  const badge = (isFrench && c.badge) || t('badge');
  const title = (isFrench && c.title) || t('title');
  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';

  const getHref = (rawUrl: string) => {
    return rawUrl.startsWith('/') ? `${localePrefix}${rawUrl}` : rawUrl;
  };

  const items = [
    {
      id: 'card1',
      title: (isFrench && c.card1_title) || t('card1_title'),
      desc: (isFrench && c.card1_desc) || t('card1_desc'),
      image: typeof c.card1_img !== 'undefined' ? c.card1_img : '/images/gold-coins.jpg',
      href: getHref(c.card1_url || '/shop?category=pieces-dor')
    },
    {
      id: 'card2',
      title: (isFrench && c.card2_title) || t('card2_title'),
      desc: (isFrench && c.card2_desc) || t('card2_desc'),
      image: typeof c.card2_img !== 'undefined' ? c.card2_img : '/images/gold-bars.jpg',
      href: getHref(c.card2_url || '/shop?category=lingots-dor')
    },
    {
      id: 'card3',
      title: (isFrench && c.card3_title) || t('card3_title'),
      desc: (isFrench && c.card3_desc) || t('card3_desc'),
      image: typeof c.card3_img !== 'undefined' ? c.card3_img : '/images/silver-bars.jpg',
      href: getHref(c.card3_url || '/shop?category=lingots-dargent')
    },
    {
      id: 'card4',
      title: (isFrench && c.card4_title) || t('card4_title'),
      desc: (isFrench && c.card4_desc) || t('card4_desc'),
      image: typeof c.card4_img !== 'undefined' ? c.card4_img : '/images/silver-coins.jpg',
      href: getHref(c.card4_url || '/shop?category=pieces-dargent')
    }
  ];

  const bgColor = c.bgColor || '#fcfbf9';
  const cardBgColor = c.cardBgColor || '#151515';

  return (
    <section className="w-full py-16 md:py-24 transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest text-[#c59a3f] uppercase">
              {badge}
            </span>
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {items.map((item) => {
            const hasCardImage = Boolean(item.image && typeof item.image === 'string' && item.image.trim() !== '');

            return (
              <div
                key={item.id}
                style={{ backgroundColor: cardBgColor }}
                className="group rounded-2xl overflow-hidden flex flex-col justify-between border border-white/5 hover:border-[#c59a3f]/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Product Image on Dark Background (if defined) */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#222222] to-[#151515] overflow-hidden flex items-center justify-center">
                  {hasCardImage ? (
                    <>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#c59a3f]/40 mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Aucune image</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 pt-3 flex flex-col items-center text-center flex-grow justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white group-hover:text-[#c59a3f] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-400 font-light">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 w-full flex justify-center">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#c59a3f]/40 text-[#c59a3f] hover:bg-[#c59a3f] hover:text-black font-medium text-xs md:text-sm transition-all duration-300 group-hover:border-[#c59a3f]"
                    >
                      <span>Découvrir</span>
                      <LuxuryArrow className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
