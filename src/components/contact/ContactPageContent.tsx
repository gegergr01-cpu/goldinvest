import ContactForm from './ContactForm';
import { getContactSettings } from '@/actions/contactSettings';
import { getTranslations } from 'next-intl/server';
import SafeHTML from '@/components/SafeHTML';
import Link from 'next/link';

export default async function ContactPageContent() {
  const settings = await getContactSettings();
  const t = await getTranslations('Contact');

  // Format paragraphs from settings.text
  const textParagraphs = settings.text
    ? settings.text.split('\n').filter((p: string) => p.trim() !== '')
    : [];

  // Address lines
  const addressLines = settings.address
    ? settings.address.split('\n').filter((l: string) => l.trim() !== '')
    : [];

  const cleanPhone = settings.phone ? settings.phone.replace(/[^\d+]/g, '') : '';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* 1. Hero Header */}
      <section className="relative bg-gradient-to-b from-[#0E2036] via-[#12253E] to-[#0A182A] text-white pt-10 pb-16 sm:pb-20 overflow-hidden border-b border-white/10">
        {/* Subtle decorative gold light glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8A63D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C8732A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-[#E8A63D] transition-colors">
              {t('breadcrumb_home')}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white font-medium">{t('breadcrumb_contact')}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Private Desk Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#E8A63D]/40 text-[#E8A63D] text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A63D] animate-pulse" />
              {t('badge')}
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
              {t('hero_title')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 font-normal">
              {t('hero_subtitle')}
            </p>

            {/* Trading Desk Live Status */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>{t('desk_status')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Grid: Presentation & Coordonnées (Left) vs Form (Right) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (5 cols): Presentation & Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Advisory Presentation Card */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#E8A63D]/15 border border-[#E8A63D]/30 flex items-center justify-center text-[#C8732A]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl font-bold text-[#0E2036]">
                  {settings.title || t('advisor_title')}
                </h2>
              </div>

              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                {textParagraphs.length > 0 ? (
                  textParagraphs.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{t('advisor_desc')}</p>
                )}
              </div>
            </div>

            {/* Direct Contact Channels Cards */}
            <div className="space-y-3.5">
              
              {/* Phone Channel */}
              {settings.phone && (
                <div className="bg-white border border-gray-200/90 hover:border-[#E8A63D]/60 rounded-2xl p-5 shadow-xs transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/25 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A] group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        {t('phone_label')}
                      </div>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-base font-bold text-[#0E2036] hover:text-[#C8732A] transition-colors block tracking-wide"
                      >
                        {settings.phone}
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t('phone_sub')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Channel */}
              {settings.emailDisplay && (
                <div className="bg-white border border-gray-200/90 hover:border-[#E8A63D]/60 rounded-2xl p-5 shadow-xs transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/25 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A] group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        {t('email_label')}
                      </div>
                      <a
                        href={`mailto:${settings.emailDisplay}`}
                        className="text-sm sm:text-base font-bold text-[#0E2036] hover:text-[#C8732A] transition-colors block truncate"
                      >
                        {settings.emailDisplay}
                      </a>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t('email_sub')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Counters & Physical Address */}
              {settings.address && (
                <div className="bg-white border border-gray-200/90 hover:border-[#E8A63D]/60 rounded-2xl p-5 shadow-xs transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/25 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A] group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        {t('address_label')}
                      </div>
                      <div className="text-sm font-medium text-[#0E2036] space-y-1">
                        {addressLines.map((line: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#C8732A] mt-0.5 font-bold">•</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {t('address_sub')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                      {t('hours_label')}
                    </div>
                    <div className="text-sm font-bold text-[#0E2036]">
                      {t('hours_value')}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t('hours_sub')}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (7 cols): Main Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/[0.03]">
              
              <div className="border-b border-gray-100 pb-5 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8732A] mb-1">
                  <span>✉️</span>
                  <span>Formulaire Officiel</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2036] mb-2">
                  {t('form_title')}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('form_subtitle')}
                </p>
              </div>

              {/* Form Component */}
              <ContactForm phonePlaceholder={settings.phonePlaceholder} />

            </div>
          </div>

        </div>

        {/* 3. Reassurance Pillars Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Privacy */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/20 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#0E2036] mb-1">
                  {t('pillars_privacy_title')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('pillars_privacy_desc')}
                </p>
              </div>
            </div>

            {/* Pillar 2: LBMA */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/20 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#0E2036] mb-1">
                  {t('pillars_lbma_title')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('pillars_lbma_desc')}
                </p>
              </div>
            </div>

            {/* Pillar 3: Dedicated Support */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A63D]/20 to-[#C8732A]/20 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#C8732A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#0E2036] mb-1">
                  {t('pillars_support_title')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('pillars_support_desc')}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 4. FAQ CTA Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0E2036] via-[#162A45] to-[#0E2036] text-white border border-[#E8A63D]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#E8A63D]/20 border border-[#E8A63D]/40 flex items-center justify-center shrink-0 text-[#E8A63D] hidden sm:flex">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">
                {t('faq_cta_title')}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                {t('faq_cta_desc')}
              </p>
            </div>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:brightness-110 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shrink-0 whitespace-nowrap"
          >
            {t('faq_cta_btn')}
          </Link>
        </div>

        {/* 5. Optional Bottom Custom Text from Admin Settings */}
        {settings.bottomText && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-3xl mx-auto prose prose-amber text-xs text-gray-500 leading-relaxed">
              <SafeHTML html={settings.bottomText} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
