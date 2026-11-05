'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCurrency } from '@/components/CurrencyProvider';
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import LuxuryArrow from '@/components/ui/LuxuryArrow';

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    type: string;
    stock: number | null;
    images: string[];
    attributes?: { name: string; options: string[] }[];
    variations?: { id: string; price: string; stock?: string; image?: string; attributes: Record<string, string> }[];
    forceSales?: any[];
    saleTogether?: any[];
  };
  enableBuyNow?: boolean;
  onVariationChange?: (image: string | null) => void;
  shippingInfo?: string[];
  contactSlug?: string;
}

export default function ProductActions({ 
  product, 
  enableBuyNow = false, 
  onVariationChange, 
  shippingInfo, 
  contactSlug = 'contact' 
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const { formatPrice } = useCurrency();
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const [wishlistedItemName, setWishlistedItemName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedSaleTogether, setSelectedSaleTogether] = useState<string[]>([]);
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'delivery' | 'vault' | 'pickup'>('delivery');
  const t = useTranslations('Product');
  const locale = useLocale();
  const localePrefix = locale === 'fr' ? '' : `/${locale}`;

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  
  const isWishlisted = wishlistStore.hasItem(product.id);

  // For variable products, check variation match
  const isVariable = product.type === 'VARIABLE';
  const attributes = product.attributes || [];
  const variations = product.variations || [];

  let currentVariation: { id: string; price: string; stock?: string; image?: string; attributes: Record<string, string> } | null = null;
  if (isVariable && Object.keys(selectedAttributes).length === attributes.length) {
    currentVariation = variations.find(v => {
      return Object.entries(selectedAttributes).every(([key, value]) => v.attributes[key] === value);
    }) || null;
  }

  // Notify parent of active variation image
  useEffect(() => {
    if (onVariationChange) {
      onVariationChange(currentVariation?.image || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVariation?.id]);

  // Dynamic price & stock
  const basePrice = currentVariation ? parseFloat(currentVariation.price) : product.price;
  
  // Volume discount calculation
  let volumeDiscountPct = 0;
  if (quantity >= 10) {
    volumeDiscountPct = 0.01; // -1%
  } else if (quantity >= 5) {
    volumeDiscountPct = 0.005; // -0.5%
  }
  const unitPrice = basePrice * (1 - volumeDiscountPct);
  const totalPrice = unitPrice * quantity;

  const currentStock = currentVariation 
    ? (currentVariation.stock ? parseInt(currentVariation.stock) : null) 
    : product.stock;

  const getCartItemBase = (prod: any, price: number, qty: number = 1, currentVar: any = null, attrs: any = undefined) => ({
    id: currentVar ? `${prod.id}-${currentVar.id}` : prod.id,
    productId: prod.id,
    variationId: currentVar?.id,
    title: prod.title,
    price: price,
    image: currentVar?.image || prod.images?.[0] || '',
    quantity: qty,
    attributes: attrs,
  });

  const getLinkedItemsForCart = (qty: number) => {
    const fsItems = (product.forceSales || []).map(fs => getCartItemBase(fs, fs.price, qty));
    const stItems = (product.saleTogether || [])
      .filter(st => selectedSaleTogether.includes(st.id))
      .map(st => getCartItemBase(st, st.price, 1));

    return [...fsItems, ...stItems];
  };

  const handleAddToCart = () => {
    if (isVariable && !currentVariation) {
      alert(t('select_options_cart'));
      return;
    }

    const mainItem = getCartItemBase(product, unitPrice, quantity, currentVariation, currentVariation ? selectedAttributes : undefined);
    const linkedItems = getLinkedItemsForCart(quantity);
    
    cartStore.addItem(mainItem, linkedItems);
    cartStore.setIsOpen(true);
    
    setAddedItemName(product.title);
    setTimeout(() => {
      setAddedItemName(null);
    }, 5000);
  };

  const handleBuyNow = () => {
    if (isVariable && !currentVariation) {
      alert(t('select_options_buy'));
      return;
    }

    const mainItem = getCartItemBase(product, unitPrice, quantity, currentVariation, currentVariation ? selectedAttributes : undefined);
    const linkedItems = getLinkedItemsForCart(quantity);
    
    cartStore.addItem(mainItem, linkedItems);
    router.push('/checkout');
  };

  const notificationPortal = isClient ? document.getElementById('cart-notification-portal') : null;

  const handleToggleWishlist = () => {
    const wasWishlisted = wishlistStore.hasItem(product.id);
    wishlistStore.toggleItem(product.id);
    
    if (!wasWishlisted) {
      setWishlistedItemName(product.title);
      wishlistStore.setIsOpen(true);
      setTimeout(() => {
        setWishlistedItemName(null);
      }, 5000);
    }
  };

  return (
    <div>
      {/* Toast Add to Cart */}
      {addedItemName && notificationPortal && createPortal(
        <div className="bg-[#0E2036] text-white px-6 py-4 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-lg rounded-xl border border-[#C8732A]/30">
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </span>
            <span>{t('added_to_cart', { name: addedItemName })}</span>
          </div>
          <Link href={`${localePrefix}/cart`} className="mt-4 sm:mt-0 text-xs font-bold tracking-wider hover:underline whitespace-nowrap bg-gradient-to-r from-[#C8732A] to-[#B8641C] text-white px-5 py-2.5 rounded-lg shadow-sm">
            {t('view_cart_caps')}
          </Link>
        </div>,
        notificationPortal
      )}

      {/* Toast Wishlist */}
      {wishlistedItemName && notificationPortal && createPortal(
        <div className="bg-[#FAF5EB] text-[#8C6D23] px-6 py-4 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-md rounded-xl border border-[#E8A63D]/40">
          <div className="flex items-center gap-3 text-sm font-medium">
            <svg className="w-5 h-5 text-[#C8732A] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span>{t('added_to_wishlist', { name: wishlistedItemName })}</span>
          </div>
          <Link href={`${localePrefix}/wishlist`} className="mt-4 sm:mt-0 text-xs font-bold tracking-wider hover:underline whitespace-nowrap bg-[#0E2036] text-white px-5 py-2.5 rounded-lg shadow-sm">
            {t('view_wishlist_caps')}
          </Link>
        </div>,
        notificationPortal
      )}

      {/* Live Market Bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t('live_spot_price')}
        </span>
        <span className="text-xs text-[#8A847A] font-medium hidden sm:inline">
          {t('live_updated')}
        </span>
      </div>

      {/* Price Display */}
      <div className="p-5 bg-gradient-to-br from-[#FAF9F5] to-[#F5F2EB] border border-[#E8E4DA] rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0E2036] tracking-tight">
                {formatPrice(unitPrice)}
              </span>
              {product.compareAtPrice && !currentVariation && (
                <span className="text-xl text-gray-400 line-through font-serif">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#8C6D23] font-medium">
              <span className="font-semibold text-emerald-700">{t('spec_tax_free')}</span>
              <span>•</span>
              <span>{t('tax_free_law')}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            {currentStock === null || currentStock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {currentStock === null ? t('immediate_stock') : t('stock_available', { count: currentStock })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {t('on_order_delay')}
              </span>
            )}
          </div>
        </div>

        {/* Volume pricing tier table */}
        <div className="mt-4 pt-4 border-t border-[#E8E4DA]/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E685F] block mb-2">
            {t('volume_pricing_title')}
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border transition-colors ${quantity < 5 ? 'bg-white border-[#C8732A] shadow-xs' : 'bg-white/60 border-[#E8E4DA]'}`}>
              <div className="text-[11px] text-gray-500">{t('tier_1_4')}</div>
              <div className="font-bold text-[#0E2036] mt-0.5">{formatPrice(basePrice)} /u</div>
            </div>
            <div className={`p-2 rounded-lg border transition-colors ${quantity >= 5 && quantity < 10 ? 'bg-white border-[#C8732A] shadow-xs ring-1 ring-[#C8732A]' : 'bg-white/60 border-[#E8E4DA]'}`}>
              <div className="text-[11px] text-[#C8732A] font-medium">{t('tier_5_9')}</div>
              <div className="font-bold text-[#0E2036] mt-0.5">{formatPrice(basePrice * 0.995)} /u</div>
            </div>
            <div className={`p-2 rounded-lg border transition-colors ${quantity >= 10 ? 'bg-white border-[#C8732A] shadow-xs ring-1 ring-[#C8732A]' : 'bg-white/60 border-[#E8E4DA]'}`}>
              <div className="text-[11px] text-emerald-700 font-medium">{t('tier_10_plus')}</div>
              <div className="font-bold text-[#0E2036] mt-0.5">{formatPrice(basePrice * 0.99)} /u</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode de détention / Delivery Selector */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0E2036] block mb-2.5">
          {t('holding_mode')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedDeliveryMode('delivery')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedDeliveryMode === 'delivery'
                ? 'border-[#C8732A] bg-white ring-2 ring-[#C8732A]/20 shadow-sm'
                : 'border-[#E8E4DA] bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🚚</span>
              <span className="text-xs font-bold text-[#0E2036]">{t('delivery_mode_insured')}</span>
            </div>
            <p className="text-[11px] text-[#6E685F] leading-tight">
              {t('delivery_mode_insured_desc')}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDeliveryMode('vault')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedDeliveryMode === 'vault'
                ? 'border-[#C8732A] bg-white ring-2 ring-[#C8732A]/20 shadow-sm'
                : 'border-[#E8E4DA] bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🏦</span>
              <span className="text-xs font-bold text-[#0E2036]">{t('delivery_mode_vault')}</span>
            </div>
            <p className="text-[11px] text-[#6E685F] leading-tight">
              {t('delivery_mode_vault_desc')}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDeliveryMode('pickup')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedDeliveryMode === 'pickup'
                ? 'border-[#C8732A] bg-white ring-2 ring-[#C8732A]/20 shadow-sm'
                : 'border-[#E8E4DA] bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🤝</span>
              <span className="text-xs font-bold text-[#0E2036]">{t('delivery_mode_pickup')}</span>
            </div>
            <p className="text-[11px] text-[#6E685F] leading-tight">
              {t('delivery_mode_pickup_desc')}
            </p>
          </button>
        </div>
      </div>

      {/* Attributes Selection (Only if Variable) */}
      {isVariable && attributes.length > 0 && (
        <div className="space-y-4 mb-6 p-4 bg-white rounded-xl border border-[#E8E4DA]">
          {attributes.map(attr => (
            <div key={attr.name}>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E2036] mb-2 block">
                {attr.name} {selectedAttributes[attr.name] && <span className="text-[#C8732A] font-semibold ml-1">: {selectedAttributes[attr.name]}</span>}
              </span>
              <div className="flex flex-wrap gap-2">
                {attr.options.map((opt: string) => {
                  const isSelected = selectedAttributes[attr.name] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedAttributes({ ...selectedAttributes, [attr.name]: opt })}
                      className={`px-3.5 py-1.5 border rounded-lg text-xs font-medium transition cursor-pointer ${
                        isSelected 
                          ? 'border-[#C8732A] bg-[#FAF5EB] text-[#8C6D23] font-bold ring-1 ring-[#C8732A]' 
                          : 'border-[#E8E4DA] text-gray-700 hover:border-[#C8732A]/50 bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Actions: Quantity + Cart + Quote */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#E8E4DA] rounded-xl overflow-hidden bg-white w-full sm:w-36 shrink-0 shadow-2xs h-13">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-4 h-full text-gray-500 hover:text-[#0E2036] hover:bg-gray-100 font-bold transition text-lg cursor-pointer"
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <input 
              type="text" 
              value={quantity} 
              readOnly 
              className="w-full text-center bg-transparent font-serif font-bold text-[#0E2036] text-base border-x border-[#E8E4DA]" 
            />
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)} 
              className="px-4 h-full text-gray-500 hover:text-[#0E2036] hover:bg-gray-100 font-bold transition text-lg cursor-pointer"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
          
          {/* Primary CTA: Add to Investment Cart */}
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={isVariable && !currentVariation}
            className={`flex-1 h-13 font-semibold rounded-xl transition-all shadow-md py-3 px-6 flex items-center justify-center gap-3 cursor-pointer ${
              (isVariable && !currentVariation)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0E2036] via-[#1B365D] to-[#0E2036] hover:from-[#132A47] hover:to-[#1B365D] text-white border border-[#C8732A]/40 hover:shadow-lg'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#C8732A] text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
            <span className="text-sm font-bold tracking-wide">
              {(isVariable && !currentVariation) ? t('select_options_btn') : t('add_to_cart_amount', { price: formatPrice(totalPrice) })}
            </span>
            <LuxuryArrow className="w-3.5 h-3.5 text-[#E8A63D]" />
          </button>
        </div>

        {/* Secondary CTA: Demande de Devis d'Investissement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`${localePrefix}/devis?product=${encodeURIComponent(product.title)}&amount=${Math.round(totalPrice)}`}
            className="h-11 px-4 rounded-xl border border-[#C8732A] bg-[#FAF5EB] hover:bg-[#F5ECD7] text-[#8C6D23] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4 text-[#C8732A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>{t('request_quote_btn')}</span>
          </Link>

          {enableBuyNow ? (
            <button 
              type="button"
              onClick={handleBuyNow}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#C8732A] to-[#B8641C] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>{t('buy_now_btn')}</span>
              <LuxuryArrow className="w-3 h-3 text-white" />
            </button>
          ) : (
            <Link
              href={`${localePrefix}/services`}
              className="h-11 px-4 rounded-xl border border-[#E8E4DA] bg-white hover:bg-gray-50 text-[#0E2036] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('discover_storage_btn')}</span>
              <LuxuryArrow className="w-3 h-3 text-[#C8732A]" />
            </Link>
          )}
        </div>
      </div>

      {/* Reassurance Grid (4 Pillars) */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-[#E8E4DA] mb-6 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EB] border border-[#E8A63D]/30 text-[#C8732A] flex items-center justify-center shrink-0 text-sm">
            🛡️
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E2036]">{t('four_pillars_lbma_title')}</div>
            <p className="text-[11px] text-[#6E685F] leading-tight">{t('four_pillars_lbma_desc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EB] border border-[#E8A63D]/30 text-[#C8732A] flex items-center justify-center shrink-0 text-sm">
            💶
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E2036]">{t('four_pillars_tax_title')}</div>
            <p className="text-[11px] text-[#6E685F] leading-tight">{t('four_pillars_tax_desc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EB] border border-[#E8A63D]/30 text-[#C8732A] flex items-center justify-center shrink-0 text-sm">
            🔁
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E2036]">{t('four_pillars_buyback_title')}</div>
            <p className="text-[11px] text-[#6E685F] leading-tight">{t('four_pillars_buyback_desc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EB] border border-[#E8A63D]/30 text-[#C8732A] flex items-center justify-center shrink-0 text-sm">
            🔒
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E2036]">{t('four_pillars_payment_title')}</div>
            <p className="text-[11px] text-[#6E685F] leading-tight">{t('four_pillars_payment_desc')}</p>
          </div>
        </div>
      </div>

      {/* Sale Together UI */}
      {product.saleTogether && product.saleTogether.length > 0 && (
        <div className="mb-6 border border-[#E8E4DA] rounded-2xl p-4 bg-white shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E2036] mb-3">
            {t('complete_investment_order')}
          </h4>
          <div className="space-y-2.5">
            {product.saleTogether.map(st => (
              <label key={st.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#FAF9F5] rounded-xl transition border border-transparent hover:border-[#E8E4DA]">
                <input 
                  type="checkbox"
                  checked={selectedSaleTogether.includes(st.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedSaleTogether(prev => [...prev, st.id]);
                    else setSelectedSaleTogether(prev => prev.filter(id => id !== st.id));
                  }}
                  className="w-4 h-4 text-[#C8732A] rounded border-[#E8E4DA] focus:ring-[#C8732A]"
                />
                {st.images?.[0] && <Image width={80} height={80} src={st.images[0]} alt={st.title} className="w-10 h-10 object-contain rounded bg-white border border-[#E8E4DA] p-1" />}
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900 leading-tight line-clamp-1">{st.title}</div>
                  <div className="text-xs font-bold text-[#8C6D23] font-serif">{formatPrice(st.price)}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Links: Wishlist / Question */}
      <div className="flex items-center gap-3 pt-2">
        <button 
          type="button"
          onClick={handleToggleWishlist}
          className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-[#C8732A] text-white border-[#C8732A] shadow-sm' 
              : 'text-[#6E685F] hover:text-[#C8732A] bg-white border-[#E8E4DA] hover:border-[#C8732A]/50'
          }`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <span>{isWishlisted ? t('in_wishlist') : t('add_to_wishlist_btn')}</span>
        </button>

        <button 
          type="button"
          onClick={() => router.push(`${localePrefix}/${contactSlug}`)}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-[#6E685F] hover:text-[#0E2036] bg-white py-2.5 px-4 rounded-xl border border-[#E8E4DA] hover:border-[#0E2036]/50 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#C8732A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>{t('consult_expert')}</span>
        </button>
      </div>
    </div>
  );
}
