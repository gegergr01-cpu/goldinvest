'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import QuickViewModal from '@/components/product/QuickViewModal';

interface BestDealsCardProps {
  product: {
    id: string | number;
    slug?: string;
    title: string;
    rawPrice?: number;
    price?: number | string;
    priceFormatted?: string;
    imageUrl?: string;
    badge?: string;
    discount?: string;
    imagePlaceholder?: string;
  };
  badge?: string;
}

export default function BestDealsCard({
  product,
  badge = 'Investissement',
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
        className="relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between group transition-all duration-500 bg-gradient-to-b from-[#181818]/95 via-[#121212]/95 to-[#0b0b0b]/95 border border-white/10 hover:border-[#c59a3f] hover:shadow-[0_0_35px_rgba(197,154,63,0.35)] cursor-pointer backdrop-blur-md overflow-hidden"
      >
        {/* Subtle hover gradient halo behind card */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c59a3f]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* 1. Top Badge (e.g. "Investissement") */}
        <div className="flex items-center justify-between w-full z-10">
          <span className="border border-[#c59a3f]/50 bg-black/60 text-amber-200/90 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.badge || badge || 'Investissement'}
          </span>
          {product.discount && (
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded-full">
              {product.discount}
            </span>
          )}
        </div>

        {/* 2. Product Coin Visual with Floating Action Icons */}
        <div className="relative w-full aspect-square my-4 flex items-center justify-center">
          {/* Subtle warm glow behind coin */}
          <div className="absolute inset-4 rounded-full bg-[#c59a3f]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500 p-2"
            />
          ) : (
            <div className="w-36 h-36 rounded-full border-2 border-[#c59a3f]/40 bg-gradient-to-br from-[#d4af37]/20 to-[#996515]/20 flex items-center justify-center text-4xl shadow-inner text-[#c59a3f]">
              🪙
            </div>
          )}

          {/* Action Icons: Cart, Quick View, Wishlist (exact mockup placement) */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300">
            {/* Cart Icon */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-black/90 hover:bg-[#c59a3f] text-white hover:text-black border border-white/20 hover:border-[#c59a3f] flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
              title="Ajouter au panier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* Quick View Icon */}
            <button
              type="button"
              onClick={handleQuickView}
              className="w-10 h-10 rounded-full bg-black/90 hover:bg-[#c59a3f] text-white hover:text-black border border-white/20 hover:border-[#c59a3f] flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
              title="Aperçu rapide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Wishlist Icon */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-full ${isWishlisted ? 'bg-[#c59a3f] text-black border-[#c59a3f]' : 'bg-black/90 hover:bg-[#c59a3f] text-white hover:text-black border-white/20 hover:border-[#c59a3f]'} border flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer`}
              title="Favoris"
            >
              <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Bottom Title & Price */}
        <div className="text-center z-10 pt-2">
          <h3 
            className="text-white font-serif text-base sm:text-lg font-normal tracking-wide text-center line-clamp-2 group-hover:text-amber-200 transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>

          <div className="text-center mt-2.5">
            <span className="text-[#c59a3f] font-serif font-bold text-lg sm:text-xl tracking-wider">
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
