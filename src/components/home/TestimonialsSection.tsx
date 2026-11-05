'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface TestimonialsSectionProps {
  config?: Record<string, string>;
}

export default function TestimonialsSection({ config }: TestimonialsSectionProps) {
  const c = config || {};
  const t = useTranslations('Landing.Testimonials');
  const locale = useLocale();
  const isFrench = locale === 'fr';

  const badge = (isFrench && c.badge) || t('badge');
  const title = (isFrench && c.title) || t('title');
  const subtitle = (isFrench && c.subtitle) || t('subtitle');
  const ratingScore = t('rating_score');
  const investorsText = t('investors_text');

  // Build dynamic reviews list from config or translations
  const rawReviews = [
    {
      id: 1,
      name: (isFrench && c.review1_name) || t('review1_name'),
      city: (isFrench && c.review1_city) || t('review1_city'),
      asset: (isFrench && c.review1_asset) || t('review1_asset'),
      text: (isFrench && c.review1_text) || t('review1_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review1_rating || '5', 10) || 5)),
      date: (isFrench && c.review1_date) || t('review1_date'),
    },
    {
      id: 2,
      name: (isFrench && c.review2_name) || t('review2_name'),
      city: (isFrench && c.review2_city) || t('review2_city'),
      asset: (isFrench && c.review2_asset) || t('review2_asset'),
      text: (isFrench && c.review2_text) || t('review2_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review2_rating || '5', 10) || 5)),
      date: (isFrench && c.review2_date) || t('review2_date'),
    },
    {
      id: 3,
      name: (isFrench && c.review3_name) || t('review3_name'),
      city: (isFrench && c.review3_city) || t('review3_city'),
      asset: (isFrench && c.review3_asset) || t('review3_asset'),
      text: (isFrench && c.review3_text) || t('review3_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review3_rating || '5', 10) || 5)),
      date: (isFrench && c.review3_date) || t('review3_date'),
    },
    // Optional additional reviews if configured in editor
    c.review4_name ? {
      id: 4,
      name: c.review4_name,
      city: c.review4_city || 'Lyon, France',
      asset: c.review4_asset || "Lingot d'Or 50 g LBMA",
      text: c.review4_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review4_rating || '5', 10) || 5)),
      date: c.review4_date || 'Il y a 3 semaines',
    } : null,
    c.review5_name ? {
      id: 5,
      name: c.review5_name,
      city: c.review5_city || 'Bordeaux, France',
      asset: c.review5_asset || "Souverain Or Élisabeth II",
      text: c.review5_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review5_rating || '5', 10) || 5)),
      date: c.review5_date || 'Il y a 1 mois',
    } : null,
    c.review6_name ? {
      id: 6,
      name: c.review6_name,
      city: c.review6_city || 'Monaco',
      asset: c.review6_asset || "Lingot d'Or 250 g LBMA",
      text: c.review6_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review6_rating || '5', 10) || 5)),
      date: c.review6_date || 'Il y a 1 mois',
    } : null
  ];

  const reviews = rawReviews.filter((r): r is NonNullable<typeof r> => r !== null && Boolean(r.name));

  return (
    <section className="w-full py-20 lg:py-24 bg-[#FAF9F5] border-t border-b border-[#E8E4DA] relative overflow-hidden">
      
      {/* Background subtle watermark & decorative grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#C8732A 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          {/* Eyebrow with gold lines */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C8732A]" />
            <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.18em] text-[#C8732A] uppercase">
              {badge}
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C8732A]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-[32px] sm:text-[40px] text-[#0E2036] tracking-tight leading-tight mb-3">
            {title.includes('confiance') ? (
              <>
                {title.replace('confiance', '')}
                <span className="bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] bg-clip-text text-transparent italic">
                  confiance
                </span>
              </>
            ) : title}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-gray-600 font-normal leading-relaxed mb-6">
            {subtitle}
          </p>

          {/* Trust Rating Aggregate Badge */}
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm text-[13px] text-gray-700">
            <div className="flex items-center text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-gray-900">{ratingScore}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-500 font-normal">{investorsText}</span>
          </div>
        </div>

        {/* Dynamic Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-[20px] p-7 sm:p-8 border border-gray-200/80 hover:border-[#C8732A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_35px_rgba(200,115,42,0.12)] hover:-translate-y-1 flex flex-col justify-between group relative"
            >
              {/* Top Row: Stars + Verified Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Dynamic Stars */}
                  <div className="flex items-center gap-1" aria-label={`${review.rating} sur 5 étoiles`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'text-[#F59E0B] fill-current' : 'text-gray-300 fill-current'}`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Verified Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Achat vérifié
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-[14.5px] text-gray-700 leading-relaxed font-normal mb-5">
                  {review.text}
                </p>
              </div>

              {/* Bottom: Client Profile & Purchased Asset Tag */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[14.5px] text-gray-900">
                      {review.name}
                    </h4>
                    <span className="text-[12px] text-gray-400">
                      {review.city}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {review.date}
                  </span>
                </div>

                {/* Acquired Asset Tag */}
                <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-[#C8732A] bg-[#C8732A]/8 px-2.5 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A]" />
                  <span className="truncate">{review.asset}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
