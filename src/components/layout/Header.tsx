'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { searchProducts } from '@/actions/public';
import { getUserRole } from '@/actions/auth';
import GoldInvestLogo from '@/components/common/GoldInvestLogo';
import Price from '@/components/Price';

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
  myAccountText = 'Mon compte',
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

  // Focus search input when toggled open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Nav links matching the mockup
  const defaultNavLinks = [
    { label: 'Accueil', url: '/' },
    { label: "Pièces d'or", url: '/shop?category=pieces-dor' },
    { label: "Lingots d'or", url: '/shop?category=lingots-dor' },
    { label: "Lingots d'argent", url: '/shop?category=lingots-dargent' },
    { label: 'À propos', url: '/about' },
    { label: 'FAQ', url: '/faq' },
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
      <header className="w-full font-sans sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
        
        {/* 1. TOP BAR (Dark Luxury) */}
        <div className="w-full bg-[#111111] text-gray-300 text-xs py-2 px-4 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            
            {/* Left: Paiement sécurisé */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Paiement 100% sécurisé</span>
            </div>

            {/* Center: Livraison rapide */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h10v9H5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11h4l3 3v3h-7v-6z" />
                <circle cx="8" cy="19" r="2" strokeWidth={1.8} />
                <circle cx="18" cy="19" r="2" strokeWidth={1.8} />
              </svg>
              <span>Livraison rapide et assurée</span>
            </div>

            {/* Right: Service client */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c59a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 18v-6a9 9 0 0118 0v6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
              </svg>
              <span>Service client à votre écoute</span>
            </div>

          </div>
        </div>

        {/* 2. MAIN HEADER BAR (White) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <GoldInvestLogo variant="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 lg:space-x-8 text-[14px] font-medium text-gray-700">
            {activeNavLinks.map((link, idx) => {
              const isActive = pathname === link.url;
              return (
                <Link
                  key={idx}
                  href={link.url}
                  className={`transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-[#c59a3f] font-semibold'
                      : 'hover:text-[#c59a3f]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c59a3f] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & "Mon compte" Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Toggle Icon */}
            <div className="relative" ref={searchContainerRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-[#c59a3f] hover:bg-gray-100 transition cursor-pointer"
                aria-label="Rechercher"
                title="Rechercher"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Floating Search Input */}
              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Rechercher pièces, lingots..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-none outline-none text-gray-800 placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="bg-[#c59a3f] hover:bg-[#b08733] text-black px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      OK
                    </button>
                  </form>

                  {/* Quick live search preview */}
                  {isSearching && (
                    <div className="p-3 text-center text-xs text-gray-400">Recherche en cours...</div>
                  )}

                  {!isSearching && searchResults.length > 0 && (
                    <ul className="mt-2 border-t border-gray-100 pt-2 max-h-56 overflow-y-auto">
                      {searchResults.slice(0, 5).map((prod) => (
                        <li key={prod.id}>
                          <Link
                            href={`/product/${prod.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs text-gray-800"
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

            {/* LOGIN ICON (Demande explicite: Prévoir l'icône de Login au niveau du Header) */}
            <button
              onClick={handleAccountClick}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-[#c59a3f] hover:bg-gray-100 transition cursor-pointer relative"
              aria-label="Connexion / Compte"
              title={actualUserRole ? 'Mon compte' : 'Se connecter'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {actualUserRole && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {/* CART ICON WITH GOLD BADGE */}
            <button
              onClick={() => cartStore.setIsOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-[#c59a3f] hover:bg-gray-100 transition cursor-pointer relative"
              aria-label="Panier d'achat"
              title="Panier"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c59a3f] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>

        </div>
      </header>

      {/* Global Interactive Drawers and Modals */}
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
        aboutDesc={mobileAboutDesc || 'Investissez en toute sérénité dans l’or et l’argent, valeurs refuges par excellence.'}
        contactAddress={mobileContactAddress || 'Chaussée de Tirlemont 110, 5030 Gembloux'}
        contactPhone={mobileContactPhone || '+32 2 123 45 67'}
        contactEmail={mobileContactEmail || 'info@goldsilversinvest.com'}
        contactWebsite={mobileContactWebsite || 'www.goldsilversinvest.com'}
      />
    </>
  );
}
