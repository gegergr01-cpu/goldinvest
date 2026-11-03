'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  config?: Record<string, string>;
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    q: "Comment l'authenticité et la pureté des métaux précieux sont-elles garanties ?",
    a: "Tous nos lingots et pièces proviennent exclusivement de fondeurs et affineurs certifiés LBMA (London Bullion Market Association) tels que C.Hafner, Valcambi, Heraeus et Umicore. Chaque produit est livré sous blister scellé inviolable avec son certificat d'essai officiel garantissant une pureté minimale de 999.9‰ (24 carats)."
  },
  {
    q: "Comment s'effectue la livraison physique et est-elle assurée ?",
    a: "Nos expéditions sont couvertes par une assurance transporteur ad valorem à 100% de leur valeur marchande. Elles s'effectuent par transporteurs de fonds spécialisés (Brink's, Loomis, Malca-Amit) dans des colis banalisés et discrets, sans aucune mention apparente du contenu. La remise se fait exclusivement en main propre contre signature et présentation obligatoire d'une pièce d'identité."
  },
  {
    q: "Quelle est la fiscalité appliquée à l'or et à l'argent d'investissement ?",
    a: "Dans l'Union Européenne, l'or d'investissement est totalement exonéré de TVA à l'achat (CGI art. 262 ter I). À la revente, l'investisseur a le choix entre la Taxe Forfaitaire sur les Métaux Précieux (11,5%) ou le régime des Plus-Values Réelles avec un abattement de 5% par an dès la 3ème année (soit une exonération totale d'impôt au bout de 22 ans sur présentation de votre facture d'achat)."
  },
  {
    q: "Garantissez-vous le rachat de mes pièces et lingots ultérieurement ?",
    a: "Oui, sans aucune exception. Nous garantissons le rachat permanent de tous les métaux précieux acquis sur notre plateforme, indexé en temps réel sur les cours officiels de Londres (LBMA) et de Paris, dès lors que les produits sont conservés dans leur scellé d'origine intact."
  },
  {
    q: "Proposez-vous une solution de stockage sécurisé hors système bancaire ?",
    a: "Absolument. Pour les investisseurs souhaitant une protection maximale sans contrainte de garde à domicile, nous mettons à disposition des coffres-forts haute sécurité en Suisse (Zurich, Genève) et en zone franche internationale, 100% alloués en nom propre, hors du système bancaire traditionnel, avec assurance tous risques Lloyd's et audit physique régulier."
  },
  {
    q: "Quels sont les délais d'expédition après validation de la commande ?",
    a: "Les ordres passés sur des produits en stock sont traités et expédiés sous 24 à 48 heures ouvrées dès validation du règlement. Un lien de traçabilité crypté vous permet de suivre l'acheminement de votre colis en direct jusqu'à sa remise sécurisée."
  }
];

export default function FaqSection({ config }: FaqSectionProps) {
  const c = config || {};

  const badge = c.badge || 'QUESTIONS FRÉQUENTES';
  const title = c.title || "Tout savoir sur l'investissement dans les métaux précieux";
  const subtitle = c.subtitle || "Retrouvez les réponses de nos experts sur la certification LBMA, la fiscalité, la livraison sécurisée et nos garanties de rachat.";

  const ctaTitle = c.cta_title || "Vous avez une question spécifique sur votre investissement ?";
  const ctaDesc = c.cta_desc || "Nos conseillers spécialistes de l'or physique vous accompagnent du lundi au vendredi.";
  const ctaBtnText = c.cta_btn_text || "Contacter un conseiller";
  const ctaBtnUrl = c.cta_btn_url || "/contact";

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-20 lg:py-24 bg-[#0E2036] text-white relative overflow-hidden border-t border-white/[0.08]">
      
      {/* Background Subtle Gradient & Watermarks */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(200, 115, 42, 0.25), transparent 60%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#C8732A 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 2-COLUMN SPLIT LAYOUT (Gauhe: Titre & Support CTA / Droite: Accordéons) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── COLONNE GAUCHE (STICKY SUR DESKTOP) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:sticky lg:top-28">
            
            {/* Header Block */}
            <div className="space-y-4">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
                <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#E8A63D] uppercase">
                  {badge}
                </span>
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
              </div>

              {/* Title */}
              <h2 className="font-serif font-bold text-[30px] sm:text-[38px] text-white tracking-tight leading-[1.18]">
                {title.includes('métaux précieux') ? (
                  <>
                    {title.replace('métaux précieux', '')}
                    <span className="bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent italic">
                      métaux précieux
                    </span>
                  </>
                ) : title}
              </h2>

              {/* Subtitle */}
              <p className="text-[14.5px] sm:text-[15.5px] text-white/75 font-normal leading-relaxed">
                {subtitle}
              </p>

            </div>

            {/* Reassurance Card avec CTA Compris */}
            <div className="relative rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-xl overflow-hidden space-y-4">
              
              {/* Subtle ambient amber corner glow */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
                style={{ background: 'radial-gradient(circle, #E8A63D 0%, transparent 70%)' }}
              />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8732A]/20 border border-[#C8732A]/40 flex items-center justify-center text-[#E8A63D] shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8A63D] font-bold block">
                    ASSISTANCE PERSONNALISÉE
                  </span>
                  <span className="text-[11.5px] text-white/60">
                    Réponse sous 2h ouvrées
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h4 className="font-serif font-bold text-[16px] sm:text-[17px] text-white leading-snug">
                  {ctaTitle}
                </h4>
                <p className="text-[13px] sm:text-[13.5px] text-white/70 leading-relaxed font-normal">
                  {ctaDesc}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={ctaBtnUrl}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[13.5px] px-6 py-3 rounded-full shadow-lg shadow-[#9C4E0F]/30 border border-[#E8A63D]/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                >
                  <span>{ctaBtnText}</span>
                  <LuxuryArrow className="w-3 h-3 text-white/95 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>

          {/* ── COLONNE DROITE (ACCORDÉONS DE LA FAQ) ── */}
          <div className="lg:col-span-7 space-y-3.5">
            {DEFAULT_FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-gradient-to-br from-[#142944] to-[#0F2238] border-[#C8732A]/70 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-[#C8732A]/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Question Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-semibold text-[15px] sm:text-[16.5px] text-white leading-snug group-hover:text-[#FFE082] transition-colors">
                      {item.q}
                    </span>

                    {/* Rotating Indicator Icon (+ to ×) */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#C8732A] text-white border-[#C8732A] rotate-45'
                          : 'bg-white/5 text-[#E8A63D] border-white/10 group-hover:border-[#E8A63D]/40'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>

                  {/* Answer Content */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-[13.5px] sm:text-[14.5px] text-white/80 leading-relaxed font-normal border-t border-white/[0.06]">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
