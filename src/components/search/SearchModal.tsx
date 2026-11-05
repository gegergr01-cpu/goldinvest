'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { searchProducts } from '@/actions/public';
import Price from '@/components/Price';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_QUICK_SEARCH_TAGS = [
  "Lingots d'or",
  "Pièces d'or",
  "Lingots d'argent",
  "1 Once",
  "1 Kilogramme",
  "Valcambi Suisse",
  "C.HAFNER",
  "StoneX Bullion",
  "Éléphant de Somalie"
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('Search');
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Active locale detection for localized URLs
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeLocale = pathMatch ? pathMatch[1] : 'fr';
  const localePrefix = activeLocale && activeLocale !== 'fr' ? `/${activeLocale}` : '';

  // Localized quick search tags
  let quickSearchTags: string[] = DEFAULT_QUICK_SEARCH_TAGS;
  try {
    const rawTags = t.raw('quick_tags');
    if (Array.isArray(rawTags) && rawTags.length > 0) {
      quickSearchTags = rawTags;
    }
  } catch (e) {
    quickSearchTags = DEFAULT_QUICK_SEARCH_TAGS;
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Autofocus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setIsSearching(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchProducts(trimmed, 'all', 8);
        setResults(res || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onClose();
      router.push(`${localePrefix}/shop?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('search_title')}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[#0E2036] rounded-2xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden text-white animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* ── TOP SEARCH INPUT BAR ── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/[0.03]"
        >
          {/* Gold Search Icon */}
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <svg
              className="w-4 h-4 text-[#E8A63D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={t('input_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-[15px] sm:text-base font-medium min-w-0"
          />

          {/* Clear button if text */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
              title={t('clear_input')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-mono transition cursor-pointer shrink-0"
            title={t('close_modal')}
          >
            <span className="hidden sm:inline text-[11px]">{t('esc_key')}</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </form>

        {/* ── MODAL BODY: RESULTS OR QUICK SUGGESTIONS ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {isSearching ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-white/70">
              <div className="w-6 h-6 border-2 border-[#E8A63D] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium tracking-wide">{t('searching_catalog')}</span>
            </div>
          ) : query.trim().length >= 2 ? (
            results.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 text-[11px] font-mono tracking-wider text-white/40 uppercase">
                  <span>{t('certified_products', { count: results.length })}</span>
                  <span className="text-[#E8A63D]">{t('lbma_live')}</span>
                </div>

                <ul className="divide-y divide-white/10">
                  {results.map((prod) => {
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
                          onClick={onClose}
                          className="flex items-center gap-3.5 p-3 hover:bg-white/10 rounded-xl transition group"
                        >
                          {/* Product Thumbnail */}
                          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-black/40 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-sm">
                            <Image
                              src={firstImage}
                              alt={localizedTitle}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-[#E8A63D] transition-colors">
                              {localizedTitle}
                            </div>
                            {categoryName && (
                              <div className="text-[11px] text-white/50 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A63D]" />
                                <span>{categoryName}</span>
                              </div>
                            )}
                          </div>

                          {/* Live Price */}
                          <div className="text-right flex-none pl-2">
                            <Price amount={prod.price} className="text-[#E8A63D] font-bold text-sm sm:text-base" />
                            <div className="text-[10px] text-emerald-400 font-mono font-medium">{t('lbma_certified')}</div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="py-12 text-center text-white/60">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-3 border border-white/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-white/90 text-sm mb-1">
                  {t('no_results_for', { query })}
                </p>
                <p className="text-white/40 text-xs max-w-sm mx-auto leading-relaxed">
                  {t('no_results_tip')}
                </p>
              </div>
            )
          ) : (
            /* ── QUICK POPULAR SEARCH TAGS ── */
            <div className="space-y-4 py-2">
              <div className="text-[11px] font-mono tracking-wider text-white/40 uppercase px-1 flex items-center justify-between">
                <span>{t('suggested_searches')}</span>
                <span className="text-[10px] text-[#E8A63D] font-medium">{t('precious_metals')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-white/80 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#E8A63D] text-[10px]">↗</span>
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              {/* Category Shortcuts */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-[11px] font-mono tracking-wider text-white/40 uppercase px-1 mb-2.5">
                  {t('browse_by_category')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link
                    href={`${localePrefix}/shop?category=pieces-dor`}
                    onClick={onClose}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between text-xs font-semibold text-white group"
                  >
                    <span>{t('cat_gold_coins')}</span>
                    <span className="text-[#E8A63D] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href={`${localePrefix}/shop?category=lingots-dor`}
                    onClick={onClose}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between text-xs font-semibold text-white group"
                  >
                    <span>{t('cat_gold_bars')}</span>
                    <span className="text-[#E8A63D] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href={`${localePrefix}/shop?category=lingots-dargent`}
                    onClick={onClose}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between text-xs font-semibold text-white group"
                  >
                    <span>{t('cat_silver')}</span>
                    <span className="text-[#E8A63D] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER BAR ── */}
        {query.trim().length >= 2 && results.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="text-xs font-semibold text-[#E8A63D] hover:text-[#fae5a2] transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('view_all_in_shop', { query })}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <span className="hidden sm:inline text-[11px] font-mono text-white/40">
              {t('press_enter')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
