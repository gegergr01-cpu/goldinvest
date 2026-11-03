'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import GoldInvestLogo from '@/components/common/GoldInvestLogo';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  phone1?: string;
  phone2?: string;
  email?: string;
  address?: string;
  description?: string;
}

export default function ContactDrawer({
  isOpen,
  onClose,
  phone1 = '+33 6 17 26 47 05',
  phone2 = '+33 6 05 82 51 96',
  email = 'azevia.solutions@gmail.com',
  address = 'Laval, France',
  description = "Spécialistes du négoce et de l'investissement en métaux précieux : pièces d'or, lingots d'or et d'argent certifiés LBMA, avec un accompagnement personnalisé et sécurisé à chaque étape jusqu'à la livraison.",
}: ContactDrawerProps) {
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
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Panel (Inspired by reference capture 1) */}
      <aside className="relative z-10 w-full max-w-md bg-[#0b1220] text-white h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header: Logo + White Circle Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <GoldInvestLogo variant="light" />
            </div>

            {/* Circular White Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
              title="Fermer"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="mt-6 text-sm text-gray-300 font-light leading-relaxed">
            {description}
          </p>

          {/* Contact Section */}
          <div className="mt-8">
            <h3 className="font-serif font-bold text-2xl text-white tracking-tight mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm">
              {/* Phone / WhatsApp */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Téléphone / WhatsApp</p>
                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="font-bold text-white text-base hover:text-[#c59a3f] transition-colors flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] inline-block shadow-sm" />
                  <span>{phone1}</span>
                </a>
              </div>

              {/* Second Phone */}
              {phone2 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Second numéro</p>
                  <a
                    href={`tel:${phone2.replace(/\s+/g, '')}`}
                    className="font-bold text-white text-base hover:text-[#c59a3f] transition-colors"
                  >
                    {phone2}
                  </a>
                </div>
              )}

              {/* Email */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="font-bold text-white hover:text-[#c59a3f] transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              {/* Siège social */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Siège social</p>
                <p className="font-bold text-white">
                  {address}
                </p>
              </div>
            </div>
          </div>

          {/* Suivez-nous Section */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="font-serif font-bold text-2xl text-white tracking-tight mb-4">
              Suivez-nous :
            </h3>

            <div className="flex items-center gap-3">
              {/* TikTok Icon (from capture) */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#162238] hover:bg-[#c59a3f] hover:text-black text-white flex items-center justify-center transition-all duration-200 border border-white/10 shadow-sm"
                title="TikTok"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47 6.27 6.27 0 0 0 1.89-4.47V8.75a8.28 8.28 0 0 0 4.89 1.58V6.88a4.82 4.82 0 0 1-1-.19z" />
                </svg>
              </a>

              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#162238] hover:bg-emerald-500 text-white flex items-center justify-center transition-all duration-200 border border-white/10 shadow-sm"
                title="WhatsApp"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12 19.82c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.88 7.88 0 0 1-1.2-4.16c0-4.36 3.55-7.91 7.91-7.91 2.11 0 4.1.82 5.6 2.31a7.86 7.86 0 0 1 2.31 5.6c0 4.36-3.55 7.92-7.93 7.92zm4.33-5.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#162238] hover:bg-[#0077b5] text-white flex items-center justify-center transition-all duration-200 border border-white/10 shadow-sm"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28M7.85 18.5V10.13H5.06v8.37h2.79z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <Link
            href="/contact"
            onClick={onClose}
            className="w-full bg-[#ea580c] hover:bg-[#d44e07] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Demander un devis gratuit</span>
            <span>↗</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}

