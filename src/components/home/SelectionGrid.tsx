'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SelectionGridProps {
  config?: Record<string, string>;
}

export default function SelectionGrid({ config }: SelectionGridProps) {
  const c = config || {};

  const badge = c.badge || 'Notre sélection';
  const title = c.title || 'Or & Argent';

  const items = [
    {
      id: 'card1',
      title: c.card1_title || "Pièces d'or",
      desc: c.card1_desc || 'Un patrimoine intemporel',
      image: c.card1_img || '/images/gold-coins.jpg',
      href: c.card1_url || '/shop?category=pieces-dor'
    },
    {
      id: 'card2',
      title: c.card2_title || "Lingots d'or",
      desc: c.card2_desc || 'Une valeur sûre',
      image: c.card2_img || '/images/gold-bars.jpg',
      href: c.card2_url || '/shop?category=lingots-dor'
    },
    {
      id: 'card3',
      title: c.card3_title || "Lingots d'argent",
      desc: c.card3_desc || 'Investir autrement',
      image: c.card3_img || '/images/silver-bars.jpg',
      href: c.card3_url || '/shop?category=lingots-dargent'
    },
    {
      id: 'card4',
      title: c.card4_title || "Pièces d'argent",
      desc: c.card4_desc || 'Un investissement accessible',
      image: c.card4_img || '/images/silver-coins.jpg',
      href: c.card4_url || '/shop?category=pieces-dargent'
    }
  ];

  return (
    <section className="w-full bg-[#fcfbf9] py-16 md:py-24">
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
          {items.map((item) => (
            <div 
              key={item.id}
              className="group bg-[#151515] rounded-2xl overflow-hidden flex flex-col justify-between border border-white/5 hover:border-[#c59a3f]/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Product Image on Dark Background */}
              <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#222222] to-[#151515] overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="p-6 pt-2 flex flex-col items-center text-center flex-grow justify-between">
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
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
