'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CurrencyOptions, defaultCurrencyOptions } from '@/lib/formatPrice';
import {
  CurrencyCode,
  CurrencyConfig,
  SUPPORTED_CURRENCIES,
  CURRENCY_LIST,
  DEFAULT_CURRENCY,
  DEFAULT_EXCHANGE_RATES,
  convertEurAmount,
  formatCurrencyValue,
  detectInitialCurrency,
} from '@/lib/currencies';
import { useLocale } from 'next-intl';

interface CurrencyContextType {
  options: CurrencyOptions;
  currentCurrency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  currencies: CurrencyConfig[];
  rates: Record<CurrencyCode, number>;
  isConverted: boolean;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInEur: number) => string;
  formatPriceWithTax: (amountInEur: number) => string;
  convertPrice: (amountInEur: number) => number;
  formatReferenceEur: (amountInEur: number) => string;
}

const defaultContext: CurrencyContextType = {
  options: defaultCurrencyOptions,
  currentCurrency: DEFAULT_CURRENCY,
  currencyConfig: SUPPORTED_CURRENCIES.EUR,
  currencies: CURRENCY_LIST,
  rates: DEFAULT_EXCHANGE_RATES,
  isConverted: false,
  setCurrency: () => {},
  formatPrice: (amount: number) => formatCurrencyValue(amount, 'EUR'),
  formatPriceWithTax: (amount: number) => formatCurrencyValue(amount, 'EUR'),
  convertPrice: (amount: number) => amount,
  formatReferenceEur: (amount: number) => formatCurrencyValue(amount, 'EUR'),
};

const CurrencyContext = createContext<CurrencyContextType>(defaultContext);

export const useCurrency = () => useContext(CurrencyContext);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export default function CurrencyProvider({
  children,
  options = defaultCurrencyOptions,
  initialCurrency,
}: {
  children: ReactNode;
  options?: CurrencyOptions;
  initialCurrency?: CurrencyCode;
}) {
  const locale = useLocale();

  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    if (initialCurrency && initialCurrency in SUPPORTED_CURRENCIES) {
      return initialCurrency;
    }
    const cookieCurrency = getCookie('NEXT_CURRENCY');
    if (cookieCurrency && cookieCurrency in SUPPORTED_CURRENCIES) {
      return cookieCurrency as CurrencyCode;
    }
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
    return detectInitialCurrency(null, locale, tz);
  });

  const [rates, setRates] = useState<Record<CurrencyCode, number>>(DEFAULT_EXCHANGE_RATES);

  // Auto-detect currency on first client mount if no cookie has been set
  useEffect(() => {
    const cookieCurrency = getCookie('NEXT_CURRENCY');
    const savedLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('NEXT_CURRENCY') : null;
    const active = cookieCurrency || savedLocal;

    if (active && active in SUPPORTED_CURRENCIES) {
      setCurrentCurrencyState(active as CurrencyCode);
    } else {
      const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
      const detected = detectInitialCurrency(null, locale, tz);
      setCurrentCurrencyState(detected);
    }
  }, [locale]);

  // Fetch latest live exchange rates
  useEffect(() => {
    let isMounted = true;
    fetch('/api/currencies/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.rates && isMounted) {
          setRates(data.rates);
        }
      })
      .catch(() => {
        // Silently preserve DEFAULT_EXCHANGE_RATES
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (!(code in SUPPORTED_CURRENCIES)) return;
    setCurrentCurrencyState(code);
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_CURRENCY=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('NEXT_CURRENCY', code);
    }
  };

  const currencyConfig = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.EUR;
  const isConverted = currentCurrency !== 'EUR';

  const convertPrice = useMemo(() => {
    return (amountInEur: number) => convertEurAmount(amountInEur, currentCurrency, rates);
  }, [currentCurrency, rates]);

  const formatPrice = useMemo(() => {
    return (amountInEur: number) => {
      const converted = convertEurAmount(amountInEur, currentCurrency, rates);
      return formatCurrencyValue(converted, currentCurrency, locale);
    };
  }, [currentCurrency, rates, locale]);

  const formatPriceWithTax = useMemo(() => {
    return (amountInEur: number) => {
      // Precious metals investment products are 0% VAT in EU/international law
      const converted = convertEurAmount(amountInEur, currentCurrency, rates);
      return formatCurrencyValue(converted, currentCurrency, locale);
    };
  }, [currentCurrency, rates, locale]);

  const formatReferenceEur = useMemo(() => {
    return (amountInEur: number) => formatCurrencyValue(amountInEur, 'EUR', locale);
  }, [locale]);

  const contextValue = useMemo<CurrencyContextType>(() => {
    return {
      options: {
        ...options,
        currencySymbol: currencyConfig.symbol,
      },
      currentCurrency,
      currencyConfig,
      currencies: CURRENCY_LIST,
      rates,
      isConverted,
      setCurrency,
      formatPrice,
      formatPriceWithTax,
      convertPrice,
      formatReferenceEur,
    };
  }, [
    options,
    currencyConfig,
    currentCurrency,
    rates,
    isConverted,
    formatPrice,
    formatPriceWithTax,
    convertPrice,
    formatReferenceEur,
  ]);

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
}
