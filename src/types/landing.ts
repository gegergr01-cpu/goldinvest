export type SectionType = 
  | 'GoldHero' 
  | 'ReassuranceBar' 
  | 'SelectionGrid' 
  | 'WhyChooseUs' 
  | 'PreciousMetalsTicker' 
  | 'CtaBanner' 
  | 'Testimonials'
  | 'Faq'
  | 'Hero' 
  | 'BestDeals' 
  | 'BestSeller' 
  | 'LatestBlogs' 
  | 'Newsletter' 
  | 'PromoBanners' 
  | 'ProductGrid' 
  | 'FullWidthBanner';

export interface SectionConfig {
  id: string;
  type: SectionType;
  name: string;
  enabled: boolean;
  settings: any;
}

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { 
    id: 'sec_gold_hero', 
    type: 'GoldHero', 
    name: 'Hero (Investissez dans la valeur sûre)', 
    enabled: true, 
    settings: { 
      title: "Investissez dans la valeur sûre", 
      highlight: "valeur sûre", 
      subtitle: "Pièces d'or, lingots d'or et d'argent au meilleur prix", 
      btnText: "Découvrir notre gamme", 
      btnUrl: "/shop", 
      btn2Text: "Demander un devis",
      btn2Url: "/devis", 
      image: "/images/hero-gold-silver.jpg",
      bgImage: "/images/hero-bg-luxury.jpg",
      bgColor: "#0a0a0a",
      bgOpacity: 0.45,
      highlightColor: "#c59a3f",
      btnBgColor: "#c59a3f",
      btnTextColor: "#000000"
    } 
  },
  { 
    id: 'sec_reassurance', 
    type: 'ReassuranceBar', 
    name: 'Barre de réassurance (4 avantages)', 
    enabled: true, 
    settings: {
      item1_title: 'Qualité garantie',
      item1_desc: 'Des produits certifiés et authentiques',
      item2_title: 'Prix compétitifs',
      item2_desc: 'Un excellent rapport qualité-prix',
      item3_title: 'Livraison rapide',
      item3_desc: 'Partout en Europe',
      item4_title: 'Service client réactif',
      item4_desc: 'Notre équipe à votre écoute'
    } 
  },
  { 
    id: 'sec_selection', 
    type: 'SelectionGrid', 
    name: 'Notre sélection (Or & Argent)', 
    enabled: true, 
    settings: { 
      badge: "Notre sélection", 
      title: "Or & Argent",
      card1_title: "Pièces d'or",
      card1_desc: "Un patrimoine intemporel",
      card1_img: "/images/gold-coins.jpg",
      card1_url: "/shop?category=pieces-dor",
      card2_title: "Lingots d'or",
      card2_desc: "Une valeur sûre",
      card2_img: "/images/gold-bars.jpg",
      card2_url: "/shop?category=lingots-dor",
      card3_title: "Lingots d'argent",
      card3_desc: "Investir autrement",
      card3_img: "/images/silver-bars.jpg",
      card3_url: "/shop?category=lingots-dargent",
      card4_title: "Pièces d'argent",
      card4_desc: "Un investissement accessible",
      card4_img: "/images/silver-coins.jpg",
      card4_url: "/shop?category=pieces-dargent"
    } 
  },
  { 
    id: 'sec_why_choose', 
    type: 'WhyChooseUs', 
    name: 'Nos services (Purchase, Storage, Delivery, Pickup, Buyback)', 
    enabled: true, 
    settings: { 
      badge: "NOS SERVICES EXCLUSIFS", 
      title: "Nos services",
      subtitle: "L'excellence et la maîtrise de vos investissements en métaux précieux.",
      description: "De l'achat de lingots et pièces certifiés au gardiennage en coffre sécurisé hors système bancaire, nous vous offrons un écosystème haut de gamme complet, liquide et transparent.",
      btnText: "Découvrir nos solutions",
      btnUrl: "/services"
    } 
  },
  { 
    id: 'sec_metals_ticker', 
    type: 'PreciousMetalsTicker', 
    name: 'Cours des métaux précieux (Widget)', 
    enabled: true, 
    settings: { 
      mode: "auto",
      title: "Cours des métaux précieux", 
      subtitle: "Actualisé en temps réel",
      defaultUnit: "oz",
      showCharts: true,
      bgColor: "#fcfbf9",
      gold_price: "€ 2 720,45", 
      gold_change: "+0,42%", 
      silver_price: "€ 32,17", 
      silver_change: "+1,12%",
      btnText: "Voir les cours en détail",
      btnUrl: "/shop"
    } 
  },
  { 
    id: 'sec_cta_banner', 
    type: 'CtaBanner', 
    name: 'Bannière CTA (Investissez dès aujourd’hui)', 
    enabled: true, 
    settings: { 
      title: "Investissez dès aujourd’hui", 
      subtitle: "Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent.",
      btnText: "Découvrir notre gamme", 
      btnUrl: "/shop", 
      btn2Text: "Demander un devis",
      btn2Url: "/devis",
      image: "/images/gold-banner-cta.jpg" 
    } 
  },
  { 
    id: 'sec_testimonials', 
    type: 'Testimonials', 
    name: 'Témoignages (Ils nous font confiance)', 
    enabled: true, 
    settings: { 
      badge: "AVIS CLIENTS VÉRIFIÉS",
      title: "Ils nous font confiance",
      subtitle: "Découvrez les retours d’expérience de nos clients investisseurs en métaux précieux physiques.",
      rating_score: "4.9 / 5",
      investors_text: "Plus de 450 investisseurs accompagnés",
      review1_name: "Thomas D.",
      review1_city: "Paris, France",
      review1_asset: "Lingot d'Or 100 g C.Hafner",
      review1_text: "« Première commande de lingots d’or scellés LBMA. Colis ultra-discret, livraison sécurisée avec signature et certificat de conformité parfait. Un service d’un professionnalisme exemplaire. »",
      review1_rating: "5",
      review1_date: "Il y a 3 jours",
      review2_name: "Sophie M.",
      review2_city: "Genève, Suisse",
      review2_asset: "20 Francs Napoléon III & Krugerrand",
      review2_text: "« Conseillers très réactifs et à l’écoute. Les cours en direct sont limpides et sans frais cachés. Les pièces sont arrivées sous pochettes sécurisées scellées sous 48 heures. »",
      review2_rating: "5",
      review2_date: "Il y a 1 semaine",
      review3_name: "Pierre L.",
      review3_city: "Bruxelles, Belgique",
      review3_asset: "Lingots d'Argent 1 kg LBMA",
      review3_text: "« Excellent accompagnement pour la diversification de mon patrimoine. Prix très compétitifs face aux comptoirs bancaires traditionnels. Je recommande les yeux fermés. »",
      review3_rating: "5",
      review3_date: "Il y a 2 semaines"
    } 
  },
  {
    id: 'sec_faq',
    type: 'Faq',
    name: 'Foire Aux Questions (FAQ)',
    enabled: true,
    settings: {
      badge: "QUESTIONS FRÉQUENTES",
      title: "Tout savoir sur l'investissement dans les métaux précieux",
      subtitle: "Retrouvez les réponses de nos experts sur la certification LBMA, la fiscalité, la livraison sécurisée et nos garanties de rachat.",
      cta_title: "Vous avez une question spécifique sur votre investissement ?",
      cta_desc: "Nos conseillers spécialistes de l'or physique vous accompagnent du lundi au vendredi.",
      cta_btn_text: "Contacter un conseiller",
      cta_btn_url: "/contact"
    }
  }
];

