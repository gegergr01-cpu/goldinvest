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
  footerCopyright = 'Gold Silver Invest © 2011-2026',
  footerSocialFacebook = 'https://facebook.com',
  footerSocialTwitter = 'https://x.com',
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

  return (
    <footer className="w-full bg-[#161719] text-white/70 font-sans border-t border-white/[0.08] relative z-20">
      
      {/* 1. Top Section: Centered Logo with horizontal divider lines */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="relative flex items-center justify-center">
          {/* Left horizontal line */}
          <div className="flex-1 h-[1px] bg-white/[0.12]" />

          {/* Centered Logo badge */}
          <div className="px-6 sm:px-8 bg-[#161719] flex items-center justify-center shrink-0">
            {footerLogoImage ? (
              <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                <Image
                  src={footerLogoImage}
                  alt="Gold Silver Invest"
                  width={220}
                  height={50}
                  unoptimized
                  className="max-h-10 sm:max-h-12 w-auto object-contain"
                />
              </Link>
            ) : (
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <GoldInvestLogo variant="light" size="lg" />
              </Link>
            )}
          </div>

          {/* Right horizontal line */}
          <div className="flex-1 h-[1px] bg-white/[0.12]" />
        </div>
      </div>

      {/* 2. Main Columns Section (5 Columns matching GoldBroker) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-7">
          
          {/* Column 1: About us */}
          <div>
            <h3 className="font-serif font-semibold text-[17px] text-white mb-4 tracking-normal">
              About us
            </h3>
            <ul className="space-y-1.5 text-[13px] leading-[1.9]">
              <li>
                <Link href="/about" className="hover:text-[#E8A63D] transition-colors">
                  Who we are
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-[#E8A63D] transition-colors">
                  Customer reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#E8A63D] transition-colors">
                  Press releases
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E8A63D] transition-colors">
                  Wealth management partnerships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E8A63D] transition-colors">
                  Affiliate program
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#E8A63D] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Buy */}
          <div>
            <h3 className="font-serif font-semibold text-[17px] text-white mb-4 tracking-normal">
              Buy
            </h3>
            <ul className="space-y-1.5 text-[13px] leading-[1.9]">
              <li>
                <Link href="/shop?category=lingots-dor" className="hover:text-[#E8A63D] transition-colors">
                  Buy gold bullion
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lingots-dor" className="hover:text-[#E8A63D] transition-colors">
                  Gold bars
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pieces-dor" className="hover:text-[#E8A63D] transition-colors">
                  Gold coins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lingots-dargent" className="hover:text-[#E8A63D] transition-colors">
                  Buy silver bullion
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lingots-dargent" className="hover:text-[#E8A63D] transition-colors">
                  Silver bars
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pieces-dargent" className="hover:text-[#E8A63D] transition-colors">
                  Silver coins
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E8A63D] transition-colors">
                  Buy platinum bullion
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E8A63D] transition-colors">
                  Buy palladium bullion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-serif font-semibold text-[17px] text-white mb-4 tracking-normal">
              Services
            </h3>
            <ul className="space-y-1.5 text-[13px] leading-[1.9]">
              <li>
                <Link href="/services" className="hover:text-[#E8A63D] transition-colors">
                  All our services
                </Link>
              </li>
              <li>
                <Link href="/services#storage" className="hover:text-[#E8A63D] transition-colors">
                  Gold and silver storage
                </Link>
              </li>
              <li>
                <Link href="/services#delivery" className="hover:text-[#E8A63D] transition-colors">
                  Gold and silver delivery
                </Link>
              </li>
              <li>
                <Link href="/services#buyback" className="hover:text-[#E8A63D] transition-colors">
                  Buyback &amp; resale
                </Link>
              </li>
              <li>
                <Link href="/services#pickup" className="hover:text-[#E8A63D] transition-colors">
                  Agency pickup &amp; withdrawal
                </Link>
              </li>
              <li>
                <Link href="/services#storage" className="hover:text-[#E8A63D] transition-colors">
                  Precious metals insurance
                </Link>
              </li>
              <li>
                <Link href="/services#purchase" className="hover:text-[#E8A63D] transition-colors">
                  Our investment solution
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Prices & market */}
          <div>
            <h3 className="font-serif font-semibold text-[17px] text-white mb-4 tracking-normal">
              Prices &amp; market
            </h3>
            <ul className="space-y-1.5 text-[13px] leading-[1.9]">
              <li>
                <Link href="/blog" className="hover:text-[#E8A63D] transition-colors">
                  News &amp; analysis
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#E8A63D] transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/shop?metal=gold" className="hover:text-[#E8A63D] transition-colors">
                  Gold price
                </Link>
              </li>
              <li>
                <Link href="/shop?metal=silver" className="hover:text-[#E8A63D] transition-colors">
                  Silver price
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E8A63D] transition-colors">
                  Platinum price
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E8A63D] transition-colors">
                  Palladium price
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E8A63D] transition-colors">
                  Gold/silver ratio
                </Link>
              </li>
              <li>
                <Link href="/widgets" className="hover:text-[#E8A63D] transition-colors">
                  Widgets
                </Link>
              </li>
              <li>
                <Link href="/#app" className="hover:text-[#E8A63D] transition-colors">
                  Mobile app
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Guide & Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif font-semibold text-[17px] text-white mb-4 tracking-normal">
              Guide
            </h3>
            <ul className="space-y-1.5 text-[13px] leading-[1.9] mb-5">
              <li>
                <Link href="/guide" className="hover:text-[#E8A63D] transition-colors">
                  Investor&apos;s guide
                </Link>
              </li>
              <li>
                <Link href="/how-to-order" className="hover:text-[#E8A63D] transition-colors">
                  How to order
                </Link>
              </li>
              <li>
                <Link href="/taxation" className="hover:text-[#E8A63D] transition-colors">
                  Gold and silver taxation
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E8A63D] transition-colors">
                  Why choose Gold Silver Invest
                </Link>
              </li>
            </ul>

            {/* Newsletter Subscription Box matching GoldBroker */}
            <div className="pt-2">
              {isSubscribed ? (
                <div className="p-2.5 bg-[#C96A2B]/15 border border-[#C96A2B]/40 rounded text-[#FFE599] text-[12px] font-medium flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-[#E8A63D]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Subscribe to our newsletter"
                      required
                      className="w-full bg-[#1F2023] border border-white/20 hover:border-white/35 focus:border-[#E8A63D] rounded px-3 py-2 text-[12px] text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-9 h-9 rounded bg-[#1F2023] border border-[#C96A2B]/70 hover:border-[#E8A63D] hover:bg-[#C96A2B]/20 text-[#FFE599] hover:text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm group"
                    title="Subscribe"
                    aria-label="Subscribe"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-[#E8A63D] group-hover:scale-110 transition-transform"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Sub-Footer Bar */}
      <div className="w-full border-t border-white/[0.12] py-6 px-4 sm:px-6 lg:px-8 bg-[#141517]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 text-[12px] text-white/50">
          
          {/* Left: Social Icons + App Store Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5">
            {/* Social Icons (Linear stroke in subtle gold) */}
            <div className="flex items-center space-x-3 text-white/70">
              {/* Facebook */}
              <a
                href={footerSocialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14 9h-2a1 1 0 0 0-1 1v2H9v3h2v6h3v-6h2l1-3h-3V9.5a.5.5 0 0 1 .5-.5h.5V9z" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={footerSocialTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors text-[13px] font-bold"
                aria-label="X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={footerSocialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={footerSocialLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M8 11v5m0-8v.01M12 16v-5m0 0a2 2 0 0 1 4 0v5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="4" />
                  <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* RSS */}
              <a
                href="/feed.xml"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="RSS Feed"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M4 11a9 9 0 0 1 9 9" />
                  <path d="M4 4a16 16 0 0 1 16 16" />
                  <circle cx="5" cy="19" r="1" fill="currentColor" />
                </svg>
              </a>

              {/* Google Reviews */}
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8A63D] transition-colors"
                aria-label="Google"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>
            </div>

            {/* App Store Badges */}
            <div className="flex items-center gap-2">
              {/* App Store badge */}
              <a
                href="#"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#202226] border border-white/10 hover:border-white/25 transition-colors text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.96-.93.04-2.07.62-2.73 1.4-.58.67-1.09 1.76-.95 2.82 1.04.08 2.1-.51 2.72-1.26z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[8px] text-white/50 uppercase tracking-tight">Download on the</div>
                  <div className="text-[11px] font-semibold text-white">App Store</div>
                </div>
              </a>

              {/* Google Play badge */}
              <a
                href="#"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#202226] border border-white/10 hover:border-white/25 transition-colors text-white"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#E8A63D]" viewBox="0 0 24 24">
                  <path d="M3 20.5v-17c0-.83.52-1.5 1.23-1.5.33 0 .66.14.93.38l10.42 8.79-4.24 4.24L3.48 21.67c-.29.21-.59.33-.48-.17zm12.33-7.58l2.25-1.9-9.9-8.35 7.65 10.25zm1.5 1.27l3.67 3.1c.54.46.54 1.2 0 1.66l-3.67 3.1-2.07-2.07 2.07-5.79zm-2.07 6.83l-7.65 6.47 9.9-8.35-2.25 1.88z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[8px] text-white/50 uppercase tracking-tight">GET IT ON</div>
                  <div className="text-[11px] font-semibold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Legal Links & Copyright */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-2.5 gap-y-1 text-white/50 text-[11.5px]">
            <Link href="/pages/politique-de-confidentialite" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>|</span>
            <Link href="/pages/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <span>|</span>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <span>|</span>
            <Link href="/pages/mentions-legales" className="hover:text-white transition-colors">
              Terms of use
            </Link>
            <span>|</span>
            <Link href="/pages/conditions-generales-de-vente" className="hover:text-white transition-colors">
              Terms of sale
            </Link>
            <span>|</span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('open-cookie-preferences');
                  window.dispatchEvent(event);
                }
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Manage my cookies
            </button>
            <span>|</span>
            <span className="text-white/70 font-medium">
              {footerCopyright}
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
