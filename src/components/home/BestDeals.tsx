import React from 'react';
import prisma from '@/lib/prisma';
import BestDealsClient, { TabConfig } from './BestDealsClient';
import { getLocale, getTranslations } from 'next-intl/server';

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

function formatProduct(p: any, defaultImage: string, defaultBadge: string, locale?: string) {
  const images = Array.isArray(p.images)
    ? p.images
    : typeof p.images === 'string'
      ? JSON.parse(p.images || '[]')
      : [];
  const activeTrans = p.translations?.find((t: any) => t.locale === locale) || p.translations?.[0];
  const title = activeTrans?.title || p.title;
  const slug = activeTrans?.slug || p.slug;
  const primaryCat = p.categories && p.categories.length > 0 ? p.categories[0] : null;
  const catTrans = primaryCat?.translations?.find((t: any) => t.locale === locale) || primaryCat?.translations?.[0];
  const primaryCategory = catTrans?.name || primaryCat?.name || '';
  const approvedReviews = (p as any).reviews || [];
  const ratingCount = approvedReviews.length;
  const avgRating =
    ratingCount > 0 ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingCount : 0;

  return {
    id: p.id,
    slug: slug,
    title: title,
    category: primaryCategory || defaultBadge,
    rawPrice: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
    imageUrl: images[0] || defaultImage,
    badge: primaryCategory || defaultBadge,
    discount: p.discountLabel || undefined,
    rating: ratingCount > 0 ? Math.round(avgRating) : 5,
    ratingText: ratingCount > 0 ? `(${avgRating.toFixed(1)})` : '',
    stock: p.stock,
    attributes: activeTrans?.attributes || p.attributes,
  };
}

function isGoldProduct(p: any): boolean {
  const catSlugs = (p.categories || []).map((c: any) => String(c.slug || '').toLowerCase()).join(' ');
  const title = String(p.title || '').toLowerCase();

  // If assigned to a silver category or title clearly indicates silver, it is NEVER gold
  if (
    catSlugs.includes('pieces-dargent') ||
    catSlugs.includes('lingots-dargent') ||
    catSlugs.includes('silver-coins') ||
    catSlugs.includes('silver-bars') ||
    catSlugs.includes('silber') ||
    title.includes('argent') ||
    title.includes('silver') ||
    title.includes('silber')
  ) {
    return false;
  }

  let metalAttr = '';
  if (p.attributes) {
    try {
      const parsed = typeof p.attributes === 'string' ? JSON.parse(p.attributes || '[]') : p.attributes;
      if (Array.isArray(parsed)) {
        const m = parsed.find((a: any) => ['métal', 'metal'].includes(String(a.name || '').toLowerCase()));
        if (m) {
          metalAttr = Array.isArray(m.options) ? m.options.join(' ') : String(m.options || '');
        }
      }
    } catch {}
  }

  if (metalAttr.toLowerCase().includes('argent') || metalAttr.toLowerCase().includes('silver')) return false;
  if (metalAttr.toLowerCase().includes('or') || metalAttr.toLowerCase().includes('gold')) return true;
  if (title.includes('feingold') || title.includes('goldbarren') || title.includes('goldmünze') || title.includes('goldm-nze') || title.includes('gold')) return true;
  if (catSlugs.includes('pieces-dor') || catSlugs.includes('lingots-dor') || catSlugs.includes('anlagegold')) return true;
  return false;
}

