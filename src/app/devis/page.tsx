'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { submitQuoteAction } from '@/actions/quotes';
import LuxuryArrow from '@/components/ui/LuxuryArrow';

export default function DevisPage() {
  const t = useTranslations('Devis');
  const pathname = usePathname();
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeLocale = pathMatch ? pathMatch[1] : 'fr';
  const localePrefix = activeLocale && activeLocale !== 'fr' ? `/${activeLocale}` : '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedQuoteId, setGeneratedQuoteId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const res = await submitQuoteAction(formData);

    if (res.error) {
      setStatus('error');
      setErrorMessage(res.error);
    } else if (res.success) {
      setStatus('success');
      setGeneratedQuoteId(res.quoteId || '');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0E2036]">
      
      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#0E2036] text-white py-16 lg:py-20 overflow-hidden border-b border-[#C8732A]/30">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#E8A63D 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#C8732A]/40 text-[#E8A63D] text-xs font-mono tracking-widest uppercase mb-4">
            <span>✨</span> {t('badge')}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── FORM CONTAINER ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        {status === 'success' ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#C8732A]/30 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#C8732A] uppercase">
                {t('success_badge')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2036]">
                {t('success_title')}
              </h2>
              <div className="inline-block bg-[#0E2036] text-[#E8A63D] font-mono text-sm px-4 py-1.5 rounded-md mt-2 font-bold tracking-wider">
                {t('reference')} {generatedQuoteId}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
              {t('success_desc')}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`${localePrefix}/account/quotes`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white text-sm font-semibold transition-colors shadow-md"
              >
                <span>{t('btn_my_quotes')}</span>
                <LuxuryArrow className="w-3 h-3 brightness-0 invert" />
              </Link>
              <Link
                href={`${localePrefix || '/'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                {t('btn_home')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200/90 shadow-lg space-y-8">
            
            <div className="border-b border-gray-100 pb-5">
              <h2 className="font-serif text-2xl font-bold text-[#0E2036]">
                {t('form_title')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t('form_desc')}
              </p>
            </div>

            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Identité */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                  {t('section_contact')}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t('placeholder_name')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t('placeholder_email')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_address')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder={t('placeholder_address')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Critères d'investissement */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                  {t('section_project')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_metal')}
                    </label>
                    <select
                      name="metalType"
                      defaultValue={t('metal_options.opt1')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                    >
                      <option value={t('metal_options.opt1')}>{t('metal_options.opt1')}</option>
                      <option value={t('metal_options.opt2')}>{t('metal_options.opt2')}</option>
                      <option value={t('metal_options.opt3')}>{t('metal_options.opt3')}</option>
                      <option value={t('metal_options.opt4')}>{t('metal_options.opt4')}</option>
                      <option value={t('metal_options.opt5')}>{t('metal_options.opt5')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t('label_budget')}
                    </label>
                    <select
                      name="investmentAmount"
                      defaultValue={t('budget_options.opt2')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                    >
                      <option value={t('budget_options.opt1')}>{t('budget_options.opt1')}</option>
                      <option value={t('budget_options.opt2')}>{t('budget_options.opt2')}</option>
                      <option value={t('budget_options.opt3')}>{t('budget_options.opt3')}</option>
                      <option value={t('budget_options.opt4')}>{t('budget_options.opt4')}</option>
                      <option value={t('budget_options.opt5')}>{t('budget_options.opt5')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {t('label_delivery')}
                  </label>
                  <select
                    name="deliveryPreference"
                    defaultValue={t('delivery_options.opt1')}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                  >
                    <option value={t('delivery_options.opt1')}>
                      {t('delivery_options.opt1')}
                    </option>
                    <option value={t('delivery_options.opt2')}>
                      {t('delivery_options.opt2')}
                    </option>
                    <option value={t('delivery_options.opt3')}>
                      {t('delivery_options.opt3')}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {t('label_message')}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={t('placeholder_message')}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                  />
                </div>
              </div>

              {/* Legal Notice Box */}
              <div className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-lg p-3.5 text-[11.5px] text-gray-600 space-y-1">
                <p className="font-semibold text-[#0E2036] flex items-center gap-1.5">
                  <span className="text-[#C8732A]">{t('legal_title')}</span>
                </p>
                <p>
                  {t('legal_text')}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-[#0E2036] hover:bg-[#1A3353] text-white text-sm font-semibold transition-colors shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <span>{t('btn_loading')}</span>
                  ) : (
                    <>
                      <span>{t('btn_submit')}</span>
                      <LuxuryArrow className="w-3 h-3 brightness-0 invert" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

    </div>
  );
}
