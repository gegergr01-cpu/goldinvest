export interface HeroDailyProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  formattedPrice: string;
  imageUrl: string;
  metal: 'gold' | 'silver';
}

export interface HeroDailyCard {
  id: 'gold-bars' | 'silver-bars' | 'gold-coins' | 'silver-coins';
  title: string;
  categorySlug: string;
  iconType: 'gold-bar' | 'silver-bar' | 'gold-coin' | 'silver-coin';
  metal: 'gold' | 'silver';
  product: HeroDailyProduct;
}

// Fallback catalog in case DB is unreachable or during client-side preview
export const FALLBACK_GOLD_BARS: HeroDailyProduct[] = [
  {
    id: 'fb-gb-1',
    slug: 'chafner-100-g-goldbarren-minted-gold-bar',
    title: 'C.Hafner 100 g Goldbarren',
    price: 11700.38,
    formattedPrice: '11 700,38 €',
    imageUrl: 'https://res.cloudinary.com/q6cqy21h/image/upload/v1793661900/topkaminbrennstoffe/media/w7mzkd7ii72dmpezcp54.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gb-2',
    slug: 'lingot-or-1kg-lbma-valcambi',
    title: "Lingot d'Or 1 kg LBMA 999.9‰",
    price: 84500.00,
    formattedPrice: '84 500,00 €',
    imageUrl: '/images/gold-bars.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gb-3',
    slug: 'lingot-or-50g-c-hafner',
    title: "Lingot d'Or 50 g C.Hafner",
    price: 4350.00,
    formattedPrice: '4 350,00 €',
    imageUrl: '/images/gold-bars.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gb-4',
    slug: 'lingot-or-1oz-pamp-suisse',
    title: "Lingot d'Or 1 oz PAMP Fortuna",
    price: 2680.00,
    formattedPrice: '2 680,00 €',
    imageUrl: '/images/gold-bars.jpg',
    metal: 'gold'
  }
];

export const FALLBACK_SILVER_BARS: HeroDailyProduct[] = [
  {
    id: 'fb-sb-1',
    slug: 'lingot-argent-1kg-lbma-heraeus',
    title: "Lingot Argent 1 kg LBMA 999‰",
    price: 1120.00,
    formattedPrice: '1 120,00 €',
    imageUrl: '/images/silver-bars.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sb-2',
    slug: 'lingot-argent-500g-umicore',
    title: "Lingot Argent 500 g Umicore",
    price: 580.00,
    formattedPrice: '580,00 €',
    imageUrl: '/images/silver-bars.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sb-3',
    slug: 'lingot-argent-100oz-nadir',
    title: "Lingot Argent 100 oz Nadir",
    price: 3450.00,
    formattedPrice: '3 450,00 €',
    imageUrl: '/images/silver-bars.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sb-4',
    slug: 'lingot-argent-250g-valcambi',
    title: "Lingot Argent 250 g Valcambi",
    price: 295.00,
    formattedPrice: '295,00 €',
    imageUrl: '/images/silver-bars.jpg',
    metal: 'silver'
  }
];

export const FALLBACK_GOLD_COINS: HeroDailyProduct[] = [
  {
    id: 'fb-gc-1',
    slug: '12-oz-elefant-2025-somalia',
    title: '1/2 oz Elefant 2025 Somalia',
    price: 1200.89,
    formattedPrice: '1 200,89 €',
    imageUrl: 'https://res.cloudinary.com/q6cqy21h/image/upload/v1793614277/topkaminbrennstoffe/media/e6lqqcqoifngr82jjnwv.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gc-2',
    slug: '20-francs-or-napoleon-iii-tete-nue',
    title: '20 Francs Or Napoléon III',
    price: 887.50,
    formattedPrice: '887,50 €',
    imageUrl: '/images/gold-coins.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gc-3',
    slug: '1-once-or-krugerrand-2025',
    title: '1 Once Or Krugerrand 2025',
    price: 2489.00,
    formattedPrice: '2 489,00 €',
    imageUrl: '/images/gold-coins.jpg',
    metal: 'gold'
  },
  {
    id: 'fb-gc-4',
    slug: '20-lei-goldmnze-carol-i-rumnien-1883',
    title: '20 Lei Carol I Rumänien 1883',
    price: 1100.75,
    formattedPrice: '1 100,75 €',
    imageUrl: 'https://res.cloudinary.com/q6cqy21h/image/upload/v1793614999/topkaminbrennstoffe/media/jggztpcdxstvzmzwawjd.jpg',
    metal: 'gold'
  }
];

export const FALLBACK_SILVER_COINS: HeroDailyProduct[] = [
  {
    id: 'fb-sc-1',
    slug: '1-once-argent-silver-eagle-usa-2025',
    title: '1 oz Silver Eagle USA 2025',
    price: 38.50,
    formattedPrice: '38,50 €',
    imageUrl: '/images/silver-coins.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sc-2',
    slug: '1-once-argent-maple-leaf-canada',
    title: '1 oz Argent Maple Leaf Canada',
    price: 37.20,
    formattedPrice: '37,20 €',
    imageUrl: '/images/silver-coins.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sc-3',
    slug: '1-once-argent-philharmonique-vienne',
    title: '1 oz Philharmonique Vienne',
    price: 36.90,
    formattedPrice: '36,90 €',
    imageUrl: '/images/silver-coins.jpg',
    metal: 'silver'
  },
  {
    id: 'fb-sc-4',
    slug: '1-once-argent-britannia-uk-2025',
    title: '1 oz Argent Britannia UK 2025',
    price: 37.80,
    formattedPrice: '37,80 €',
    imageUrl: '/images/silver-coins.jpg',
    metal: 'silver'
  }
];

export function getDayOfYear(): number {
  const now = new Date();
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 1);
  const current = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((current - startOfYear) / 86400000);
}

export function pickDailyProduct(products: HeroDailyProduct[], offset: number = 0): HeroDailyProduct {
  if (!products || products.length === 0) {
    return FALLBACK_GOLD_BARS[0];
  }
  const day = getDayOfYear();
  const index = Math.abs((day + offset) % products.length);
  return products[index];
}

export function getDefaultHeroDailyCards(config?: Record<string, any>): HeroDailyCard[] {
  const c = config || {};

  return [
    {
      id: 'gold-bars',
      title: c.card1_title || 'Gold bars',
      categorySlug: 'lingots-dor',
      iconType: 'gold-bar',
      metal: 'gold',
      product: pickDailyProduct(FALLBACK_GOLD_BARS, 0),
    },
    {
      id: 'silver-bars',
      title: c.card2_title || 'Silver bars',
      categorySlug: 'lingots-dargent',
      iconType: 'silver-bar',
      metal: 'silver',
      product: pickDailyProduct(FALLBACK_SILVER_BARS, 1),
    },
    {
      id: 'gold-coins',
      title: c.card3_title || 'Gold coins',
      categorySlug: 'pieces-dor',
      iconType: 'gold-coin',
      metal: 'gold',
      product: pickDailyProduct(FALLBACK_GOLD_COINS, 2),
    },
    {
      id: 'silver-coins',
      title: c.card4_title || 'Silver coins',
      categorySlug: 'pieces-dargent',
      iconType: 'silver-coin',
      metal: 'silver',
      product: pickDailyProduct(FALLBACK_SILVER_COINS, 3),
    },
  ];
}

