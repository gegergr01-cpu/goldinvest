import prisma from '@/lib/prisma';
import {
  HeroDailyCard,
  HeroDailyProduct,
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

function mapDbProduct(p: any, metal: 'gold' | 'silver'): HeroDailyProduct {
  const images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price,
    formattedPrice: formatPrice(price),
    imageUrl: images[0] || (metal === 'gold' ? '/images/gold-bars.jpg' : '/images/silver-bars.jpg'),
    metal,
  };
}

/**
 * Queries the database for products in each of the 4 precious metals categories.
 * ONLY returns a card if the category has at least ONE real product in the database.
 * No fictitious/mock products are created or displayed.
 * Changes the displayed product daily among existing real products.
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
            { title: { contains: 'hafner', mode: 'insensitive' } },
            { title: { contains: 'goldbarren', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 30
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
            },
            { title: { contains: 'silberbarren', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 30
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
            { title: { contains: 'goldmünze', mode: 'insensitive' } },
            { title: { contains: 'chervonetz', mode: 'insensitive' } },
            { title: { contains: 'elefant', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 30
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
                { title: { contains: 'pièce', mode: 'insensitive' } }
              ]
            },
            {
              AND: [
                { title: { contains: 'silver', mode: 'insensitive' } },
                { title: { contains: 'coin', mode: 'insensitive' } }
              ]
            },
            { title: { contains: 'silbermünze', mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      })
    ]);

    const cards: HeroDailyCard[] = [];

    // Only add a category card if it has at least 1 real product in the DB
    if (goldBarsDb && goldBarsDb.length > 0) {
      const products = goldBarsDb.map(p => mapDbProduct(p, 'gold'));
      const product = pickDailyProduct(products, 0);
      if (product) {
        cards.push({
          id: 'gold-bars',
          title: c.card1_title || 'Gold bars',
          categorySlug: 'lingots-dor',
          iconType: 'gold-bar',
          metal: 'gold',
          product,
        });
      }
    }

    if (silverBarsDb && silverBarsDb.length > 0) {
      const products = silverBarsDb.map(p => mapDbProduct(p, 'silver'));
      const product = pickDailyProduct(products, 1);
      if (product) {
        cards.push({
          id: 'silver-bars',
          title: c.card2_title || 'Silver bars',
          categorySlug: 'lingots-dargent',
          iconType: 'silver-bar',
          metal: 'silver',
          product,
        });
      }
    }

    if (goldCoinsDb && goldCoinsDb.length > 0) {
      const products = goldCoinsDb.map(p => mapDbProduct(p, 'gold'));
      const product = pickDailyProduct(products, 2);
      if (product) {
        cards.push({
          id: 'gold-coins',
          title: c.card3_title || 'Gold coins',
          categorySlug: 'pieces-dor',
          iconType: 'gold-coin',
          metal: 'gold',
          product,
        });
      }
    }

    if (silverCoinsDb && silverCoinsDb.length > 0) {
      const products = silverCoinsDb.map(p => mapDbProduct(p, 'silver'));
      const product = pickDailyProduct(products, 3);
      if (product) {
        cards.push({
          id: 'silver-coins',
          title: c.card4_title || 'Silver coins',
          categorySlug: 'pieces-dargent',
          iconType: 'silver-coin',
          metal: 'silver',
          product,
        });
      }
    }

    return cards;
  } catch (error) {
    console.error('Error fetching hero daily cards from DB:', error);
    return [];
  }
}
