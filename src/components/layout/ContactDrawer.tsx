'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logoImage?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  address?: string;
  description?: string;
}

export default function ContactDrawer({
  isOpen,
  onClose,
  logoImage,
  phone1 = '+33 6 17 26 47 05',
  phone2 = '+33 6 05 82 51 96',
  email = 'azevia.solutions@gmail.com',
  address = 'Laval, France',
  description,
}: ContactDrawerProps) {
  const t = useTranslations('ContactDrawer');
  const pathname = usePathname();
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeLocale = pathMatch ? pathMatch[1] : 'fr';
  const localePrefix = activeLocale && activeLocale !== 'fr' ? `/${activeLocale}` : '';

  const drawerDescription = description || t('description');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#040A14]/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Quick panel (matching Capture 1 & AZ Solutions .quick-panel) */}
      <aside
        className="relative z-10 w-[380px] max-w-[92vw] bg-[#0E2036] text-white h-screen overflow-y-auto p-[40px_30px] flex flex-col justify-between shadow-[-24px_0_60px_rgba(0,0,0,0.4)] animate-in slide-in-from-right duration-300"
        aria-label={t('contact_title')}
      >
        <div>
          {/* Head: Logo + Circular White Close Button */}
          <div className="flex items-start justify-between gap-3.5 mb-8">
            <Link href={`${localePrefix || '/'}`} onClick={onClose} className="flex items-center select-none">
              {logoImage ? (
                <Image
                  src={logoImage}
                  alt="Logo"
                  width={160}
                  height={45}
                  unoptimized
                  className="max-h-11 w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col items-start gap-1">
                  <span className="font-serif font-bold text-[21px] text-white tracking-[0.01em] leading-none">
                    GOLD<span className="text-[#E8A63D]">INVEST</span>
                  </span>
                  <span className="font-mono text-[9.5px] font-medium tracking-[0.16em] text-white/50 uppercase leading-none">
                    {t('tagline')}
                  </span>
                </div>
              )}
            </Link>

            {/* Circular White Close Button with 90° rotation on hover */}
            <button
              onClick={onClose}
              type="button"
              className="w-[38px] h-[38px] rounded-full bg-white text-[#0E2036] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:rotate-90 flex-none shadow-md"
              aria-label={t('close')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="w-[15px] h-[15px]">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-white/65 text-[14.5px] leading-[1.65] mb-8 font-normal">
            {drawerDescription}
          </p>

          {/* Title: Contact */}
          <h3 className="font-serif text-white text-[21px] font-bold mb-4">
            {t('contact_title')}
          </h3>

          {/* Field: Téléphone / WhatsApp */}
          <div className="mb-5">
            <p className="text-[12.5px] text-white/50 mb-1.5 font-normal">{t('phone_whatsapp')}</p>
            <p className="flex items-center gap-2.5 text-white font-semibold text-[15.5px] m-0">
              <span className="w-2 h-2 rounded-full bg-[#D2571E] flex-none" />
              <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="text-white hover:text-[#E8A63D] transition-colors">
                {phone1}
              </a>
            </p>
          </div>

          {/* Field: Second numéro */}
          {phone2 && (
            <div className="mb-5">
              <p className="text-[12.5px] text-white/50 mb-1.5 font-normal">{t('second_phone')}</p>
              <p className="text-white font-semibold text-[15.5px] m-0">
                <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="text-white hover:text-[#E8A63D] transition-colors">
                  {phone2}
                </a>
              </p>
            </div>
          )}

          {/* Field: Email */}
          <div className="mb-5">
            <p className="text-[12.5px] text-white/50 mb-1.5 font-normal">{t('email')}</p>
            <p className="text-white font-semibold text-[15.5px] m-0">
              <a href={`mailto:${email}`} className="text-white hover:text-[#E8A63D] transition-colors break-all">
                {email}
              </a>
            </p>
          </div>

          {/* Field: Siège social */}
          <div className="mb-6">
            <p className="text-[12.5px] text-white/50 mb-1.5 font-normal">{t('head_office')}</p>
            <p className="text-white font-semibold text-[15.5px] m-0">
              {address}
            </p>
          </div>

          {/* Title: Suivez-nous : */}
          <h3 className="font-serif text-white text-[21px] font-bold mb-3">
            {t('follow_us')}
          </h3>

          <div className="flex gap-2.5 mt-1">
            {/* TikTok Icon (from AZ Solutions markup) */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[38px] h-[38px] rounded-full bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-white transition-colors duration-150"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M16.5 3c.4 2 1.8 3.4 3.8 3.7v2.7c-1.4 0-2.7-.4-3.8-1.2v6.4c0 3.2-2.6 5.4-5.5 5.4-3 0-5.5-2.3-5.5-5.4 0-3 2.5-5.4 5.5-5.4.4 0 .8 0 1.1.1v2.8a2.7 2.7 0 0 0-1.1-.2c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.9-1.3 2.9-2.9V3h2.6z" />
              </svg>
            </a>

            {/* WhatsApp direct */}
            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[38px] h-[38px] rounded-full bg-white/[0.08] hover:bg-emerald-600 flex items-center justify-center text-white transition-colors duration-150"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12 19.82c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.88 7.88 0 0 1-1.2-4.16c0-4.36 3.55-7.91 7.91-7.91 2.11 0 4.1.82 5.6 2.31a7.86 7.86 0 0 1 2.31 5.6c0 4.36-3.55 7.92-7.93 7.92zm4.33-5.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[38px] h-[38px] rounded-full bg-white/[0.08] hover:bg-[#0077b5] flex items-center justify-center text-white transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28M7.85 18.5V10.13H5.06v8.37h2.79z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <Link
            href={`${localePrefix}/devis`}
            onClick={onClose}
            className="w-full bg-[#D2571E] hover:bg-[#A8420F] text-white font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 shadow-lg transition-all text-[14.5px]"
          >
            <span>{t('request_free_quote')}</span>
            <span className="text-sm">↗</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
