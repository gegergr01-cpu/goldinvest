'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SUPPORTED_LOCALES, Locale } from '@/i18n/config';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export default function ClientLocaleAutoSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only perform auto-detection if the user has NOT previously chosen a language
    const hasLocaleCookie = getCookie('NEXT_LOCALE');
    if (hasLocaleCookie) return;

    // Detect browser languages
    const browserLanguages = typeof navigator !== 'undefined'
      ? (navigator.languages || [navigator.language || 'en'])
      : ['en'];

    let targetLocale: Locale = 'en'; // Default fallback is English if not in supported languages
    let matched = false;

    for (const rawLang of browserLanguages) {
      if (!rawLang) continue;
      const langCode = rawLang.split('-')[0].toLowerCase();
      if ((SUPPORTED_LOCALES as readonly string[]).includes(langCode)) {
        targetLocale = langCode as Locale;
        matched = true;
        break;
      }
    }

    // Set cookie immediately so auto-detection only runs once
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Extract current locale in pathname
    const match = pathname?.match(/^\/([a-z]{2})(?:\/|$)(.*)/);
    const currentUrlLocale = match ? match[1] : null;

    if (currentUrlLocale && currentUrlLocale !== targetLocale) {
      const rest = match ? match[2] : '';
      const newPath = `/${targetLocale}${rest ? `/${rest}` : ''}`;
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      window.location.replace(`${newPath}${search}${hash}`);
    }
  }, [pathname, router]);

  return null;
}

