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

export function getDayOfYear(): number {
  const now = new Date();
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 1);
  const current = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((current - startOfYear) / 86400000);
}

export function pickDailyProduct(products: HeroDailyProduct[], offset: number = 0): HeroDailyProduct | null {
  if (!products || products.length === 0) {
    return null;
  }
  const day = getDayOfYear();
  const index = Math.abs((day + offset) % products.length);
  return products[index];
}