function isSilverProduct(p: any): boolean {
  const catSlugs = (p.categories || []).map((c: any) => String(c.slug || '').toLowerCase()).join(' ');
  const title = String(p.title || '').toLowerCase();

  // If assigned to a gold category and not silver, it is NEVER silver
  if (
    (catSlugs.includes('pieces-dor') || catSlugs.includes('lingots-dor') || catSlugs.includes('anlagegold')) &&
    !catSlugs.includes('pieces-dargent') && !catSlugs.includes('lingots-dargent')
  ) {
    return false;
  }

  let metalAttr = '';
  if (p.attributes) {
    try {
      const parsed = typeof p.attributes === 'string' ? JSON.parse(p.attributes || '[]') : p.attributes;
      if (Array.isArray(parsed)) {
        const m = parsed.find((a: any) => ['métal', 'metal'].includes(String(a.name || '').toLowerCase()));
        if (m) {
          metalAttr = Array.isArray(m.options) ? m.options.join(' ') : String(m.options || '');
        }
      }
    } catch {}
  }

  if (catSlugs.includes('pieces-dargent') || catSlugs.includes('lingots-dargent') || catSlugs.includes('silver-coins') || catSlugs.includes('silver-bars')) return true;
  if (metalAttr.toLowerCase().includes('argent') || metalAttr.toLowerCase().includes('silver') || metalAttr.toLowerCase().includes('silber')) return true;
  if (title.includes('feinsilber') || title.includes('silberbarren') || title.includes('silbermünze') || title.includes('silbermuenze') || title.includes('argent') || title.includes('silver')) return true;
  return false;
}

function padWithFallbacks(
  realProducts: any[],
  fallbacks: any[],
  maxNum: number
): any[] {
  if (realProducts.length >= maxNum) {
    return realProducts.slice(0, maxNum);
  }
  const remaining = maxNum - realProducts.length;
  const padded = fallbacks
    .filter((f) => {
      const fn = String(f.title || '').toLowerCase();
      return !realProducts.some((r) => {
        const rn = String(r.title || '').toLowerCase();
        if (fn.includes('philharmonique') && rn.includes('philharmonique')) return true;
        if (fn.includes('maple') && rn.includes('maple')) return true;
        if (fn.includes('eagle') && rn.includes('eagle')) return true;
        if (fn.includes('britannia') && rn.includes('britannia')) return true;
        if (fn.includes('krugerrand') && rn.includes('krugerrand')) return true;
        if (fn.includes('napoléon') && rn.includes('napoléon')) return true;
        return false;
      });
    })
    .slice(0, remaining);

  return [...realProducts, ...padded];
}

