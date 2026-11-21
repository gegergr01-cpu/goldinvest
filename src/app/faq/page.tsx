import React from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import FaqPageClient from '@/components/faq/FaqPageClient';
import { FAQ_DATA } from '@/lib/faqData';
import { safeJsonLd } from '@/lib/security';
import { buildInternationalAlternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: "Foire Aux Questions (FAQ) | Tout savoir sur l'or d'investissement | GOLAY INVEST",
    description: "Retrouvez les réponses de nos experts : certification LBMA, fiscalité TVA 0%, régimes de plus-values, garde en coffres sécurisés en Suisse et garanties de rachat permanent.",
    alternates: buildInternationalAlternates('/faq', locale),
  };
}

export default function FaqPage() {
  // Extract all Q&A for Schema.org FAQPage rich snippets
  const allFaqItems = FAQ_DATA.flatMap(t => t.items);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(faqSchema),
        }}
      />
      <FaqPageClient />
    </>
  );
}
