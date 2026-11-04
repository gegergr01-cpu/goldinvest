'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { LuxuryArrow } from '@/components/ui/LuxuryArrow';

export interface FaqTopic {
  id: string;
  category: string;
  icon: string;
  badge: string;
  items: {
    q: string;
    a: string;
    keywords?: string[];
  }[];
}

export const FAQ_DATA: FaqTopic[] = [
  {
    id: 'authenticity',
    category: 'Authenticité & Certification LBMA',
    icon: '🛡️',
    badge: 'Normes Good Delivery',
    items: [
      {
        q: "Comment l'authenticité et la pureté des métaux précieux sont-elles garanties ?",
        a: "Tous nos lingots et pièces proviennent exclusivement de fondeurs et d'affineurs certifiés par la prestigieuse London Bullion Market Association (LBMA) tels que C.Hafner, Valcambi, Heraeus et Umicore. Chaque lingot ou monnaie d'investissement est livré neuf de frappe, sous blister scellé inviolable avec son numéro de série individuel gravé et son certificat d'essai officiel garantissant une pureté minimale de 999.9‰ (24 carats) pour les lingots et de 900‰ à 999.9‰ pour les pièces boursables.",
        keywords: ['lbma', 'purete', 'authenticite', 'certificat', 'valcambi', 'heraeus', 'titrage', 'or pur']
      },
      {
        q: "Qu'est-ce que le label LBMA \"Good Delivery\" et pourquoi est-il crucial ?",
        a: "La London Bullion Market Association (LBMA) est l'autorité suprême de régulation des métaux précieux dans le monde. Le label Good Delivery atteste que l'affineur respecte les critères les plus drastiques de l'industrie en matière de pureté, de pesée, d'intégrité et de conformité éthique. Détenir un produit certifié Good Delivery vous garantit une négociabilité immédiate sur toutes les bourses mondiales (Paris, Londres, Zurich, New York, Tokyo) sans aucune décote ni frais d'analyse complémentaire.",
        keywords: ['good delivery', 'bourse', 'liquidite', 'negoce', 'international', 'fiabilite']
      },
      {
        q: "Pourquoi privilégier des pièces et lingots scellés sous blister d'origine ?",
        a: "Le blister scellé d'origine fait office de certificat d'authenticité infalsifiable et protège l'or de toute rayure, oxydation ou altération physique. Il comporte le poinçon du fondeur essayeur juré, le numéro de série individuel et la date. De plus, sur le plan fiscal, le blister scellé prouve formellement la traçabilité de votre acquisition et permet de bénéficier du régime fiscal de la plus-value réelle dégressive.",
        keywords: ['blister', 'scelle', 'inviolable', 'tracabilite', 'protection', 'poincon']
      },
      {
        q: "Comment vérifier le numéro de série d'un lingot ou lingotin ?",
        a: "Chaque lingot (de 1g à 1kg) possède un numéro de série unique directement gravé au laser dans le métal précieux ainsi qu'imprimé sur le blister sécurisé. Ce même numéro figure sur votre facture officielle d'achat certifiée téléchargeable en PDF dans votre espace client, assurant une parfaite concordance juridique.",
        keywords: ['numero de serie', 'laser', 'facture', 'espace client', 'concordance']
      }
    ]
  },
  {
    id: 'taxation',
    category: 'Fiscalité & Réglementation',
    icon: '💶',
    badge: 'TVA 0% & Plus-Values',
    items: [
      {
        q: "L'or d'investissement est-il soumis à la TVA à l'achat ?",
        a: "Non. En application de la directive européenne 98/80/CE transposée à l'article 262 ter I du Code Général des Impôts (CGI), l'or d'investissement (pièces d'une pureté minimale de 900‰ ayant eu cours légal et lingots d'au moins 995‰) est totalement et légalement exonéré de TVA à l'achat dans l'ensemble de l'Union Européenne.",
        keywords: ['tva', 'exoneration', 'impots', 'cgi', 'taxe', 'reglementation', '262 ter']
      },
      {
        q: "Quelle est la fiscalité applicable à la revente de métaux précieux ?",
        a: "Lors de la revente, l'investisseur résident fiscal français a le choix entre deux régimes fiscaux très avantageux : 1) La Taxe Forfaitaire sur les Métaux Précieux (TMP) fixée à 11,5% du montant brut de la vente, ou 2) Le régime des Plus-Values Réelles (TPV) fixé à 36,2% sur la plus-value nette uniquement, avec un abattement de 5% par an dès la 3ème année de détention. Ce second régime aboutit à une exonération totale d'impôt (0% d'impôt) au bout de 22 ans de détention, sur simple présentation de votre facture d'achat nominative.",
        keywords: ['revente', 'fiscalite', 'plus-value', 'tmp', 'tpv', 'abattement', 'exoneration 22 ans']
      },
      {
        q: "L'or physique est-il soumis à l'Impôt sur la Fortune Immobilière (IFI) ?",
        a: "Non. L'IFI ne concerne strictement que les actifs immobiliers. Les métaux précieux (or, argent, platine physique) sont des biens meubles corporels et n'entrent absolument pas dans l'assiette de calcul de l'IFI.",
        keywords: ['ifi', 'fortune', 'patrimoine', 'assiette', 'meuble', 'declaration']
      },
      {
        q: "L'argent physique bénéficie-t-il également d'une exonération de TVA ?",
        a: "Contrairement à l'or d'investissement, l'argent physique livré à domicile est soumis à la TVA en Europe. Cependant, grâce à notre solution de stockage en coffres sécurisés en zone franche (notamment à Zurich et Singapour), vous pouvez acheter et détenir de l'argent et du platine en totale suspension de TVA (0% TVA) tant que les métaux demeurent dans les coffres francs sous douane.",
        keywords: ['argent', 'zone franche', 'suisse', 'zurich', 'suspension', 'hors taxe']
      }
    ]
  },
  {
    id: 'storage',
    category: 'Stockage Sécurisé & Coffres Hors Banques',
    icon: '🏦',
    badge: 'Zurich · Genève · Paris',
    items: [
      {
        q: "Pourquoi stocker ses métaux précieux hors du système bancaire ?",
        a: "Les coffres bancaires traditionnels sont vulnérables aux faillites des établissements de crédit, aux gels d'avoirs étatiques ou aux fermetures administratives en cas de crise systémique (bail-in financier). Notre solution de stockage s'effectue auprès de gardiens privés indépendants accrédités (Malca-Amit, Loomis, Brink's) dans des zones franches sécurisées, totalement hors de tout bilan bancaire.",
        keywords: ['coffre', 'faillite', 'hors banque', 'suisse', 'loomis', 'brinks', 'malca-amit', 'crise']
      },
      {
        q: "Mes métaux sont-ils détenus en nom propre (100% alloués) ?",
        a: "Oui, sans aucune ambiguïté. Vos métaux sont 100% alloués et ségrégués en nom propre. Vous recevez un certificat de dépôt nominatif officiel avec l'inventaire précis et les numéros de série de vos lingots. Vous demeurez l'unique et direct propriétaire légal à 100%.",
        keywords: ['nom propre', 'alloue', 'segregue', 'certificat de depot', 'proprietaire']
      },
      {
        q: "Comment mes avoirs en coffre sont-ils assurés et audités ?",
        a: "L'intégralité de vos métaux en coffre est couverte par une police d'assurance tous risques souscrite auprès des Lloyd's de Londres à 100% de la valeur de marché boursière en temps réel. De plus, un audit physique indépendant contradictoire est réalisé deux fois par an par des commissaires aux comptes certifiés.",
        keywords: ['assurance', 'lloyds', 'audit', 'commissaire aux comptes', 'securite']
      },
      {
        q: "Puis-je visiter mes coffres ou retirer mes métaux à tout moment ?",
        a: "Oui. En tant que propriétaire direct, vous disposez d'un droit d'accès permanent à vos avoirs. Sur simple notification préalable de 48 heures ouvrées pour organiser le protocole sécurisé, vous pouvez vous rendre sur place dans nos salons privés pour inspecter vos pièces ou procéder à un retrait physique en main propre.",
        keywords: ['visite', 'acces', 'retrait physique', 'salon prive', 'recuperation']
      }
    ]
  },
  {
    id: 'delivery',
    category: 'Livraison Sécurisée & Retrait Privé',
    icon: '🚚',
    badge: 'Assurance 100% Ad Valorem',
    items: [
      {
        q: "Comment se déroule la livraison physique et la discrétion est-elle garantie ?",
        a: "Nos expéditions sont réalisées via des transporteurs spécialisés dans le fret de valeurs (Brink's, Loomis, Malca-Amit ou DHL Express Valeurs). Les colis sont scellés avec un ruban adhésif de sécurité inviolable, neutres et totalement banalisés (aucune mention d'or, d'argent ou du nom commercial n'apparaît sur le paquet). La remise se fait exclusivement en main propre contre signature et vérification d'une pièce d'identité.",
        keywords: ['livraison', 'discretion', 'colis neutre', 'transport', 'signature', 'identite']
      },
      {
        q: "Que se passe-t-il en cas de perte, de vol ou de retard du transporteur ?",
        a: "Vous ne prenez aucun risque financier : nos expéditions sont intégralement couvertes par une assurance ad valorem à 100% de leur valeur marchande. Notre responsabilité contractuelle et celle de l'assureur s'étendent jusqu'au moment où vous apposez physiquement votre signature sur le bordereau de réception. En cas d'incident, un remplacement immédiat ou un remboursement intégral à 100% est exécuté sous 48h.",
        keywords: ['perte', 'vol', 'assurance transport', 'garantie', 'remboursement', 'ad valorem']
      },
      {
        q: "Quels sont les délais d'expédition après validation du règlement ?",
        a: "Pour tous les produits signalés 'En stock', les commandes sont préparées, scellées et expédiées sous 24 à 48 heures ouvrées dès réception du règlement bancaire. Un code de suivi GPS crypté et confidentiel vous est transmis dès l'enlèvement pour suivre le trajet de votre colis en direct.",
        keywords: ['delai', 'expedition', 'suivi gps', '24-48h', 'preparation']
      },
      {
        q: "Puis-je retirer ma commande en main propre dans vos salons privés ?",
        a: "Oui. Si vous préférez éviter le transport postal, nous proposons un service de retrait sécurisé sur rendez-vous dans nos salons privés à Paris, Zurich et Genève. Vous êtes accueilli dans un espace confidentiel haute sécurité pour vérifier vos scellés et prendre possession immédiate de vos actifs.",
        keywords: ['retrait agence', 'main propre', 'paris', 'zurich', 'geneve', 'salon prive']
      }
    ]
  },
  {
    id: 'buyback',
    category: 'Rachat Garanti & Devis d\'Investissement',
    icon: '🔁',
    badge: 'Liquidité sous 24-48h',
    items: [
      {
        q: "Garantissez-vous le rachat de mes pièces et lingots ultérieurement ?",
        a: "Oui, sans aucune restriction de durée. Nous garantissons le rachat permanent de tous les lingots et pièces acquis chez Gold Silver Invest, dès lors que les produits sont conservés dans leur scellé d'origine intact. Pour les métaux stockés dans nos coffres partenaires, le rachat est instantané en un clic car la chaîne de garde est restée 100% inviolée.",
        keywords: ['rachat garanti', 'liquidite', 'reprise', 'chaine de garde', 'revente']
      },
      {
        q: "À quel prix mes métaux sont-ils rachetés et sous quel délai suis-je payé ?",
        a: "Nos prix de rachat sont indexés en temps réel et en toute transparence sur les cours officiels de la bourse de Londres (fixing LBMA) et de Paris, sans décote arbitraire. Dès validation du rachat, le règlement est exécuté par virement bancaire SEPA ou international sous 24 à 48 heures ouvrées sur votre compte bancaire nominatif.",
        keywords: ['prix rachat', 'cours spot', 'fixing', 'virement', 'paiement 24h']
      },
      {
        q: "Comment obtenir un devis personnalisé pour un ordre d'investissement ?",
        a: "Pour les ordres patrimoniaux ou d'entreprises (au-delà de 10 000 €), vous pouvez formuler une demande de devis directement sur notre page dédiée (/devis). Nos spécialistes vous transmettent sous 2h un devis officiel certifié en PDF avec fixation du cours spot, détails d'allocation et conditions de garde ou de livraison.",
        keywords: ['devis', 'devis officiel', 'pdf', 'gros volume', 'patrimoine', 'tresorerie']
      },
      {
        q: "Rachetez-vous également des métaux précieux achetés auprès d'un autre établissement ?",
        a: "Oui. Notre service d'expertise numismatique et de rachat étudie également les pièces d'or boursables (Napoléon 20F, Souverain, Krugerrand...) et les lingots certifiés LBMA acquis auprès d'autres maisons, sous réserve d'un contrôle d'authenticité et de la présentation des justificatifs légaux d'acquisition.",
        keywords: ['expertise', 'autre maison', 'rachat externe', 'napoleon', 'lingot externe']
      }
    ]
  }
];

