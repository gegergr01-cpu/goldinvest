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

/**
 * Standard minimal projection for Product Cards (Lists, Grid, BestDeals, Home, Search).
 * STRICT ANTI-EGRESS: Excludes heavy HTML `description`, raw JSON `attributes`/`variations`,
 * and internal metadata fields. Only loads fields strictly required for rendering cards.
 */
export const PRODUCT_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  type: true,
  price: true,
  compareAtPrice: true,
  images: true,
  stock: true,
  isBestSeller: true,
  isDealOfTheDay: true,
  discountLabel: true,
  createdAt: true,
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
    },
  },
  translations: {
    select: {
      locale: true,
      title: true,
      slug: true,
    },
  },
  reviews: {
    where: { isApproved: true },
    select: { rating: true },
  },
} as const;

/**
 * Standard minimal projection for Blog Article Cards.
 * STRICT ANTI-EGRESS: Excludes heavy article HTML `content` and raw markdown.
 */
export const ARTICLE_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  image: true,
  category: true,
  createdAt: true,
  _count: {
    select: {
      comments: { where: { isApproved: true } },
    },
  },
} as const;

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

// Cached single product by slug (includes full details only on detail page)
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

// Cached related products with minimal projection
export const getCachedRelatedProducts = async (categoryIds: string[], excludeProductId: string) => {
  const sortedIds = [...categoryIds].sort();
  return unstable_cache(
    async () => prisma.product.findMany({
      where: { 
        categories: { some: { id: { in: categoryIds } } }, 
        id: { not: excludeProductId },
        isDeleted: false,
      },
      select: PRODUCT_CARD_SELECT,
      take: 4,
    }),
    ['related-products', sortedIds.join(','), excludeProductId],
    { tags: ['products'], revalidate: 3600 }
  )();
};

// Caching for Homepage best sellers (minimal projection)
export const getCachedBestSellers = unstable_cache(
  async () => prisma.product.findMany({
    where: { isBestSeller: true, isDeleted: false },
    take: 8,
    select: PRODUCT_CARD_SELECT,
  }),
  ['home-best-sellers'],
  { tags: ['products'], revalidate: 3600 }
);

// Caching for Homepage latest products (minimal projection)
export const getCachedLatestProducts = unstable_cache(
  async () => prisma.product.findMany({
    where: { isDeleted: false },
    take: 8,
    orderBy: { createdAt: 'desc' },
    select: PRODUCT_CARD_SELECT,
  }),
  ['home-latest-products'],
  { tags: ['products'], revalidate: 3600 }
);

// Caching categories tree (minimal projection, no heavy meta fields)
export const getCachedCategoriesTree = unstable_cache(
  async () => prisma.category.findMany({
    where: { parentId: null },
    select: {
      id: true,
      name: true,
      slug: true,
      translations: {
        select: { locale: true, name: true, slug: true },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          translations: {
            select: { locale: true, name: true, slug: true },
          },
        },
      },
    },
  }),
  ['categories-tree'],
  { tags: ['categories'], revalidate: 3600 }
);

// Caching product counts for layout badges
export const getCachedProductCounts = unstable_cache(
  async () => {
    const [newCount, hotCount, saleCount] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false, orderItems: { some: {} } } }),
      prisma.product.count({ where: { isDeleted: false, compareAtPrice: { not: null } } }),
    ]);
    return { newCount, hotCount, saleCount };
  },
  ['layout-product-counts'],
  { tags: ['products'], revalidate: 3600 }
);

// Caching Shop Filter Metadata (Categories with count, Brands with count, Min/Max Price)
export const getCachedShopFilterMetadata = async (locale: string = 'fr') => {
  return unstable_cache(
    async () => {
      const [allCategories, priceAgg, allBrands] = await Promise.all([
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            translations: {
              where: { locale },
              select: { name: true, slug: true },
            },
            _count: {
              select: { products: { where: { isDeleted: false } } },
            },
          },
          orderBy: { name: 'asc' },
        }),
        prisma.product.aggregate({
          where: { isDeleted: false },
          _min: { price: true },
          _max: { price: true },
        }),
        prisma.brand.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: { products: { where: { isDeleted: false } } },
            },
          },
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        allCategories,
        globalMinPrice: Math.floor(priceAgg._min?.price || 0),
        globalMaxPrice: Math.ceil(priceAgg._max?.price || 1000),
        allBrands,
      };
    },
    ['shop-filter-metadata', locale],
    { tags: ['categories', 'products', 'brands'], revalidate: 3600 }
  )();
};

// Caching Category lookups by slug (deduplicated between generateMetadata & page render)
export const getCachedCategoryBySlug = async (slug: string, locale: string = 'fr') => {
  return unstable_cache(
    async () => {
      const rawSlug = slug;
      const decodedSlug = decodeURIComponent(rawSlug);
      const orConditions: any[] = [{ slug: decodedSlug }, { slug: rawSlug }];
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawSlug)) {
        orConditions.push({ id: rawSlug });
      }
      return prisma.category.findFirst({
        where: { OR: orConditions },
        select: {
          id: true,
          name: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
          translations: {
            where: { locale },
            select: { name: true, slug: true, metaTitle: true, metaDescription: true },
          },
        },
      });
    },
    ['category-by-slug', slug, locale],
    { tags: ['categories', `category-${slug}`], revalidate: 3600 }
  )();
};

// Caching CMS Pages by slug (deduplicated between generateMetadata & page render)
export const getCachedPageBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      if (!slug || typeof slug !== 'string') return null;
      return prisma.page.findUnique({
        where: { slug },
      });
    },
    ['cms-page-by-slug', slug],
    { tags: ['pages', `page-${slug}`], revalidate: 3600 }
  )();
};

// Caching approved reviews for Homepage
export const getCachedApprovedReviews = async (limit: number = 6, locale: string = 'fr') => {
  return unstable_cache(
    async () => {
      return prisma.review.findMany({
        where: { isApproved: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          reviewerName: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              translations: {
                where: { locale },
                select: { title: true },
              },
            },
          },
          user: {
            select: {
              email: true,
            },
          },
        },
      });
    },
    ['home-approved-reviews', limit.toString(), locale],
    { tags: ['reviews', 'products'], revalidate: 3600 }
  )();
};

// Caching published blog articles with minimal card projection
export const getCachedPublishedArticles = async (query: string = '') => {
  const cleanQ = query.trim().toLowerCase();
  return unstable_cache(
    async () => {
      return prisma.article.findMany({
        where: {
          isPublished: true,
          ...(cleanQ ? { title: { contains: cleanQ, mode: 'insensitive' } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        select: ARTICLE_CARD_SELECT,
      });
    },
    ['published-articles', cleanQ],
    { tags: ['articles'], revalidate: 3600 }
  )();
};

// Caching recent blog articles for sidebars
export const getCachedRecentArticles = async (limit: number = 5) => {
  return unstable_cache(
    async () => {
      return prisma.article.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: { id: true, title: true, slug: true },
      });
    },
    ['recent-articles', limit.toString()],
    { tags: ['articles'], revalidate: 3600 }
  )();
};

// Caching full article detail by slug (deduplicated between generateMetadata & page render)
export const getCachedArticleBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      if (!slug || typeof slug !== 'string') return null;
      return prisma.article.findUnique({
        where: { slug },
        include: {
          comments: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              author: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
    },
    ['article-by-slug', slug],
    { tags: ['articles', `article-${slug}`], revalidate: 3600 }
  )();
};
