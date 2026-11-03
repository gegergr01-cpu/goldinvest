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
  mobileAboutTitle,
  mobileAboutDesc,
  mobileContactAddress,
  mobileContactPhone,
  mobileContactEmail,
  mobileContactWebsite,
  userRole: initialUserRole = null,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [actualUserRole, setActualUserRole] = useState<'ADMIN' | 'CUSTOMER' | null>(initialUserRole);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Scroll detection for sticky header effect (matching Capture 2 & 3)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  // Nav links inspired by user reference
  const defaultNavLinks = [
    { label: 'Accueil', url: '/' },
    { label: "Pièces d'or", url: '/shop?category=pieces-dor' },
    { label: "Lingots d'or", url: '/shop?category=lingots-dor' },
    { label: "Lingots d'argent", url: '/shop?category=lingots-dargent' },
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
      {/* 1. TOP BAR (Infinite marquee ticker: EUR -> DKK -> Forint -> GBP -> USD -> CAD -> cycle repeats) */}
      <TopBarTicker />

      {/* 2. STICKY / FLOATING HEADER */}
      <header
        className={`w-full font-sans sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080d19]/95 backdrop-blur-md shadow-2xl border-b border-white/10 py-3'
            : 'bg-[#070c18]/80 backdrop-blur-sm border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <GoldInvestLogo variant="light" />
          </div>

          {/* Right: Floating Capsule Navigation (Matching Capture 2 & 3) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="rounded-full bg-[#121c2e]/75 backdrop-blur-md border border-white/15 px-6 py-2 flex items-center gap-6 shadow-2xl">
              
              {/* Navigation Links with active underline */}
              <nav className="flex items-center space-x-6 text-[13px] font-medium text-gray-200">
                {activeNavLinks.map((link, idx) => {
                  const isActive = pathname === link.url;
                  return (
                    <Link
                      key={idx}
                      href={link.url}
                      className={`relative py-1 transition-colors duration-200 ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#ea580c] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* CTA Button: Demander un devis ↗ (Orange pill button matching capture) */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#d44e07] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md shadow-orange-600/30 whitespace-nowrap cursor-pointer"
              >
                <span>Demander un devis</span>
                <span className="text-sm font-bold">↗</span>
              </Link>

              {/* 4-Squares Icon Button (Toggles Contact Drawer from Capture 1) */}
              <button
                type="button"
                onClick={() => setIsContactDrawerOpen(true)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="Informations & Contact"
                aria-label="Ouvrir le panneau de contact"
              >
                {/* 4 Rounded Squares (2x2 Grid matching reference capture) */}
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 16 16">
                  <rect x="2" y="2" width="5" height="5" rx="1.2" />
                  <rect x="9" y="2" width="5" height="5" rx="1.2" />
                  <rect x="2" y="9" width="5" height="5" rx="1.2" />
                  <rect x="9" y="9" width="5" height="5" rx="1.2" />
                </svg>
              </button>

            </div>

            {/* Quick Action Icons: Search, Account, Cart */}
            <div className="flex items-center gap-2 pl-2">
              {/* Search Toggle */}
              <div className="relative" ref={searchContainerRef}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Rechercher"
                  title="Rechercher"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#0d1627] rounded-xl shadow-2xl border border-white/20 p-2 z-50 text-white">
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
                        className="bg-[#ea580c] hover:bg-[#d44e07] text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
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
                              <Price amount={prod.price} className="text-[#c59a3f] font-bold" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Login / Account */}
              <button
                onClick={handleAccountClick}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
                aria-label="Mon compte"
                title={actualUserRole ? 'Mon compte' : 'Se connecter'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {actualUserRole && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#080d19]" />
                )}
              </button>

              {/* Cart Drawer */}
              <button
                onClick={() => cartStore.setIsOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
                aria-label="Panier"
                title="Panier"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {mounted && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
              className="w-8 h-8 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center"
              title="Contact"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 16 16">
                <rect x="2" y="2" width="5" height="5" rx="1.2" />
                <rect x="9" y="2" width="5" height="5" rx="1.2" />
                <rect x="2" y="9" width="5" height="5" rx="1.2" />
                <rect x="9" y="9" width="5" height="5" rx="1.2" />
              </svg>
            </button>

            <button
              onClick={() => cartStore.setIsOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 relative"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && cartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ea580c] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* 4-Squares Contact Drawer (Capture 1) */}
      <ContactDrawer 
        isOpen={isContactDrawerOpen} 
        onClose={() => setIsContactDrawerOpen(false)}
        phone1={mobileContactPhone || '+33 6 17 26 47 05'}
        email={mobileContactEmail || 'azevia.solutions@gmail.com'}
        address={mobileContactAddress || 'Laval, France'}
        description="Spécialistes du négoce et de l'investissement en métaux précieux : pièces d'or, lingots d'or et d'argent certifiés LBMA, avec un accompagnement personnalisé et sécurisé à chaque étape jusqu'à la livraison."
      />

      {/* Other Global Modals and Drawers */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <CartDrawer 
        isOpen={cartStore.isOpen} 
        onClose={() => cartStore.setIsOpen(false)} 
      />

      <WishlistDrawer 
        isOpen={wishlistStore.isOpen} 
        onClose={() => wishlistStore.setIsOpen(false)} 
      />

      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuLinks={activeNavLinks}
        categories={categories}
        aboutTitle={mobileAboutTitle || 'Gold Silver Invest'}
        aboutDesc={mobileAboutDesc || 'Spécialistes du négoce et de l\'investissement en métaux précieux.'}
        contactAddress={mobileContactAddress || 'Laval, France'}
        contactPhone={mobileContactPhone || '+33 6 17 26 47 05'}
        contactEmail={mobileContactEmail || 'azevia.solutions@gmail.com'}
        contactWebsite={mobileContactWebsite || 'www.goldsilverinvest.fr'}
      />
    </>
  );
}
