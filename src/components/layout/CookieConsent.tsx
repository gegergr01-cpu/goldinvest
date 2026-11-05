'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if consent has already been given or declined
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }

    // Allow user to re-open cookie preferences from the footer link
    const handleOpenPrefs = () => setShowBanner(true);
    window.addEventListener('open-cookie-preferences', handleOpenPrefs);

    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenPrefs);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
    // Dispatch custom event to initialize analytics/trackers if consent given
    window.dispatchEvent(new Event('cookie_consent_accepted'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setShowBanner(false);
    window.dispatchEvent(new Event('cookie_consent_declined'));
  };

  if (!mounted || !showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies"
      className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-auto sm:bottom-6 z-50 max-w-sm sm:max-w-[420px] w-auto sm:w-full bg-[#0E2036]/95 backdrop-blur-xl border border-[#E8A63D]/35 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_25px_rgba(232,166,61,0.08)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header: Shield Icon + Title + GDPR Pill + Close Button */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#E8A63D]/25 to-[#C8732A]/35 border border-[#E8A63D]/50 flex items-center justify-center shrink-0 shadow-inner">
            <svg
              className="w-4 h-4 text-[#E8A63D]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-white text-[14px] sm:text-[15px] tracking-wide truncate">
                {t('title')}
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9.5px] text-emerald-400 font-semibold tracking-wide uppercase shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                RGPD
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDecline}
          aria-label="Fermer"
          className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors -mr-1 -mt-1 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body: Clear text adapted to bullion transactions */}
      <p className="text-white/75 text-[12px] sm:text-[12.5px] leading-relaxed mb-3">
        {t('message')}
      </p>

      {/* Privacy Policy Link */}
      <div className="mb-3.5">
        <Link
          href="/pages/politique-de-confidentialite"
          className="text-[11.5px] text-[#E8A63D] hover:text-[#FFE599] font-medium transition-colors inline-flex items-center gap-1 group"
        >
          <span>{t('privacy_policy')}</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
        <button
          onClick={handleDecline}
          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-semibold tracking-wide transition-all cursor-pointer text-center"
        >
          {t('decline')}
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:brightness-110 text-white text-xs font-bold tracking-wide shadow-md shadow-[#C8732A]/30 hover:shadow-[#C8732A]/50 transition-all cursor-pointer text-center"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
