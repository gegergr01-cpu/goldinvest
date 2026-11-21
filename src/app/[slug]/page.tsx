import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/actions/pages';
import SafeHTML from '@/components/SafeHTML';
import { getContactSettings } from '@/actions/contactSettings';
import ContactPageContent from '@/components/contact/ContactPageContent';
import { getLocale } from 'next-intl/server';
import { buildInternationalAlternates } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

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

  return {
    title: page.metaTitle ? page.metaTitle : `${page.title} - ${storeName}`,
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords || undefined,
    alternates: buildInternationalAlternates(`/${page.slug}`, locale),
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      url: `${SITE_URL}/${locale}/${page.slug}`,
      siteName: storeName,
      type: 'website',
    }
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const contactSettings = await getContactSettings();
  if (resolvedParams.slug === contactSettings.slug) {
    return <ContactPageContent />;
  }

  const { data: page, success } = await getPageBySlug(resolvedParams.slug);

  if (!success || !page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 1. Luxury Navy Header Banner with Breadcrumbs & Swiss Registry Badge */}
      <section className="bg-gradient-to-b from-[#0B1A2C] via-[#0E2036] to-[#0E2036] text-white border-b border-white/10 pt-10 pb-12 sm:pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/60 mb-5">
            <Link href="/" className="hover:text-[#E8A63D] transition-colors">
              Accueil
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">Informations Légales & Institutionnelles</span>
            <span className="text-white/30">/</span>
            <span className="text-[#E8A63D] font-medium truncate max-w-[200px] sm:max-w-none">
              {page.title}
            </span>
          </nav>

          {/* Official Swiss Company Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[#E8A63D] text-xs font-mono tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8732A] animate-pulse" />
            <span>Maison GOLAY INVEST • Savièse, Suisse • CH-626.1.022.620-4</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {page.title}
          </h1>

          {/* Subtitle / Last Updated */}
          <p className="text-sm text-white/60 mt-2">
            Mise à jour officielle • Conforme au droit suisse (CO/LPD) et aux normes européennes LBMA
          </p>
        </div>
      </section>

      {/* 2. Page Content Container */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-10">
          {/* Desktop Content */}
          <SafeHTML 
            html={page.desktopContent || ''}
            className="hidden md:block w-full prose max-w-none prose-headings:font-serif prose-headings:text-[#0E2036] prose-a:text-[#C8732A] prose-a:underline hover:prose-a:text-[#B8641C]"
          />
          
          {/* Mobile Content */}
          <SafeHTML 
            html={page.mobileContent || (page.desktopContent || '')}
            className="block md:hidden w-full prose max-w-none prose-headings:font-serif prose-headings:text-[#0E2036] prose-a:text-[#C8732A] prose-a:underline hover:prose-a:text-[#B8641C]"
          />
        </div>

        {/* Support & Inquiries Help Box */}
        <div className="mt-10 bg-gradient-to-r from-slate-100 to-amber-50/50 rounded-2xl border border-amber-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0E2036] mb-1">
              Une question concernant nos mentions légales ou nos services ?
            </h3>
            <p className="text-sm text-gray-600">
              Nos conseillers spécialistes en métaux précieux d’investissement sont à votre disposition.
            </p>
          </div>
          <a
            href="mailto:info@golayinvest.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8732A] to-[#B8641C] hover:from-[#D88334] hover:to-[#A85514] text-white font-medium text-sm shadow-md transition-all whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contacter nos juristes
          </a>
        </div>
      </main>
    </div>
  );
}
