'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GoldInvestLogo from '@/components/common/GoldInvestLogo';

type FooterProps = {
  supportPhone?: string;
  supportEmail?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  footerHeadingColor?: string;
  footerAddress1?: string;
  footerAddress2?: string;
  footerLocationsTitle?: string;
  footerNewsletterTitle?: string;
  footerNewsletterText?: string;
  footerNewsletterPlaceholder?: string;
  footerCallUsText?: string;
  footerCopyright?: string;
  footerSocialFacebook?: string;
  footerSocialTwitter?: string;
  footerSocialInstagram?: string;
  footerSocialLinkedin?: string;
  footerColumns?: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
  categories?: Array<{ id: string; name: string; slug: string | null }>;
  footerLogoImage?: string;
  footerDescription?: string;
  footerShowAddress?: boolean;
  footerShowEmail?: boolean;
  footerShowPhone?: boolean;
  footerPaymentAmex?: boolean;
  footerPaymentApplePay?: boolean;
  footerPaymentGooglePay?: boolean;
  footerPaymentMastercard?: boolean;
  footerPaymentVisa?: boolean;
  footerPaymentOpay?: boolean;
  contactSlug?: string;
};

export default function Footer({
  footerLogoImage,
  supportPhone = '+32 2 123 45 67',
  supportEmail = 'info@goldsilversinvest.com',
  footerCopyright = '© 2026 Gold Invest. Tous droits réservés.',
  footerSocialFacebook = 'https://facebook.com',
  footerSocialInstagram = 'https://instagram.com',
  footerSocialLinkedin = 'https://linkedin.com',
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 600);
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-gray-300 font-sans border-t border-white/5 relative z-20">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Presentation (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            {footerLogoImage ? (
              <Link href="/" className="inline-block">
                <Image
                  src={footerLogoImage}
                  alt="Footer Logo"
                  width={220}
                  height={60}
                  unoptimized
                  className="max-h-12 w-auto object-contain"
                />
              </Link>
            ) : (
              <GoldInvestLogo variant="light" size="lg" />
            )}
            <p className="mt-4 text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              Investissez en toute sérénité dans l’or et l’argent, des valeurs refuges par excellence.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center space-x-3.5">
              {/* Facebook */}
              <a 
                href={footerSocialFacebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#c59a3f] hover:border-[#c59a3f] transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href={footerSocialInstagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#c59a3f] hover:border-[#c59a3f] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href={footerSocialLinkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#c59a3f] hover:border-[#c59a3f] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Liens utiles (col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-serif font-bold text-[#c59a3f] uppercase tracking-wider mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:underline transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Nos produits (col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-serif font-bold text-[#c59a3f] uppercase tracking-wider mb-4">
              Nos produits
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/shop?category=pieces-dor" className="hover:text-white hover:underline transition-colors">
                  Pièces d&apos;or
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lingots-dor" className="hover:text-white hover:underline transition-colors">
                  Lingots d&apos;or
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lingots-dargent" className="hover:text-white hover:underline transition-colors">
                  Lingots d&apos;argent
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pieces-dargent" className="hover:text-white hover:underline transition-colors">
                  Pièces d&apos;argent
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Service client (col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-serif font-bold text-[#c59a3f] uppercase tracking-wider mb-4">
              Service client
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#c59a3f] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{supportPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#c59a3f] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${supportEmail}`} className="hover:text-white truncate">
                  {supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#c59a3f] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lun. - Ven. : 9h - 18h</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter (col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-serif font-bold text-[#c59a3f] uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 font-light">
              Recevez nos offres exclusives
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-[#c59a3f]/10 border border-[#c59a3f]/30 rounded-lg text-[#c59a3f] text-xs font-semibold">
                Merci pour votre inscription !
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex items-center bg-white rounded-lg p-1 border border-gray-200">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email" 
                  required
                  className="w-full px-2.5 py-1.5 text-xs text-gray-900 bg-transparent outline-none placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#c59a3f] hover:bg-[#b08733] text-black w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  aria-label="S'inscrire"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="w-full border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center md:text-left">
          
          {/* Left: Copyright */}
          <div>
            <span>{footerCopyright}</span>
          </div>

          {/* Right: Legal Links & Back to Top Button */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link href="/pages/mentions-legales" className="hover:text-gray-300 transition-colors">
                Mentions légales
              </Link>
              <span>|</span>
              <Link href="/pages/politique-de-confidentialite" className="hover:text-gray-300 transition-colors">
                Politique de confidentialité
              </Link>
              <span>|</span>
              <Link href="/pages/conditions-generales-de-vente" className="hover:text-gray-300 transition-colors">
                Conditions générales de vente
              </Link>
            </div>

            {/* Back to top gold button */}
            <button 
              onClick={scrollToTop} 
              className="w-8 h-8 rounded-full bg-[#c59a3f] hover:bg-[#b08733] text-black flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer flex-shrink-0"
              title="Retour en haut"
              aria-label="Retour en haut"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}
