import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from './config';

export default getRequestConfig(async () => {
  let pathname = '/';
  let headerLocale: string | null = null;

  try {
    const headersList = await headers();
    pathname = headersList.get('x-pathname') || '/';
    headerLocale = headersList.get('x-locale');
  } catch (error) {
    pathname = '/';
  }

  const isAdminRoute = pathname.startsWith('/admin');

  // Determine target locale
  let locale: Locale = DEFAULT_LOCALE;

  if (headerLocale && (SUPPORTED_LOCALES as readonly string[]).includes(headerLocale)) {
    locale = headerLocale as Locale;
  } else {
    // Fallback to DB settings if no URL/header locale
    try {
      const langSetting = await prisma.setting.findUnique({ where: { key: 'active_language' } });
      if (langSetting && (SUPPORTED_LOCALES as readonly string[]).includes(langSetting.value)) {
        locale = langSetting.value as Locale;
      }
    } catch (error) {
      console.error("Failed to fetch i18n setting", error);
    }
  }

  // Admin route fallback if translation scope is frontend only
  if (isAdminRoute) {
    try {
      const scopeSetting = await prisma.setting.findUnique({ where: { key: 'translation_scope' } });
      if (scopeSetting?.value === 'frontend_only') {
        locale = 'fr';
      }
    } catch {}
  }

  const safeLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale) ? locale : DEFAULT_LOCALE;

  let messages;
  try {
    messages = (await import(`../../messages/${safeLocale}.json`)).default;
  } catch (error) {
    messages = (await import('../../messages/fr.json')).default;
  }

  return {
    locale: safeLocale,
    messages
  };
});
