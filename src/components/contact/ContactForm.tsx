'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/actions/contact';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ContactForm({ phonePlaceholder }: { phonePlaceholder?: string }) {
  const t = useTranslations('Contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');
    setMessage('');

    const formData = new FormData(form);
    const res = await submitContactMessage(formData);

    if (res.error) {
      setStatus('error');
      setMessage(res.error || t('error_sending'));
    } else if (res.success) {
      setStatus('success');
      setMessage(t('success_sending'));
      form.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200/90 text-emerald-800 p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
          <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm font-medium leading-relaxed">
            {message}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200/90 text-rose-800 p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm font-medium leading-relaxed">
            {message}
          </div>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t('name_label')} <span className="text-[#C8732A]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder={t('name_placeholder')}
            className="w-full px-4 py-3 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#E8A63D] focus:ring-2 focus:ring-[#E8A63D]/20 rounded-xl text-sm text-gray-900 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t('email_label_field')} <span className="text-[#C8732A]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder={t('email_placeholder')}
            className="w-full px-4 py-3 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#E8A63D] focus:ring-2 focus:ring-[#E8A63D]/20 rounded-xl text-sm text-gray-900 transition-all outline-none"
          />
        </div>
      </div>

      {/* Row 2: Phone & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t('phone_label_field')}
          </label>
          <input
            type="tel"
            name="phone"
            placeholder={phonePlaceholder || t('phone_placeholder')}
            className="w-full px-4 py-3 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#E8A63D] focus:ring-2 focus:ring-[#E8A63D]/20 rounded-xl text-sm text-gray-900 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t('subject_label')} <span className="text-[#C8732A]">*</span>
          </label>
          <div className="relative">
            <select
              name="subject"
              required
              defaultValue=""
              className="w-full px-4 py-3 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#E8A63D] focus:ring-2 focus:ring-[#E8A63D]/20 rounded-xl text-sm text-gray-800 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {t('subject_placeholder')}
              </option>
              <option value={t('subject_advice')}>{t('subject_advice')}</option>
              <option value={t('subject_storage')}>{t('subject_storage')}</option>
              <option value={t('subject_buyback')}>{t('subject_buyback')}</option>
              <option value={t('subject_quote')}>{t('subject_quote')}</option>
              <option value={t('subject_order')}>{t('subject_order')}</option>
              <option value={t('subject_other')}>{t('subject_other')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Express Quote Promotion Box */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#FDF6ED] via-[#FFFDF9] to-[#FDF6ED] border border-[#E8A63D]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E8A63D]/20 border border-[#E8A63D]/30 flex items-center justify-center shrink-0 text-[#C8732A]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E2036]">
              {t('quote_box_title')}
            </div>
            <div className="text-[11.5px] text-gray-600">
              {t('quote_box_desc')}
            </div>
          </div>
        </div>
        <Link
          href="/devis"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-[#0E2036] hover:bg-[#1B365D] text-[#E8A63D] hover:text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
        >
          {t('quote_box_btn')}
        </Link>
      </div>

      {/* Row 3: Message Textarea */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          {t('message_label')} <span className="text-[#C8732A]">*</span>
        </label>
        <textarea
          name="message"
          required
          placeholder={t('message_placeholder')}
          rows={5}
          className="w-full px-4 py-3 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#E8A63D] focus:ring-2 focus:ring-[#E8A63D]/20 rounded-xl text-sm text-gray-900 transition-all outline-none resize-y"
        ></textarea>
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-[11.5px] text-gray-500 pt-0.5">
        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>{t('privacy_note')}</span>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:brightness-110 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#C8732A]/25 hover:shadow-[#C8732A]/40 transition-all cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t('sending')}</span>
            </>
          ) : (
            <>
              <span>{t('send_btn')}</span>
              <svg className="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
