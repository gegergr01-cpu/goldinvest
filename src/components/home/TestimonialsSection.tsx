'use client';

import React from 'react';

interface TestimonialsSectionProps {
  config?: Record<string, string>;
}

export default function TestimonialsSection({ config }: TestimonialsSectionProps) {
  const c = config || {};

  const badge = c.badge || 'Ils nous font confiance';

  const reviews = [
    {
      id: 1,
      name: c.review1_name || 'Thomas D.',
      text: c.review1_text || '« Service impeccable et livraison rapide. Je recommande vivement ! »',
      rating: parseInt(c.review1_rating || '5', 10),
      avatarBg: 'bg-emerald-600',
      initials: (c.review1_name || 'Thomas D.').split(' ').map(n => n[0]).join('').slice(0, 2)
    },
    {
      id: 2,
      name: c.review2_name || 'Sophie M.',
      text: c.review2_text || '« Des prix très compétitifs et une équipe très professionnelle. »',
      rating: parseInt(c.review2_rating || '5', 10),
      avatarBg: 'bg-amber-600',
      initials: (c.review2_name || 'Sophie M.').split(' ').map(n => n[0]).join('').slice(0, 2)
    },
    {
      id: 3,
      name: c.review3_name || 'Pierre L.',
      text: c.review3_text || '« Une expérience d’achat parfaite. Je reviendrai sans hésiter. »',
      rating: parseInt(c.review3_rating || '5', 10),
      avatarBg: 'bg-blue-600',
      initials: (c.review3_name || 'Pierre L.').split(' ').map(n => n[0]).join('').slice(0, 2)
    }
  ];

  const bgColor = c.bgColor || '#fcfbf9';
  const cardBgColor = c.cardBgColor || '#ffffff';

  return (
    <section 
      className="w-full py-16 md:py-24 border-t border-gray-100 transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest text-[#c59a3f] uppercase">
              {badge}
            </span>
            <span className="w-8 h-[1px] bg-[#c59a3f]" />
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{ backgroundColor: cardBgColor }}
              className="rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5"
            >
              {/* Avatar with Initials & Ring */}
              <div className={`w-14 h-14 rounded-full ${review.avatarBg} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-[#c59a3f]/30`}>
                {review.initials}
              </div>

              {/* Review Content */}
              <div className="flex flex-col">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 text-[#e5a932] mb-1.5">
                  {[...Array(Math.max(1, Math.min(5, review.rating)))].map((_, i) => (
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
