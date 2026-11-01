'use client';

import React from 'react';
import Link from 'next/link';

export default function WhyChooseUs() {
  const pillars = [
    {
      title: 'Produits certifiés',
      desc: 'Authenticité garantie',
      icon: (
        <svg className="w-9 h-9 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Transparence totale',
      desc: 'Des prix clairs',
      icon: (
        <svg className="w-9 h-9 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 6l9-4 9 4M3 6v14l9 4 9-4V6M3 6l9 4 9-4M12 10v14" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 14l-4 3 4 3M16 14l4 3-4 3" />
        </svg>
      )
    },
    {
      title: 'Accompagnement personnalisé',
      desc: 'Une équipe à votre écoute',
      icon: (
        <svg className="w-9 h-9 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Livraison sécurisée',
      desc: 'Dans toute l’Europe',
      icon: (
        <svg className="w-9 h-9 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative w-full bg-[#0d0d0d] text-white py-20 md:py-28 overflow-hidden border-t border-white/5">
      {/* Background golden dust glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#c59a3f]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs md:text-sm font-semibold tracking-wider text-[#c59a3f] uppercase">
                Pourquoi — nous choisir ?
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Votre partenaire <br />
              de confiance
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-300 font-light leading-relaxed">
              Nous vous accompagnons dans votre investissement avec transparence, sécurité et expertise.
            </p>

            <div className="mt-8">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-[#c59a3f] hover:bg-[#b08733] text-black font-semibold text-sm md:text-base px-7 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg group cursor-pointer"
              >
                <span>En savoir plus</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right 4 Pillars Column */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#c59a3f]/50 group-hover:bg-[#c59a3f]/10 transition-all duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[#c59a3f] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

