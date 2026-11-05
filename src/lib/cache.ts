import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

// Sensitive secret keys that must NEVER be leaked to public cache or RSC props
const HIDDEN_SETTING_KEYS = new Set([
  'STRIPE_SECRET_KEY',
  'PAYPAL_SECRET',
  'CRON_SECRET',
  'SMTP_PASSWORD',
  'SMTP_PASS',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SETUP_TOKEN',
]);

// Helper to get raw settings (excluding sensitive payment and service credentials)
async function fetchSettings() {
  const settingsDb = await prisma.setting.findMany();
  return settingsDb
    .filter(s => !HIDDEN_SETTING_KEYS.has(s.key))
    .reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
}

// Cached version of settings
export const getCachedSettings = unstable_cache(
  async () => fetchSettings(),
  ['global-settings'],
  { tags: ['settings'], revalidate: 3600 }
);

// We need a helper for dynamic tags per slug since unstable_cache tags must be statically defined in the wrapper
// A common pattern is a factory function:
export const getCachedProductBySlug = async (slug: string, locale: string = 'fr') => {
  return unstable_cache(
    async () => {
      const encodedSlugLower = encodeURIComponent(slug).toLowerCase();
      const encodedSlugUpper = encodeURIComponent(slug);
      let decodedSlug = slug;
      try { decodedSlug = decodeURIComponent(slug); } catch (e) {}

      const product = await prisma.product.findFirst({
        where: { 
          OR: [
            { slug: slug },
            { slug: encodedSlugLower },
            { slug: encodedSlugUpper },
            { slug: decodedSlug },
            { translations: { some: { slug: slug } } },
            { translations: { some: { slug: decodedSlug } } },
          ]
        },
        include: {
          translations: true,
          categories: {
            include: {
              translations: true
            }
          },
          Product_ForceSales_A: true,
          Product_SaleTogether_A: true,
          brand: true,
          tags: true,
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
          }
        }
      });

      if (!product) return null;

      // Overlay translation if available for requested locale
      const activeTranslation = product.translations.find(t => t.locale === locale);

      const localizedTitle = activeTranslation?.title || product.title;
      const localizedSlug = activeTranslation?.slug || product.slug;
      const localizedShortDesc = activeTranslation?.shortDescription ?? product.shortDescription;
      const localizedDesc = activeTranslation?.description ?? product.description;
      const localizedMetaTitle = activeTranslation?.metaTitle ?? product.metaTitle;
      const localizedMetaDesc = activeTranslation?.metaDescription ?? product.metaDescription;
      const localizedAttributes = activeTranslation?.attributes ?? product.attributes;

      // Localize categories
      const localizedCategories = product.categories.map(cat => {
        const catTrans = (cat as any).translations?.find((t: any) => t.locale === locale);
        return {
          ...cat,
          name: catTrans?.name || cat.name,
          slug: catTrans?.slug || cat.slug,
          metaTitle: catTrans?.metaTitle || cat.metaTitle,
          metaDescription: catTrans?.metaDescription || cat.metaDescription
        };
      });

      // RGPD: Never leak raw emails to client RSC payload
      const sanitizedReviews = product.reviews.map(r => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewerName: r.reviewerName || (r.user?.email ? r.user.email.split('@')[0] : 'Client'),
      }));

      return {
        ...product,
        title: localizedTitle,
        slug: localizedSlug,
        shortDescription: localizedShortDesc,
        description: localizedDesc,
        metaTitle: localizedMetaTitle,
        metaDescription: localizedMetaDesc,
        attributes: localizedAttributes,
        categories: localizedCategories,
        reviews: sanitizedReviews,
      };
    },
    ['product-details', slug, locale],
    { tags: ['products', `product-${slug}`, `product-locale-${locale}`], revalidate: 3600 }
  )();
};

export const getCachedRelatedProducts = async (categoryIds: string[], excludeProductId: string) => {
  // Sort IDs so the cache key is consistent
  const sortedIds = [...categoryIds].sort();
  return unstable_cache(
    async () => prisma.product.findMany({
      where: { 
        categories: { some: { id: { in: categoryIds } } }, 
        id: { not: excludeProductId } 
      },
      include: { categories: true },
      take: 4,
    }),
    ['related-products', sortedIds.join(','), excludeProductId],
    { tags: ['products'], revalidate: 3600 }
  )();
};

// Caching for Homepage best sellers
export const getCachedBestSellers = unstable_cache(
  async () => prisma.product.findMany({
    where: { isBestSeller: true, isDeleted: false },
    take: 8,
    include: { categories: true }
  }),
  ['home-best-sellers'],
  { tags: ['products'], revalidate: 3600 }
);

// Caching for Homepage latest products
export const getCachedLatestProducts = unstable_cache(
  async () => prisma.product.findMany({
    where: { isDeleted: false },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { categories: true }
  }),
  ['home-latest-products'],
  { tags: ['products'], revalidate: 3600 }
);

// Caching categories tree
export const getCachedCategoriesTree = unstable_cache(
  async () => prisma.category.findMany({
    where: { parentId: null },
    include: { children: true }
  }),
  ['categories-tree'],
  { tags: ['categories'], revalidate: 3600 }
);

export const getCachedProductCounts = unstable_cache(
  async () => {
    const [newCount, hotCount, saleCount] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { orderItems: { some: {} } } }),
      prisma.product.count({ where: { compareAtPrice: { not: null } } })
    ]);
    return { newCount, hotCount, saleCount };
  },
  ['layout-product-counts'],
  { tags: ['products'], revalidate: 3600 }
);
