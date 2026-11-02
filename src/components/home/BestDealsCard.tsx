'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import QuickViewModal from '@/components/product/QuickViewModal';

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg 
    className={`w-3.5 h-3.5 ${filled ? 'text-[#c59a3f]' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

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
  };
  badge?: string;
  borderColor?: string;
  btnBgColor?: string;
  btnTextColor?: string;
  btnHoverBgColor?: string;
  btnHoverTextColor?: string;
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

  const formattedPrice = typeof product.rawPrice === 'number'
    ? `${product.rawPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
    : (product.priceFormatted || (product.price ? `${product.price} €` : '—'));

  return (
    <>
      <div 
        onClick={() => router.push(`/product/${product.slug || product.id}`)}
        className="w-full bg-white border border-gray-200/90 hover:border-[#c59a3f] rounded-2xl p-5 sm:p-6 flex flex-col justify-between group/card cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        style={{ borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined }}
      >
        {/* 1. Image Area with Badges & Hover Actions */}
        <div className="relative h-48 sm:h-52 w-full bg-white mb-4 flex items-center justify-center overflow-hidden rounded-xl">
          {/* Discount / Tag */}
          {product.discount ? (
            <span className="absolute top-1 left-1 bg-amber-100 text-[#9b7628] text-xs font-bold px-2.5 py-1 rounded-md z-10 shadow-sm">
              {product.discount}
            </span>
          ) : (product.badge || badge) ? (
            <span className="absolute top-1 left-1 bg-amber-50/90 border border-amber-200/80 text-[#9b7628] text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10 shadow-xs">
              {product.badge || badge}
            </span>
          ) : null}

          {/* Product Image */}
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.title} 
              width={500} 
              height={500} 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-full object-contain group-hover/card:scale-105 transition duration-500" 
            />
          ) : (
            <div className="text-7xl group-hover/card:scale-110 transition duration-500 select-none">
              {product.imagePlaceholder || '🪙'}
            </div>
          )}

          {/* Hover Action Icons Stack */}
          <div className="absolute top-1 right-1 flex flex-col items-center justify-center gap-1.5 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#c59a3f] text-gray-700 hover:text-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 transform hover:scale-105 cursor-pointer"
              title="Ajouter au panier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#c59a3f] text-gray-700 hover:text-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 transform hover:scale-105 cursor-pointer"
              title="Aperçu rapide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full ${isWishlisted ? 'bg-[#c59a3f] text-white border-[#c59a3f]' : 'bg-white hover:bg-[#c59a3f] text-gray-700 hover:text-white border-gray-200'} border shadow-md flex items-center justify-center transition-all duration-200 transform hover:scale-105 cursor-pointer`}
              title="Favoris"
            >
              <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Product Info (Centered as requested) */}
        <div className="mt-auto pt-2 flex flex-col items-center text-center">
          {product.category && (
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-700/80 mb-1">
              {product.category}
            </span>
          )}

          <h3 
            className="text-sm sm:text-base font-serif font-medium text-gray-900 line-clamp-2 mb-2 transition-colors group-hover/card:text-[#b8860b]" 
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

          {/* Rating Stars (if available) */}
          {product.ratingText && (
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < (product.rating || 0)} />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {product.ratingText}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-1">
            <span className="text-lg sm:text-xl font-serif font-bold text-[#b8860b]">
              {formattedPrice}
            </span>
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
          images: product.imageUrl ? [product.imageUrl] : [],
        }} 
      />
    </>
  );
}
