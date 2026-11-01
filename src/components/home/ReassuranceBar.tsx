'use client';

import React from 'react';

export default function ReassuranceBar() {
  const items = [
    {
      title: 'Qualité garantie',
      desc: 'Des produits certifiés et authentiques',
      icon: (
        <svg className="w-8 h-8 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6 3h12l4 6-10 12L2 9l4-6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 21L7.5 9h9L12 21z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M2 9h20" />
        </svg>
      )
    },
    {
      title: 'Prix compétitifs',
      desc: 'Un excellent rapport qualité-prix',
      icon: (
        <svg className="w-8 h-8 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth={1.7} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 9.5a4 4 0 00-6.5 3.1 4 4 0 006.5 3.1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6.5 11h7M6.5 13h7" />
        </svg>
      )
    },
    {
      title: 'Livraison rapide',
      desc: 'Partout en Europe',
      icon: (
        <svg className="w-8 h-8 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 8h10v9H5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 11h4l3 3v3h-7v-6z" />
          <circle cx="8" cy="19" r="2" strokeWidth={1.7} />
          <circle cx="18" cy="19" r="2" strokeWidth={1.7} />
        </svg>
      )
    },
    {
      title: 'Service client réactif',
      desc: 'Notre équipe à votre écoute',
      icon: (
        <svg className="w-8 h-8 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 18v-6a9 9 0 0118 0v6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-white border-y border-gray-100 py-8 md:py-10 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
          {items.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-6 sm:pt-0 lg:pl-6' : ''}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#c59a3f]/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm md:text-base font-bold text-gray-900 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

