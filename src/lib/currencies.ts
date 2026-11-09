export type CurrencyCode = 'EUR' | 'DKK' | 'HUF' | 'GBP' | 'CAD' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  nameFr: string;
  nameEn: string;
  nameNative: string;
  flag: string;
  flagCode: string;
  decimals: number;
  symbolPosition: 'left' | 'right' | 'left-space' | 'right-space';
  thousandSeparator: string;
  decimalSeparator: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    nameFr: 'Euro',
    nameEn: 'Euro',
    nameNative: 'Euro',
    flag: '🇪🇺',
    flagCode: 'eu',
    decimals: 2,
    symbolPosition: 'right-space',
    thousandSeparator: '\u00A0',
    decimalSeparator: ',',
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr.',
    nameFr: 'Couronne Danoise',
    nameEn: 'Danish Krone',
    nameNative: 'Danske kroner',
    flag: '🇩🇰',
    flagCode: 'dk',
    decimals: 2,
    symbolPosition: 'right-space',
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
  HUF: {
    code: 'HUF',
    symbol: 'Ft',
    nameFr: 'Forint Hongrois',
    nameEn: 'Hungarian Forint',
    nameNative: 'Magyar forint',
    flag: '🇭🇺',
    flagCode: 'hu',
    decimals: 0, // Hungarian Forints do not use fractional cents in retail
    symbolPosition: 'right-space',
    thousandSeparator: '\u00A0',
    decimalSeparator: ',',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    nameFr: 'Livre Sterling',
    nameEn: 'British Pound',
    nameNative: 'British Pound',
    flag: '🇬🇧',
    flagCode: 'gb',
    decimals: 2,
    symbolPosition: 'left',
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    nameFr: 'Dollar Canadien',
    nameEn: 'Canadian Dollar',
    nameNative: 'Dollar Canadien',
    flag: '🇨🇦',
    flagCode: 'ca',
    decimals: 2,
    symbolPosition: 'right-space',
    thousandSeparator: '\u00A0',
    decimalSeparator: ',',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    nameFr: 'Dollar Américain',
    nameEn: 'US Dollar',
    nameNative: 'US Dollar',
    flag: '🇺🇸',
    flagCode: 'us',
    decimals: 2,
    symbolPosition: 'left',
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
};

export const CURRENCY_LIST: CurrencyConfig[] = Object.values(SUPPORTED_CURRENCIES);

export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';

// Reliable default exchange rates (1 EUR = X currency units)
export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: 1.0,
  DKK: 7.475,
  HUF: 363.5,
  GBP: 0.834,
  CAD: 1.572,
  USD: 1.115,
};

/**
 * Converts a base EUR amount to target currency
 */
export function convertEurAmount(
  amountInEur: number,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (!amountInEur || isNaN(amountInEur)) return 0;
  if (targetCurrency === 'EUR') return amountInEur;

  const rate = rates[targetCurrency] || DEFAULT_EXCHANGE_RATES[targetCurrency] || 1.0;
  const converted = amountInEur * rate;

  // HUF does not use decimal fractions
  if (targetCurrency === 'HUF') {
    return Math.round(converted);
  }

  return Number(converted.toFixed(2));
}

/**
 * Formats an amount already in target currency into a localized string with proper symbol
 */
export function formatCurrencyValue(
  amount: number,
  currencyCode: CurrencyCode = 'EUR',
  locale?: string
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.EUR;
  const isZeroDecimals = config.decimals === 0;

  // Format with thousand and decimal separators
  const rounded = isZeroDecimals ? Math.round(amount) : amount;
  const fixedStr = isZeroDecimals ? rounded.toFixed(0) : rounded.toFixed(config.decimals);
  const [intPart, decPart] = fixedStr.split('.');

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
  const numberPart = isZeroDecimals || !decPart
    ? formattedInt
    : `${formattedInt}${config.decimalSeparator}${decPart}`;

  switch (config.symbolPosition) {
    case 'left':
      return `${config.symbol}${numberPart}`;
    case 'left-space':
      return `${config.symbol}\u00A0${numberPart}`;
    case 'right':
      return `${numberPart}${config.symbol}`;
    case 'right-space':
    default:
      return `${numberPart}\u00A0${config.symbol}`;
  }
}

/**
 * Auto-detects the most relevant currency based on:
 * 1. Saved user cookie (priority)
 * 2. Country / Timezone detection
 * 3. Active site locale
 */
export function detectInitialCurrency(
  cookieCurrency?: string | null,
  locale?: string,
  timezone?: string
): CurrencyCode {
  // 1. Manual user choice preserved in cookie
  if (cookieCurrency && (cookieCurrency as CurrencyCode) in SUPPORTED_CURRENCIES) {
    return cookieCurrency as CurrencyCode;
  }

  // 2. Client TimeZone detection
  if (timezone) {
    const tz = timezone.toLowerCase();
    if (tz.includes('copenhagen')) return 'DKK';
    if (tz.includes('budapest')) return 'HUF';
    if (tz.includes('london')) return 'GBP';
    if (
      tz.includes('toronto') ||
      tz.includes('vancouver') ||
      tz.includes('montreal') ||
      tz.includes('halifax') ||
      tz.includes('edmonton') ||
      tz.includes('winnipeg')
    ) {
      return 'CAD';
    }
    if (
      tz.includes('new_york') ||
      tz.includes('chicago') ||
      tz.includes('los_angeles') ||
      tz.includes('denver') ||
      tz.includes('phoenix') ||
      tz.includes('indiana') ||
      tz.includes('detroit')
    ) {
      return 'USD';
    }
  }

  // 3. Fallback based on active site locale
  if (locale === 'da') return 'DKK';
  if (locale === 'hu') return 'HUF';
  if (locale === 'en') return 'GBP';

  return DEFAULT_CURRENCY;
}

