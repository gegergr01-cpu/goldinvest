'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GoldHero() {
  return (
    <section className="relative w-full bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background radial gradient for subtle luxury warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c59a3f]/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Investissez dans <br className="hidden sm:inline" />
              la <span className="text-[#c59a3f]">valeur sûre</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-300 font-light max-w-lg leading-relaxed">
              Pièces d'or, lingots d'or et d'argent au meilleur prix
            </p>

            <div className="mt-8">
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-3 bg-[#c59a3f] hover:bg-[#b08733] text-black font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-[#c59a3f]/25 cursor-pointer group"
              >
                <span>Découvrir notre gamme</span>
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

          {/* Right Image Visual Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[580px] aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image 
                src="/images/hero-gold-silver.jpg" 
                alt="Lingots d'or et d'argent, pièces Krugerrand et Maple Leaf - Gold Invest"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle luxury edge lighting overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

