'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Nav links inspired by user reference & AZ Solutions
  const defaultNavLinks = [
    { label: 'Accueil', url: '/' },
    { label: "Pièces d'or", url: '/shop?category=pieces-dor' },
    { label: "Lingots d'or", url: '/shop?category=lingots-dor' },
    { label: "Argent fin", url: '/shop?category=lingots-dargent' },
    { label: 'Services', url: '/shop' },
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
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'fixed top-0 left-0 right-0 z-50'
            : isHomePage
            ? 'absolute top-0 left-0 right-0 z-40'
            : 'relative z-40'
        }`}
      >
        {/* 1. TOP BAR TICKER (Cycles in infinite scroll through EUR, DKK, Forint, GBP, USD, CAD) */}
        {!isScrolled && <TopBarTicker />}

        {/* 2. HEADER: Transparent over Hero on Homepage, Solid #0E2036 when scrolled */}
        <header
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#0E2036] shadow-[0_6px_24px_rgba(0,0,0,0.35)] py-2.5 border-b border-white/10'
              : isHomePage
              ? 'bg-transparent py-4 border-b border-white/5'
              : 'bg-[#0E2036] py-3 border-b border-white/10'
          }`}
        >
          <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex items-center justify-between gap-4">

            {/* Logo Line (Left) matching AZ Solutions aesthetic */}
            <Link href="/" className="flex flex-col items-start gap-1 text-decoration-none flex-none select-none group">
              <span className="font-serif font-bold text-[21px] text-white tracking-[0.01em] leading-none group-hover:text-[#E8A63D] transition-colors">
                GOLD<span className="text-[#E8A63D]">INVEST</span>
              </span>
              <span className="font-mono text-[9.5px] font-medium tracking-[0.16em] text-white/50 uppercase leading-none">
                OR · ARGENT · GROUPAGE
              </span>
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
                      className={`relative text-[14.5px] font-medium transition-colors duration-150 whitespace-nowrap ${
                        isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-[2px] bg-[#D2571E] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions inside pill: Demander un devis + 4-Squares Icon + Icons */}
              <div className="flex items-center gap-2.5 flex-none">

                {/* Orange Pill CTA: Demander un devis ↗ */}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#D2571E] hover:bg-[#A8420F] text-white font-bold text-[14.5px] px-6 py-2.5 rounded-full transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#D2571E]/30 whitespace-nowrap select-none"
                >
                  <span>Demander un devis</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 flex-none"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
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

                {/* Quick Search Icon */}
                <div className="relative" ref={searchContainerRef}>
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Rechercher"
                    title="Rechercher"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  {isSearchOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-[#0E2036] rounded-xl shadow-2xl border border-white/20 p-2.5 z-50 text-white">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Rechercher pièces, lingots..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-black/40 rounded-lg border border-white/10 outline-none text-white placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          className="bg-[#D2571E] hover:bg-[#A8420F] text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          OK
                        </button>
                      </form>

                      {isSearching && (
                        <div className="p-3 text-center text-xs text-gray-400">Recherche en cours...</div>
                      )}

                      {!isSearching && searchResults.length > 0 && (
                        <ul className="mt-2 border-t border-white/10 pt-2 max-h-56 overflow-y-auto">
                          {searchResults.slice(0, 5).map((prod) => (
                            <li key={prod.id}>
                              <Link
                                href={`/product/${prod.slug}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded text-xs text-white"
                              >
                                <span className="font-medium truncate flex-1">{prod.title}</span>
                                <Price amount={prod.price} className="text-[#E8A63D] font-bold" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

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
                  {mounted && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D2571E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {cartItems}
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* Mobile Right Controls: 4-Squares + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
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
        </header>
      </div>

      {/* 3. QUICK PANEL / CONTACT DRAWER (Opened via 4-Squares Button, Capture 1) */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
        phone1={mobileContactPhone || '+33 6 17 26 47 05'}
        email={mobileContactEmail || 'azevia.solutions@gmail.com'}
        address={mobileContactAddress || 'Laval, France'}
        description={mobileAboutDesc}
      />

      {/* 4. MOBILE SIDEBAR DRAWER */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
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
