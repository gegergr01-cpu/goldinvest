'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { searchProducts } from '@/actions/public';
import { getUserRole } from '@/actions/auth';
import GoldInvestLogo from '@/components/common/GoldInvestLogo';
import Price from '@/components/Price';
import TopBarTicker from './TopBarTicker';
import ContactDrawer from './ContactDrawer';
import LanguageSelector from './LanguageSelector';
import SearchModal from '@/components/search/SearchModal';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

const LoginModal = dynamic(() => import('@/components/auth/LoginModal'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
const WishlistDrawer = dynamic(() => import('@/components/wishlist/WishlistDrawer'), { ssr: false });
const MobileSidebar = dynamic(() => import('@/components/layout/MobileSidebar'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false });

type HeaderProps = {
  announcement?: string;
  logoImage?: string;
  headerLogoHeight?: string;
  mobileLogoHeight?: string;
  menuLinks?: Array<{ label: string; url: string }>;
  topBarLinks?: Array<{ label: string; icon: string; url: string }>;
  loginText?: string;
  myAccountText?: string;
  adminDashboardText?: string;
  topBarBgColor?: string;
  topBarTextColor?: string;
  categories?: Array<{ id: string; name: string; slug: string | null; parentId?: string | null }>;
  searchBorderColor?: string;
  searchPlaceholder?: string;
  searchBtnText?: string;
  searchBtnBgColor?: string;
  searchBtnTextColor?: string;
  showNew?: boolean;
  showHot?: boolean;
  showSale?: boolean;
  mobileAboutTitle?: string;
  mobileAboutDesc?: string;
  mobileMenuLinks?: Array<{ label: string; url: string }>;
  mobileContactAddress?: string;
  mobileContactPhone?: string;
  mobileContactEmail?: string;
  mobileContactWebsite?: string;
  mobileHeaderBorderColor?: string;
  allCategoriesBgColor?: string;
  allCategoriesTextColor?: string;
  userRole?: 'ADMIN' | 'CUSTOMER' | null;
};

export default function Header({
  logoImage = '',
  headerLogoHeight = '48',
  mobileLogoHeight = '40',
  menuLinks = [],
  categories = [],
  mobileAboutTitle = '',
  mobileAboutDesc = '',
  mobileContactAddress = '',
  mobileContactPhone = '',
  mobileContactEmail = '',
  mobileContactWebsite = '',
  userRole: initialUserRole = null,
}: HeaderProps) {
  const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

  const [mounted, setMounted] = useState(false);
  const [actualUserRole, setActualUserRole] = useState<'ADMIN' | 'CUSTOMER' | null>(initialUserRole);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Scroll detection for sticky header effect
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Past 20px of scroll, transition to solid sticky header (#0E2036)
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Active locale detection for localized URLs
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeLocale = pathMatch ? pathMatch[1] : 'fr';
  const localePrefix = activeLocale && activeLocale !== 'fr' ? `/${activeLocale}` : '';

  // Cart & Wishlist stores
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const cartItems = cartStore.getTotalItems();

  useEffect(() => {
    setMounted(true);
    getUserRole().then((role) => {
      if (role) {
        setActualUserRole(role as 'ADMIN' | 'CUSTOMER');
      }
    });
  }, []);

  // Nav links inspired by user reference & AZ Solutions
  const defaultNavLinks = [
    { label: t('nav_home'), url: `${localePrefix || ''}/` },
    { label: t('nav_coins'), url: `${localePrefix}/shop?category=pieces-dor` },
    { label: t('nav_bars'), url: `${localePrefix}/shop?category=lingots-dor` },
    { label: t('nav_silver'), url: `${localePrefix}/shop?category=lingots-dargent` },
    { label: t('nav_services'), url: `${localePrefix}/services` },
    { label: t('nav_contact'), url: `${localePrefix}/contact` },
  ];

  const activeNavLinks = menuLinks && menuLinks.length > 0 ? menuLinks : defaultNavLinks;

  const handleAccountClick = () => {
    if (actualUserRole) {
      router.push(actualUserRole === 'ADMIN' ? '/admin' : '/account');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      {/* 
        CONTAINER WRAPPER:
        On homepage when at top (!isScrolled): ABSOLUTE OVER HERO so the Hero extends all the way to the top!
        When scrolled: FIXED STICKY BAR with solid #0E2036 dark background matching Capture 2.
        On other pages: RELATIVE in normal document flow with solid #0E2036 dark background.
      */}
      <div
        className={`w-full max-w-full transition-all duration-300 ${isScrolled
          ? 'fixed top-0 left-0 right-0 z-50'
          : isHomePage
            ? 'absolute top-0 left-0 right-0 z-50'
            : 'relative z-50'
          }`}
      >
        {/* 1. TOP BAR TICKER (Cycles in infinite scroll through EUR, DKK, Forint, GBP, USD, CAD) */}
        {!isScrolled && <TopBarTicker />}

        {/* 2. HEADER: Transparent over Hero on Homepage, Solid #0E2036 when scrolled */}
        <header
          className={`w-full transition-all duration-300 ${isScrolled
            ? 'bg-[#0E2036] shadow-[0_6px_24px_rgba(0,0,0,0.35)] py-2.5 border-b border-white/10'
            : isHomePage
              ? 'bg-transparent py-4 border-b border-white/5'
              : 'bg-[#0E2036] py-3 border-b border-white/10'
            }`}
        >
          <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex items-center justify-between gap-4">

            {/* Logo Line (Left) */}
            <Link href={`${localePrefix || '/'}`} className="flex items-center flex-none select-none group">
              {logoImage ? (
                <div className="relative flex items-center py-1">
                  <Image
                    src={logoImage}
                    alt="Logo"
                    width={200}
                    height={55}
                    priority
                    unoptimized
                    className="w-auto object-contain transition-transform group-hover:scale-[1.02]"
                    style={{ maxHeight: headerLogoHeight ? `${headerLogoHeight}px` : '50px' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-start gap-1">
                  <span className="font-serif font-bold text-[21px] text-white tracking-[0.01em] leading-none group-hover:text-[#E8A63D] transition-colors">
                    GOLD<span className="text-[#E8A63D]">INVEST</span>
                  </span>
                  <span className="font-mono text-[9.5px] font-medium tracking-[0.16em] text-white/50 uppercase leading-none">
                    {t('tagline')}
                  </span>
                </div>
              )}
            </Link>

            {/* Pill Nav Bar (Center & Right, matching Capture 2 & 3 / AZ Solutions .nav-pill) */}
            <div className="hidden lg:flex items-center justify-between gap-2.5 bg-white/[0.09] border border-white/10 rounded-full pl-7 pr-2 py-2 flex-1 max-w-[820px] mx-auto shadow-sm backdrop-blur-md">

              {/* Main Nav Links with active dash indicator */}
              <nav className="flex items-center gap-7">
                {activeNavLinks.map((link, idx) => {
                  const isActive = pathname === link.url;
                  return (
                    <Link
                      key={idx}
                      href={link.url}
                      className={`relative text-[14.5px] font-medium transition-colors duration-150 whitespace-nowrap ${isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-[2px] bg-gradient-to-r from-[#D88334] to-[#B8641C] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions inside pill: Demander un devis + 4-Squares Icon + Icons */}
              <div className="flex items-center gap-2.5 flex-none">

                {/* Devis Action Button (Luxury Icon with Tooltip) */}
                <Link
                  href={`${localePrefix}/devis`}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#9C4E0F]/30 border border-[#E8A63D]/40 group relative"
                  title={t('request_quote_title')}
                  aria-label={t('request_quote')}
                >
                  <svg
                    className="w-4 h-4 text-white drop-shadow-sm transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {/* Subtle hover tooltip badge */}
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#0E2036] border border-white/20 text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                    {t('request_quote')}
                  </span>
                </Link>

                {/* 4-Squares Button (Exact AZ Solutions geometry: 2 straight + 2 diamonds rotated 45°) */}
                <button
                  type="button"
                  onClick={() => setIsContactDrawerOpen(true)}
                  className="w-11 h-11 rounded-full bg-[#0a1420] hover:bg-[#050b13] text-white border-none flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm"
                  title={t('info_contact')}
                  aria-label={t('open_contact_panel')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
                    <rect x="3" y="3" width="7" height="7" rx="1.6" />
                    <rect x="14" y="3" width="7" height="7" rx="1.6" transform="rotate(45 17.5 6.5)" />
                    <rect x="3" y="14" width="7" height="7" rx="1.6" transform="rotate(45 6.5 17.5)" />
                    <rect x="14" y="14" width="7" height="7" rx="1.6" />
                  </svg>
                </button>

                {/* Search Modal Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label={t('search_products')}
                  title={t('search_title')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Cart Drawer Button */}
                <button
                  onClick={() => cartStore.setIsOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
                  aria-label={t('cart')}
                  title={t('cart')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {mounted && cartItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D2571E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {cartItems}
                    </span>
                  )}
                </button>

                {/* Multilingual Selector (9 languages) */}
                <LanguageSelector variant="header" />

              </div>
            </div>

            {/* Mobile Right Controls: Language + 4-Squares Contact + Hamburger */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-2.5">
              <LanguageSelector variant="header" />
              <button
                type="button"
                onClick={() => setIsContactDrawerOpen(true)}
                className="w-9 h-9 rounded-full bg-[#0a1420] text-white flex items-center justify-center cursor-pointer hover:bg-[#152438] transition-colors shadow-2xs"
                aria-label={t('quick_contact')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <rect x="3" y="3" width="7" height="7" rx="1.6" />
                  <rect x="14" y="3" width="7" height="7" rx="1.6" transform="rotate(45 17.5 6.5)" />
                  <rect x="3" y="14" width="7" height="7" rx="1.6" transform="rotate(45 6.5 17.5)" />
                  <rect x="14" y="14" width="7" height="7" rx="1.6" />
                </svg>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white text-2xl p-1 focus:outline-none cursor-pointer hover:text-[#E8A63D] transition-colors"
                aria-label={t('open_menu')}
              >
                ☰
              </button>
            </div>

          </div>


        </header>
      </div>

      {/* 3. QUICK PANEL / CONTACT DRAWER (Opened via 4-Squares Button, Capture 1) */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
        logoImage={logoImage}
        phone1={mobileContactPhone || '+33 6 17 26 47 05'}
        email={mobileContactEmail || 'azevia.solutions@gmail.com'}
        address={mobileContactAddress || 'Laval, France'}
        description={mobileAboutDesc}
      />

      {/* 4. MOBILE SIDEBAR DRAWER */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        logoImage={logoImage}
        logoHeight={mobileLogoHeight}
        menuLinks={activeNavLinks}
        aboutTitle={mobileAboutTitle || ''}
        aboutDesc={mobileAboutDesc || ''}
        contactAddress={mobileContactAddress || ''}
        contactPhone={mobileContactPhone || ''}
        contactEmail={mobileContactEmail || ''}
        contactWebsite={mobileContactWebsite || ''}
      />

      {/* 5. CART & WISHLIST DRAWERS & LOGIN MODAL & SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <CartDrawer
        isOpen={cartStore.isOpen}
        onClose={() => cartStore.setIsOpen(false)}
      />
      <WishlistDrawer
        isOpen={wishlistStore.isOpen}
        onClose={() => wishlistStore.setIsOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* 6. MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        onSearchClick={() => setIsSearchModalOpen(true)}
        onLoginClick={handleAccountClick}
        onCartClick={() => cartStore.setIsOpen(true)}
        onWishlistClick={() => wishlistStore.setIsOpen(true)}
        userRole={actualUserRole}
      />
    </>
  );
}
