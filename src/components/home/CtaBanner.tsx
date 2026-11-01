'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CtaBanner() {
  return (
    <section className="w-full bg-[#fcfbf9] py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 min-h-[160px] md:min-h-[190px] flex items-center">
          
          {/* Background Image with Dark Vignette Overlay */}
          <Image 
            src="/images/gold-banner-cta.jpg"
            alt="Investissement Or et Argent - Gold Invest"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60 md:to-black/40" />

          {/* Banner Content */}
          <div className="relative z-10 w-full p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                Investissez dès aujourd’hui
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-200 font-light">
                Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-3 bg-[#c59a3f] hover:bg-[#b08733] text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#c59a3f]/30 group cursor-pointer"
              >
                <span>Découvrir notre gamme</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

