'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

export interface TestimonialReviewItem {
  id: string | number;
  name: string;
  city?: string;
  asset?: string;
  text: string;
  rating: number;
  date?: string;
  isVerified?: boolean;
}

interface TestimonialsSectionProps {
  config?: Record<string, string>;
  dbReviews?: any[];
}

function formatReviewDate(dateInput: Date | string | undefined, locale: string): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      fr: "Aujourd'hui",
      en: 'Today',
      de: 'Heute',
      es: 'Hoy',
      it: 'Oggi',
      nl: 'Vandaag',
      pt: 'Hoje',
      da: 'I dag',
      hu: 'Ma',
    }[locale] || "Aujourd'hui";
  }

  if (diffDays < 7) {
    return {
      fr: `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
      en: `${diffDays} day${diffDays > 1 ? 's' : ''} ago`,
      de: `Vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`,
      es: `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`,
      it: `${diffDays} giorn${diffDays > 1 ? 'i' : 'o'} fa`,
      nl: `${diffDays} dag${diffDays > 1 ? 'en' : ''} geleden`,
      pt: `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`,
      da: `For ${diffDays} dag${diffDays > 1 ? 'e' : ''} siden`,
      hu: `${diffDays} napja`,
    }[locale] || `Il y a ${diffDays} jours`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return {
      fr: `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`,
      en: `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`,
      de: `Vor ${diffWeeks} Woche${diffWeeks > 1 ? 'n' : ''}`,
      es: `Hace ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`,
      it: `${diffWeeks} settiman${diffWeeks > 1 ? 'e' : 'a'} fa`,
      nl: `${diffWeeks} we${diffWeeks > 1 ? 'ken' : 'ek'} geleden`,
      pt: `Há ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`,
      da: `For ${diffWeeks} uge${diffWeeks > 1 ? 'r' : ''} siden`,
      hu: `${diffWeeks} hete`,
    }[locale] || `Il y a ${diffWeeks} semaines`;
  }

  return date.toLocaleDateString(locale === 'en' ? 'en-US' : (locale === 'de' ? 'de-DE' : 'fr-FR'), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TestimonialsSection({ config, dbReviews = [] }: TestimonialsSectionProps) {
  const c = config || {};
  const t = useTranslations('Landing.Testimonials');
  const locale = useLocale();
  const isFrench = locale === 'fr';

  const badge = (isFrench && c.badge) || t('badge');
  const title = (isFrench && c.title) || t('title');
  const subtitle = (isFrench && c.subtitle) || t('subtitle');
  const ratingScore = t('rating_score');
  const investorsText = t('investors_text');

  // Localized verified badge text
  const verifiedBadgeText = {
    fr: 'Achat vérifié',
    en: 'Verified purchase',
    de: 'Verifizierter Kauf',
    es: 'Compra verificada',
    it: 'Acquisto verificato',
    nl: 'Geverifieerde aankoop',
    pt: 'Compra verificada',
    da: 'Verificeret køb',
    hu: 'Ellenőrzött vásárlás',
  }[locale] || t('verified_purchase') || 'Achat vérifié';

  // Localized subtitle fallback for verified reviewers
  const verifiedInvestorSub = {
    fr: 'Investisseur vérifié',
    en: 'Verified Investor',
    de: 'Verifizierter Anleger',
    es: 'Inversor verificado',
    it: 'Investitore verificato',
    nl: 'Geverifieerde belegger',
    pt: 'Investidor verificado',
    da: 'Verificeret investor',
    hu: 'Hitelesített befektető',
  }[locale] || 'Investisseur vérifié';

  const defaultAssetTag = {
    fr: "Or & Argent d'investissement",
    en: 'Investment Gold & Silver',
    de: 'Anlagegold & -silber',
    es: 'Oro y Plata de inversión',
    it: 'Oro e Argento da investimento',
    nl: 'Beleggingsgoud & -zilver',
    pt: 'Ouro e Prata de investimento',
    da: 'Investeringsguld og -sølv',
    hu: 'Befektetési arany és ezüst',
  }[locale] || "Or d'investissement";

  // Build default fallback reviews list from config or translations
  const fallbackReviews: TestimonialReviewItem[] = [
    {
      id: 'fb-1',
      name: (isFrench && c.review1_name) || t('review1_name'),
      city: (isFrench && c.review1_city) || t('review1_city'),
      asset: (isFrench && c.review1_asset) || t('review1_asset'),
      text: (isFrench && c.review1_text) || t('review1_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review1_rating || '5', 10) || 5)),
      date: (isFrench && c.review1_date) || t('review1_date'),
      isVerified: true,
    },
    {
      id: 'fb-2',
      name: (isFrench && c.review2_name) || t('review2_name'),
      city: (isFrench && c.review2_city) || t('review2_city'),
      asset: (isFrench && c.review2_asset) || t('review2_asset'),
      text: (isFrench && c.review2_text) || t('review2_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review2_rating || '5', 10) || 5)),
      date: (isFrench && c.review2_date) || t('review2_date'),
      isVerified: true,
    },
    {
      id: 'fb-3',
      name: (isFrench && c.review3_name) || t('review3_name'),
      city: (isFrench && c.review3_city) || t('review3_city'),
      asset: (isFrench && c.review3_asset) || t('review3_asset'),
      text: (isFrench && c.review3_text) || t('review3_text'),
      rating: Math.min(5, Math.max(1, parseInt(c.review3_rating || '5', 10) || 5)),
      date: (isFrench && c.review3_date) || t('review3_date'),
      isVerified: true,
    },
    c.review4_name ? {
      id: 'fb-4',
      name: c.review4_name,
      city: c.review4_city || 'Lyon, France',
      asset: c.review4_asset || "Lingot d'Or 50 g LBMA",
      text: c.review4_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review4_rating || '5', 10) || 5)),
      date: c.review4_date || 'Il y a 3 semaines',
      isVerified: true,
    } : null,
    c.review5_name ? {
      id: 'fb-5',
      name: c.review5_name,
      city: c.review5_city || 'Bordeaux, France',
      asset: c.review5_asset || "Souverain Or Élisabeth II",
      text: c.review5_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review5_rating || '5', 10) || 5)),
      date: c.review5_date || 'Il y a 1 mois',
      isVerified: true,
    } : null,
    c.review6_name ? {
      id: 'fb-6',
      name: c.review6_name,
      city: c.review6_city || 'Monaco',
      asset: c.review6_asset || "Lingot d'Or 250 g LBMA",
      text: c.review6_text || '',
      rating: Math.min(5, Math.max(1, parseInt(c.review6_rating || '5', 10) || 5)),
      date: c.review6_date || 'Il y a 1 mois',
      isVerified: true,
    } : null
  ].filter((r): r is NonNullable<typeof r> => r !== null && Boolean(r.name));

  // Transform database approved reviews
  const mappedDbReviews: TestimonialReviewItem[] = (dbReviews || []).map((rev: any) => {
    const rawName = rev.reviewerName || (rev.user?.email ? rev.user.email.split('@')[0] : 'Client');
    // Clean name: capitalize first letter
    const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const productTitle = rev.product?.translations?.[0]?.title || rev.product?.title || defaultAssetTag;

    return {
      id: rev.id,
      name: cleanName,
      city: verifiedInvestorSub,
      asset: productTitle,
      text: rev.comment ? `« ${rev.comment.trim()} »` : '',
      rating: Math.min(5, Math.max(1, Number(rev.rating) || 5)),
      date: formatReviewDate(rev.createdAt, locale),
      isVerified: true,
    };
  }).filter((r: TestimonialReviewItem) => Boolean(r.text));

  // Combine DB reviews with fallbacks if needed to ensure at least 3 reviews are always shown
  let reviews: TestimonialReviewItem[] = [];
  if (mappedDbReviews.length >= 3) {
    reviews = mappedDbReviews.slice(0, 6);
  } else if (mappedDbReviews.length > 0) {
    // Prepend DB reviews, then complement with fallback reviews
    const needed = Math.max(0, 3 - mappedDbReviews.length);
    reviews = [...mappedDbReviews, ...fallbackReviews.slice(0, needed)];
  } else {
    reviews = fallbackReviews.slice(0, 3);
  }

  // Dynamic rating score calculation if DB reviews are present
  const displayRatingScore = mappedDbReviews.length > 0
    ? `${(mappedDbReviews.reduce((sum, r) => sum + r.rating, 0) / mappedDbReviews.length).toFixed(1)} / 5`
    : ratingScore;

  // Title highlight detection across all locales
  const highlightWords: Record<string, string> = {
    fr: 'confiance',
    en: 'Investors',
    de: 'vertrauen',
    es: 'Nosotros',
    it: 'fiducia',
    nl: 'vertrouwen',
    pt: 'confiança',
    da: 'tillid',
    hu: 'bizalom',
  };
  const targetHighlight = highlightWords[locale] || 'confiance';

  const renderTitle = () => {
    const lowerTitle = title.toLowerCase();
    const lowerHighlight = targetHighlight.toLowerCase();
    const idx = lowerTitle.indexOf(lowerHighlight);

    if (idx !== -1) {
      const before = title.slice(0, idx);
      const match = title.slice(idx, idx + targetHighlight.length);
      const after = title.slice(idx + targetHighlight.length);
      return (
        <>
          {before}
          <span className="bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] bg-clip-text text-transparent italic">
            {match}
          </span>
          {after}
        </>
      );
    }
    return title;
  };

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

          {/* Heading with elegant highlight */}
          <h2 className="font-serif font-bold text-[32px] sm:text-[40px] text-[#0E2036] tracking-tight leading-tight mb-3">
            {renderTitle()}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-gray-600 font-normal leading-relaxed mb-6">
            {subtitle}
          </p>

          {/* Trust Rating Aggregate Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-white px-4 sm:px-5 py-2.5 sm:py-2 rounded-2xl sm:rounded-full border border-gray-200/80 shadow-xs text-[12.5px] sm:text-[13px] text-gray-700 mx-auto max-w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-gray-900 font-serif">{displayRatingScore}</span>
            </div>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-600 sm:text-gray-500 font-medium sm:font-normal text-xs sm:text-[13px] text-center">
              {investorsText}
            </span>
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
                  <div className="flex items-center gap-1" aria-label={`${review.rating} / 5`}>
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

                  {/* Verified Badge (Translated) */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
                    <svg className="w-3 h-3 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{verifiedBadgeText}</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-[14.5px] text-gray-700 leading-relaxed font-normal mb-5 line-clamp-4">
                  {review.text}
                </p>
              </div>

              {/* Bottom: Client Profile & Purchased Asset Tag */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[14.5px] text-gray-900 truncate max-w-[160px] sm:max-w-[180px]">
                      {review.name}
                    </h4>
                    {review.city && (
                      <span className="text-[12px] text-gray-400 block truncate max-w-[160px] sm:max-w-[180px]">
                        {review.city}
                      </span>
                    )}
                  </div>
                  {review.date && (
                    <span className="text-[11px] text-gray-400 font-mono shrink-0">
                      {review.date}
                    </span>
                  )}
                </div>

                {/* Acquired Asset Tag */}
                {review.asset && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-[#C8732A] bg-[#C8732A]/8 px-2.5 py-1 rounded-md max-w-full overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A] shrink-0" />
                    <span className="truncate">{review.asset}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
