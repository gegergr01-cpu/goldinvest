'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { searchProducts } from '@/actions/public';
import { getUserRole } from '@/actions/auth';
import GoldInvestLogo from '@/components/common/GoldInvestLogo';
import Price from '@/components/Price';
import TopBarTicker from './TopBarTicker';
import ContactDrawer from './ContactDrawer';
import LanguageSelector from './LanguageSelector';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

const LoginModal = dynamic(() => import('@/components/auth/LoginModal'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
const WishlistDrawer = dynamic(() => import('@/components/wishlist/WishlistDrawer'), { ssr: false });
const MobileSidebar = dynamic(() => import('@/components/layout/MobileSidebar'), { ssr: false });

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

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active locale detection for search redirects
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

  // Live search debounce
  useEffect(() => {
    if (searchQuery.trim().length <= 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchProducts(searchQuery.trim(), 'all');
        setSearchResults(res || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Keyboard shortcut: Escape to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      router.push(`${localePrefix}/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Nav links inspired by user reference & AZ Solutions
  const defaultNavLinks = [
    { label: 'Accueil', url: '/' },
    { label: "Pièces d'or", url: '/shop?category=pieces-dor' },
    { label: "Lingots d'or", url: '/shop?category=lingots-dor' },
    { label: "Argent fin", url: '/shop?category=lingots-dargent' },
    { label: 'Services', url: '/services' },
    { label: 'Contact', url: '/contact' },
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
            <Link href="/" className="flex items-center flex-none select-none group">
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
                    OR · ARGENT · GROUPAGE
                  </span>
                </div>
              )}
            </Link>

            {/* Pill Nav Bar (Center & Right, with integrated luxury search mode) */}
            <div
              ref={searchContainerRef}
              className="hidden lg:flex items-center justify-between gap-2.5 bg-white/[0.09] border border-white/10 rounded-full pl-6 pr-2 py-2 flex-1 max-w-[840px] mx-auto shadow-sm backdrop-blur-md relative"
            >
              {isSearchOpen ? (
                /* ── INLINE SEARCH BAR INSIDE PILL ── */
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 flex items-center gap-3 pr-4 animate-in fade-in duration-150 min-w-0"
                >
                  <svg className="w-4 h-4 text-[#E8A63D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher des lingots d'or, pièces, argent d'investissement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/50 text-[14.5px] font-medium"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-white/40 hover:text-white transition p-1 cursor-pointer"
                      title="Effacer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-mono transition cursor-pointer shrink-0"
                    title="Fermer la recherche (Échap)"
                  >
                    <span>Échap</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                /* ── MAIN NAV LINKS ── */
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
              )}

              {/* Actions inside pill: Demander un devis + 4-Squares Icon + Icons */}
              <div className="flex items-center gap-2.5 flex-none">

                {/* Cuivre Doré Pill CTA: Demander un devis ↗ */}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-bold text-[14.5px] px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#9C4E0F]/35 border border-[#E8A63D]/35 whitespace-nowrap select-none group"
                >
                  <span>Demander un devis</span>
                  <LuxuryArrow className="w-3 h-3 text-white/90 group-hover:translate-x-0.5" />
                </Link>

                {/* 4-Squares Button (Exact AZ Solutions geometry: 2 straight + 2 diamonds rotated 45°) */}
                <button
                  type="button"
                  onClick={() => setIsContactDrawerOpen(true)}
                  className="w-11 h-11 rounded-full bg-[#0a1420] hover:bg-[#050b13] text-white border-none flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm"
                  title="Informations & Contact"
                  aria-label="Ouvrir le panneau de contact"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]">
                    <rect x="3" y="3" width="7" height="7" rx="1.6" />
                    <rect x="14" y="3" width="7" height="7" rx="1.6" transform="rotate(45 17.5 6.5)" />
                    <rect x="3" y="14" width="7" height="7" rx="1.6" transform="rotate(45 6.5 17.5)" />
                    <rect x="14" y="14" width="7" height="7" rx="1.6" />
                  </svg>
                </button>

                {/* Quick Search Toggle Icon */}
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (isSearchOpen) setSearchQuery('');
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                    isSearchOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={isSearchOpen ? 'Fermer la recherche' : 'Rechercher'}
                  title={isSearchOpen ? 'Fermer la recherche' : 'Rechercher'}
                >
                  {isSearchOpen ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>

                {/* Cart Drawer Button */}
                <button
                  onClick={() => cartStore.setIsOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
                  aria-label="Panier"
                  title="Panier"
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

              {/* ── LUXURY SEARCH RESULTS DROPDOWN (Centered & Full Width under the pill) ── */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-3 w-full bg-[#0E2036] rounded-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-4 z-[9999] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-white">
                  {isSearching ? (
                    <div className="py-6 flex items-center justify-center gap-3 text-xs text-white/70">
                      <div className="w-4 h-4 border-2 border-[#E8A63D] border-t-transparent rounded-full animate-spin" />
                      <span>Recherche en cours dans le catalogue certifié...</span>
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono tracking-wider text-white/40 uppercase">
                          <span>Produits trouvés ({searchResults.length})</span>
                          <span className="text-[#E8A63D]">Cours LBMA Direct</span>
                        </div>
                        <ul className="divide-y divide-white/10 max-h-80 overflow-y-auto">
                          {searchResults.map((prod) => {
                            const localizedTrans = prod.translations?.find((t: any) => t.locale === activeLocale);
                            const localizedTitle = localizedTrans?.title || prod.title;
                            const localizedSlug = localizedTrans?.slug || prod.slug;
                            const parsedImages = Array.isArray(prod.images)
                              ? prod.images
                              : (typeof prod.images === 'string' ? JSON.parse(prod.images || '[]') : []);
                            const firstImage = parsedImages[0] || '/images/hero-bg-luxury.jpg';
                            const categoryName = prod.categories?.[0]?.translations?.find((t: any) => t.locale === activeLocale)?.name || prod.categories?.[0]?.name;

                            return (
                              <li key={prod.id}>
                                <Link
                                  href={`${localePrefix}/product/${localizedSlug}`}
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center gap-3 p-2.5 hover:bg-white/10 rounded-xl transition group"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                    <Image
                                      src={firstImage}
                                      alt={localizedTitle}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                      unoptimized
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs text-white truncate group-hover:text-[#E8A63D] transition-colors">
                                      {localizedTitle}
                                    </div>
                                    {categoryName && (
                                      <div className="text-[10.5px] text-white/50 mt-0.5">
                                        {categoryName}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right flex-none">
                                    <Price amount={prod.price} className="text-[#E8A63D] font-bold text-xs" />
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleSearchSubmit()}
                            className="w-full py-2 px-3 text-center text-xs font-semibold text-[#E8A63D] hover:text-[#fae5a2] hover:bg-white/5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Voir tous les résultats pour « {searchQuery} »</span>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-white/60">
                        <p className="font-semibold text-white/80 mb-1">Aucun produit trouvé pour « {searchQuery} »</p>
                        <p className="text-white/40 text-[11.5px]">Vérifiez l&apos;orthographe ou essayez : or, argent, lingot, once, souverain...</p>
                      </div>
                    )
                  ) : (
                    /* Suggestions rapides quand la recherche est vide */
                    <div className="py-2">
                      <div className="text-[11px] font-mono tracking-wider text-white/40 uppercase mb-2.5 px-1 flex items-center justify-between">
                        <span>Recherches rapides suggérées</span>
                        <span className="text-[10px] text-[#E8A63D] font-medium">Investissement</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Lingots d'or",
                          "Pièces d'or",
                          "Lingots d'argent",
                          "1 Once",
                          "1 Kilogramme",
                          "Valcambi Suisse",
                          "C.HAFNER",
                          "StoneX Bullion"
                        ].map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => setSearchQuery(sug)}
                            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-white/80 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="text-[#E8A63D] text-[10px]">↗</span>
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Right Controls: Search + Language + 4-Squares + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isMobileSearchOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:text-white'
                }`}
                aria-label="Rechercher"
                title="Rechercher"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <LanguageSelector variant="header" />
              <button
                type="button"
                onClick={() => setIsContactDrawerOpen(true)}
                className="w-9 h-9 rounded-full bg-[#0a1420] text-white flex items-center justify-center"
                aria-label="Contact rapide"
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
                className="text-white text-2xl p-1 focus:outline-none"
                aria-label="Ouvrir le menu"
              >
                ☰
              </button>
            </div>

          </div>

          {/* Mobile Search Dropdown Bar */}
          {isMobileSearchOpen && (
            <div className="lg:hidden px-4 py-3 bg-[#0E2036] border-t border-white/10 animate-in slide-in-from-top-2 duration-150">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Rechercher pièces, lingots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white/10 rounded-lg border border-white/15 text-white placeholder-white/50 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#C8732A] hover:bg-[#D88334] text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  OK
                </button>
              </form>
            </div>
          )}
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

      {/* 5. CART & WISHLIST DRAWERS & LOGIN MODAL */}
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
    </>
  );
}
