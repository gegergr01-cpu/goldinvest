'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getContactSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          'CONTACT_TITLE',
          'CONTACT_TEXT',
          'CONTACT_SLUG',
          'CONTACT_ADDRESS',
          'CONTACT_PHONE',
          'CONTACT_EMAIL_DISPLAY',
          'CONTACT_FORM_RECIPIENT',
          'CONTACT_BOTTOM_TEXT',
          'CONTACT_PHONE_PLACEHOLDER'
        ]
      }
    }
  });

  const settingsMap = settings.reduce((acc: any, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  const isDefaultGermanAct = !settingsMap.CONTACT_TEXT || 
    settingsMap.CONTACT_TEXT.includes('German Telemedia Act') || 
    settingsMap.CONTACT_TEXT.includes('Prestataire De Services');

  const isDefaultTitle = !settingsMap.CONTACT_TITLE || 
    settingsMap.CONTACT_TITLE === 'Content Responsibility';

  return {
    title: (!isDefaultTitle && settingsMap.CONTACT_TITLE)
      ? settingsMap.CONTACT_TITLE
      : 'Conseil & Accompagnement Patrimonial',
    slug: settingsMap.CONTACT_SLUG !== undefined ? settingsMap.CONTACT_SLUG : 'contact',
    text: (!isDefaultGermanAct && settingsMap.CONTACT_TEXT)
      ? settingsMap.CONTACT_TEXT
      : `Nos conseillers et spécialistes en métaux précieux physiques vous accueillent et vous guident avec discrétion et rigueur.\n\nQue vous souhaitiez débuter la constitution d'un portefeuille de précaution en lingots certifiés ou sécuriser des capitaux importants en coffres sécurisés, nous vous apportons un conseil personnalisé, transparent et appuyé sur les cours officiels en direct.\n\nNous sommes à votre entière disposition pour répondre à toutes vos questions relatives à la fiscalité de l'or d'investissement (0% TVA), aux modalités de livraison sécurisée ou au gardiennage en coffres de haute sécurité.`,
    address: settingsMap.CONTACT_ADDRESS !== undefined && settingsMap.CONTACT_ADDRESS.trim() !== ''
      ? settingsMap.CONTACT_ADDRESS
      : 'Chaussée de Tirlemont 110, 5030 Gembloux, BELGIQUE\n100 Pall Mall, St. James\'s, London SW1Y 5NQ, UK',
    phone: settingsMap.CONTACT_PHONE !== undefined && settingsMap.CONTACT_PHONE.trim() !== ''
      ? settingsMap.CONTACT_PHONE
      : '+32 455 76 17 81',
    emailDisplay: settingsMap.CONTACT_EMAIL_DISPLAY !== undefined && settingsMap.CONTACT_EMAIL_DISPLAY.trim() !== ''
      ? settingsMap.CONTACT_EMAIL_DISPLAY
      : 'contact@goldsilverinvest.com',
    formRecipient: settingsMap.CONTACT_FORM_RECIPIENT || 'contact@goldsilverinvest.com',
    bottomText: settingsMap.CONTACT_BOTTOM_TEXT !== undefined ? settingsMap.CONTACT_BOTTOM_TEXT : '',
    phonePlaceholder: settingsMap.CONTACT_PHONE_PLACEHOLDER !== undefined && settingsMap.CONTACT_PHONE_PLACEHOLDER.trim() !== ''
      ? settingsMap.CONTACT_PHONE_PLACEHOLDER
      : '+32 455 76 17 81'
  };
}

export async function updateContactSettings(data: {
  title: string;
  slug: string;
  text: string;
  address: string;
  phone: string;
  emailDisplay: string;
  formRecipient: string;
  bottomText: string;
  phonePlaceholder: string;
}) {
  await requireAdmin();

  try {
    const keys = [
      { key: 'CONTACT_TITLE', value: data.title },
      { key: 'CONTACT_SLUG', value: data.slug },
      { key: 'CONTACT_TEXT', value: data.text },
      { key: 'CONTACT_ADDRESS', value: data.address },
      { key: 'CONTACT_PHONE', value: data.phone },
      { key: 'CONTACT_EMAIL_DISPLAY', value: data.emailDisplay },
      { key: 'CONTACT_FORM_RECIPIENT', value: data.formRecipient },
      { key: 'CONTACT_BOTTOM_TEXT', value: data.bottomText },
      { key: 'CONTACT_PHONE_PLACEHOLDER', value: data.phonePlaceholder }
    ];

    for (const item of keys) {
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value }
      });
    }

    revalidatePath('/contact');
    revalidatePath('/admin/pages/contact');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating contact settings:', error);
    return { error: 'Failed to update contact settings' };
  }
}
