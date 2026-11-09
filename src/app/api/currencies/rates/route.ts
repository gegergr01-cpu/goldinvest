import { NextResponse } from 'next/server';
import { DEFAULT_EXCHANGE_RATES, CurrencyCode } from '@/lib/currencies';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  let rates: Record<CurrencyCode, number> = { ...DEFAULT_EXCHANGE_RATES };
  let source = 'fallback';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Primary: open.er-api.com (European Central Bank data)
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        rates = {
          EUR: 1.0,
          DKK: Number(data.rates.DKK) || DEFAULT_EXCHANGE_RATES.DKK,
          HUF: Number(data.rates.HUF) || DEFAULT_EXCHANGE_RATES.HUF,
          GBP: Number(data.rates.GBP) || DEFAULT_EXCHANGE_RATES.GBP,
          CAD: Number(data.rates.CAD) || DEFAULT_EXCHANGE_RATES.CAD,
          USD: Number(data.rates.USD) || DEFAULT_EXCHANGE_RATES.USD,
        };
        source = 'open.er-api.com';
      }
    }
  } catch (error) {
    // If primary fails, try secondary Frankfurter API
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 2500);

      const res2 = await fetch('https://api.frankfurter.app/latest?from=EUR', {
        signal: controller2.signal,
        next: { revalidate: 3600 },
      });

      clearTimeout(timeoutId2);

      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.rates) {
          rates = {
            EUR: 1.0,
            DKK: Number(data2.rates.DKK) || DEFAULT_EXCHANGE_RATES.DKK,
            HUF: Number(data2.rates.HUF) || DEFAULT_EXCHANGE_RATES.HUF,
            GBP: Number(data2.rates.GBP) || DEFAULT_EXCHANGE_RATES.GBP,
            CAD: Number(data2.rates.CAD) || DEFAULT_EXCHANGE_RATES.CAD,
            USD: Number(data2.rates.USD) || DEFAULT_EXCHANGE_RATES.USD,
          };
          source = 'api.frankfurter.app';
        }
      }
    } catch {
      // Keep reliable DEFAULT_EXCHANGE_RATES
      source = 'default_fallback';
    }
  }

  return NextResponse.json(
    {
      success: true,
      base: 'EUR',
      rates,
      source,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
