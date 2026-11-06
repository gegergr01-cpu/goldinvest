'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Price from '@/components/Price';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

type QuickViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
};

// Smart extractor of precious metal attributes & investment specifications
function extractSpecs(product: any) {
  let attrs: Array<{ name: string; options: any }> = [];
  if (product.attributes) {
    if (Array.isArray(product.attributes)) {
      attrs = product.attributes;
    } else if (typeof product.attributes === 'string') {
      try {
        const parsed = JSON.parse(product.attributes);
        if (Array.isArray(parsed)) attrs = parsed;
      } catch {}
    }
  }

  const findAttr = (keys: string[]) => {
    const a = attrs.find((item) =>
      keys.includes(String(item.name || '').toLowerCase().trim())
    );
    if (!a) return '';
    if (Array.isArray(a.options)) return a.options.join(' | ');
    return String(a.options || '');
  };

  const title = String(product.title || '').toLowerCase();

  // 1. Metal
  let metal = product.metal || findAttr(['métal', 'metal']);
  if (!metal) {
    if (title.includes('argent') || title.includes('silver') || title.includes('silber')) {
      metal = 'Argent (Silver)';
    } else if (title.includes('platine') || title.includes('platinum')) {
      metal = 'Platine (Platinum)';
    } else {
      metal = 'Or (Gold)';
    }
  }

  // 2. Purity
  let purity = product.purity || findAttr(['pureté', 'purete', 'titrage', 'purity']);
  if (!purity) {
    if (
      title.includes('20 francs') ||
      title.includes('20 lei') ||
      title.includes('napoléon') ||
      title.includes('napoleon') ||
      title.includes('tunesien') ||
      title.includes('10 roubles') ||
      title.includes('chervonetz') ||
      title.includes('souverain') ||
      title.includes('sovereign')
    ) {
      purity = '900‰ (21.6K)';
    } else if (title.includes('krugerrand')) {
      purity = '916.7‰ (22K)';
    } else if (title.includes('argent') || title.includes('silver') || title.includes('silber')) {
      purity = 'Argent 999‰';
    } else {
      purity = 'Or 999.9‰ (24K)';
    }
  }

  // 3. Fine Weight
  let weight = product.weight || findAttr(['poids fin', 'poids or fin', 'poids', 'fine weight', 'weight']);
  if (!weight) {
    if (title.includes('20 francs') || title.includes('20 lei') || title.includes('napoléon') || title.includes('tunesien')) {
      weight = '5,81 g or fin';
    } else if (title.includes('10 roubles') || title.includes('chervonetz')) {
      weight = '7,74 g or fin';
    } else if (title.includes('1/2 oz') || title.includes('1/2 once')) {
      weight = '1/2 oz (15,55 g)';
    } else if (title.includes('1/4 oz') || title.includes('1/4 once')) {
      weight = '1/4 oz (7,78 g)';
    } else if (title.includes('1/10 oz') || title.includes('1/10 once')) {
      weight = '1/10 oz (3,11 g)';
    } else if (title.includes('1 oz') || title.includes('1oz') || title.includes('1 once')) {
      weight = '1 oz (31,10 g)';
    } else if (title.includes('100g') || title.includes('100 g')) {
      weight = '100 g';
    } else if (title.includes('50g') || title.includes('50 g')) {
      weight = '50 g';
    } else if (title.includes('250g') || title.includes('250 g')) {
      weight = '250 g';
    } else if (title.includes('500g') || title.includes('500 g')) {
      weight = '500 g';
    } else if (title.includes('1kg') || title.includes('1 kg')) {
      weight = '1 kg';
    } else if (title.includes('5g') || title.includes('5 g')) {
      weight = '5 g';
    } else if (title.includes('2g') || title.includes('2 g')) {
      weight = '2 g';
    } else {
      weight = "Poids d'investissement";
    }
  }

  // 4. Certification / Mint / Refinery
  let cert = findAttr(['certification', 'certificat', 'accréditation', 'accreditation', 'atelier', 'atelier / institut', 'fondeur', 'fondeurs']);
  if (!cert) {
    if (title.includes('perth mint')) cert = 'The Perth Mint (Australie)';
    else if (title.includes('austrian mint') || title.includes('vienne')) cert = 'Austrian Mint (Autriche)';
    else if (title.includes('royal mint') || title.includes('britannia')) cert = 'The Royal Mint (Royaume-Uni)';
    else if (title.includes('valcambi')) cert = 'Valcambi SA (Suisse) • LBMA';
    else if (title.includes('heraeus') || title.includes('argor')) cert = 'Argor-Heraeus • LBMA';
    else if (title.includes('metalor')) cert = 'Metalor (Suisse) • LBMA';
    else if (title.includes('c.hafner') || title.includes('hafner')) cert = 'C.HAFNER (Allemagne) • LBMA';
    else cert = 'Certifié LBMA Good Delivery';
  }

  return { metal, purity, weight, cert };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Product');

  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';

  // Reset state when product changes or modal opens + Escape listener
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setActiveImage(0);
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, product, onClose]);

  if (!isOpen || !product) return null;

  // Normalize images
  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : typeof product.images === 'string' && product.images.startsWith('[')
      ? (() => { try { return JSON.parse(product.images); } catch { return []; } })()
      : product.imageUrl
        ? [product.imageUrl]
        : product.image
          ? [product.image]
          : [];

  const mainImage = images[activeImage] || '/images/gold-coins.jpg';
  const isWishlisted = wishlistStore.hasItem(String(product.id));

  // Specifications
  const specs = extractSpecs(product);

  // Price calculations
  const rawPrice = typeof product.price === 'number'
    ? product.price
    : Number(product.rawPrice) || Number(product.price) || 0;
  const comparePrice = typeof product.compareAtPrice === 'number'
    ? product.compareAtPrice
    : Number(product.compareAtPrice) || null;
  const hasDiscount = Boolean(comparePrice && comparePrice > rawPrice);

  // Ratings
  const rating = product.rating || 5;
  const ratingText = product.ratingText || '';

  // Product URL for full details
  const productSlug = product.slug || '';
  const productUrl = productSlug ? `${localePrefix}/product/${productSlug}` : `${localePrefix}/shop`;

  // Localized texts & trust pillars
  const viewDetailsText = {
    fr: "Voir la fiche produit complète",
    en: "View full product details",
    de: "Vollständige Produktdetails ansehen",
    es: "Ver ficha de producto completa",
    it: "Visualizza scheda prodotto completa",
    nl: "Bekijk volledige productfiche",
    pt: "Ver detalhes completos do produto",
    da: "Se fulde produktdetaljer",
    hu: "Teljes terméklap megtekintése"
  }[locale] || "Voir la fiche produit complète";

  const taxDisclaimer = {
    fr: "TVA 0% • Métal précieux d'investissement (Directive 2006/112/CE)",
    en: "0% VAT • Investment Bullion (EU Directive 2006/112/EC)",
    de: "0% MwSt. • Anlagegold & -silber (EU-Richtlinie 2006/112/EG)",
    es: "0% IVA • Metal precioso de inversión (Directiva 2006/112/CE)",
    it: "IVA 0% • Metallo prezioso da investimento (Direttiva 2006/112/CE)",
    nl: "0% BTW • Beleggingsedelmetaal (Richtlijn 2006/112/EG)",
    pt: "IVA 0% • Metal precioso de investimento (Diretiva 2006/112/CE)",
    da: "0% moms • Investeringsguld og -sølv (Direktiv 2006/112/EF)",
    hu: "0% ÁFA • Befektetési nemesfém (2006/112/EK irányelv)"
  }[locale] || "TVA 0% • Métal précieux d'investissement";

  const trustLabels = {
    fr: {
      delivery: "Livraison discrète & assurée",
      authenticity: "Certifié LBMA & scellé officiel",
      buyback: "Rachat garanti au cours spot"
    },
    en: {
      delivery: "Discreet & fully insured delivery",
      authenticity: "LBMA certified & tamper-proof seal",
      buyback: "Guaranteed buyback at spot price"
    },
    de: {
      delivery: "Diskrete & voll versicherte Lieferung",
      authenticity: "LBMA-zertifiziert & versiegelt",
      buyback: "Garantierter Rückkauf zum Spotpreis"
    },
    es: {
      delivery: "Envío discreto y asegurado al 100%",
      authenticity: "Certificado LBMA y precinto oficial",
      buyback: "Recompra garantizada al precio spot"
    },
    it: {
      delivery: "Spedizione discreta e assicurata",
      authenticity: "Certificato LBMA e sigillo ufficiale",
      buyback: "Riacquisto garantito al prezzo spot"
    },
    nl: {
      delivery: "Discrete & volledig verzekerde levering",
      authenticity: "LBMA-gecertificeerd & verzegeld",
      buyback: "Gegarandeerde terugkoop tegen spotprijs"
    },
    pt: {
      delivery: "Entrega discreta e 100% segura",
      authenticity: "Certificado LBMA e selo oficial",
      buyback: "Recompra garantida à cotação spot"
    },
    da: {
      delivery: "Diskret og fuldt forsikret levering",
      authenticity: "LBMA-certificeret og forseglet",
      buyback: "Garanteret tilbagekøb til spotpris"
    },
    hu: {
      delivery: "Diszkrét és biztosított szállítás",
      authenticity: "LBMA minősített és lezárt",
      buyback: "Garantált visszavásárlás spot áron"
    }
  }[locale] || {
    delivery: "Livraison discrète & assurée",
    authenticity: "Certifié LBMA & scellé officiel",
    buyback: "Rachat garanti au cours spot"
  };

  const handleAddToCart = () => {
    cartStore.addItem({
      id: String(product.id),
      productId: String(product.id),
      title: product.title,
      price: rawPrice,
      image: mainImage,
      quantity,
    });
    cartStore.setIsOpen(true);
    onClose();
  };

  const handleBuyNow = () => {
    cartStore.addItem({
      id: String(product.id),
      productId: String(product.id),
      title: product.title,
      price: rawPrice,
      image: mainImage,
      quantity,
    });
    onClose();
    router.push(`${localePrefix}/checkout`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    wishlistStore.toggleItem(String(product.id));
  };

  const cleanDescription = (product.shortDescription || product.description || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const badgeText = product.badge || product.category || 'Investissement';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {/* Luxury Backdrop with smooth blur */}
      <div 
        className="absolute inset-0 bg-[#070E18]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      {/* Luxury Modal Container */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl shadow-black/40 border border-amber-500/20 w-full max-w-4xl max-h-[92vh] md:max-h-[88vh] overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with gold-trimmed hover */}
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Fermer"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-[#0E2036] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:rotate-90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* LEFT COLUMN: Visual Showcase & Gallery */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 p-5 sm:p-6 md:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80">
          <div className="relative">
            {/* Top Image Badges: Investment badge & Wishlist Heart */}
            <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
                {badgeText}
              </span>
              {hasDiscount && product.discountLabel && (
                <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase bg-red-600 text-white shadow-xs">
                  {product.discountLabel}
                </span>
              )}
            </div>

            <button
              onClick={handleToggleWishlist}
              aria-label="Ajouter aux favoris"
              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <svg 
                className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'}`} 
                viewBox="0 0 24 24" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Main Stage Image */}
            <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200/90 shadow-inner group p-4 sm:p-6">
              <Image 
                width={700} 
                height={700} 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Thumbnails row (if multiple images) */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pt-3 pb-1 custom-scrollbar">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-14 h-14 flex-shrink-0 rounded-lg border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                    activeImage === idx 
                      ? 'border-[#C8732A] shadow-md ring-2 ring-[#C8732A]/25' 
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image width={120} height={120} src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Subtle certification tag below images on desktop */}
          <div className="hidden sm:flex items-center justify-center gap-2 pt-3 text-[11px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{specs.cert}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Precious Metal Specs & Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[58vh] md:max-h-none">
          <div>
            {/* Category / Sub-badge */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] uppercase font-serif tracking-[0.2em] text-[#C8732A] font-semibold">
                {specs.metal}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t('in_stock') || 'En stock'}
              </span>
            </div>

            {/* Product Title (Noble Serif) */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 leading-snug tracking-tight">
              {product.title}
            </h2>

            {/* Stars / Reviews if available */}
            <div className="flex items-center gap-1.5 mt-2 mb-3.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {ratingText ? `${ratingText}` : `${rating}.0`}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-[11px] text-slate-500">
                {t('customer_reviews') || 'Avis certifiés'}
              </span>
            </div>

            {/* Pricing Section (Warm Gold + Tax Free Stamp) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/40 border border-amber-200/60 mb-4">
              <div className="flex items-baseline gap-2.5">
                <Price amount={rawPrice} className="text-2xl sm:text-3xl font-serif font-bold text-[#9C4E0F]" />
                {hasDiscount && (
                  <Price amount={comparePrice!} showTax={false} className="text-slate-400 line-through text-sm font-medium" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{taxDisclaimer}</span>
              </div>
            </div>

            {/* 4-Pillar Specification Grid (Identity of the Bullion/Coin) */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {t('spec_purity') || 'Pureté'}
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {specs.purity}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {t('spec_fine_weight') || 'Poids fin'}
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {specs.weight}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Certification
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {specs.cert}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Fiscalité
                </span>
                <span className="text-xs font-bold text-emerald-700 mt-0.5 block truncate">
                  {t('spec_tax_free') || 'TVA 0%'}
                </span>
              </div>
            </div>

            {/* Short Description */}
            {cleanDescription && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {cleanDescription}
              </p>
            )}
          </div>

          <div>
            {/* Quantity Selector + Add to Cart + Buy Now Dual CTA */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                {/* Modern Counter */}
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-slate-50 h-11 px-1">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Diminuer la quantité"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 font-bold transition-colors cursor-pointer"
                  >
                    –
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Augmenter la quantité"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA: Add to Cart (Gold Gradient) */}
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9C4E0F]/25 cursor-pointer active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{t('add_to_cart')}</span>
                </button>
              </div>

              {/* Secondary CTA: Buy Now Direct (Navy Blue) */}
              <button 
                type="button"
                onClick={handleBuyNow}
                className="w-full h-10 px-4 rounded-xl bg-[#0E2036] hover:bg-[#1B365D] text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700/40 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <span>{t('buy_now_btn') || 'Commander directement'}</span>
                <LuxuryArrow className="w-3 h-3 text-white/90" />
              </button>
            </div>

            {/* Direct Link to Full Product Details */}
            <div className="mt-3.5 text-center">
              <Link 
                href={productUrl}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E2036] hover:text-[#C8732A] transition-colors group cursor-pointer"
              >
                <span>{viewDetailsText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Bottom 3 Trust Pillars */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-center select-none">
              <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-slate-50/90 border border-slate-100">
                <span className="text-sm">🔒</span>
                <span className="text-[9.5px] font-medium text-slate-700 leading-tight">
                  {trustLabels.delivery}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-slate-50/90 border border-slate-100">
                <span className="text-sm">🛡️</span>
                <span className="text-[9.5px] font-medium text-slate-700 leading-tight">
                  {trustLabels.authenticity}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-slate-50/90 border border-slate-100">
                <span className="text-sm">⚖️</span>
                <span className="text-[9.5px] font-medium text-slate-700 leading-tight">
                  {trustLabels.buyback}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
