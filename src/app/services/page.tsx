import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

export const metadata: Metadata = {
  title: "Nos Services d'Investissement | Gold Silver Invest",
  description: "Découvrez notre écosystème complet : achat certifié LBMA, stockage en coffres privés haute sécurité à Zurich et Singapour, livraison discrète 100% assurée et rachat garanti.",
};

const SERVICES_DATA = [
  {
    id: 'purchase',
    num: '01',
    title: 'Purchase — Achat de Métaux Précieux',
    tag: 'Authenticité & Pureté Certifiée',
    desc: 'Buy bullion bars and coins from certified, globally recognized refiners, guaranteeing the authenticity, purity, and quality of precious metals. Enjoy a wide selection of products at the best price.',
    fullDesc: 'Nous travaillons exclusivement en direct avec les fondeurs et affineurs accrédités par la prestigieuse London Bullion Market Association (LBMA) tels que C.Hafner, Valcambi, Heraeus et Umicore. Chaque lingot et pièce est livré neuf de frappe, sous blister scellé inviolable avec numéro de série individuel et certificat d\'essai officiel garantissant une pureté minimale de 999.9‰ (24 carats).',
    highlights: [
      { label: 'Affineurs accrédités', value: 'LBMA Good Delivery' },
      { label: 'Pureté garantie', value: '999.9‰ (24 Carats)' },
      { label: 'Fiscalité avantageuse', value: 'Exonération totale de TVA' },
      { label: 'Transparence', value: 'Cours spot direct de la bourse' },
    ],
    features: [
      'Large sélection de pièces emblématiques (Napoléon 20F, Maple Leaf, Krugerrand, Philharmonique).',
      'Lingots de 1g à 1kg frappés et coulés sous scellé avec certificat.',
      'Prix transparents fixés directement sur les cours mondiaux de l\'or et de l\'argent en temps réel.',
      'Aucun intermédiaire bancaire pour vous garantir les meilleures marges du marché.',
    ],
    ctaText: 'Découvrir le catalogue de lingots & pièces',
    ctaUrl: '/shop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#E8A63D]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 'storage',
    num: '02',
    title: 'Storage — Stockage Sécurisé Hors Système Bancaire',
    tag: 'Coffres Privés Haute Sécurité',
    desc: 'Store your precious metals outside the banking system in highly secure vaults located in free-trade zones in Zurich, Singapore, New York, or Toronto.',
    fullDesc: 'Protégez votre patrimoine physique contre les faillites bancaires, les crises monétaires et le risque souverain. Vos métaux précieux sont stockés dans des installations ultra-sécurisées de haute sécurité gérées par des opérateurs indépendants de premier ordre (Malca-Amit, Loomis, Brink\'s) au sein de zones franches internationales.',
    highlights: [
      { label: 'Localisation', value: 'Zurich, Singapour, New York, Toronto' },
      { label: 'Propriété directe', value: 'Nom propre (Titulaire 100%)' },
      { label: 'Assurance', value: '100% valeur marchande (Lloyd\'s)' },
      { label: 'Avantage fiscal', value: 'Exemption de TVA en zone franche' },
    ],
    features: [
      'Stockage en nom propre et ségrégué : vos lingots et pièces ne figurent à aucun bilan bancaire.',
      'Certificat de dépôt individuel et numéroté émis pour chaque client.',
      'Audit physique indépendant régulier par des commissaires aux comptes certifiés.',
      'Possibilité de stocker de l\'argent physique en zone franche sans acquitter la TVA légale.',
    ],
    ctaText: 'Ouvrir un compte de stockage sécurisé',
    ctaUrl: '/contact?subject=storage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#E8A63D]">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'delivery',
    num: '03',
    title: 'Delivery — Livraison Sécurisée & Discrète',
    tag: 'Expédition Assurée à 100%',
    desc: 'Receive your precious metals directly at home with a fast, secure, and discreet delivery service. Package delivery with real-time tracking.',
    fullDesc: 'Si vous préférez détenir personnellement vos métaux à domicile ou dans votre propre coffre, nous organisons une expédition ultra-sécurisée via des transporteurs spécialisés dans le fret de valeurs (Brink\'s, Loomis, Malca-Amit, DHL Express Valeurs). La discrétion et la sûreté sont nos priorités absolues.',
    highlights: [
      { label: 'Couverture', value: 'Assurance tous risques à 100%' },
      { label: 'Discrétion', value: 'Emballage neutre sans mention' },
      { label: 'Remise', value: 'Contre signature + pièce d\'identité' },
      { label: 'Délais', value: 'Expédition rapide sous 24-48h' },
    ],
    features: [
      'Colis banalisés et scellés avec ruban de sécurité inviolable : impossible de deviner le contenu.',
      'Assurance intégrale de bout en bout jusqu\'à la remise physique effective de la marchandise.',
      'Remise en main propre exclusive contre présentation obligatoire d\'une pièce d\'identité valide.',
      'Suivi GPS confidentiel en temps réel et avertissement par SMS la veille de la livraison.',
    ],
    ctaText: 'Demander un devis avec livraison sécurisée',
    ctaUrl: '/contact?subject=delivery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#E8A63D]">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'pickup',
    num: '04',
    title: 'Pickup — Retrait en Main Propre en Coffre',
    tag: 'Discrétion Absolue & Confiance',
    desc: 'Visit one of our storage vaults to collect your precious metals order in person in complete discretion, security, and confidentiality.',
    fullDesc: 'Pour les investisseurs exigeant une totale souveraineté sur leurs avoirs sans recourir au transport postal, nous mettons à votre disposition un service de collecte directe dans nos installations de coffres sécurisées partenaires. Vous récupérez vos métaux en toute tranquillité dans un environnement sécurisé de premier ordre.',
    highlights: [
      { label: 'Points de retrait', value: 'Zurich, Genève, Singapour' },
      { label: 'Confidentialité', value: 'Salons privés sécurisés' },
      { label: 'Contrôle', value: 'Vérification contradictoire sur place' },
      { label: 'Rendez-vous', value: 'Accès exclusif et programmé' },
    ],
    features: [
      'Remise en main propre de vos lingots et pièces de la main à la main dans un sas de haute sécurité.',
      'Possibilité de vérifier vous-même le scellé, les numéros de série et les certificats officiels.',
      'Discrétion totale garantie : prise en charge dans des salons de réception privatifs.',
      'Possibilité de basculer instantanément vos métaux vers une solution de stockage sans transport.',
    ],
    ctaText: 'Prendre rendez-vous pour un retrait physique',
    ctaUrl: '/contact?subject=pickup',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#E8A63D]">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'buyback',
    num: '05',
    title: 'Buyback — Rachat Garanti & Liquidité Immédiate',
    tag: 'Liquidité 100% Garantie sous 24-48h',
    desc: 'Easily sell your bars and coins stored in the vaults. Through our buyback service, you can sell all or part of your precious metals quickly, transparently, and without having to move them physically.',
    fullDesc: 'L\'un des atouts majeurs de l\'or et de l\'argent d\'investissement réside dans leur liquidité immédiate. Grâce à notre service de rachat garanti, vous pouvez revendre tout ou partie de vos métaux précieux en un clic au meilleur cours du marché, avec règlement bancaire express.',
    highlights: [
      { label: 'Rachat garanti', value: '100% des produits vendus' },
      { label: 'Délai de virement', value: '24 à 48 heures ouvrées' },
      { label: 'Frais de transport', value: '0 € pour les métaux en coffre' },
      { label: 'Cotation', value: 'Cours spot officiel LBMA' },
    ],
    features: [
      'Garantie de rachat permanente pour tout produit acheté et conservé dans nos coffres partenaires.',
      'Revente instantanée à distance : aucune expédition requise, la chaîne de garde est préservée intacte.',
      'Prix de rachat transparents indexés en continu sur le fixing de Londres.',
      'Virement SEPA ou international sécurisé directement sur votre compte bancaire nominatif sous 24-48h.',
    ],
    ctaText: 'Demander une estimation ou revendre',
    ctaUrl: '/contact?subject=buyback',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#E8A63D]">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full bg-[#081422] text-white min-h-screen selection:bg-[#C8732A] selection:text-white">
      
      {/* ================= 1. LUXURY SERVICES HERO ================= */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0E2036] via-[#0E2036]/90 to-[#081422]">
        
        {/* Ambient Gold Radial Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #C8732A 0%, #E8A63D 50%, transparent 80%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 115, 42, 0.35), transparent 70%)' }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
            <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#E8A63D] uppercase">
              ÉCOSYSTÈME COMPLET D&apos;INVESTISSEMENT
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto">
            Nos Services{' '}
            <span className="bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent italic drop-shadow-[0_2px_18px_rgba(232,166,61,0.35)]">
              d&apos;Investissement
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/75 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            Une infrastructure souveraine, sécurisée et confidentielle pour acquérir, stocker en coffres privés hors banques, vous faire livrer ou revendre vos métaux précieux au meilleur cours.
          </p>

          {/* Quick Anchor Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto pt-2">
            {SERVICES_DATA.map((srv) => (
              <a
                key={srv.id}
                href={`#${srv.id}`}
                className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-[#C8732A] text-white/80 hover:text-white border border-white/10 hover:border-[#E8A63D] text-[12.5px] sm:text-[13px] font-medium transition-all duration-200 backdrop-blur-md shadow-xs hover:-translate-y-0.5"
              >
                <span className="text-[#E8A63D] font-mono mr-1.5">{srv.num}.</span>
                <span>{srv.title.split('—')[0].trim()}</span>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 2. THE 5 SERVICE BLOCKS (WITH ANCHORS) ================= */}
      <section className="py-16 md:py-24 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 1;

          return (
            <div
              key={service.id}
              id={service.id}
              className="scroll-mt-28 relative rounded-3xl p-[1.5px] bg-gradient-to-b from-[#C8732A]/50 via-white/10 to-transparent transition-all duration-300"
            >
              <div className="relative rounded-[22.5px] bg-[#0E2036]/90 backdrop-blur-xl p-7 sm:p-10 lg:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Background Number Watermark */}
                <span className="absolute -top-6 right-6 font-serif font-bold text-[120px] sm:text-[160px] text-white/[0.03] select-none pointer-events-none leading-none">
                  {service.num}
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left (or Right) Content Column */}
                  <div className={`lg:col-span-7 flex flex-col items-start ${isEven ? 'lg:order-2' : ''}`}>
                    
                    {/* Top Tag & Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                        {service.icon}
                      </div>
                      <div>
                        <span className="text-[10.5px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/[0.07] text-[#E8A63D] border border-[#E8A63D]/30 inline-block">
                          {service.tag}
                        </span>
                        <div className="text-white/40 text-[11px] font-mono mt-0.5">
                          SERVICE REF. 0{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight mb-4">
                      {service.title}
                    </h2>

                    {/* Main Description */}
                    <p className="text-[14px] sm:text-[15px] text-[#FFE599] font-serif italic mb-3 leading-snug">
                      {service.desc}
                    </p>
                    <p className="text-[13.5px] sm:text-[14.5px] text-white/75 leading-relaxed mb-6">
                      {service.fullDesc}
                    </p>

                    {/* Feature bullets */}
                    <ul className="space-y-2.5 mb-8 w-full">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-white/85">
                          <span className="w-5 h-5 rounded-full bg-[#C8732A]/20 border border-[#C8732A]/50 flex items-center justify-center text-[#E8A63D] shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action CTA */}
                    <Link
                      href={service.ctaUrl}
                      className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14px] px-6 py-3 rounded-full shadow-lg shadow-[#9C4E0F]/30 border border-[#E8A63D]/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                    >
                      <span>{service.ctaText}</span>
                      <LuxuryArrow className="w-3 h-3 text-white/90 group-hover:translate-x-1" />
                    </Link>

                  </div>

                  {/* Highlights Grid Card */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                    <div className="bg-[#081422]/70 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-md">
                      <div className="text-[11px] font-mono tracking-wider uppercase text-[#E8A63D] font-bold mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                        <span>Points clés du service</span>
                        <span className="text-white/40">Garantie Souveraine</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.highlights.map((hl, hIdx) => (
                          <div key={hIdx} className="bg-white/[0.04] p-3.5 rounded-xl border border-white/5">
                            <span className="block text-[11px] text-white/50 mb-1">
                              {hl.label}
                            </span>
                            <span className="block font-serif font-bold text-[14.5px] text-[#FFE599] leading-tight">
                              {hl.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Seal / Trust notice */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs shrink-0">
                          ✓
                        </div>
                        <p className="text-[11.5px] text-white/60 leading-snug">
                          Protocole d&apos;assurance vérifié et exécution conforme aux normes de la LBMA.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* ================= 3. BOTTOM ADVISOR REASSURANCE BANNER ================= */}
      <section className="py-16 bg-[#0E2036] border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-white/[0.05] via-[#C8732A]/10 to-transparent p-8 sm:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#E8A63D] font-bold block mb-2">
                ACCOMPAGNEMENT DÉDIÉ
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
                Vous avez un projet d&apos;investissement spécifique ?
              </h3>
              <p className="text-[14px] text-white/70 max-w-xl">
                Nos spécialistes des métaux précieux vous conseillent pour configurer votre portefeuille, vos solutions de garde en coffre ou organiser une livraison personnalisée.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-full shadow-lg shadow-[#9C4E0F]/30 border border-[#E8A63D]/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>Contacter un conseiller</span>
                <LuxuryArrow className="w-3 h-3 text-white/90 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

