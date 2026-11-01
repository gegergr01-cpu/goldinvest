import ShopPage from '@/app/shop/page';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/site';

const isUuid = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Gold Silver Invest";
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
    description: category?.metaDescription || `Shop products in ${category?.name}`,
    keywords: category?.metaKeywords || undefined,
    alternates: {
      canonical: `/product-category/${category?.slug}`,
    },
    openGraph: {
      title: category?.metaTitle || category?.name || 'Category',
      description: category?.metaDescription || `Shop products in ${category?.name}`,
      url: `${SITE_URL}/product-category/${category?.slug}`,
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

  return <ShopPage searchParams={newSearchParams} />;
}
