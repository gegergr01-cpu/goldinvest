import GoldHero from '@/components/home/GoldHero';
import ReassuranceBar from '@/components/home/ReassuranceBar';
import SelectionGrid from '@/components/home/SelectionGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PreciousMetalsTicker from '@/components/home/PreciousMetalsTicker';
import CtaBanner from '@/components/home/CtaBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { getCachedSettings } from '@/lib/cache';

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const settings = await getCachedSettings();

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* 1. Hero Section */}
        <GoldHero />

        {/* 2. Reassurance Bar (Qualité garantie, Prix compétitifs, etc.) */}
        <ReassuranceBar />

        {/* 3. Notre sélection - Or & Argent */}
        <SelectionGrid />

        {/* 4. Pourquoi nous choisir ? Votre partenaire de confiance */}
        <WhyChooseUs />

        {/* 5. Cours des métaux précieux (Live Ticker) */}
        <PreciousMetalsTicker />

        {/* 6. Bannière CTA - Investissez dès aujourd'hui */}
        <CtaBanner />

        {/* 7. Ils nous font confiance (Témoignages clients) */}
        <TestimonialsSection />
      </main>
    </div>
  );
}
