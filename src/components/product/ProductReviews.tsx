'use client';

import { useState } from 'react';
import { submitReview } from '@/actions/reviews';
import { useTranslations, useLocale } from 'next-intl';
import SafeHTML from '@/components/SafeHTML';
import LuxuryArrow from '@/components/ui/LuxuryArrow';

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  reviewerName?: string | null;
};

type ProductReviewsProps = {
  productId: string;
  productTitle?: string;
  reviews: Review[];
  description?: string | null;
  isLoggedIn: boolean;
};

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg 
    className={`w-4 h-4 ${filled ? 'text-[#C8732A]' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ProductReviews({ productId, productTitle, reviews, description, isLoggedIn }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const t = useTranslations('Product');
  const locale = useLocale();
  const localePrefix = locale === 'fr' ? '' : `/${locale}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const res = await submitReview(productId, rating, comment);
    
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: t('review_submitted') });
      setComment('');
      setRating(5);
    }
    setLoading(false);
  };

  return (
    <div className="mt-16">
      {/* Tab Navigation */}
      <div className="flex gap-2 relative z-10">
        <button 
          type="button"
          onClick={() => setActiveTab('desc')}
          className={`px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-serif font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'desc' 
              ? 'bg-white text-[#0E2036] border-t-2 border-[#C8732A] shadow-xs' 
              : 'bg-[#FAF5EB]/80 text-[#6E685F] hover:bg-white hover:text-[#0E2036] border border-[#E8E4DA] border-b-0'
          }`}
        >
          <svg className="w-4 h-4 text-[#C8732A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span>{t('tab_desc_analysis')}</span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-serif font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reviews' 
              ? 'bg-white text-[#0E2036] border-t-2 border-[#C8732A] shadow-xs' 
              : 'bg-[#FAF5EB]/80 text-[#6E685F] hover:bg-white hover:text-[#0E2036] border border-[#E8E4DA] border-b-0'
          }`}
        >
          <svg className="w-4 h-4 text-[#C8732A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          <span>{t('tab_investor_reviews', { count: reviews.length })}</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="w-full border border-[#E8E4DA] rounded-b-2xl rounded-tr-2xl p-6 sm:p-10 bg-white shadow-xs">
        {activeTab === 'desc' ? (
          <div className="space-y-6">
            {description ? (
              <div className="w-full overflow-x-auto text-sm text-[#3E3830] leading-relaxed">
                <SafeHTML 
                  html={description}
                  className="prose prose-sm max-w-none w-full whitespace-normal text-gray-700" 
                />
              </div>
            ) : (
              <div className="text-sm text-gray-500 py-6 text-center">
                {t('desc_updating')}
              </div>
            )}

            {/* LBMA Certification & Investment Advisory Box */}
            <div className="mt-8 p-6 bg-[#FAF9F5] border border-[#E8E4DA] rounded-2xl">
              <h4 className="text-sm font-serif font-bold text-[#0E2036] mb-2 flex items-center gap-2">
                <span>{t('advisory_title')}</span>
              </h4>
              <p className="text-xs text-[#6E685F] leading-relaxed mb-4">
                {t('advisory_p1')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E8E4DA]">
                  <span className="font-bold text-[#0E2036] block">{t('advisory_card1_title')}</span>
                  <span className="text-[11px] text-gray-500">{t('advisory_card1_desc')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E4DA]">
                  <span className="font-bold text-[#0E2036] block">{t('advisory_card2_title')}</span>
                  <span className="text-[11px] text-gray-500">{t('advisory_card2_desc')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E4DA]">
                  <span className="font-bold text-[#0E2036] block">{t('advisory_card3_title')}</span>
                  <span className="text-[11px] text-gray-500">{t('advisory_card3_desc')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Reviews List */}
            <div>
              <h3 className="text-base font-serif font-bold mb-4 text-[#0E2036]">
                {t('reviews_feedback_title')}
              </h3>
              
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-[#E8E4DA]">
                  <p className="text-sm text-gray-500 font-medium">{t('no_reviews')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('be_first_investor_review')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-[#F2EFE8] pb-6 last:border-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= review.rating} />)}
                          </div>
                          <span className="text-xs font-bold text-[#0E2036]">
                            {review.reviewerName || t('verified_investor')}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ {t('verified_purchase')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3E3830] leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Submission Form */}
            <div className="pt-6 border-t border-[#E8E4DA]">
              <h4 className="text-sm font-serif font-bold text-[#0E2036] mb-1">
                {t('leave_review_title', { product: productTitle || '' })}
              </h4>
              <p className="text-xs text-gray-500 mb-6">
                {t('leave_review_subtitle')}
              </p>
              
              {!isLoggedIn ? (
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E8E4DA] text-xs text-gray-600 flex items-center justify-between">
                  <span>{t('must_be_logged_in')}</span>
                  <a href={`${localePrefix}/login`} className="font-bold text-[#C8732A] hover:underline">
                    {t('login')} →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                  {msg.text && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {msg.text}
                    </div>
                  )}
                  
                  {/* Rating Selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-[#0E2036]">{t('your_rating_text')} :</label>
                    <div className="flex gap-1 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-hidden"
                          aria-label={`${star} étoiles`}
                        >
                          <svg 
                            className={`w-5 h-5 ${star <= rating ? 'text-[#C8732A]' : 'text-gray-300'} hover:text-[#C8732A] transition-colors`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-[#0E2036] mb-1.5">{t('your_review')} :</label>
                    <textarea 
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      placeholder={t('review_comment_placeholder')}
                      className="w-full text-xs p-3 border border-[#E8E4DA] rounded-xl focus:ring-1 focus:ring-[#C8732A] focus:border-[#C8732A] outline-hidden bg-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-[#0E2036] hover:bg-[#1B365D] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? t('sending') : t('publish_review_btn')}</span>
                    <LuxuryArrow className="w-3 h-3 text-[#E8A63D]" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
