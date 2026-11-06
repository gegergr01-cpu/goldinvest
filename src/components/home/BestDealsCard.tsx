'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import QuickViewModal from '@/components/product/QuickViewModal';

interface BestDealsCardProps {
  product: {
    id: string | number;
    slug?: string;
    title: string;
    category?: string;
    rawPrice?: number;
    price?: number | string;
    priceFormatted?: string;
    imageUrl?: string;
    badge?: string;
    discount?: string;
    imagePlaceholder?: string;
    rating?: number;
    ratingText?: string;
    stock?: number | null;
    attributes?: any;
    purity?: string;
    weight?: string;
    inStock?: boolean;
  };
  badge?: string;
  borderColor?: string;
  btnBgColor?: string;
  btnTextColor?: string;
  btnHoverBgColor?: string;
  btnHoverTextColor?: string;
}

// Smart precious metal specifications extractor
function getPreciousMetalSpecs(product: BestDealsCardProps['product']) {
  if (product.purity && product.weight) {
    return {
      purity: product.purity,
      weight: product.weight,
      inStock: product.inStock ?? (product.stock === undefined || product.stock === null || product.stock > 0),
    };
  }

  const title = (product.title || '').toLowerCase();
  let purity = product.attributes?.purity || product.attributes?.purete;
  let weight = product.attributes?.weight || product.attributes?.poids;

  // If attributes is stored as an array (standard Prisma JSON array of { name, options })
  if (!purity && Array.isArray(product.attributes)) {
    const a = product.attributes.find((x: any) => 
      ['pureté', 'purete', 'titrage', 'purity'].includes(String(x?.name || '').toLowerCase())
    );
    if (a) purity = Array.isArray(a.options) ? a.options[0] : (a.options || '');
  }

  if (!weight && Array.isArray(product.attributes)) {
    const a = product.attributes.find((x: any) => 
      ['poids fin', 'poids or fin', 'poids', 'fine weight', 'weight'].includes(String(x?.name || '').toLowerCase())
    );
    if (a) weight = Array.isArray(a.options) ? a.options[0] : (a.options || '');
  }

  if (!purity) {
    if (
      title.includes('20 francs') ||
      title.includes('20 lei') ||
      title.includes('napoléon') ||
      title.includes('napoleon') ||
      title.includes('tunesien') ||
      title.includes('chervonetz') ||
      title.includes('10 roubles') ||
      title.includes('souverain') ||
      title.includes('sovereign')
    ) {
      purity = '900‰ (21.6K)';
    } else if (title.includes('krugerrand')) {
      purity = '916.7‰ (22K)';
    } else if (title.includes('argent') || title.includes('silver')) {
      purity = 'Argent 999.9‰';
    } else {
      purity = 'Or 999.9‰ (24K)';
    }
  }

  if (!weight) {
    if (
      title.includes('20 francs') ||
      title.includes('20 lei') ||
      title.includes('napoléon') ||
      title.includes('tunesien')
    ) {
      weight = '5,81 g or fin';
    } else if (title.includes('10 roubles') || title.includes('chervonetz')) {
      weight = '7,74 g or fin';
    } else if (title.includes('1/2 oz')) {
      weight = '1/2 oz (15,55 g)';
    } else if (title.includes('1/4 oz')) {
      weight = '1/4 oz (7,78 g)';
    } else if (title.includes('1/10 oz')) {
      weight = '1/10 oz (3,11 g)';
    } else if (title.includes('1 oz') || title.includes('1oz')) {
      weight = '1 oz (31,10 g)';
    } else if (title.includes('50g')) {
      weight = '50 g';
    } else if (title.includes('100g')) {
      weight = '100 g';
    } else if (title.includes('250g')) {
      weight = '250 g';
    } else if (title.includes('500g')) {
      weight = '500 g';
    } else if (title.includes('1kg') || title.includes('1 kg')) {
      weight = '1 kg';
    } else {
      weight = 'Or d\'investissement';
    }
  }

  const inStock = product.inStock ?? (product.stock === undefined || product.stock === null || product.stock > 0);

  return { purity, weight, inStock };
}

