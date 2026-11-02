import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getFilteredProducts } from '@/actions/public';
import BestDealsCard from './BestDealsCard';

interface BestDealsProps {
  config?: Record<string, any>;
}

// 4 iconic default gold coins matching the luxury gold catalog
const fallbackCoins = [
  {
    id: 'coin-napoleon',
    slug: '20-francs-or-napoleon-iii',
    title: '20 Francs Or Napoléon III',
    category: 'Pièces d\'or',
    rawPrice: 887.50,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-maple-leaf',
    slug: '1-once-or-maple-leaf',
    title: '1 Once Or Maple Leaf',
    category: 'Pièces d\'or',
    rawPrice: 2489.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'Investissement',
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-krugerrand',
    slug: '1-once-or-krugerrand',
    title: '1 Once Or Krugerrand',
    category: 'Pièces d\'or',
    rawPrice: 2489.00,
    imageUrl: '/images/hero-gold-silver.jpg',
    badge: 'Investissement',
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-philharmonic',
    slug: '1-once-or-philharmonique',
    title: '1 Once Or Philharmonique',
    category: 'Pièces d\'or',
    rawPrice: 2489.00,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    rating: 5,
    ratingText: '(5.0)',
  },
];

export default async function BestDeals({ config }: BestDealsProps) {
  const c = config || {};

  const badge = c.badge || "NOS PIÈCES D'OR";
  const title = c.title || "Nos Pièces d'Or";
  const highlight = c.highlight || "Pièces d'Or";
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
      const approvedReviews = (p as any).reviews || [];
      const ratingCount = approvedReviews.length;
      const avgRating = ratingCount > 0 ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingCount : 0;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: primaryCategory || cardBadge,
        rawPrice: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        imageUrl: images[0] || '/images/gold-coins.jpg',
        badge: primaryCategory || cardBadge,
        discount: p.discountLabel || undefined,
        rating: ratingCount > 0 ? Math.round(avgRating) : 5,
        ratingText: ratingCount > 0 ? `(${avgRating.toFixed(1)})` : '',
      };
    });
  } else {
    displayProducts = fallbackCoins;
  }

  // Render title with gold highlight if specified
  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="text-[#b8860b]">
            {highlight}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className={`relative w-full py-16 md:py-24 bg-white text-gray-900 overflow-hidden font-sans${c.hideMobile ? ' hidden sm:block' : ''}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Centered Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow / Badge */}
          {badge && (
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#c59a3f]/70" />
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#b8860b] font-semibold select-none">
                {badge}
              </span>
              <div className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#c59a3f]/70" />
            </div>
          )}

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-[1.2]">
            {renderTitle()}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3.5 text-gray-600 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* 2. Products Grid */}
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
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c59a3f]/50 to-[#c59a3f]" />
          
          <Link
            href={seeAllUrl}
            className="mx-4 sm:mx-8 px-8 py-3.5 rounded-full border border-[#c59a3f] bg-black hover:bg-[#c59a3f] text-[#d4af37] hover:text-white font-serif text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 group whitespace-nowrap shadow-md hover:shadow-xl"
          >
            <span>{btnText}</span>
            <svg 
              className="w-4 h-4 text-[#c59a3f] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c59a3f]/50 to-[#c59a3f]" />
        </div>

      </div>
    </section>
  );
}
