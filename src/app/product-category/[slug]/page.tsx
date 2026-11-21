import ShopPage from '@/app/shop/page';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/site';
import { getLocale } from 'next-intl/server';
import { buildInternationalAlternates } from '@/lib/seo';
import { safeJsonLd } from '@/lib/security';

const isUuid = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "GOLAY INVEST";
  const locale = await getLocale();
  const rawSlug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(rawSlug);

  const orConditions: any[] = [
    { slug: decodedSlug },
    { slug: rawSlug },
  ];
  if (isUuid(rawSlug)) {
    orConditions.push({ id: rawSlug });
  }

  const category = await prisma.category.findFirst({
    where: {
      OR: orConditions,
    },
  });

  if (!category) {
    return {
      title: `Category not found - ${storeName}`,
    };
  }

  return {
    title: category?.metaTitle ? category.metaTitle : `${category?.name || 'Category'} | ${storeName}`,
    description: category?.metaDescription || `Découvrez notre gamme de produits d'investissement en métaux précieux (${category?.name || 'Category'}).`,
    keywords: category?.metaKeywords || undefined,
    alternates: buildInternationalAlternates(`/product-category/${category?.slug || rawSlug}`, locale),
    openGraph: {
      title: category?.metaTitle || category?.name || 'Category',
      description: category?.metaDescription || `Découvrez notre gamme de produits d'investissement en métaux précieux (${category?.name || 'Category'}).`,
      url: `${SITE_URL}/${locale}/product-category/${category?.slug || rawSlug}`,
      siteName: storeName,
      type: 'website',
    }
  };
}

export default async function ProductCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(rawSlug);

  const orConditions: any[] = [
    { slug: decodedSlug },
    { slug: rawSlug },
  ];
  if (isUuid(rawSlug)) {
    orConditions.push({ id: rawSlug });
  }

  const category = await prisma.category.findFirst({
    where: {
      OR: orConditions,
    },
  });

  if (!category) {
    notFound();
  }

  // If searchParams explicitly specifies category, respect it. Otherwise, default to this category's slug.
  const activeCategory = resolvedSearchParams.category !== undefined
    ? resolvedSearchParams.category
    : (category.slug || decodedSlug);

  const newSearchParams = Promise.resolve({
    ...resolvedSearchParams,
    category: activeCategory
  });

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "GOLAY INVEST";
  const locale = await getLocale();
  const baseUrl = SITE_URL.replace(/\/$/, '');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Boutique',
        item: `${baseUrl}/${locale}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${baseUrl}/${locale}/product-category/${category.slug || decodedSlug}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.metaDescription || `Collection de métaux précieux d'investissement ${category.name} chez ${storeName}`,
    url: `${baseUrl}/${locale}/product-category/${category.slug || decodedSlug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }}
      />
      <ShopPage searchParams={newSearchParams} />
    </>
  );
}
