'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

type MobileBottomNavProps = {
  onSearchClick: () => void;
  onLoginClick: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  userRole?: 'ADMIN' | 'CUSTOMER' | null;
};

export default function MobileBottomNav({
  onSearchClick,
  onLoginClick,
  onCartClick,
  onWishlistClick,
  userRole,
}: MobileBottomNavProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';
  const t = useTranslations('BottomNav');

  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();

  const cartCount = cartStore.getTotalItems();
  const wishlistCount = wishlistStore.items.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomeActive = pathname === '/' || pathname === `/${locale}` || pathname === `${localePrefix}/`;
  const isCartActive = pathname === '/cart' || pathname === `${localePrefix}/cart`;
  const isWishlistActive = pathname === '/wishlist' || pathname === `${localePrefix}/wishlist`;
  const isAccountActive = pathname?.startsWith('/account') || pathname?.startsWith('/admin');

  const userLabel = userRole === 'ADMIN' ? t('admin') : userRole === 'CUSTOMER' ? t('account') : t('login');

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E2036]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* 1. Accueil (Home) */}
        <Link
          href={`${localePrefix || ''}/`}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 group ${
            isHomeActive ? 'text-[#E8A63D]' : 'text-white/70 hover:text-white'
          }`}
        >
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill={isHomeActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isHomeActive ? 1.5 : 1.8}
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-full">
            {t('home')}
          </span>
          {isHomeActive && (
            <span className="w-1 h-1 rounded-full bg-[#E8A63D] mt-0.5 shadow-[0_0_6px_#E8A63D]" />
          )}
        </Link>

        {/* 2. Panier (Cart) */}
        <button
          type="button"
          onClick={() => {
            if (onCartClick) onCartClick();
            else cartStore.setIsOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 cursor-pointer group ${
            isCartActive ? 'text-[#E8A63D]' : 'text-white/70 hover:text-white'
          }`}
          aria-label={t('cart')}
        >
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill={isCartActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isCartActive ? 1.5 : 1.8}
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-[#D2571E] to-[#C8732A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-1 ring-[#0E2036]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-full">
            {t('cart')}
          </span>
          {isCartActive && (
            <span className="w-1 h-1 rounded-full bg-[#E8A63D] mt-0.5 shadow-[0_0_6px_#E8A63D]" />
          )}
        </button>

        {/* 3. Recherche (Ajax Search) - Central Elevated Action */}
        <button
          type="button"
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 cursor-pointer group text-white/80 hover:text-white"
          aria-label={t('search')}
        >
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#C8732A] via-[#B8641C] to-[#0E2036] flex items-center justify-center shadow-[0_2px_10px_rgba(200,115,42,0.4)] border border-[#E8A63D]/40 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              className="w-4 h-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <span className="text-[10px] font-semibold tracking-tight text-[#E8A63D] mt-0.5 truncate max-w-full">
            {t('search')}
          </span>
        </button>

        {/* 4. Wishlist (Favoris) */}
        <button
          type="button"
          onClick={() => {
            if (onWishlistClick) onWishlistClick();
            else wishlistStore.setIsOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 cursor-pointer group ${
            isWishlistActive ? 'text-[#E8A63D]' : 'text-white/70 hover:text-white'
          }`}
          aria-label={t('wishlist')}
        >
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill={isWishlistActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isWishlistActive ? 1.5 : 1.8}
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E8A63D] text-[#0E2036] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-1 ring-[#0E2036]">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-full">
            {t('wishlist')}
          </span>
          {isWishlistActive && (
            <span className="w-1 h-1 rounded-full bg-[#E8A63D] mt-0.5 shadow-[0_0_6px_#E8A63D]" />
          )}
        </button>

        {/* 5. Login / Compte */}
        <button
          type="button"
          onClick={onLoginClick}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-95 cursor-pointer group ${
            isAccountActive ? 'text-[#E8A63D]' : 'text-white/70 hover:text-white'
          }`}
          aria-label={userLabel}
        >
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill={isAccountActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isAccountActive ? 1.5 : 1.8}
              className="w-5 h-5 transition-transform group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {userRole && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#0E2036]" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-full">
            {userLabel}
          </span>
          {isAccountActive && (
            <span className="w-1 h-1 rounded-full bg-[#E8A63D] mt-0.5 shadow-[0_0_6px_#E8A63D]" />
          )}
        </button>
      </div>
    </nav>
  );
}
