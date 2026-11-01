'use client';

import React from 'react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Thomas D.',
      text: '« Service impeccable et livraison rapide. Je recommande vivement ! »',
      rating: 5,
      avatarBg: 'bg-emerald-600',
      initials: 'TD'
    },
    {
      id: 2,
      name: 'Sophie M.',
      text: '« Des prix très compétitifs et une équipe très professionnelle. »',
      rating: 5,
      avatarBg: 'bg-amber-600',
      initials: 'SM'
    },
    {
      id: 3,
      name: 'Pierre L.',
      text: '« Une expérience d’achat parfaite. Je reviendrai sans hésiter. »',
      rating: 5,
      avatarBg: 'bg-blue-600',
      initials: 'PL'
    }
  ];

  return (
    <section className="w-full bg-[#fcfbf9] py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest text-[#c59a3f] uppercase">
              Ils nous font confiance
            </span>
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5"
            >
              {/* Avatar with Initials & Ring */}
              <div className={`w-14 h-14 rounded-full ${review.avatarBg} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-[#c59a3f]/30`}>
                {review.initials}
              </div>

              {/* Review Content */}
              <div className="flex flex-col">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 text-[#e5a932] mb-1.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 italic leading-snug">
                  {review.text}
                </p>

                <span className="mt-2 text-xs font-semibold text-gray-900 not-italic">
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

