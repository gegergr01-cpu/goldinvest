import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ServicesClient from './ServicesClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Services');
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
  };
}

export default function ServicesPage() {
  return <ServicesClient />;
}
