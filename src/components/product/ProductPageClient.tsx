'use client';

import { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';
import Link from 'next/link';
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-[#C8732A]' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Specs extraction matching BestDealsCard logic
function getProductKeySpecs(product: any) {
  const title = (product.title || '').toLowerCase();
  let purity = '';
  let weight = '';

  if (Array.isArray(product.attributes)) {
    const pAttr = product.attributes.find((x: any) => 
      ['pureté', 'purete', 'titrage', 'purity'].includes(String(x?.name || '').toLowerCase())
    );
    if (pAttr) purity = Array.isArray(pAttr.options) ? pAttr.options.join(', ') : String(pAttr.options || '');

    const wAttr = product.attributes.find((x: any) => 
      ['poids fin', 'poids or fin', 'poids', 'fine weight', 'weight'].includes(String(x?.name || '').toLowerCase())
    );
    if (wAttr) weight = Array.isArray(wAttr.options) ? wAttr.options.join(', ') : String(wAttr.options || '');
  }

  if (!purity) {
    if (
      title.includes('20 francs') ||
      title.includes('20 lei') ||
      title.includes('napoléon') ||
      title.includes('napoleon') ||
      title.includes('tunesien') ||
      title.includes('chervonetz') ||
      title.includes('10 roubles') ||
      title.includes('souverain') ||
      title.includes('sovereign')
    ) {
      purity = '900‰ (21.6K)';
    } else if (title.includes('krugerrand')) {
      purity = '916.7‰ (22K)';
    } else if (title.includes('argent') || title.includes('silver')) {
      purity = 'Argent 999.9‰';
    } else {
      purity = 'Or 999.9‰ (24K)';
    }
  }

  if (!weight) {
    if (
      title.includes('20 francs') ||
      title.includes('20 lei') ||
      title.includes('napoléon') ||
      title.includes('tunesien')
    ) {
      weight = '5,81 g or fin';
    } else if (title.includes('10 roubles') || title.includes('chervonetz')) {
      weight = '7,74 g or fin';
    } else if (title.includes('1/2 oz')) {
      weight = '1/2 oz (15,55 g)';
    } else if (title.includes('1/4 oz')) {
      weight = '1/4 oz (7,78 g)';
    } else if (title.includes('1/10 oz')) {
      weight = '1/10 oz (3,11 g)';
    } else if (title.includes('1 oz') || title.includes('1oz')) {
      weight = '1 oz (31,10 g)';
    } else if (title.includes('50g')) {
      weight = '50 g';
    } else if (title.includes('100g')) {
      weight = '100 g';
    } else if (title.includes('250g')) {
      weight = '250 g';
    } else if (title.includes('500g')) {
      weight = '500 g';
    } else if (title.includes('1kg') || title.includes('1 kg')) {
      weight = '1 kg';
    } else {
      weight = 'Standard LBMA';
    }
  }

  return { purity, weight };
}

interface ProductPageClientProps {
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    discountLabel?: string | null;
    type: string;
    stock: number | null;
    images: string[];
    attributes?: { name: string; options: string[] }[];
    variations?: { id: string; price: string; stock?: string; image?: string; attributes: Record<string, string> }[];
    brand?: { name: string; logo?: string | null } | null;
    categories?: { id: string; name: string; slug?: string }[];
    tags?: { name: string; slug?: string; id?: string }[];
    reviews?: { rating: number }[];
    [key: string]: any;
  };
  enableBuyNow?: boolean;
  storeName?: string;
  translations?: {
    sku: string;
    categories: string;
    tags: string;
    sold: string;
    customer_reviews: string;
    uncategorized: string;
    brand: string;
  };
  shippingInfo?: string[];
  contactSlug?: string;
}

export default function ProductPageClient({ 
  product, 
  enableBuyNow = false, 
  storeName = 'Gold Silver Invest', 
  translations, 
  shippingInfo, 
  contactSlug = 'contact' 
}: ProductPageClientProps) {
  const [variationImage, setVariationImage] = useState<string | null>(null);

  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length
    : 5;

  const t = useTranslations('Product');
  const locale = useLocale();
  const localePrefix = locale === 'fr' ? '' : `/${locale}`;
  const specs = getProductKeySpecs(product);
  const primaryCategory = product.categories?.[0]?.name || t('uncategorized');

  return (
    <>
      {/* Galerie d'images */}
      <ProductGallery
        images={product.images}
        title={product.title}
        discountLabel={product.discountLabel}
        compareAtPrice={product.compareAtPrice}
        price={product.price}
        activeVariationImage={variationImage}
      />

      {/* Colonne droite : En-tête, Spécifications, Actions d'achat, Métadonnées */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Category & Verified Investment Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#FAF5EB] text-[#8C6D23] border border-[#E8A63D]/30 shadow-2xs">
            {primaryCategory}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-[#6E685F] font-medium">
            {t('certified_investment_quality')}
          </span>
        </div>

        {/* Product Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0E2036] mb-3 leading-tight tracking-tight">
          {product.title}
        </h1>

        {/* Brand & Reviews row */}
        <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-[#6E685F]">
          {/* Brand */}
          {product.brand && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">{t('refiner')}</span>
              {product.brand.logo ? (
                <Image 
                  width={120} 
                  height={32} 
                  src={product.brand.logo} 
                  alt={product.brand.name} 
                  className="h-6 w-auto object-contain" 
                />
              ) : (
                <span className="font-bold text-[#0E2036] tracking-wide">{product.brand.name}</span>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(avgRating)} />)}
            </div>
            <span className="font-semibold text-[#0E2036]">
              {reviews.length > 0 ? t('investor_reviews', { count: reviews.length }) : t('certified_compliant')}
            </span>
          </div>

          {/* LBMA Good Delivery Tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0E2036] text-white text-[11px] font-medium tracking-wide">
            <span className="text-[#E8A63D]">★</span> {t('lbma_good_delivery')}
          </span>
        </div>

        {/* Technical Snapshot Banner (Pureté · Poids · Fiscalité) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-3 bg-white rounded-xl border border-[#E8E4DA] shadow-2xs">
          <div className="text-center p-2 rounded-lg bg-[#FAF9F5]">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">{t('spec_purity')}</span>
            <span className="text-xs font-serif font-bold text-[#0E2036] mt-0.5 block">{specs.purity}</span>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#FAF9F5]">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">{t('spec_fine_weight')}</span>
            <span className="text-xs font-serif font-bold text-[#0E2036] mt-0.5 block">{specs.weight}</span>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#FAF9F5]">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">{t('spec_packaging')}</span>
            <span className="text-xs font-serif font-bold text-[#0E2036] mt-0.5 block">{t('spec_sealed_blister')}</span>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#FAF9F5]">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">{t('spec_tax')}</span>
            <span className="text-xs font-serif font-bold text-emerald-700 mt-0.5 block">{t('spec_tax_free')}</span>
          </div>
        </div>

        {/* Actions Component (Price, Quantities, Delivery Options, Cart & Quote buttons, Guarantees) */}
        <ProductActions
          product={product as any}
          enableBuyNow={enableBuyNow}
          onVariationChange={(image: string | null) => setVariationImage(image)}
          shippingInfo={shippingInfo}
          contactSlug={contactSlug}
        />

        {/* Detailed Characteristics & Meta */}
        <div className="mt-8 pt-6 border-t border-[#E8E4DA] space-y-3 text-xs text-[#6E685F]">
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="font-semibold text-[#0E2036]">{t('inventory_ref')}</span>
            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{product.id.split('-')[0].toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="font-semibold text-[#0E2036]">{t('investment_category')}</span>
            <div className="text-right">
              {product.categories && product.categories.length > 0
                ? product.categories.map((c: any, index: number) => (
                    <span key={c.id}>
                      <Link href={`${localePrefix}/product-category/${c.slug || c.id}`} className="hover:text-[#C8732A] transition-colors font-medium">
                        {c.name}
                      </Link>
                      {index < product.categories!.length - 1 ? ', ' : ''}
                    </span>
                  ))
                : t('uncategorized')}
            </div>
          </div>

          {product.brand && !product.brand.logo && (
            <div className="flex items-center justify-between py-1 border-b border-gray-100">
              <span className="font-semibold text-[#0E2036]">{t('certified_refiner')}</span>
              <span className="font-medium text-gray-900">{product.brand.name}</span>
            </div>
          )}

          {/* Dynamic attributes entered from the Admin product form */}
          {Array.isArray(product.attributes) && product.attributes.length > 0 && (
            <div className="pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E2036] block mb-2.5">
                {t('additional_technical_specs')}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.attributes.map((attr: any, idx: number) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#E8E4DA] flex flex-col justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">{attr.name}</span>
                    <span className="text-[#0E2036] font-serif font-bold mt-0.5">
                      {Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.gtin && (
            <div className="flex items-center justify-between py-1 border-b border-gray-100">
              <span className="font-semibold text-[#0E2036]">{t('ean_code')}</span>
              <span className="font-mono text-gray-600">{product.gtin}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
