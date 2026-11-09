import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/config'

// Initialize Redis and Ratelimit if env vars are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;
if (redisUrl && redisToken) {
  ratelimit = new Ratelimit({
    redis: new Redis({ url: redisUrl, token: redisToken }),
    limiter: Ratelimit.slidingWindow(30, '10 s'), // 30 max requests per 10 seconds per IP
    analytics: true,
  });
}

function detectPreferredLocale(request: NextRequest): Locale {
  // 1. Check NEXT_LOCALE cookie (user's explicit preference)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header from client browser
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang
      .split(',')
      .map(part => part.split(';')[0].trim().substring(0, 2).toLowerCase());

    for (const code of preferred) {
      if ((SUPPORTED_LOCALES as readonly string[]).includes(code)) {
        return code as Locale;
      }
    }
    // If client's browser language is NOT in supported languages, fallback to English
    return 'en';
  }

  // 3. Fallback to English
  return 'en';
}

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting Check (Protection anti-DDoS / Brute force)
  if (ratelimit) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (request as any).ip ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
    
    if (!success) {
      return new NextResponse(
        `<!DOCTYPE html><html><head><title>429 Too Many Requests</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="font-family: system-ui; text-align: center; padding: 2rem; background: #f9fafb;"><h1 style="color: #ef4444;">Access temporarily blocked</h1><p>You have sent too many requests in a short time.</p><p>For security reasons, please wait a few seconds before trying again.</p></body></html>`,
        { 
          status: 429, 
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          } 
        }
      );
    }
  }

  const { pathname, search } = request.nextUrl;

  // 2. Exclude non-page routes (API, Admin, Next internals, static files)
  const isExcluded =
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  if (isExcluded) {
    const response = await updateSession(request);
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // 3. Check if pathname starts with a supported locale (/fr, /en, /de, etc.)
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)(.*)/);
  const possibleLocale = localeMatch ? localeMatch[1] : null;
  const isLocalePrefixed = possibleLocale && (SUPPORTED_LOCALES as readonly string[]).includes(possibleLocale);

  if (isLocalePrefixed) {
    const activeLocale = possibleLocale as Locale;
    const rawRest = localeMatch ? localeMatch[2] : '';
    const internalPath = rawRest ? `/${rawRest}` : '/';

    // Account route protection
    if (internalPath.startsWith('/account')) {
      const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
      if (!hasSession) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = `/${activeLocale}/login`;
        return NextResponse.redirect(loginUrl);
      }
    }

    // Rewrite internally to the base path while maintaining the locale in URL
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', activeLocale);
    requestHeaders.set('x-pathname', internalPath);

    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    // Update Supabase session and copy cookies
    const sessionResponse = await updateSession(request);
    sessionResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    // Set cookie for active locale
    rewriteResponse.cookies.set('NEXT_LOCALE', activeLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    rewriteResponse.headers.set('x-locale', activeLocale);
    rewriteResponse.headers.set('x-pathname', internalPath);

    return rewriteResponse;
  }

  // 4. If path has no locale prefix, redirect to /{locale}{pathname}
  const preferredLocale = detectPreferredLocale(request);
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${preferredLocale}${pathname === '/' ? '' : pathname}`;
  redirectUrl.search = search;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