export default function FaqPageClient() {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'authenticity-0': true, // Open first question by default
  });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    filteredTopics.forEach(topic => {
      topic.items.forEach((_, idx) => {
        allOpen[`${topic.id}-${idx}`] = true;
      });
    });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  // Filtered topics based on category tab & search query
  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return FAQ_DATA
      .filter(topic => selectedTopic === 'all' || topic.id === selectedTopic)
      .map(topic => {
        if (!q) return topic;

        const matchingItems = topic.items.filter(item => {
          const matchQ = item.q.toLowerCase().includes(q);
          const matchA = item.a.toLowerCase().includes(q);
          const matchK = item.keywords?.some(k => k.toLowerCase().includes(q));
          return matchQ || matchA || matchK;
        });

        return {
          ...topic,
          items: matchingItems
        };
      })
      .filter(topic => topic.items.length > 0);
  }, [selectedTopic, searchQuery]);

  const totalQuestionsCount = useMemo(() => {
    return filteredTopics.reduce((acc, curr) => acc + curr.items.length, 0);
  }, [filteredTopics]);

  return (
    <div className="w-full bg-[#FAF9F5] text-[#0E2036] min-h-screen selection:bg-[#C8732A] selection:text-white">
      
      {/* ================= 1. HERO BANNER (DEEP NAVY & GOLD) ================= */}
      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-[#0E2036] via-[#0E2036] to-[#0A182A] text-white border-b border-[#C8732A]/30">
        
        {/* Ambient Gold Radial Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #C8732A 0%, #E8A63D 50%, transparent 80%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 115, 42, 0.4), transparent 70%)' }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E8A63D]" />
            <span className="font-mono text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#E8A63D] uppercase">
              CENTRE D&apos;AIDE & EXPERTISE PATRIMONIALE
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E8A63D]" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4 max-w-4xl mx-auto">
            Foire Aux Questions{' '}
            <span className="bg-gradient-to-r from-[#fae5a2] via-[#E8A63D] to-[#c59a3f] bg-clip-text text-transparent italic drop-shadow-[0_2px_18px_rgba(232,166,61,0.35)]">
              (FAQ)
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed mb-8">
            Tout savoir sur l&apos;investissement dans les métaux précieux : certification LBMA, fiscalité à l&apos;achat et à la revente, stockage en coffres privés en Suisse et garanties de rachat permanent.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une question (ex. TVA, LBMA, coffres, rachat, livraison...)"
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-xs sm:text-sm pl-11 pr-10 py-3.5 rounded-full border border-white/20 focus:border-[#E8A63D] outline-none backdrop-blur-md transition-all shadow-lg shadow-black/20"
              />
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="w-4 h-4 text-[#E8A63D] absolute left-4 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-white/60 hover:text-white p-1 text-xs"
                  aria-label="Effacer la recherche"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pt-1">
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
                selectedTopic === 'all'
                  ? 'bg-gradient-to-r from-[#C8732A] to-[#B8641C] text-white shadow-md border border-[#E8A63D]'
                  : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/15'
              }`}
            >
              Toutes les questions
            </button>
            {FAQ_DATA.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-[12.5px] font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  selectedTopic === topic.id
                    ? 'bg-gradient-to-r from-[#C8732A] to-[#B8641C] text-white shadow-md border border-[#E8A63D]'
                    : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/15'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.category.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 2. MAIN CONTENT (ACCORDIONS + ADVISOR SIDEBAR) ================= */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        
        {/* Subtle decorative dot pattern watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#C8732A 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* ── LEFT / MAIN COLUMN: CATEGORIZED ACCORDIONS ── */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Header stats & Expand/Collapse All */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DA] text-xs text-[#6E685F]">
                <div>
                  <span className="font-bold text-[#0E2036]">{totalQuestionsCount}</span> question(s) répertoriée(s)
                  {searchQuery && (
                    <span className="ml-1 text-[#C8732A]">pour &ldquo;{searchQuery}&rdquo;</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExpandAll}
                    className="hover:text-[#C8732A] font-semibold transition-colors cursor-pointer"
                  >
                    Tout déplier
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={handleCollapseAll}
                    className="hover:text-[#C8732A] font-semibold transition-colors cursor-pointer"
                  >
                    Tout replier
                  </button>
                </div>
              </div>

              {filteredTopics.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E4DA] shadow-xs">
                  <span className="text-4xl block mb-3">🔍</span>
                  <h3 className="font-serif font-bold text-lg text-[#0E2036] mb-1">
                    Aucune question trouvée pour &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto">
                    Nos experts restent à votre entière disposition pour vous répondre directement et vous accompagner dans votre projet d&apos;investissement.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedTopic('all'); }}
                    className="px-5 py-2 rounded-full bg-[#0E2036] text-white text-xs font-semibold hover:bg-[#1B365D] transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                filteredTopics.map((topic) => (
                  <div key={topic.id} className="space-y-4">
                    
                    {/* Category Title & Badge */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{topic.icon}</span>
                        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0E2036] tracking-tight">
                          {topic.category}
                        </h2>
                      </div>
                      <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-[#8C6D23] bg-[#FAF5EB] border border-[#E8A63D]/30 px-3 py-1 rounded-full font-bold">
                        {topic.badge}
                      </span>
                    </div>

                    {/* Accordion Items for this Category */}
                    <div className="space-y-3">
                      {topic.items.map((item, idx) => {
                        const itemKey = `${topic.id}-${idx}`;
                        const isOpen = !!openItems[itemKey];

                        return (
                          <div
                            key={itemKey}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                              isOpen
                                ? 'bg-white border-[#C8732A]/70 shadow-[0_8px_30px_rgba(200,115,42,0.08)] ring-1 ring-[#C8732A]/20'
                                : 'bg-white border-[#E8E4DA] hover:border-[#C8732A]/50 shadow-xs'
                            }`}
                          >
                            {/* Question Trigger Button */}
                            <button
                              type="button"
                              onClick={() => toggleItem(itemKey)}
                              className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                              aria-expanded={isOpen}
                            >
                              <span className="font-serif font-bold text-[15px] sm:text-[16px] text-[#0E2036] leading-snug group-hover:text-[#C8732A] transition-colors">
                                {item.q}
                              </span>

                              {/* Right Action Button: Orange circular '×' when open, '+' when closed */}
                              {isOpen ? (
                                <span
                                  className="w-7 h-7 rounded-full bg-[#C8732A] hover:bg-[#D88334] text-white flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm"
                                  title="Fermer"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              ) : (
                                <span
                                  className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-gray-500 group-hover:text-[#C8732A] group-hover:border-[#C8732A]/40 flex items-center justify-center shrink-0 transition-all duration-200"
                                  title="Ouvrir"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                  </svg>
                                </span>
                              )}
                            </button>

                            {/* Answer Content */}
                            {isOpen && (
                              <div className="px-5 sm:px-6 pb-6 pt-1 text-[13.5px] sm:text-[14px] text-[#3E3830] leading-relaxed font-normal border-t border-[#F2EFE8]">
                                <p>{item.a}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))
              )}

            </div>

            {/* ── RIGHT COLUMN: STICKY ADVISOR & DEVIS CARD ── */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              
              {/* Card 1: Assistance Personnalisée */}
              <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0E2036] to-[#0A182A] text-white border border-[#C8732A]/30 shadow-xl overflow-hidden relative">
                
                {/* Ambient Amber Glow */}
                <div 
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none opacity-25 blur-2xl"
                  style={{ background: 'radial-gradient(circle, #E8A63D 0%, transparent 70%)' }}
                />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8732A]/20 border border-[#C8732A]/40 flex items-center justify-center text-[#E8A63D] shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8A63D] font-bold block">
                      ASSISTANCE PERSONNALISÉE
                    </span>
                    <span className="text-[11px] text-white/60">
                      Réponse sous 2h ouvrées
                    </span>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-[17px] text-white leading-snug mb-2">
                  Une question spécifique sur votre investissement ?
                </h3>
                
                <p className="text-[12.5px] sm:text-[13px] text-white/70 leading-relaxed font-normal mb-6">
                  Nos conseillers spécialistes de l&apos;or physique vous accompagnent du lundi au vendredi de 9h à 18h pour structurer votre allocation patrimoniale.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white font-semibold text-[13px] px-6 py-3 rounded-full shadow-md shadow-[#9C4E0F]/25 border border-[#E8A63D]/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                  >
                    <span>Contacter un conseiller</span>
                    <LuxuryArrow className="w-3 h-3 text-white/95 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/devis"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-[13px] px-6 py-3 rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Demander un devis officiel</span>
                    <LuxuryArrow className="w-3 h-3 text-[#E8A63D]" />
                  </Link>
                </div>

              </div>

              {/* Card 2: 4 Reassurance Pillars */}
              <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#0E2036] uppercase tracking-wider">
                  Nos Garanties d&apos;Investissement
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#FAF5EB] text-[#C8732A] flex items-center justify-center shrink-0 font-bold">✓</span>
                    <div>
                      <span className="font-bold text-[#0E2036] block">100% Or Certifié LBMA</span>
                      <span className="text-gray-500 text-[11px]">Fondeurs accrédités Good Delivery sous blister scellé.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#FAF5EB] text-[#C8732A] flex items-center justify-center shrink-0 font-bold">✓</span>
                    <div>
                      <span className="font-bold text-[#0E2036] block">Exonération totale de TVA</span>
                      <span className="text-gray-500 text-[11px]">Or d&apos;investissement net de taxe (Art. 262 ter I du CGI).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#FAF5EB] text-[#C8732A] flex items-center justify-center shrink-0 font-bold">✓</span>
                    <div>
                      <span className="font-bold text-[#0E2036] block">Rachat Garanti au cours spot</span>
                      <span className="text-gray-500 text-[11px]">Liquidité immédiate sous 24-48h sans décote.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#FAF5EB] text-[#C8732A] flex items-center justify-center shrink-0 font-bold">✓</span>
                    <div>
                      <span className="font-bold text-[#0E2036] block">Stockage sécurisé en Suisse</span>
                      <span className="text-gray-500 text-[11px]">Coffres haute sécurité hors banques assurés à 100%.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

