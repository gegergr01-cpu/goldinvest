import GoldHero from '@/components/home/GoldHero';
import ReassuranceBar from '@/components/home/ReassuranceBar';
import SelectionGrid from '@/components/home/SelectionGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PreciousMetalsTicker from '@/components/home/PreciousMetalsTicker';
import CtaBanner from '@/components/home/CtaBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';

import Hero from '@/components/home/Hero';
import BestDeals from '@/components/home/BestDeals';
import BestSeller from '@/components/home/BestSeller';
import LatestBlogs from '@/components/home/LatestBlogs';
import Newsletter from '@/components/home/Newsletter';
import PromoBanners from '@/components/home/PromoBanners';
import ProductGrid from '@/components/home/ProductGrid';
import FullWidthBanner from '@/components/home/FullWidthBanner';

import { getCachedSettings } from '@/lib/cache';
import { getHeroDailyCards } from '@/lib/heroDailyProducts';
import { SectionConfig, DEFAULT_SECTIONS } from '@/types/landing';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [settings, heroDailyCards] = await Promise.all([
    getCachedSettings(),
    getHeroDailyCards(),
  ]);

  let layout: SectionConfig[] = DEFAULT_SECTIONS;
  if (settings && settings.HOMEPAGE_LAYOUT) {
    try {
      const raw = settings.HOMEPAGE_LAYOUT;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed) && parsed.length > 0) {
        layout = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        layout = parsed.sections;
      }
    } catch (e) {
      console.error('Error parsing HOMEPAGE_LAYOUT:', e);
      layout = DEFAULT_SECTIONS;
    }
  }

  if (!Array.isArray(layout) || layout.length === 0) {
    layout = DEFAULT_SECTIONS;
  }

  // Ensure SilverDeals is included right after BestDeals if a custom layout only had Gold
  const hasBestDeals = layout.some((s) => s && s.type === 'BestDeals' && s.settings?.metal !== 'silver');
  const hasSilverDeals = layout.some((s) => s && (s.type === 'SilverDeals' || (s.type === 'BestDeals' && s.settings?.metal === 'silver')));

  if (hasBestDeals && !hasSilverDeals) {
    const goldIdx = layout.findIndex((s) => s && s.type === 'BestDeals' && s.settings?.metal !== 'silver');
    const autoSilverSection: SectionConfig = {
      id: 'sec_silver_deals_auto',
      type: 'SilverDeals',
      name: "L'Argent d'Investissement (Pièces & Lingots)",
      enabled: true,
      settings: {
        metal: 'silver',
        badge: "L'ARGENT D'INVESTISSEMENT",
        title: "Nos Produits d'Argent d'Investissement",
        highlight: "Argent d'Investissement",
        subtitle: "Pièces d'argent pures 999‰ et lingots certifiés LBMA sous blister scellé pour diversifier votre patrimoine.",
        cardBadge: "Investissement",
        tab1_title: "Pièces d'argent",
        tab2_title: "Lingots d'argent",
        tab1_btn_text: "Voir toutes les pièces d'argent",
        tab1_btn_url: "/shop?category=pieces-dargent",
        tab2_btn_text: "Voir tous les lingots d'argent",
        tab2_btn_url: "/shop?category=lingots-dargent",
        maxProducts: '4'
      }
    };
    layout.splice(goldIdx + 1, 0, autoSilverSection);
  }

  // Filter only enabled sections
  const activeSections = layout.filter((s) => s && s.enabled);

  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'GoldHero':
        return <GoldHero key={section.id} config={section.settings} dailyCards={heroDailyCards} />;
      case 'ReassuranceBar':
        return <ReassuranceBar key={section.id} config={section.settings} />;
      case 'SelectionGrid':
        return <SelectionGrid key={section.id} config={section.settings} />;
      case 'WhyChooseUs':
        return <WhyChooseUs key={section.id} config={section.settings} />;
      case 'PreciousMetalsTicker':
        return <PreciousMetalsTicker key={section.id} config={section.settings} />;
      case 'CtaBanner':
        return <CtaBanner key={section.id} config={section.settings} />;
      case 'Testimonials':
        return <TestimonialsSection key={section.id} config={section.settings} />;
      case 'Faq':
        return <FaqSection key={section.id} config={section.settings} />;

      // Product Showcases with Tabs
      case 'BestDeals':
        return <BestDeals key={section.id} config={section.settings} />;
      case 'SilverDeals':
        return <BestDeals key={section.id} config={{ ...section.settings, metal: 'silver' }} />;

      // Legacy / alternate sections
      case 'Hero':
        return <Hero key={section.id} config={section.settings} />;
      case 'BestSeller':
        return <BestSeller key={section.id} config={section.settings} />;
      case 'LatestBlogs':
        return <LatestBlogs key={section.id} config={section.settings} />;
      case 'Newsletter':
        return <Newsletter key={section.id} config={section.settings} />;
      case 'PromoBanners':
        return <PromoBanners key={section.id} config={section.settings} />;
      case 'ProductGrid':
        return <ProductGrid key={section.id} config={section.settings} />;
      case 'FullWidthBanner':
        return <FullWidthBanner key={section.id} config={section.settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E2036]">
      <main>
        {activeSections.map(renderSection)}
      </main>
    </div>
  );
}
