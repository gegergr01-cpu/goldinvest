'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import QuickViewModal from '@/components/product/QuickViewModal';

interface BestDealsCardProps {
  product: {
    id: string | number;
    slug?: string;
    title: string;
    category?: string;
    rawPrice?: number;
    price?: number | string;
    priceFormatted?: string;
    imageUrl?: string;
    badge?: string;
    discount?: string;
    imagePlaceholder?: string;
    rating?: number;
    ratingText?: string;
    stock?: number | null;
    attributes?: any;
    purity?: string;
    weight?: string;
    inStock?: boolean;
  };
  badge?: string;
  borderColor?: string;
  btnBgColor?: string;
  btnTextColor?: string;
  btnHoverBgColor?: string;
  btnHoverTextColor?: string;
}

const METAL_NAMES: Record<'gold' | 'silver', Record<string, string>> = {
  gold: {
    fr: 'Or',
    en: 'Gold',
    de: 'Gold',
    es: 'Oro',
    it: 'Oro',
    nl: 'Goud',
    pt: 'Ouro',
    da: 'Guld',
    hu: 'Arany',
  },
  silver: {
    fr: 'Argent',
    en: 'Silver',
    de: 'Silber',
    es: 'Plata',
    it: 'Argento',
    nl: 'Zilver',
    pt: 'Prata',
    da: 'Sølv',
    hu: 'Ezüst',
  },
};

const FINE_METAL_SUFFIX: Record<'gold' | 'silver', Record<string, string>> = {
  gold: {
    fr: 'or fin',
    en: 'fine gold',
    de: 'Feingold',
    es: 'oro fino',
    it: 'oro fino',
    nl: 'fijngoud',
    pt: 'ouro fino',
    da: 'finguld',
    hu: 'színarany',
  },
  silver: {
    fr: 'argent fin',
    en: 'fine silver',
    de: 'Feinsilber',
    es: 'plata fina',
    it: 'argento fino',
    nl: 'fijnzilver',
    pt: 'prata fina',
    da: 'finsølv',
    hu: 'színezüst',
  },
};

function parseAttributes(rawAttrs: any): Array<{ name: string; options: any }> {
  if (!rawAttrs) return [];
  if (Array.isArray(rawAttrs)) return rawAttrs;
  if (typeof rawAttrs === 'string') {
    try {
      const parsed = JSON.parse(rawAttrs);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed).map(([name, val]) => ({
          name,
          options: Array.isArray(val) ? val : [String(val)],
        }));
      }
    } catch {}
  }
  return [];
}

function cleanPurity(rawPurity: string, isSilver: boolean, isGold: boolean, title: string, locale: string = 'fr'): string {
  const p = (rawPurity || '').toLowerCase();
  const t = title.toLowerCase();
  const metal = isSilver ? (METAL_NAMES.silver[locale] || 'Silver') : (METAL_NAMES.gold[locale] || 'Gold');
  const decSep = (locale === 'de' || locale === 'da' || locale === 'hu') ? ',' : '.';

  // Latin Monetary Union coins (Napoleon, Carol I, Chervonetz, 20 Francs Tunisia, etc.)
  if (
    p.includes('900') || 
    p.includes('21.6') || 
    p.includes('21,6') || 
    t.includes('20 francs') || 
    t.includes('20 lei') || 
    t.includes('napoléon') || 
    t.includes('napoleon') || 
    t.includes('chervonetz') || 
    t.includes('10 roubles') ||
    t.includes('tunesien')
  ) {
    return `900‰ (21${decSep}6K)`;
  }

  // British Sovereigns and Krugerrands are 22K (916.7‰)
  if (
    p.includes('916') || 
    p.includes('22k') || 
    p.includes('22 k') || 
    p.includes('22 carats') || 
    p.includes('22 karat') || 
    t.includes('22k') || 
    t.includes('22 karat') ||
    t.includes('22 carats') ||
    t.includes('souverain') || 
    t.includes('sovereign') || 
    t.includes('krugerrand')
  ) {
    return `${metal} 916${decSep}7‰ (22K)`;
  }

  // 999.9 fine
  if (
    p.includes('999,9') || 
    p.includes('999.9') || 
    p.includes('99,99') || 
    t.includes('999,9') || 
    t.includes('999.9')
  ) {
    return isSilver ? `${metal} 999${decSep}9‰` : `${metal} 999${decSep}9‰ (24K)`;
  }

  // 999 fine
  if (
    p.includes('999') || 
    p.includes('99,9') || 
    t.includes('999') || 
    t.includes('99,9')
  ) {
    return isSilver ? `${metal} 999‰` : `${metal} 999‰ (24K)`;
  }

  // Fallbacks based on metal
  if (isSilver) return `${metal} 999‰`;
  return `${metal} 999${decSep}9‰ (24K)`;
}

