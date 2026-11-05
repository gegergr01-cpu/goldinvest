'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const QUOTE_LABELS: Record<string, { title: string; subtitle: string; tab: string }> = {
  fr: { title: "Demander un devis", subtitle: "Proposition sous 24h · Cours LBMA", tab: "DEVIS" },
  en: { title: "Request a Quote", subtitle: "Response within 24h · Live LBMA", tab: "QUOTE" },
  de: { title: "Angebot anfordern", subtitle: "Antwort binnen 24h · LBMA-Kurs", tab: "ANGEBOT" },
  es: { title: "Solicitar presupuesto", subtitle: "Respuesta en 24h · Precio LBMA", tab: "COTIZAR" },
  it: { title: "Richiedi un preventivo", subtitle: "Risposta in 24h · Prezzo LBMA", tab: "PREVENTIVO" },
  nl: { title: "Offerte aanvragen", subtitle: "Binnen 24u · Officiële LBMA-koers", tab: "OFFERTE" },
  pt: { title: "Solicitar orçamento", subtitle: "Resposta em 24h · Cotação LBMA", tab: "ORÇAMENTO" },
  da: { title: "Få et tilbud", subtitle: "Svar inden for 24 timer · LBMA-kurs", tab: "TILBUD" },
  hu: { title: "Árajánlat kérése", subtitle: "Ajánlat 24 órán belül · LBMA ár", tab: "AJÁNLAT" },
};

export default function FloatingQuoteBadge() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Hide on admin or devis page itself
  if (pathname?.startsWith('/admin') || pathname?.includes('/devis')) {
    return null;
  }

  // Active locale detection
  const pathMatch = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  const activeLocale = pathMatch ? pathMatch[1] : 'fr';
  const localePrefix = activeLocale && activeLocale !== 'fr' ? `/${activeLocale}` : '';
  const labels = QUOTE_LABELS[activeLocale] || QUOTE_LABELS.fr;

  return (
    <aside
      aria-label={labels.title}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`${localePrefix}/devis`}
        className="flex items-center bg-gradient-to-l from-[#9C4E0F] via-[#B8641C] to-[#C8732A] hover:from-[#A85514] hover:to-[#D88334] text-white rounded-l-2xl shadow-[-6px_8px_30px_rgba(0,0,0,0.45)] border-y border-l border-[#E8A63D]/50 border-r-0 transition-all duration-300 ease-out cursor-pointer overflow-hidden p-2.5 sm:p-3"
      >
        {/* Expanded Content (Reveals on Hover) */}
        <div
          className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ease-out whitespace-nowrap ${
            isHovered ? 'max-w-[260px] opacity-100 pr-3 pl-2' : 'max-w-0 opacity-0 p-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white drop-shadow-sm">
              {labels.title}
            </span>
            <span className="text-[#fae5a2] text-xs font-bold transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </div>
          <span className="text-[10.5px] text-white/85 font-medium leading-tight">
            {labels.subtitle}
          </span>
        </div>

        {/* Resting Anchor Tab: Icon + Green Live Dot + Vertical Micro-Text */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Vertical Micro-badge visible when resting on desktop */}
          <span
            className={`hidden sm:inline-block font-mono text-[9px] font-bold tracking-[0.2em] text-[#fae5a2] uppercase transition-opacity duration-200 [writing-mode:vertical-rl] rotate-180 py-1 ${
              isHovered ? 'opacity-0 hidden' : 'opacity-90'
            }`}
          >
            {labels.tab}
          </span>

          {/* Icon Badge */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/25 flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
            {/* Green Live Indicator Dot */}
            <span className="absolute -top-1 -left-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm" />
            </span>

            {/* Quote / Feather Document Vector Icon */}
            <svg
              className="w-5 h-5 text-white drop-shadow-sm transition-transform group-hover:-rotate-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </Link>
    </aside>
  );
}
