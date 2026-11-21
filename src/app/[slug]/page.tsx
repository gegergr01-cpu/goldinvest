import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/actions/pages';
import SafeHTML from '@/components/SafeHTML';
import { getContactSettings } from '@/actions/contactSettings';
import ContactPageContent from '@/components/contact/ContactPageContent';
import { getLocale } from 'next-intl/server';
import { buildInternationalAlternates } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { getLocalizedPageData } from '@/lib/pageTranslations';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locale = await getLocale();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "GOLAY INVEST";

  const contactSettings = await getContactSettings();
  if (resolvedParams.slug === contactSettings.slug) {
    return {
      title: `${contactSettings.title} - ${storeName}`,
      description: "Contactez les conseillers et spécialistes en métaux précieux de GOLAY INVEST. Conseil personnalisé en investissement or et argent physique, gardiennage et achat sécurisé.",
      alternates: buildInternationalAlternates(`/${contactSettings.slug}`, locale),
    };
  }

  const { data: page } = await getPageBySlug(resolvedParams.slug);

  if (!page || !page.isPublished) {
    return {
      title: `Page not found - ${storeName}`,
    };
  }

  const locData = getLocalizedPageData(resolvedParams.slug, locale);

  const title = locData?.metaTitle || (page.metaTitle ? page.metaTitle : `${locData?.title || page.title} - ${storeName}`);
  const description = locData?.metaDescription || page.metaDescription || undefined;
  const keywords = locData?.metaKeywords || page.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    alternates: buildInternationalAlternates(`/${page.slug}`, locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/${page.slug}`,
      siteName: storeName,
      type: 'website',
    }
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locale = await getLocale();
  const localePrefix = locale === 'fr' ? '' : `/${locale}`;

  const contactSettings = await getContactSettings();
  if (resolvedParams.slug === contactSettings.slug) {
    return <ContactPageContent />;
  }

  const { data: page, success } = await getPageBySlug(resolvedParams.slug);

  if (!success || !page || !page.isPublished) {
    notFound();
  }

  const locData = getLocalizedPageData(resolvedParams.slug, locale);
  const displayTitle = locData?.title || page.title;
  const displayBadge = locData?.badge || 'Maison GOLAY INVEST • Savièse, Suisse • CH-626.1.022.620-4';
  const displaySubtitle = locData?.subtitle || 'Mise à jour officielle • Conforme au droit suisse (CO/LPD) et aux normes européennes LBMA';

  const homeLabels: Record<string, string> = {
    fr: 'Accueil',
    en: 'Home',
    de: 'Startseite',
    es: 'Inicio',
    it: 'Home',
    nl: 'Home',
    pt: 'Início',
    da: 'Forside',
    hu: 'Főoldal',
  };

  const breadcrumbSectionLabels: Record<string, string> = {
    fr: 'Informations Légales & Institutionnelles',
    en: 'Legal & Institutional Information',
    de: 'Rechtliche & Institutionelle Hinweise',
    es: 'Información Legal e Institucional',
    it: 'Informazioni Legali & Istituzionali',
    nl: 'Juridische & Institutionele Informatie',
    pt: 'Informação Legal e Institucional',
    da: 'Juridiske og Institutionelle Oplysninger',
    hu: 'Jogi és Intézményi Információk',
  };

  const helpTitles: Record<string, string> = {
    fr: 'Une question concernant nos mentions légales ou nos services ?',
    en: 'A question regarding our legal terms or custody services?',
    de: 'Fragen zu unseren rechtlichen Hinweisen oder Verwahrungsdiensten?',
    es: '¿Tiene preguntas sobre nuestros términos legales o servicios?',
    it: 'Avete domande sulle nostre condizioni legali o servizi?',
    nl: 'Vragen over onze juridische voorwaarden of bewaardiensten?',
    pt: 'Dúvidas sobre os nossos termos legais ou serviços de custódia?',
    da: 'Spørgsmål til vores juridiske vilkår eller opbevaringstjenester?',
    hu: 'Kérdése van jogi feltételeinkkel vagy széfőrzési szolgáltatásunkkal kapcsolatban?',
  };

  const helpButtons: Record<string, string> = {
    fr: 'Contacter nos conseillers',
    en: 'Contact our specialists',
    de: 'Unsere Berater kontaktieren',
    es: 'Contactar a nuestros asesores',
    it: 'Contatta i nostri esperti',
    nl: 'Contacteer onze adviseurs',
    pt: 'Contactar os nossos especialistas',
    da: 'Kontakt vores rådgivere',
    hu: 'Kapcsolatfelvétel szakértőinkkel',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 1. Luxury Navy Header Banner with Breadcrumbs & Swiss Registry Badge */}
      <section className="bg-gradient-to-b from-[#0B1A2C] via-[#0E2036] to-[#0E2036] text-white border-b border-white/10 pt-7 pb-7 sm:pt-9 sm:pb-9">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/60 mb-3.5">
            <Link href={`${localePrefix || '/'}`} className="hover:text-[#E8A63D] transition-colors">
              {homeLabels[locale] || 'Accueil'}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{breadcrumbSectionLabels[locale] || 'Informations Légales & Institutionnelles'}</span>
            <span className="text-white/30">/</span>
            <span className="text-[#E8A63D] font-medium truncate max-w-[200px] sm:max-w-none">
              {displayTitle}
            </span>
          </nav>

          {/* Official Swiss Company Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-[#E8A63D] text-[11.5px] font-mono tracking-wider mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A] animate-pulse" />
            <span>{displayBadge}</span>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
            {displayTitle}
          </h1>

          {/* Subtitle / Last Updated */}
          <p className="text-xs sm:text-sm text-white/65 mt-2 max-w-3xl leading-relaxed">
            {displaySubtitle}
          </p>
        </div>
      </section>

      {/* 2. Page Content Container */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="w-full">
          {/* Desktop Content */}
          <SafeHTML
            html={(locData?.contentHtml || page.desktopContent || '').replace(/<!-- Hero Header Card -->[\s\S]*?<\/div>\s*(?=(?:<!--|<div))/i, '')}
            className="hidden md:block w-full"
          />

          {/* Mobile Content */}
          <SafeHTML
            html={(locData?.contentHtml || page.mobileContent || (page.desktopContent || '')).replace(/<!-- Hero Header Card -->[\s\S]*?<\/div>\s*(?=(?:<!--|<div))/i, '')}
            className="block md:hidden w-full"
          />
        </div>

        {/* Support & Inquiries Help Box */}
        <div className="mt-10 bg-gradient-to-r from-slate-100 to-amber-50/50 rounded-2xl border border-amber-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0E2036] mb-1">
              {helpTitles[locale] || 'Une question concernant nos mentions légales ou nos services ?'}
            </h3>
            <p className="text-sm text-gray-600">
              Maison GOLAY INVEST • Savièse, Suisse (CH-626.1.022.620-4) • info@golayinvest.com
            </p>
          </div>
          <a
            href="mailto:info@golayinvest.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8732A] to-[#B8641C] hover:from-[#D88334] hover:to-[#A85514] text-white font-medium text-sm shadow-md transition-all whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {helpButtons[locale] || 'Contacter nos conseillers'}
          </a>
        </div>
      </main>
    </div>
  );
}