function cleanWeight(rawWeight: string, title: string, isSilver: boolean, locale: string = 'fr'): string {
  let w = (rawWeight || '').trim();
  const t = title.toLowerCase();
  const fineSuffix = isSilver ? (FINE_METAL_SUFFIX.silver[locale] || 'fine silver') : (FINE_METAL_SUFFIX.gold[locale] || 'fine gold');
  const decSep = (locale === 'en') ? '.' : ',';

  // If CombiBar (e.g. 100 x 1 g, 50 x 1 g, 25 x 1 g, 20 x 1 g)
  const combiMatch = t.match(/(\d+)\s*[x×]\s*1\s*g/i);
  if (combiMatch) {
    return `${combiMatch[1]} × 1 g (${combiMatch[1]} g)`;
  }

  // If title is a Tube or Monster Box of coins, prioritize the unit coin weight so cards remain unified
  if (/tube|tubo|monster\s*box/i.test(t)) {
    if (t.includes('1/10 oz') || t.includes('1/10 once') || t.includes('1/10 unze') || t.includes('1/10 onza') || t.includes('1/10 oncia')) return `1/10 oz (3${decSep}11 g)`;
    if (t.includes('1/4 oz') || t.includes('1/4 once') || t.includes('1/4 unze') || t.includes('1/4 onza') || t.includes('1/4 oncia')) return `1/4 oz (7${decSep}78 g)`;
    if (t.includes('1/2 oz') || t.includes('1/2 once') || t.includes('1/2 unze') || t.includes('1/2 onza') || t.includes('1/2 oncia')) return `1/2 oz (15${decSep}55 g)`;
    if (t.includes('1 oz') || t.includes('1oz') || t.includes('1 once') || t.includes('1 unze') || t.includes('1 onza') || t.includes('1 oncia')) return `1 oz (31${decSep}10 g)`;
  }

  // If contains "par pièce" or "pro münze" or "per coin", keep only the individual coin specification
  if (/par pièce|pro münze|per coin|par piece|por moneda|per moneta/i.test(w)) {
    w = w.split(/par pièce|pro münze|per coin|par piece|por moneda|per moneta/i)[0].trim();
  }

  // Strip existing localized suffixes so we can re-localize them accurately
  w = w.replace(/\s+d'(?:or|argent)\s+pur/gi, '');
  w = w.replace(/\s+de\s+(?:feingold|feinsilber)/gi, '');
  w = w.replace(/\s+feingold/gi, '');
  w = w.replace(/\s+feinsilber/gi, '');
  w = w.replace(/\s+fine\s+(?:gold|silver)/gi, '');
  w = w.replace(/\s+oro\s+fino/gi, '');
  w = w.replace(/\s+plata\s+fina/gi, '');
  w = w.replace(/\s+d'or\s+fin/gi, '');
  w = w.replace(/\s+or\s+fin/gi, '');
  w = w.replace(/\s+or\s+pur/gi, '');
  w = w.replace(/\s+argent\s+fin/gi, '');
  w = w.trim();

  // 1/2 oz variations
  if (/15[,\.]55\s*g/i.test(w)) {
    return `1/2 oz (15${decSep}55 g)`;
  }

  // 1/4 oz variations
  if (/7[,\.]78\s*g|7[,\.]776\s*g/i.test(w)) {
    return `1/4 oz (7${decSep}78 g)`;
  }

  // 1/10 oz variations
  if (/3[,\.]11\s*g/i.test(w)) {
    return `1/10 oz (3${decSep}11 g)`;
  }

  // Historic coins
  if (/7[,\.]74\s*g/i.test(w)) {
    return `7${decSep}74 g ${fineSuffix}`;
  }

  if (/5[,\.]80\s*g|5[,\.]81\s*g/i.test(w)) {
    return `5${decSep}80 g ${fineSuffix}`;
  }

  if (/29[,\.]29\s*g/i.test(w)) {
    return `29${decSep}29 g ${fineSuffix}`;
  }

  // 1 once bar / coin variations
  if (/31[,\.]1035\s*g|31[,\.]10\s*g/i.test(w) || ((t.includes('1 once') || t.includes('1 unze') || t.includes('1 onza') || t.includes('1 oncia')) && !w.includes('oz'))) {
    return `1 oz (31${decSep}10 g)`;
  }

  // If w is empty or generic fallback, extract from title
  if (!w || /or d'investissement|argent d'investissement|anlagegewicht|anlagegold|anlagesilber|poids d'investissement/i.test(w)) {
    if (t.includes('1/10 oz') || t.includes('1/10 once') || t.includes('1/10 unze') || t.includes('1/10 onza') || t.includes('1/10 oncia')) return `1/10 oz (3${decSep}11 g)`;
    if (t.includes('1/4 oz') || t.includes('1/4 once') || t.includes('1/4 unze') || t.includes('1/4 onza') || t.includes('1/4 oncia')) return `1/4 oz (7${decSep}78 g)`;
    if (t.includes('1/2 oz') || t.includes('1/2 once') || t.includes('1/2 unze') || t.includes('1/2 onza') || t.includes('1/2 oncia')) return `1/2 oz (15${decSep}55 g)`;
    if (t.includes('1 oz') || t.includes('1oz') || t.includes('1 once') || t.includes('1 unze') || t.includes('1 onza') || t.includes('1 oncia')) return `1 oz (31${decSep}10 g)`;
    if (t.includes('20 francs') || t.includes('20 lei') || t.includes('napoléon') || t.includes('napoleon') || t.includes('tunesien')) return `5${decSep}80 g ${fineSuffix}`;
    if (t.includes('10 roubles') || t.includes('chervonetz')) return `7${decSep}74 g ${fineSuffix}`;
    if (t.includes('souverain') || t.includes('sovereign')) {
      if (t.includes('coffret') || t.includes('set') || t.includes('4 sovereign') || t.includes('4 souverain') || t.includes('großen') || t.includes('estuche')) return `29${decSep}29 g ${fineSuffix}`;
      return `7${decSep}32 g ${fineSuffix}`;
    }
    if (t.includes('100g') || t.includes('100 g')) return '100 g';
    if (t.includes('50g') || t.includes('50 g')) return '50 g';
    if (t.includes('250g') || t.includes('250 g')) return '250 g';
    if (t.includes('500g') || t.includes('500 g')) return '500 g';
    if (t.includes('1kg') || t.includes('1 kg') || t.includes('1 kilogramme') || t.includes('1 kilo')) return '1 kg';
    if (t.includes('20g') || t.includes('20 g')) return '20 g';
    if (t.includes('10g') || t.includes('10 g')) return '10 g';
    if (t.includes('5g') || t.includes('5 g')) return '5 g';
    if (t.includes('2,5g') || t.includes('2.5g')) return `2${decSep}5 g`;
    if (t.includes('2g') || t.includes('2 g')) return '2 g';
    if (t.includes('1g') || t.includes('1 g')) return '1 g';
  }

  // Format round grams: 50,00 g -> 50 g
  w = w.replace(/^(\d+)[,\.]00\s*g$/i, '$1 g');
  w = w.replace(/^(\d+)[,\.]0\s*g$/i, '$1 g');

  // Format 1 kg
  if (/^1\s*kg\s*\(\s*1\s*000\s*g\s*\)$/i.test(w)) {
    return '1 kg';
  }

  return w;
}

// Smart precious metal specifications extractor
function getPreciousMetalSpecs(product: BestDealsCardProps['product'], locale: string = 'fr') {
  const title = (product.title || '').trim();
  const titleLower = title.toLowerCase();
  const attrs = parseAttributes(product.attributes);

  const isSilver = 
    titleLower.includes('argent') || 
    titleLower.includes('silver') || 
    titleLower.includes('silber') || 
    titleLower.includes('plata') || 
    titleLower.includes('argento') || 
    titleLower.includes('zilver') || 
    titleLower.includes('prata') || 
    titleLower.includes('sølv') || 
    titleLower.includes('ezüst') || 
    attrs.some(a => ['métal', 'metal', 'metall'].includes(String(a.name || '').toLowerCase()) && 
      (Array.isArray(a.options) ? a.options.join(' ') : String(a.options || '')).toLowerCase().match(/argent|silver|silber|plata|argento|zilver|prata|sølv|ezüst/));

  const isGold = !isSilver;

  // Extract raw purity from product or attributes
  let rawPurity = product.purity || product.attributes?.purity || product.attributes?.purete || '';
  if (!rawPurity) {
    const purityAttr = attrs.find(a => {
      const n = String(a.name || '').toLowerCase();
      return (
        n.includes('puret') || 
        n.includes('titrage') || 
        n.includes('purity') || 
        n.includes('feingehalt') || 
        n.includes('feinheit') || 
        n.includes('ley') || 
        n.includes('purezza')
      );
    });
    if (purityAttr) {
      rawPurity = Array.isArray(purityAttr.options) ? purityAttr.options[0] : String(purityAttr.options || '');
    }
  }

  // Extract raw weight from product or attributes: PRIORITIZE FINE WEIGHT
  let rawWeight = product.weight || product.attributes?.weight || product.attributes?.poids || '';
  if (!rawWeight) {
    const fineWeightAttr = attrs.find(a => {
      const n = String(a.name || '').toLowerCase();
      return (
        n.includes('poids fin') || 
        n.includes('fine weight') || 
        n.includes('feingewicht') || 
        n.includes('feingoldgehalt') || 
        n.includes('feingold') || 
        n.includes('feinsilber') || 
        n.includes('peso fino') || 
        n.includes('fijngoud') || 
        n.includes('fijn gewicht')
      );
    });
    if (fineWeightAttr) {
      rawWeight = Array.isArray(fineWeightAttr.options) ? fineWeightAttr.options[0] : String(fineWeightAttr.options || '');
    } else {
      const generalWeightAttr = attrs.find(a => {
        const n = String(a.name || '').toLowerCase();
        if (n.includes('brut') || n.includes('gross') || n.includes('rau')) return false;
        return n.includes('poids') || n.includes('weight') || n.includes('gewicht') || n.includes('peso');
      });
      if (generalWeightAttr) {
        rawWeight = Array.isArray(generalWeightAttr.options) ? generalWeightAttr.options[0] : String(generalWeightAttr.options || '');
      }
    }
  }

  const purity = cleanPurity(rawPurity, isSilver, isGold, title, locale);
  const weight = cleanWeight(rawWeight, title, isSilver, locale);
  const inStock = product.inStock ?? (product.stock === undefined || product.stock === null || product.stock > 0);

  return { purity, weight, inStock };
}

export default function BestDealsCard({
  product,
  badge = 'Investissement',
  borderColor = '#e5e7eb',
}: BestDealsCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isWishlisted = wishlistStore.hasItem(String(product.id));

  const specs = getPreciousMetalSpecs(product, locale);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.addItem({
      id: String(product.id),
      productId: String(product.id),
      title: product.title,
      price: typeof product.rawPrice === 'number' ? product.rawPrice : Number(product.price) || 0,
      image: product.imageUrl || '',
      quantity: 1,
    });
    cartStore.setIsOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasWishlisted = wishlistStore.hasItem(String(product.id));
    wishlistStore.toggleItem(String(product.id));
    if (!wasWishlisted) {
      wishlistStore.setIsOpen(true);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Clean formatting ensuring non-breaking space between thousands and currency symbol
  const formattedPrice = typeof product.rawPrice === 'number'
    ? `${product.rawPrice.toLocaleString(locale === 'en' ? 'en-US' : (locale === 'de' ? 'de-DE' : 'fr-FR'), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, '\u00A0')}\u00A0€`
    : (product.priceFormatted || (product.price ? `${String(product.price).replace(/\s/g, '\u00A0')}\u00A0€` : '—'));

  // Localized stock status label
  const stockText = specs.inStock
    ? ({
        fr: 'En stock',
        en: 'In stock',
        de: 'Auf Lager',
        es: 'En stock',
        it: 'Disponibile',
        nl: 'Op voorraad',
        pt: 'Em estoque',
        da: 'På lager',
        hu: 'Raktáron',
      }[locale] || 'En stock')
    : ({
        fr: 'Sur commande',
        en: 'On order',
        de: 'Auf Bestellung',
        es: 'Bajo pedido',
        it: 'Su ordinazione',
        nl: 'Op bestelling',
        pt: 'Sob encomenda',
        da: 'På bestilling',
        hu: 'Rendelésre',
      }[locale] || 'Sur commande');

  // Localized tax & spot disclaimer
  const spotDisclaimer = {
    fr: 'TVA 0% · Cours spot',
    en: '0% VAT · Spot price',
    de: '0% MwSt. · Spotkurs',
    es: '0% IVA · Precio spot',
    it: 'IVA 0% · Prezzo spot',
    nl: '0% BTW · Spotkoers',
    pt: '0% IVA · Preço spot',
    da: '0% moms · Spotkurs',
    hu: '0% ÁFA · Spot ár',
  }[locale] || 'TVA 0% · Cours spot';

  // Action button titles
  const wishlistTitle = isWishlisted
    ? ({
        fr: 'Retirer des favoris',
        en: 'Remove from wishlist',
        de: 'Vom Wunschzettel entfernen',
        es: 'Quitar de favoritos',
        it: 'Rimuovi dai preferiti',
        nl: 'Van verlanglijst verwijderen',
        pt: 'Remover dos favoritos',
        da: 'Fjern fra ønskeliste',
        hu: 'Eltávolítás a kívánságlistáról',
      }[locale] || 'Retirer des favoris')
    : ({
        fr: 'Ajouter aux favoris',
        en: 'Add to wishlist',
        de: 'Auf den Wunschzettel',
        es: 'Añadir a favoritos',
        it: 'Aggiungi ai preferiti',
        nl: 'Aan verlanglijst toevoegen',
        pt: 'Adicionar aos favoritos',
        da: 'Tilføj til ønskeliste',
        hu: 'Kívánságlistához adás',
      }[locale] || 'Ajouter aux favoris');

  const quickViewTitle = {
    fr: 'Aperçu rapide',
    en: 'Quick view',
    de: 'Schnellansicht',
    es: 'Vista rápida',
    it: 'Anteprima rapida',
    nl: 'Snelle weergave',
    pt: 'Visualização rápida',
    da: 'Hurtig visning',
    hu: 'Gyorsnézet',
  }[locale] || 'Aperçu rapide';

  const addToCartTitle = {
    fr: 'Ajouter au panier',
    en: 'Add to cart',
    de: 'In den Warenkorb',
    es: 'Añadir al carrito',
    it: 'Aggiungi al carrello',
    nl: 'In winkelwagen',
    pt: 'Adicionar ao carrinho',
    da: 'Læg i kurv',
    hu: 'Kosárba',
  }[locale] || 'Ajouter au panier';

  // Clean category badge display
  const rawBadge = product.badge || badge;
  const badgeMap: Record<string, Record<string, string>> = {
    investissement: {
      fr: 'Investissement',
      en: 'Investment',
      de: 'Anlageprodukte',
      es: 'Inversión',
      it: 'Investimento',
      nl: 'Belegging',
      pt: 'Investimento',
      da: 'Investering',
      hu: 'Befektetés',
    },
    'lbma certifié': {
      fr: 'LBMA Certifié',
      en: 'LBMA Certified',
      de: 'LBMA-zertifiziert',
      es: 'Certificado LBMA',
      it: 'Certificato LBMA',
      nl: 'LBMA gecertificeerd',
      pt: 'Certificado LBMA',
      da: 'LBMA-certificeret',
      hu: 'LBMA minősített',
    },
  };
  const lowerBadge = rawBadge.toLowerCase().trim();
  const displayBadge = badgeMap[lowerBadge]?.[locale] || rawBadge;

  const localePrefix = locale && locale !== 'fr' ? `/${locale}` : '';
  const productUrl = `${localePrefix}/product/${product.slug || product.id}`;

  return (
    <>
      <div 
        onClick={() => router.push(productUrl)}
        className="w-full bg-white border border-[#E5E7EB] hover:border-[#E8A63D]/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group/card cursor-pointer hover:shadow-[0_12px_32px_rgba(200,115,42,0.12)] transition-all duration-300 relative overflow-hidden"
        style={{ borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined }}
      >
        {/* 1. Header Row: Category Badge (Left) + Stock Availability (Right) */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.discount ? (
            <span className="bg-amber-100 text-[#9b7628] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.discount}
            </span>
          ) : (
            <span className="bg-[#FAF5EB] border border-[#E4D1B0] text-[#9A7228] text-[10.5px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
              {displayBadge}
            </span>
          )}

          {specs.inStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stockText}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
              {stockText}
            </span>
          )}
        </div>

        {/* 2. Product Image with Smooth Hover Zoom */}
        <div className="relative h-44 sm:h-48 w-full bg-transparent flex items-center justify-center overflow-hidden my-2">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.title} 
              width={500} 
              height={500} 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500 ease-out" 
            />
          ) : (
            <div className="text-7xl group-hover/card:scale-110 transition duration-500 select-none">
              {product.imagePlaceholder || '🪙'}
            </div>
          )}
        </div>

        {/* 3. Product Info: Technical Metal Specs & Title */}
        <div className="flex flex-col items-center text-center mt-2 mb-3">
          {/* Technical Specs: Pureté · Poids fin */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#E8A63D]/25 text-[11px] font-mono font-medium text-[#8C6D23] mb-2 tracking-wide max-w-full whitespace-nowrap overflow-hidden">
            <span className="truncate">{specs.purity}</span>
            <span className="text-[#C8732A]/70 font-bold shrink-0">•</span>
            <span className="truncate">{specs.weight}</span>
          </div>

          <h3 
            className="text-[14.5px] sm:text-[15.5px] font-serif font-bold text-gray-900 leading-snug line-clamp-2 min-h-[42px] transition-colors group-hover/card:text-[#B8641C]" 
            title={product.title}
          >
            <Link 
              href={productUrl} 
              className="hover:underline" 
              onClick={(e) => e.stopPropagation()}
            >
              {product.title}
            </Link>
          </h3>
        </div>

        {/* 4. Bottom Divider Line & Action Bar: Price (Left) + Actions Toolbar (Right) */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          {/* Price & Tax exemption / spot indication */}
          <div className="flex flex-col items-start text-left min-w-0 pr-1">
            <span className="text-[17px] sm:text-[19px] font-serif font-bold text-[#b8860b] tracking-tight leading-tight whitespace-nowrap">
              {formattedPrice}
            </span>
            <span className="text-[10px] sm:text-[10.5px] text-gray-400 font-sans tracking-wide mt-0.5 whitespace-nowrap select-none">
              {spotDisclaimer}
            </span>
          </div>

          {/* Combined Action Buttons: Wishlist, Quick View, Cart (Balanced Circular Trio) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                isWishlisted 
                  ? 'bg-[#C8732A] text-white border-[#C8732A] shadow-sm' 
                  : 'bg-gray-50/80 hover:bg-[#FAF5EB] text-gray-500 hover:text-[#C8732A] border-gray-200 hover:border-[#E8A63D]/60'
              }`}
              title={wishlistTitle}
              aria-label={wishlistTitle}
            >
              <svg className="w-3.5 h-3.5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={handleQuickView}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gray-50/80 hover:bg-[#FAF5EB] text-gray-500 hover:text-[#C8732A] border border-gray-200 hover:border-[#E8A63D]/60 flex items-center justify-center transition-all duration-200 cursor-pointer"
              title={quickViewTitle}
              aria-label={quickViewTitle}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Add to Cart Button (Circular Luxury Imperial Copper Gradient) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white flex items-center justify-center shadow-md shadow-[#9C4E0F]/20 hover:shadow-[#9C4E0F]/40 transition-all duration-200 cursor-pointer group/cartBtn"
              title={addToCartTitle}
              aria-label={addToCartTitle}
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cartBtn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Luxury Quick View Interactive Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={{
          ...product,
          badge: displayBadge,
        }}
      />
    </>
  );
}