export default function BestDealsCard({
  product,
  badge = 'Investissement',
  borderColor = '#e5e7eb',
}: BestDealsCardProps) {
  const router = useRouter();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isWishlisted = wishlistStore.hasItem(String(product.id));

  const specs = getPreciousMetalSpecs(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.addItem({
      id: String(product.id),
      productId: String(product.id),
      title: product.title,
      price: typeof product.rawPrice === 'number' ? product.rawPrice : Number(product.price) || 0,
      image: product.imageUrl || '',
      quantity: 1,
    });
    cartStore.setIsOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasWishlisted = wishlistStore.hasItem(String(product.id));
    wishlistStore.toggleItem(String(product.id));
    if (!wasWishlisted) {
      wishlistStore.setIsOpen(true);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Clean formatting ensuring non-breaking space between thousands and currency symbol
  const formattedPrice = typeof product.rawPrice === 'number'
    ? `${product.rawPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, '\u00A0')}\u00A0€`
    : (product.priceFormatted || (product.price ? `${String(product.price).replace(/\s/g, '\u00A0')}\u00A0€` : '—'));

  // Clean category badge display (translate German scraped labels like 'Goldmünze' into 'Pièce d'Or')
  const rawBadge = product.badge || badge;
  const displayBadge = rawBadge.toUpperCase() === 'GOLDMÜNZE' ? "Pièce d'Or" : rawBadge;

  return (
    <>
      <div 
        onClick={() => router.push(`/product/${product.slug || product.id}`)}
        className="w-full bg-white border border-[#E5E7EB] hover:border-[#E8A63D]/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group/card cursor-pointer hover:shadow-[0_12px_32px_rgba(200,115,42,0.12)] transition-all duration-300 relative overflow-hidden"
        style={{ borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined }}
      >
        {/* 1. Header Row: Category Badge (Left) + Stock Availability (Right) */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.discount ? (
            <span className="bg-amber-100 text-[#9b7628] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.discount}
            </span>
          ) : (
            <span className="bg-[#FAF5EB] border border-[#E4D1B0] text-[#9A7228] text-[10.5px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
              {displayBadge}
            </span>
          )}

          {specs.inStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
              Sur commande
            </span>
          )}
        </div>

        {/* 2. Product Image with Smooth Hover Zoom */}
        <div className="relative h-44 sm:h-48 w-full bg-transparent flex items-center justify-center overflow-hidden my-2">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.title} 
              width={500} 
              height={500} 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500 ease-out" 
            />
          ) : (
            <div className="text-7xl group-hover/card:scale-110 transition duration-500 select-none">
              {product.imagePlaceholder || '🪙'}
            </div>
          )}
        </div>

        {/* 3. Product Info: Technical Metal Specs & Title */}
        <div className="flex flex-col items-center text-center mt-2 mb-3">
          {/* Technical Specs: Pureté · Poids fin */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#E8A63D]/25 text-[11px] font-mono font-medium text-[#8C6D23] mb-2 tracking-wide">
            <span>{specs.purity}</span>
            <span className="text-[#C8732A]/70 font-bold">•</span>
            <span>{specs.weight}</span>
          </div>

          <h3 
            className="text-[14.5px] sm:text-[15.5px] font-serif font-bold text-gray-900 leading-snug line-clamp-2 min-h-[42px] transition-colors group-hover/card:text-[#B8641C]" 
            title={product.title}
          >
            <Link 
              href={`/product/${product.slug || product.id}`} 
              className="hover:underline" 
              onClick={(e) => e.stopPropagation()}
            >
              {product.title}
            </Link>
          </h3>
        </div>

        {/* 4. Bottom Divider Line & Action Bar: Price (Left) + Actions Toolbar (Right) */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          {/* Price & Tax exemption / spot indication */}
          <div className="flex flex-col items-start text-left min-w-0 pr-1">
            <span className="text-[17px] sm:text-[19px] font-serif font-bold text-[#b8860b] tracking-tight leading-tight whitespace-nowrap">
              {formattedPrice}
            </span>
            <span className="text-[10px] sm:text-[10.5px] text-gray-400 font-sans tracking-wide mt-0.5 whitespace-nowrap select-none">
              TVA 0% · Cours spot
            </span>
          </div>

          {/* Combined Action Buttons: Wishlist, Quick View, Cart (Balanced Circular Trio) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                isWishlisted 
                  ? 'bg-[#C8732A] text-white border-[#C8732A] shadow-sm' 
                  : 'bg-gray-50/80 hover:bg-[#FAF5EB] text-gray-500 hover:text-[#C8732A] border-gray-200 hover:border-[#E8A63D]/60'
              }`}
              title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
              aria-label="Favoris"
            >
              <svg className="w-3.5 h-3.5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={handleQuickView}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gray-50/80 hover:bg-[#FAF5EB] text-gray-500 hover:text-[#C8732A] border border-gray-200 hover:border-[#E8A63D]/60 flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Aperçu rapide"
              aria-label="Aperçu rapide"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Add to Cart Button (Circular Luxury Imperial Copper Gradient) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white flex items-center justify-center shadow-md shadow-[#9C4E0F]/25 border border-[#E8A63D]/30 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={{
          id: String(product.id),
          slug: product.slug || '',
          title: product.title,
          price: typeof product.rawPrice === 'number' ? product.rawPrice : Number(product.price) || 0,
          compareAtPrice: (product as any).compareAtPrice,
          images: product.imageUrl ? [product.imageUrl] : [],
          attributes: product.attributes,
          category: product.category,
          badge: badge || product.badge,
          purity: specs.purity,
          weight: specs.weight,
          stock: product.stock,
          rating: product.rating,
          ratingText: product.ratingText,
          shortDescription: (product as any).shortDescription || (product as any).description,
        }} 
      />
    </>
  );
}
