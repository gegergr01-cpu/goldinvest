import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import ServicesClient from './ServicesClient';
import { buildInternationalAlternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Services');
  const locale = await getLocale();
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: buildInternationalAlternates('/services', locale),
  };
}

export default function ServicesPage() {
  return <ServicesClient />;
}
