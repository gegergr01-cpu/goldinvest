import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getFilteredProducts } from '@/actions/public';
import BestDealsCard from './BestDealsCard';

interface BestDealsProps {
  config?: Record<string, any>;
}

// 4 iconic default gold coins matching the mockup
const fallbackCoins = [
  {
    id: 'coin-napoleon',
    slug: '20-francs-or-napoleon-iii',
    title: '20 Francs Or Napoléon III',
    rawPrice: 887.50,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
  },
  {
    id: 'coin-maple-leaf',
    slug: '1-once-or-maple-leaf',
    title: '1 Once Or Maple Leaf',
    rawPrice: 2489.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'Investissement',
  },
  {
    id: 'coin-krugerrand',
    slug: '1-once-or-krugerrand',
    title: '1 Once Or Krugerrand',
    rawPrice: 2489.00,
    imageUrl: '/images/hero-gold-silver.jpg',
    badge: 'Investissement',
  },
  {
    id: 'coin-philharmonic',
    slug: '1-once-or-philharmonique',
    title: '1 Once Or Philharmonique',
    rawPrice: 2489.00,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
  },
];

export default async function BestDeals({ config }: BestDealsProps) {
  const c = config || {};

  const badge = c.badge || "NOS PIÈCES D'OR";
  const title = c.title || "Investissez dans l'excellence";
  const highlight = c.highlight || "l'excellence";
  const subtitle = c.subtitle || "Des pièces d'or authentiques, sélectionnées avec soin pour préserver votre patrimoine.";
  const cardBadge = c.cardBadge || "Investissement";
  const btnText = c.btnText || c.SEE_ALL_TEXT || "Voir toutes les pièces d'or";
  const seeAllUrl = c.seeAllUrl || c.btnUrl || "/shop?category=pieces-dor";

  const filterType = c.filterType || 'ALL';
  const categoryId = c.categoryId || undefined;
  const maxNum = parseInt(c.maxProducts || '4', 10) || 4;

  let dbProducts: any[] = [];

  try {
    // 1. Try targeted filter (manual selection or category)
    dbProducts = await getFilteredProducts(filterType, categoryId, maxNum, c.productIds);

    // 2. If nothing returned (e.g. filterType was ON_SALE and no deals were flagged), fetch real products from DB
    if (!dbProducts || dbProducts.length === 0) {
      dbProducts = await prisma.product.findMany({
        where: categoryId ? { categories: { some: { id: categoryId } } } : {},
        include: { categories: true, reviews: { where: { isApproved: true } } },
        take: maxNum,
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch {
    dbProducts = [];
  }

  // Format products for BestDealsCard
  let displayProducts: any[] = [];

  if (dbProducts && dbProducts.length > 0) {
    displayProducts = dbProducts.map((p) => {
      const images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
      const primaryCategory = p.categories && p.categories.length > 0 ? p.categories[0].name : '';
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        rawPrice: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        imageUrl: images[0] || '/images/gold-coins.jpg',
        badge: primaryCategory || cardBadge,
        discount: p.discountLabel || undefined,
      };
    });
  } else {
    // Elegant fallback from mockup
    displayProducts = fallbackCoins;
  }

  // Render title with gold highlight
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7c77c] via-[#ffd700] to-[#b8860b]">
            {highlight}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#080808] text-white overflow-hidden font-sans">
      
      {/* Ambient warm gold radial glows (matching the mockup lighting) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c59a3f]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#c59a3f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#c59a3f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Diamond icon & NOS PIÈCES D'OR */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[#c59a3f] text-xs transform rotate-45 inline-block">◆</span>
            
            <div className="flex items-center justify-center gap-3 mt-2 mb-3">
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#c59a3f]/70" />
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#c59a3f] font-semibold select-none">
                {badge}
              </span>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#c59a3f]/70" />
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.2]">
            {renderTitle()}
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-gray-300 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* 2. Four Luxury Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 md:mt-14">
          {displayProducts.map((product) => (
            <BestDealsCard 
              key={product.id} 
              product={product} 
              badge={cardBadge} 
            />
          ))}
        </div>

        {/* 3. Bottom CTA with Flanking Gold Lines */}
        <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 flex items-center justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c59a3f]/40 to-[#c59a3f]/70" />
          
          <Link
            href={seeAllUrl}
            className="mx-4 sm:mx-8 px-8 py-3.5 rounded-full border border-[#c59a3f]/70 hover:border-[#c59a3f] bg-black/60 hover:bg-[#c59a3f]/15 text-white font-serif text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 group whitespace-nowrap shadow-[0_0_20px_rgba(197,154,63,0.15)] hover:shadow-[0_0_30px_rgba(197,154,63,0.35)]"
          >
            <span>{btnText}</span>
            <svg 
              className="w-4 h-4 text-[#c59a3f] transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c59a3f]/40 to-[#c59a3f]/70" />
        </div>

      </div>
    </section>
  );
}
