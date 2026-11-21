import { SUPPORTED_LOCALES, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/lib/site';

/**
 * Builds standard international SEO alternates (self-canonical + all 9 hreflang languages + x-default)
 * compliant with Google Search Console international targeting guidelines.
 *
 * @param path Internal path without locale prefix, e.g. "/shop", "/product/krugerrand-1-oz", "" (for homepage)
 * @param currentLocale Active locale, e.g. "fr", "de", "en", "da", "hu", etc.
 */
export function buildInternationalAlternates(path: string = '', currentLocale: Locale | string = 'fr') {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const baseUrl = SITE_URL.replace(/\/$/, '');

  const languages: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languages[loc] = `${baseUrl}/${loc}${cleanPath}`;
  }
  // x-default fallback for non-targeted locales or global visitors (default English)
  languages['x-default'] = `${baseUrl}/en${cleanPath}`;

  const current = (SUPPORTED_LOCALES as readonly string[]).includes(currentLocale)
    ? currentLocale
    : 'fr';

  return {
    canonical: `${baseUrl}/${current}${cleanPath}`,
    languages,
  };
}

/**
 * Returns default target currency for Schema.org / SEO Rich Snippets based on locale
 */
export function getLocaleTargetCurrency(locale: string = 'fr'): string {
  switch (locale.toLowerCase()) {
    case 'da':
      return 'DKK';
    case 'hu':
      return 'HUF';
    case 'en':
      return 'GBP';
    default:
      return 'EUR';
  }
}
