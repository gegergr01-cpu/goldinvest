import Hero from '@/components/home/Hero';
import BestDeals from '@/components/home/BestDeals';
import BestSeller from '@/components/home/BestSeller';
import LatestBlogs from '@/components/home/LatestBlogs';
import Newsletter from '@/components/home/Newsletter';
import PromoBanners from '@/components/home/PromoBanners';
import ProductGrid from '@/components/home/ProductGrid';
import FullWidthBanner from '@/components/home/FullWidthBanner';

import GoldHero from '@/components/home/GoldHero';
import ReassuranceBar from '@/components/home/ReassuranceBar';
import SelectionGrid from '@/components/home/SelectionGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PreciousMetalsTicker from '@/components/home/PreciousMetalsTicker';
import CtaBanner from '@/components/home/CtaBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';

import { SectionConfig, DEFAULT_SECTIONS } from '@/types/landing';
import PreviewSectionWrapper from '@/components/admin/PreviewSectionWrapper';
import { getSettings } from '@/actions/settings';
import { getHeroDailyCards } from '@/lib/heroDailyProducts';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PreviewPage() {
  const [draftLayoutSetting, heroDailyCards] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'PREVIEW_LAYOUT_DRAFT' } }),
    getHeroDailyCards(),
  ]);

  let layoutCookieStr = draftLayoutSetting?.value || '';

  let layout: SectionConfig[] = DEFAULT_SECTIONS;
  if (layoutCookieStr) {
    try {
      const parsed = typeof layoutCookieStr === 'string' ? JSON.parse(layoutCookieStr) : layoutCookieStr;
      if (Array.isArray(parsed) && parsed.length > 0) {
        layout = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        layout = parsed.sections;
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    const settings = await getSettings();
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
        console.error(e);
      }
    }
  }

  if (!Array.isArray(layout) || layout.length === 0) {
    layout = DEFAULT_SECTIONS;
  }

  const activeSections = layout.filter((s) => s && s.enabled);

  const renderSection = (section: SectionConfig) => {
    let content = null;
    switch (section.type) {
      case 'GoldHero':
        content = <GoldHero config={section.settings} dailyCards={heroDailyCards} />;
        break;
      case 'ReassuranceBar':
        content = <ReassuranceBar config={section.settings} />;
        break;
      case 'SelectionGrid':
        content = <SelectionGrid config={section.settings} />;
        break;
      case 'WhyChooseUs':
        content = <WhyChooseUs config={section.settings} />;
        break;
      case 'PreciousMetalsTicker':
        content = <PreciousMetalsTicker config={section.settings} />;
        break;
      case 'CtaBanner':
        content = <CtaBanner config={section.settings} />;
        break;
      case 'Testimonials':
        content = <TestimonialsSection config={section.settings} />;
        break;
      case 'Faq':
        content = <FaqSection config={section.settings} />;
        break;

      // Legacy / alternate sections
      case 'Hero':
        content = <Hero config={section.settings} isPreview={true} sectionId={section.id} />;
        break;
      case 'BestDeals':
        content = <BestDeals config={section.settings} />;
        break;
      case 'BestSeller':
        content = <BestSeller config={section.settings} />;
        break;
      case 'LatestBlogs':
        content = <LatestBlogs config={section.settings} />;
        break;
      case 'Newsletter':
        content = <Newsletter config={section.settings} />;
        break;
      case 'PromoBanners':
        content = <PromoBanners config={section.settings} />;
        break;
      case 'ProductGrid':
        content = <ProductGrid config={section.settings} />;
        break;
      case 'FullWidthBanner':
        content = <FullWidthBanner config={section.settings} />;
        break;
      default:
        return null;
    }

    return (
      <PreviewSectionWrapper key={section.id} sectionId={section.id} sectionName={section.name || section.type}>
        {content}
      </PreviewSectionWrapper>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {activeSections.length > 0 ? (
          activeSections.map(renderSection)
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">Aucune section active.</div>
        )}
      </main>
    </div>
  );
}
