import prisma from '@/lib/prisma';
import {
  HeroDailyCard,
  HeroDailyProduct,
  FALLBACK_GOLD_BARS,
  FALLBACK_SILVER_BARS,
  FALLBACK_GOLD_COINS,
  FALLBACK_SILVER_COINS,
  getDefaultHeroDailyCards,
  pickDailyProduct,
} from '@/types/heroCards';

function formatPrice(val: number): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(val);
  } catch {
    return `${val.toFixed(2)} €`;
  }
}

function mapDbProduct(p: any, defaultImage: string, metal: 'gold' | 'silver'): HeroDailyProduct {
  const images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price,
    formattedPrice: formatPrice(price),
    imageUrl: images[0] || defaultImage,
    metal,
  };
}

/**
 * Queries database for the 4 categories and picks the product of the day for each.
 * Rotates daily based on current UTC day.
 */
export async function getHeroDailyCards(config?: Record<string, any>): Promise<HeroDailyCard[]> {
  const c = config || {};

  try {
    const [goldBarsDb, silverBarsDb, goldCoinsDb, silverCoinsDb] = await Promise.all([
      // 1. Gold Bars
      prisma.product.findMany({
        where: {
          isDeleted: false,
          OR: [
            { categories: { some: { slug: { in: ['lingots-dor', 'anlagegold', 'goldbarren', 'gold-bars'] } } } },
            {
              AND: [
                { title: { contains: 'bar', mode: 'insensitive' } },
                { title: { contains: 'gold', mode: 'insensitive' } }
              ]
            },
            { title: { contains: 'hafner', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // 2. Silver Bars
      prisma.product.findMany({
        where: {
          isDeleted: false,
          OR: [
            { categories: { some: { slug: { in: ['lingots-dargent', 'silver-bars', 'silberbarren'] } } } },
            {
              AND: [
                { title: { contains: 'argent', mode: 'insensitive' } },
                { title: { contains: 'lingot', mode: 'insensitive' } }
              ]
            },
            {
              AND: [
                { title: { contains: 'silver', mode: 'insensitive' } },
                { title: { contains: 'bar', mode: 'insensitive' } }
              ]
            }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // 3. Gold Coins
      prisma.product.findMany({
        where: {
          isDeleted: false,
          OR: [
            { categories: { some: { slug: { in: ['pieces-dor', 'goldm-nze', 'gold-coins', 'goldmuenzen'] } } } },
            {
              AND: [
                { title: { contains: 'or', mode: 'insensitive' } },
                { title: { contains: 'pièce', mode: 'insensitive' } }
              ]
            },
            { title: { contains: 'chervonetz', mode: 'insensitive' } },
            { title: { contains: 'elefant', mode: 'insensitive' } },
            { title: { contains: 'napoléon', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // 4. Silver Coins
      prisma.product.findMany({
        where: {
          isDeleted: false,
          OR: [
            { categories: { some: { slug: { in: ['pieces-dargent', 'silver-coins', 'silbermuenzen'] } } } },
            {
              AND: [
                { title: { contains: 'argent', mode: 'insensitive' } },
                { title: { contains: 'once', mode: 'insensitive' } }
              ]
            },
            {
              AND: [
                { title: { contains: 'silver', mode: 'insensitive' } },
                { title: { contains: 'eagle', mode: 'insensitive' } }
              ]
            }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    // Map DB products, fallback to rich defaults if DB had none
    const goldBars: HeroDailyProduct[] = goldBarsDb.length > 0
      ? goldBarsDb.map(p => mapDbProduct(p, '/images/gold-bars.jpg', 'gold'))
      : FALLBACK_GOLD_BARS;

    const silverBars: HeroDailyProduct[] = silverBarsDb.length > 0
      ? silverBarsDb.map(p => mapDbProduct(p, '/images/silver-bars.jpg', 'silver'))
      : FALLBACK_SILVER_BARS;

    const goldCoins: HeroDailyProduct[] = goldCoinsDb.length > 0
      ? goldCoinsDb.map(p => mapDbProduct(p, '/images/gold-coins.jpg', 'gold'))
      : FALLBACK_GOLD_COINS;

    const silverCoins: HeroDailyProduct[] = silverCoinsDb.length > 0
      ? silverCoinsDb.map(p => mapDbProduct(p, '/images/silver-coins.jpg', 'silver'))
      : FALLBACK_SILVER_COINS;

    return [
      {
        id: 'gold-bars',
        title: c.card1_title || 'Gold bars',
        categorySlug: 'lingots-dor',
        iconType: 'gold-bar',
        metal: 'gold',
        product: pickDailyProduct(goldBars, 0),
      },
      {
        id: 'silver-bars',
        title: c.card2_title || 'Silver bars',
        categorySlug: 'lingots-dargent',
        iconType: 'silver-bar',
        metal: 'silver',
        product: pickDailyProduct(silverBars, 1),
      },
      {
        id: 'gold-coins',
        title: c.card3_title || 'Gold coins',
        categorySlug: 'pieces-dor',
        iconType: 'gold-coin',
        metal: 'gold',
        product: pickDailyProduct(goldCoins, 2),
      },
      {
        id: 'silver-coins',
        title: c.card4_title || 'Silver coins',
        categorySlug: 'pieces-dargent',
        iconType: 'silver-coin',
        metal: 'silver',
        product: pickDailyProduct(silverCoins, 3),
      },
    ];
  } catch (error) {
    console.error('Error fetching hero daily cards from DB:', error);
    return getDefaultHeroDailyCards(config);
  }
}
