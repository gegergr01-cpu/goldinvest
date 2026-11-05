export const SUPPORTED_LOCALES = [
  'fr',
  'en',
  'de',
  'es',
  'it',
  'nl',
  'pt',
  'da',
  'hu',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export interface LocaleDetail {
  code: Locale;
  label: string;
  nativeName: string;
  flag: string;
  defaultCurrency: string;
}

export const LOCALE_DETAILS: Record<Locale, LocaleDetail> = {
  fr: {
    code: 'fr',
    label: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    defaultCurrency: 'EUR',
  },
  en: {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    defaultCurrency: 'EUR',
  },
  de: {
    code: 'de',
    label: 'Allemand',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    defaultCurrency: 'EUR',
  },
  es: {
    code: 'es',
    label: 'Espagnol',
    nativeName: 'Español',
    flag: '🇪🇸',
    defaultCurrency: 'EUR',
  },
  it: {
    code: 'it',
    label: 'Italien',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    defaultCurrency: 'EUR',
  },
  nl: {
    code: 'nl',
    label: 'Néerlandais',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    defaultCurrency: 'EUR',
  },
  pt: {
    code: 'pt',
    label: 'Portugais',
    nativeName: 'Português',
    flag: '🇵🇹',
    defaultCurrency: 'EUR',
  },
  da: {
    code: 'da',
    label: 'Danois',
    nativeName: 'Dansk',
    flag: '🇩🇰',
    defaultCurrency: 'DKK',
  },
  hu: {
    code: 'hu',
    label: 'Hongrois',
    nativeName: 'Magyar',
    flag: '🇭🇺',
    defaultCurrency: 'HUF',
  },
};

