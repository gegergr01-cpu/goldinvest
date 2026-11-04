import React from 'react';
import prisma from '@/lib/prisma';
import BestDealsClient, { TabConfig } from './BestDealsClient';

interface BestDealsProps {
  config?: Record<string, any>;
}

// 4 iconic default gold coins
const fallbackGoldCoins = [
  {
    id: 'coin-napoleon',
    slug: '20-francs-or-napoleon-iii',
    title: '20 Francs Or Napoléon III',
    category: "Pièces d'or",
    rawPrice: 887.50,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    purity: '900‰ (21.6K)',
    weight: '5,81 g or fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-maple-leaf',
    slug: '1-once-or-maple-leaf',
    title: '1 Once Or Maple Leaf',
    category: "Pièces d'or",
    rawPrice: 2489.00,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    purity: '999.9‰ (24K)',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-krugerrand',
    slug: '1-once-or-krugerrand',
    title: '1 Once Or Krugerrand',
    category: "Pièces d'or",
    rawPrice: 2489.00,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    purity: '916.7‰ (22K)',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-philharmonic',
    slug: '1-once-or-philharmonique',
    title: '1 Once Or Philharmonique',
    category: "Pièces d'or",
    rawPrice: 2489.00,
    imageUrl: '/images/gold-coins.jpg',
    badge: 'Investissement',
    purity: '999.9‰ (24K)',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
];

// 4 iconic default gold bars
const fallbackGoldBars = [
  {
    id: 'bar-gold-1oz',
    slug: 'lingot-or-1-once-c-hafner',
    title: "Lingot d'Or 1 Once C.Hafner LBMA",
    category: "Lingots d'or",
    rawPrice: 2460.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'LBMA Certifié',
    purity: '999.9‰ (24K)',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-gold-50g',
    slug: 'lingot-or-50g-c-hafner',
    title: "Lingot d'Or 50 g C.Hafner LBMA",
    category: "Lingots d'or",
    rawPrice: 3945.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'LBMA Certifié',
    purity: '999.9‰ (24K)',
    weight: '50 g or fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-gold-100g',
    slug: 'lingot-or-100g-c-hafner',
    title: "Lingot d'Or 100 g C.Hafner LBMA",
    category: "Lingots d'or",
    rawPrice: 7850.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'LBMA Certifié',
    purity: '999.9‰ (24K)',
    weight: '100 g or fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-gold-250g',
    slug: 'lingot-or-250g-c-hafner',
    title: "Lingot d'Or 250 g C.Hafner LBMA",
    category: "Lingots d'or",
    rawPrice: 19550.00,
    imageUrl: '/images/gold-bars.jpg',
    badge: 'LBMA Certifié',
    purity: '999.9‰ (24K)',
    weight: '250 g or fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
];

// 4 iconic default silver coins
const fallbackSilverCoins = [
  {
    id: 'coin-silver-maple',
    slug: '1-once-argent-maple-leaf',
    title: '1 Once Argent Maple Leaf',
    category: "Pièces d'argent",
    rawPrice: 36.50,
    imageUrl: '/images/silver-coins.jpg',
    badge: 'Investissement',
    purity: 'Argent 999.9‰',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-silver-philharmonic',
    slug: '1-once-argent-philharmonique',
    title: '1 Once Argent Philharmonique',
    category: "Pièces d'argent",
    rawPrice: 36.20,
    imageUrl: '/images/silver-coins.jpg',
    badge: 'Investissement',
    purity: 'Argent 999‰',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-silver-eagle',
    slug: '1-once-argent-silver-eagle',
    title: '1 Once Argent American Eagle',
    category: "Pièces d'argent",
    rawPrice: 38.90,
    imageUrl: '/images/silver-coins.jpg',
    badge: 'Investissement',
    purity: 'Argent 999‰',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'coin-silver-britannia',
    slug: '1-once-argent-britannia',
    title: '1 Once Argent Britannia',
    category: "Pièces d'argent",
    rawPrice: 36.80,
    imageUrl: '/images/silver-coins.jpg',
    badge: 'Investissement',
    purity: 'Argent 999‰',
    weight: '1 oz (31,10 g)',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
];

// 4 iconic default silver bars
const fallbackSilverBars = [
  {
    id: 'bar-silver-100g',
    slug: 'lingot-argent-100g-lbma',
    title: "Lingot d'Argent 100 g LBMA",
    category: "Lingots d'argent",
    rawPrice: 118.00,
    imageUrl: '/images/silver-bars.jpg',
    badge: 'LBMA Certifié',
    purity: 'Argent 999.9‰',
    weight: '100 g argent fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-silver-250g',
    slug: 'lingot-argent-250g-lbma',
    title: "Lingot d'Argent 250 g LBMA",
    category: "Lingots d'argent",
    rawPrice: 289.00,
    imageUrl: '/images/silver-bars.jpg',
    badge: 'LBMA Certifié',
    purity: 'Argent 999.9‰',
    weight: '250 g argent fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-silver-500g',
    slug: 'lingot-argent-500g-lbma',
    title: "Lingot d'Argent 500 g LBMA",
    category: "Lingots d'argent",
    rawPrice: 565.00,
    imageUrl: '/images/silver-bars.jpg',
    badge: 'LBMA Certifié',
    purity: 'Argent 999.9‰',
    weight: '500 g argent fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
  {
    id: 'bar-silver-1kg',
    slug: 'lingot-argent-1kg-c-hafner',
    title: "Lingot d'Argent 1 kg C.Hafner LBMA",
    category: "Lingots d'argent",
    rawPrice: 1095.00,
    imageUrl: '/images/silver-bars.jpg',
    badge: 'LBMA Certifié',
    purity: 'Argent 999.9‰',
    weight: '1 kg argent fin',
    inStock: true,
    rating: 5,
    ratingText: '(5.0)',
  },
];

function formatProduct(p: any, defaultImage: string, defaultBadge: string) {
  const images = Array.isArray(p.images)
    ? p.images
    : typeof p.images === 'string'
    ? JSON.parse(p.images || '[]')
    : [];
  const primaryCategory = p.categories && p.categories.length > 0 ? p.categories[0].name : '';
  const approvedReviews = (p as any).reviews || [];
  const ratingCount = approvedReviews.length;
  const avgRating =
    ratingCount > 0 ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingCount : 0;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: primaryCategory || defaultBadge,
    rawPrice: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
    imageUrl: images[0] || defaultImage,
    badge: primaryCategory || defaultBadge,
    discount: p.discountLabel || undefined,
    rating: ratingCount > 0 ? Math.round(avgRating) : 5,
    ratingText: ratingCount > 0 ? `(${avgRating.toFixed(1)})` : '',
    stock: p.stock,
    attributes: p.attributes,
  };
}

export default async function BestDeals({ config }: BestDealsProps) {
  const c = config || {};

  const metalType: 'gold' | 'silver' =
    c.metal === 'silver' || c.metal === 'SILVER' || (c.title && c.title.toLowerCase().includes('argent'))
      ? 'silver'
      : 'gold';

  const isSilver = metalType === 'silver';

  // Titles, Subtitles, Badges with luxury defaults
  const defaultBadge = isSilver ? "L'ARGENT D'INVESTISSEMENT" : "L'OR D'INVESTISSEMENT";
  const badge = c.badge && c.badge !== "NOS PIÈCES D'OR" ? c.badge : defaultBadge;

  const defaultTitle = isSilver
    ? "Nos Produits d'Argent d'Investissement"
    : "Nos Produits d'Or d'Investissement";
  const title = c.title && c.title !== "Nos Pièces d'Or" ? c.title : defaultTitle;

  const defaultHighlight = isSilver ? "Argent d'Investissement" : "Or d'Investissement";
  const highlight = c.highlight && c.highlight !== "Pièces d'Or" ? c.highlight : defaultHighlight;

  const defaultSubtitle = isSilver
    ? "Pièces d'argent pures 999‰ et lingots certifiés LBMA sous blister scellé pour diversifier votre patrimoine."
    : "Pièces d'or d'investissement boursables et lingots certifiés LBMA sous blister scellé pour sécuriser votre épargne.";
  const subtitle = c.subtitle && !c.subtitle.includes("Des pièces d'or authentiques, sélectionnées avec soin")
    ? c.subtitle
    : defaultSubtitle;

  const cardBadge = c.cardBadge || 'Investissement';
  const maxNum = parseInt(c.maxProducts || '4', 10) || 4;

  // Tabs labels and URLs
  const tab1Label = c.tab1_title || (isSilver ? "Pièces d'argent" : "Pièces d'or");
  const tab2Label = c.tab2_title || (isSilver ? "Lingots d'argent" : "Lingots d'or");

  const tab1BtnText = c.tab1_btn_text || (isSilver ? "Voir toutes les pièces d'argent" : "Voir toutes les pièces d'or");
  const tab1BtnUrl = c.tab1_btn_url || (isSilver ? "/shop?category=pieces-dargent" : "/shop?category=pieces-dor");

  const tab2BtnText = c.tab2_btn_text || (isSilver ? "Voir tous les lingots d'argent" : "Voir tous les lingots d'or");
  const tab2BtnUrl = c.tab2_btn_url || (isSilver ? "/shop?category=lingots-dargent" : "/shop?category=lingots-dor");

  // Fetch DB products in parallel
  let tab1Products: any[] = [];
  let tab2Products: any[] = [];

  try {
    if (isSilver) {
      const [silverCoinsDb, silverBarsDb] = await Promise.all([
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['pieces-dargent', 'silver-coins', 'silbermuenzen'] } } } },
              {
                AND: [
                  { title: { contains: 'argent', mode: 'insensitive' } },
                  { title: { contains: 'pièce', mode: 'insensitive' } },
                ],
              },
              {
                AND: [
                  { title: { contains: 'silver', mode: 'insensitive' } },
                  { title: { contains: 'coin', mode: 'insensitive' } },
                ],
              },
              { title: { contains: 'silver eagle', mode: 'insensitive' } },
            ],
          },
          include: { categories: true, reviews: { where: { isApproved: true } } },
          take: maxNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['lingots-dargent', 'silver-bars', 'silberbarren'] } } } },
              {
                AND: [
                  { title: { contains: 'argent', mode: 'insensitive' } },
                  { title: { contains: 'lingot', mode: 'insensitive' } },
                ],
              },
              {
                AND: [
                  { title: { contains: 'silver', mode: 'insensitive' } },
                  { title: { contains: 'bar', mode: 'insensitive' } },
                ],
              },
            ],
          },
          include: { categories: true, reviews: { where: { isApproved: true } } },
          take: maxNum,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      tab1Products = silverCoinsDb && silverCoinsDb.length > 0
        ? silverCoinsDb.map((p) => formatProduct(p, '/images/silver-coins.jpg', cardBadge))
        : fallbackSilverCoins.slice(0, maxNum);

      tab2Products = silverBarsDb && silverBarsDb.length > 0
        ? silverBarsDb.map((p) => formatProduct(p, '/images/silver-bars.jpg', 'LBMA Certifié'))
        : fallbackSilverBars.slice(0, maxNum);
    } else {
      // Gold Showcase
      const [goldCoinsDb, goldBarsDb] = await Promise.all([
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['pieces-dor', 'goldm-nze', 'gold-coins', 'goldmuenzen'] } } } },
              {
                AND: [
                  { title: { contains: 'or', mode: 'insensitive' } },
                  { title: { contains: 'pièce', mode: 'insensitive' } },
                ],
              },
              { title: { contains: 'napoléon', mode: 'insensitive' } },
              { title: { contains: 'krugerrand', mode: 'insensitive' } },
              { title: { contains: 'philharmonique', mode: 'insensitive' } },
              { title: { contains: 'maple leaf', mode: 'insensitive' } },
            ],
          },
          include: { categories: true, reviews: { where: { isApproved: true } } },
          take: maxNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['lingots-dor', 'anlagegold', 'goldbarren', 'gold-bars'] } } } },
              {
                AND: [
                  { title: { contains: 'bar', mode: 'insensitive' } },
                  { title: { contains: 'gold', mode: 'insensitive' } },
                ],
              },
              {
                AND: [
                  { title: { contains: 'lingot', mode: 'insensitive' } },
                  { title: { contains: 'or', mode: 'insensitive' } },
                ],
              },
              { title: { contains: 'hafner', mode: 'insensitive' } },
              { title: { contains: 'valcambi', mode: 'insensitive' } },
              { title: { contains: 'heraeus', mode: 'insensitive' } },
            ],
          },
          include: { categories: true, reviews: { where: { isApproved: true } } },
          take: maxNum,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      tab1Products = goldCoinsDb && goldCoinsDb.length > 0
        ? goldCoinsDb.map((p) => formatProduct(p, '/images/gold-coins.jpg', cardBadge))
        : fallbackGoldCoins.slice(0, maxNum);

      tab2Products = goldBarsDb && goldBarsDb.length > 0
        ? goldBarsDb.map((p) => formatProduct(p, '/images/gold-bars.jpg', 'LBMA Certifié'))
        : fallbackGoldBars.slice(0, maxNum);
    }
  } catch (err) {
    console.error('Error fetching showcase products:', err);
    if (isSilver) {
      tab1Products = fallbackSilverCoins.slice(0, maxNum);
      tab2Products = fallbackSilverBars.slice(0, maxNum);
    } else {
      tab1Products = fallbackGoldCoins.slice(0, maxNum);
      tab2Products = fallbackGoldBars.slice(0, maxNum);
    }
  }

  const tab1Config: TabConfig = {
    id: 'tab1',
    label: tab1Label,
    icon: '🪙',
    products: tab1Products,
    btnText: tab1BtnText,
    btnUrl: tab1BtnUrl,
  };

  const tab2Config: TabConfig = {
    id: 'tab2',
    label: tab2Label,
    icon: '🧱',
    products: tab2Products,
    btnText: tab2BtnText,
    btnUrl: tab2BtnUrl,
  };

  return (
    <BestDealsClient
      badge={badge}
      title={title}
      highlight={highlight}
      subtitle={subtitle}
      cardBadge={cardBadge}
      hideMobile={c.hideMobile}
      metal={metalType}
      tab1={tab1Config}
      tab2={tab2Config}
    />
  );
}
