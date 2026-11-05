import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductReviews from '@/components/product/ProductReviews';
import BestDealsCard from '@/components/home/BestDealsCard';
import { createClient } from '@/utils/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { safeJsonLd } from '@/lib/security';
import { Metadata } from 'next';
import { getCachedProductBySlug, getCachedSettings, getCachedRelatedProducts } from '@/lib/cache';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  
  const product = await getCachedProductBySlug(slug, locale);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Gold Silver Invest";

  if (!product) {
    return {
      title: `Produit introuvable - ${storeName}`,
    };
  }

  return {
    title: product.metaTitle ? product.metaTitle : `${product.title} | ${storeName}`,
    description: product.metaDescription || (product.shortDescription ? product.shortDescription.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 160) : '') || (product.description ? product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 160) : ''),
    alternates: {
      canonical: `/product/${slug}`,
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const localePrefix = locale === 'fr' ? '' : `/${locale}`;
  
  const product = await getCachedProductBySlug(slug, locale);
  const t = await getTranslations('Product');

  const settingsMap = await getCachedSettings();
  const enableBuyNow = settingsMap.ENABLE_BUY_NOW_BUTTON === 'true';
  const shippingInfo = [
    settingsMap.SHIPPING_INFO_1 || 'Livraison discrète et sécurisée sous 24-48h',
    settingsMap.SHIPPING_INFO_2 || 'Colis scellé avec assurance 100% ad valorem',
    settingsMap.SHIPPING_INFO_3 || 'Option garde en coffres sécurisés en Suisse / Paris',
    settingsMap.SHIPPING_INFO_4 || 'Rachat garanti permanent sans décote',
  ];

  if (!product) {
    return notFound();
  }

  // Related products (same category)
  const categoryIds = (product as any).categories?.map((c: any) => c.id) || [];
  const relatedProducts = await getCachedRelatedProducts(categoryIds, product.id);

  // Lowest shipping rate for DE / default
  const deZone = await prisma.shippingZone.findFirst({
    where: { name: 'DE', isActive: true },
    include: { methods: { where: { isActive: true }, orderBy: { rate: 'asc' } } }
  });
  const lowestShippingRate = deZone?.methods?.[0]?.rate ?? 0;

  // Check if logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Gold Silver Invest';

  const reviews = (product as any).reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length
    : 0;

  const schemaJson: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images || [],
    description: (product.description ? product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : undefined) || (product.shortDescription ? product.shortDescription.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : undefined),
    sku: product.id.split('-')[0].toUpperCase(),
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.goldsilversinvest.com'}/product/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: storeName
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: lowestShippingRate,
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd'
          }
        }
      }
    }
  };

  if (reviews.length > 0) {
    schemaJson.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    };
    schemaJson.review = reviews.map((r: any) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
      },
      author: {
        '@type': 'Person',
        name: r.reviewerName || 'Investisseur',
      },
      reviewBody: r.comment || '',
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : undefined,
    }));
  }

  if ((product as any).brand) {
    schemaJson.brand = {
      '@type': 'Brand',
      name: (product as any).brand.name
    };
  }

  if ((product as any).gtin) {
    schemaJson.gtin = (product as any).gtin;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-gray-900 flex flex-col">
      <main className="flex-grow pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(schemaJson)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Accueil',
                  item: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldsilversinvest.com',
                },
                ...((product as any).categories && (product as any).categories.length > 0 ? [{
                  '@type': 'ListItem',
                  position: 2,
                  name: (product as any).categories[0].name,
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldsilversinvest.com'}/product-category/${(product as any).categories[0].slug || (product as any).categories[0].id}`,
                }] : []),
                {
                  '@type': 'ListItem',
                  position: (product as any).categories && (product as any).categories.length > 0 ? 3 : 2,
                  name: product.title,
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldsilversinvest.com'}/product/${product.slug}`,
                },
              ],
            })
          }}
        />

        {/* Refined Luxury Breadcrumb */}
        <div className="bg-white border-b border-[#E8E4DA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 text-xs text-[#6E685F] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={localePrefix || '/'} className="hover:text-[#C8732A] transition-colors font-medium">
                {t('home')}
              </Link>
              <span className="text-[#C8732A]/50">/</span>
              {(product as any).categories && (product as any).categories.length > 0 ? (
                <Link 
                  href={`${localePrefix}/product-category/${(product as any).categories[0].slug || (product as any).categories[0].id}`}
                  className="hover:text-[#C8732A] transition-colors font-medium"
                >
                  {(product as any).categories[0].name}
                </Link>
              ) : (
                <span>{t('category')}</span>
              )}
              <span className="text-[#C8732A]/50">/</span>
              <span className="text-[#0E2036] font-semibold line-clamp-1 max-w-[280px] sm:max-w-md">
                {product.title}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8C6D23] font-medium bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#E8A63D]/30 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A]" />
              <span>{t('lbma_badge')}</span>
            </div>
          </div>
        </div>

        {/* Main Product Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div id="cart-notification-portal"></div>
          
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            <ProductPageClient
              product={product as any}
              enableBuyNow={enableBuyNow}
              storeName={storeName}
              shippingInfo={shippingInfo}
              contactSlug={settingsMap.CONTACT_SLUG || 'contact'}
              translations={{
                sku: t('sku'),
                categories: t('categories'),
                tags: t('tags'),
                sold: t('sold'),
                customer_reviews: t('customer_reviews', { count: (product as any).reviews?.length || 0 }),
                uncategorized: t('uncategorized'),
                brand: t('brand')
              }}
            />
          </div>

          {/* Description & Reviews Tabs */}
          <ProductReviews 
            productId={product.id}
            productTitle={product.title}
            reviews={(product as any).reviews || []}
            description={product.description}
            isLoggedIn={isLoggedIn}
          />

          {/* Related Investment Products Section */}
          <div className="mt-20 pt-12 border-t border-[#E8E4DA]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#C8732A] block mb-1">
                  {t('related_portfolio_title')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E2036]">
                  {t('related_products_heading')}
                </h2>
                <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
                  {t('related_products_desc')}
                </p>
              </div>

              <Link
                href={`${localePrefix}/shop`}
                className="text-xs font-bold text-[#C8732A] hover:text-[#B8641C] hover:underline flex items-center gap-1.5 shrink-0"
              >
                <span>{t('explore_catalog')}</span>
                <span>→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map(rp => {
                  const images = Array.isArray(rp.images) 
                    ? rp.images 
                    : (typeof rp.images === 'string' ? JSON.parse(rp.images || '[]') : []);
                  const localizedTrans = (rp as any).translations?.find((tr: any) => tr.locale === locale);
                  const localizedTitle = localizedTrans?.title || rp.title;
                  const localizedSlug = localizedTrans?.slug || rp.slug;
                  const catTrans = (rp as any).categories?.[0]?.translations?.find((tr: any) => tr.locale === locale);
                  const primaryCat = catTrans?.name || (rp as any).categories?.[0]?.name || 'Investissement';

                  return (
                    <BestDealsCard
                      key={rp.id}
                      product={{
                        id: rp.id,
                        slug: localizedSlug,
                        title: localizedTitle,
                        category: primaryCat,
                        rawPrice: typeof rp.price === 'number' ? rp.price : Number(rp.price) || 0,
                        imageUrl: images[0] || '/images/gold-coins.jpg',
                        badge: primaryCat,
                        discount: rp.discountLabel || undefined,
                        stock: rp.stock,
                        attributes: rp.attributes,
                      }}
                      badge={primaryCat}
                    />
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-[#E8E4DA] text-xs text-gray-500">
                  {t('no_related_products')}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
