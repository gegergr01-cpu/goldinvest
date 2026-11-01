export type SectionType = 
  | 'GoldHero' 
  | 'ReassuranceBar' 
  | 'SelectionGrid' 
  | 'WhyChooseUs' 
  | 'PreciousMetalsTicker' 
  | 'CtaBanner' 
  | 'Testimonials'
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
      image: "/images/hero-gold-silver.jpg" 
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
    name: 'Pourquoi nous choisir (Votre partenaire de confiance)', 
    enabled: true, 
    settings: { 
      badge: "Pourquoi — nous choisir ?", 
      title: "Votre partenaire de confiance",
      subtitle: "Nous vous accompagnons dans votre investissement avec transparence, sécurité et expertise.",
      btnText: "En savoir plus",
      btnUrl: "/about",
      pillar1_title: "Produits certifiés",
      pillar1_desc: "Authenticité garantie",
      pillar2_title: "Transparence totale",
      pillar2_desc: "Des prix clairs",
      pillar3_title: "Accompagnement personnalisé",
      pillar3_desc: "Une équipe à votre écoute",
      pillar4_title: "Livraison sécurisée",
      pillar4_desc: "Dans toute l’Europe"
    } 
  },
  { 
    id: 'sec_metals_ticker', 
    type: 'PreciousMetalsTicker', 
    name: 'Cours des métaux précieux (Widget)', 
    enabled: true, 
    settings: { 
      title: "Cours des métaux précieux", 
      subtitle: "Actualisé en temps réel",
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
      image: "/images/gold-banner-cta.jpg" 
    } 
  },
  { 
    id: 'sec_testimonials', 
    type: 'Testimonials', 
    name: 'Témoignages (Ils nous font confiance)', 
    enabled: true, 
    settings: { 
      badge: "Ils nous font confiance",
      review1_name: "Thomas D.",
      review1_text: "« Service impeccable et livraison rapide. Je recommande vivement ! »",
      review1_rating: "5",
      review2_name: "Sophie M.",
      review2_text: "« Des prix très compétitifs et une équipe très professionnelle. »",
      review2_rating: "5",
      review3_name: "Pierre L.",
      review3_text: "« Une expérience d’achat parfaite. Je reviendrai sans hésiter. »",
      review3_rating: "5"
    } 
  }
];

