import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getContactSettings } from '@/actions/contactSettings';
import { SITE_URL } from '@/lib/site';
import { SUPPORTED_LOCALES } from '@/i18n/config';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/$/, '');
  const contactSettings = await getContactSettings();
  const contactSlug = contactSettings.slug || 'contact';

  // Helper to generate an entry with all reciprocal hreflang links
  const createLocalizedEntry = (
    path: string,
    lastModified: Date = new Date(),
    changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly',
    priority: number = 0.8
  ): MetadataRoute.Sitemap => {
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

    const languages: Record<string, string> = {};
    for (const loc of SUPPORTED_LOCALES) {
      languages[loc] = `${baseUrl}/${loc}${cleanPath}`;
    }
    languages['x-default'] = `${baseUrl}/en${cleanPath}`;

    // Return an entry for EACH supported locale
    return SUPPORTED_LOCALES.map((loc) => ({
      url: `${baseUrl}/${loc}${cleanPath}`,
      lastModified,
      changeFrequency,
      priority: loc === 'fr' || loc === 'en' ? priority : Math.max(0.4, priority - 0.05),
      alternates: {
        languages,
      },
    }));
  };

  // 1. Static Pages
  const staticPaths: Array<{ path: string; freq: 'daily' | 'weekly' | 'monthly'; priority: number }> = [
    { path: '', freq: 'daily', priority: 1.0 },
    { path: '/shop', freq: 'daily', priority: 0.9 },
    { path: '/services', freq: 'weekly', priority: 0.8 },
    { path: '/blog', freq: 'weekly', priority: 0.8 },
    { path: `/${contactSlug}`, freq: 'monthly', priority: 0.6 },
    { path: '/faq', freq: 'weekly', priority: 0.7 },
    { path: '/sale', freq: 'weekly', priority: 0.8 },
    { path: '/new', freq: 'weekly', priority: 0.8 },
    { path: '/hot', freq: 'weekly', priority: 0.8 },
  ];

  const staticEntries = staticPaths.flatMap((item) =>
    createLocalizedEntry(item.path, new Date(), item.freq, item.priority)
  );

  // 2. Dynamic Products
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { slug: true, updatedAt: true },
  });

  const productEntries = products.flatMap((product) =>
    createLocalizedEntry(
      `/product/${product.slug}`,
      product.updatedAt,
      'weekly',
      0.85
    )
  );

  // 3. Dynamic Categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryEntries = categories
    .filter((c) => c.slug)
    .flatMap((category) =>
      createLocalizedEntry(
        `/product-category/${category.slug}`,
        new Date(),
        'weekly',
        0.75
      )
    );

  // 4. Dynamic Blog Articles
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const articleEntries = articles.flatMap((article) =>
    createLocalizedEntry(
      `/blog/${article.slug}`,
      article.updatedAt,
      'weekly',
      0.7
    )
  );

  // 5. CMS Pages (About, Legal, etc.)
  const pages = await prisma.page.findMany({
    select: { slug: true, updatedAt: true },
  });

  const cmsEntries = pages.flatMap((page) =>
    createLocalizedEntry(
      `/${page.slug}`,
      page.updatedAt,
      'monthly',
      0.5
    )
  );

  return [
    ...staticEntries,
    ...productEntries,
    ...categoryEntries,
    ...articleEntries,
    ...cmsEntries,
  ];
}
