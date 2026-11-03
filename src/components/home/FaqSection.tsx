'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    a: "Tous nos lingots et pièces proviennent exclusivement de fondeurs et raffineurs certifiés LBMA (London Bullion Market Association) tels que C.Hafner, Valcambi, Heraeus et Umicore. Chaque produit est livré sous blister scellé inviolable avec son certificat d'essai individuel garantissant une pureté de 999.9‰ (24 carats)."
  },
  {
    q: "Comment s'effectue la livraison physique et est-elle assurée ?",
    a: "Nos expéditions sont couvertes par une assurance transporteur à 100% de leur valeur marchande. Elles s'effectuent par transporteurs spécialisés dans des colis banalisés et discrets, sans aucune mention apparente du contenu. La remise se fait exclusivement en main propre contre signature et présentation d'une pièce d'identité."
  },
  {
    q: "Quelle est la fiscalité appliquée à l'or et à l'argent d'investissement ?",
    a: "Dans l'Union Européenne, l'or d'investissement est totalement exonéré de TVA à l'achat. À la revente, l'investisseur a le choix entre la Taxe Forfaitaire sur les Métaux Précieux (11,5%) ou le régime des Plus-Values Réelles avec un abattement de 5% par an dès la 3ème année (soit une exonération totale au bout de 22 ans sur présentation de votre facture)."
  },
  {
    q: "Garantissez-vous le rachat de mes pièces et lingots ultérieurement ?",
    a: "Oui, sans exception. Nous garantissons le rachat permanent de tous les métaux précieux acquis sur notre plateforme, indexé en temps réel sur les cours officiels de Londres et de Paris, dès lors que les produits sont conservés dans leur pochette scellée d'origine."
  },
  {
    q: "Proposez-vous une solution de stockage sécurisé hors système bancaire ?",
    a: "Absolument. Pour les investisseurs souhaitant une protection maximale sans contrainte de garde à domicile, nous mettons à disposition des coffres-forts ultra-sécurisés en Suisse et en Belgique, hors du système bancaire traditionnel, avec assurance tous risques et audit régulier."
  },
  {
    q: "Quels sont les délais d'expédition après validation de la commande ?",
    a: "Les ordres passés sur des produits en stock sont traités et expédiés sous 24 à 48 heures ouvrées dès validation du règlement. Un lien de traçabilité crypté vous permet de suivre l'acheminement de votre colis en direct jusqu'à sa remise."
  }
];

export default function FaqSection({ config }: FaqSectionProps) {
  const c = config || {};

  const badge = c.badge || 'QUESTIONS FRÉQUENTES';
  const title = c.title || "Tout savoir sur l'investissement dans les métaux précieux";
  const subtitle = c.subtitle || 'Retrouvez les réponses de nos experts sur la certification LBMA, la fiscalité, la livraison sécurisée et nos garanties de rachat.';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-20 lg:py-24 bg-[#0E2036] text-white relative overflow-hidden border-t border-white/[0.08]">
      
      {/* Background Subtle Gradient & Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(200, 115, 42, 0.25), transparent 70%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 20px)'
        }}
      />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
            <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.18em] text-[#E8A63D] uppercase">
              {badge}
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-[30px] sm:text-[40px] text-white tracking-tight leading-tight mb-4">
            {title.includes('métaux précieux') ? (
              <>
                {title.replace('métaux précieux', '')}
                <span className="bg-gradient-to-r from-[#FFE082] via-[#E8A63D] to-[#C8732A] bg-clip-text text-transparent italic">
                  métaux précieux
                </span>
              </>
            ) : title}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/75 font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {DEFAULT_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-[14px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#142944]/90 border-[#C8732A]/60 shadow-[0_8px_25px_rgba(0,0,0,0.35)]'
                    : 'bg-[#10243C]/60 border-white/[0.08] hover:border-white/20 hover:bg-[#122740]'
                }`}
              >
                {/* Question Trigger Button */}
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-semibold text-[15.5px] sm:text-[17px] text-white leading-snug">
                    {item.q}
                  </span>

                  {/* Golden Rotating Indicator Icon */}
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
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-[14px] sm:text-[14.5px] text-white/80 leading-relaxed font-normal border-t border-white/[0.06]">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Helper: Need further advice? */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-[16px] text-white">
              Vous avez une question spécifique sur votre investissement ?
            </h4>
            <p className="text-[13px] text-white/65 mt-0.5">
              Nos conseillers spécialistes de l&apos;or physique vous accompagnent du lundi au vendredi.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-full shadow-md transition-all duration-200 shrink-0"
          >
            <span>Contacter un conseiller</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

