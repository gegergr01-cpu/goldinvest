import React from 'react';
import type { Metadata } from 'next';
import FaqPageClient from '@/components/faq/FaqPageClient';
import { FAQ_DATA } from '@/lib/faqData';
import { safeJsonLd } from '@/lib/security';

export const metadata: Metadata = {
  title: "Foire Aux Questions (FAQ) | Tout savoir sur l'or d'investissement | Gold Silver Invest",
  description: "Retrouvez les réponses de nos experts : certification LBMA, fiscalité TVA 0%, régimes de plus-values, garde en coffres sécurisés en Suisse et garanties de rachat permanent.",
  alternates: {
    canonical: '/faq',
  },
};

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