export default async function BestDeals({ config }: BestDealsProps) {
  const c = config || {};

  const metalType: 'gold' | 'silver' =
    c.metal === 'silver' || c.metal === 'SILVER' || (c.title && c.title.toLowerCase().includes('argent'))
      ? 'silver'
      : 'gold';

  const isSilver = metalType === 'silver';
  const locale = await getLocale();
  const isFrench = locale === 'fr';
  const t = await getTranslations(isSilver ? 'Landing.SilverDeals' : 'Landing.BestDeals');

  const badge = (isFrench && c.badge && !["NOS PIÈCES D'OR", "L'OR D'INVESTISSEMENT", "L'ARGENT D'INVESTISSEMENT"].includes(c.badge))
    ? c.badge
    : t('badge');

  const title = (isFrench && c.title && !["Nos Pièces d'Or", "Nos Produits d'Or d'Investissement", "Nos Produits d'Argent d'Investissement"].includes(c.title))
    ? c.title
    : t('title');

  const highlight = (isFrench && c.highlight && !["Pièces d'Or"].includes(c.highlight))
    ? c.highlight
    : t('highlight');

  const subtitle = (isFrench && c.subtitle && !c.subtitle.includes("Des pièces d'or authentiques, sélectionnées avec soin"))
    ? c.subtitle
    : t('subtitle');

  const cardBadge = (isFrench && c.cardBadge) ? c.cardBadge : t('cardBadge');
  const maxNum = parseInt(c.maxProducts || '4', 10) || 4;

  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';

  // Tabs labels and URLs
  const tab1Label = (isFrench && c.tab1_title) ? c.tab1_title : t('tab1_title');
  const tab2Label = (isFrench && c.tab2_title) ? c.tab2_title : t('tab2_title');

  const tab1BtnText = (isFrench && c.tab1_btn_text) ? c.tab1_btn_text : t('tab1_btn_text');
  const tab1RawUrl = c.tab1_btn_url || (isSilver ? "/shop?category=pieces-dargent" : "/shop?category=pieces-dor");
  const tab1BtnUrl = tab1RawUrl.startsWith('/') ? `${localePrefix}${tab1RawUrl}` : tab1RawUrl;

  const tab2BtnText = (isFrench && c.tab2_btn_text) ? c.tab2_btn_text : t('tab2_btn_text');
  const tab2RawUrl = c.tab2_btn_url || (isSilver ? "/shop?category=lingots-dargent" : "/shop?category=lingots-dor");
  const tab2BtnUrl = tab2RawUrl.startsWith('/') ? `${localePrefix}${tab2RawUrl}` : tab2RawUrl;

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
              { categories: { some: { slug: { in: ['pieces-dargent', 'silver-coins', 'silbermuenzen', 'monedas-de-plata', 'pieces-argent', 'silver-coin'] } } } },
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
              { title: { contains: 'silbermünze', mode: 'insensitive' } },
            ],
          },
          include: {
            categories: { include: { translations: { where: { locale } } } },
            translations: { where: { locale } },
            reviews: { where: { isApproved: true } },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['lingots-dargent', 'silver-bars', 'silberbarren', 'lingotes-de-plata', 'lingot-argent'] } } } },
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
          include: {
            categories: { include: { translations: { where: { locale } } } },
            translations: { where: { locale } },
            reviews: { where: { isApproved: true } },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const filteredSilverCoins = (silverCoinsDb || []).filter((p) => !isGoldProduct(p));
      const filteredSilverBars = (silverBarsDb || []).filter((p) => !isGoldProduct(p));

      const mappedSilverCoins = filteredSilverCoins.map((p) =>
        formatProduct(p, '/images/silver-coins.jpg', cardBadge, locale)
      );
      const mappedSilverBars = filteredSilverBars.map((p) =>
        formatProduct(p, '/images/silver-bars.jpg', 'LBMA Certifié', locale)
      );

      tab1Products = padWithFallbacks(mappedSilverCoins, fallbackSilverCoins, maxNum);
      tab2Products = padWithFallbacks(mappedSilverBars, fallbackSilverBars, maxNum);
    } else {
      // Gold Showcase
      const [goldCoinsDb, goldBarsDb] = await Promise.all([
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['pieces-dor', 'goldm-nze', 'gold-coins', 'goldmuenzen', 'monedas-de-oro', 'pieces-or'] } } } },
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
          include: {
            categories: { include: { translations: { where: { locale } } } },
            translations: { where: { locale } },
            reviews: { where: { isApproved: true } },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({
          where: {
            isDeleted: false,
            OR: [
              { categories: { some: { slug: { in: ['lingots-dor', 'anlagegold', 'goldbarren', 'gold-bars', 'lingotes-de-oro'] } } } },
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
          include: {
            categories: { include: { translations: { where: { locale } } } },
            translations: { where: { locale } },
            reviews: { where: { isApproved: true } },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const filteredGoldCoins = (goldCoinsDb || []).filter((p) => !isSilverProduct(p));
      const filteredGoldBars = (goldBarsDb || []).filter((p) => !isSilverProduct(p));

      const mappedGoldCoins = filteredGoldCoins.map((p) =>
        formatProduct(p, '/images/gold-coins.jpg', cardBadge, locale)
      );
      const mappedGoldBars = filteredGoldBars.map((p) =>
        formatProduct(p, '/images/gold-bars.jpg', 'LBMA Certifié', locale)
      );

      tab1Products = padWithFallbacks(mappedGoldCoins, fallbackGoldCoins, maxNum);
      tab2Products = padWithFallbacks(mappedGoldBars, fallbackGoldBars, maxNum);
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
