'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getSettings } from './settings';
import { getContactSettings } from './contactSettings';
import { getTranslations } from 'next-intl/server';
import { escapeHtml } from '@/lib/security';
import crypto from 'crypto';
import { SITE_URL } from '@/lib/site';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { 
  sendAdminContactNotification, 
  sendClientContactConfirmation 
} from '@/lib/mailer';

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const CONTACT_SETTING_KEY = 'CONTACT_MESSAGES_REGISTRY_JSON';

/**
 * Get all contact form messages (for Admin panel)
 */
export async function getContactMessages(): Promise<ContactMessageRecord[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: CONTACT_SETTING_KEY }
    });
    if (!setting || !setting.value) return [];
    const list: ContactMessageRecord[] = JSON.parse(setting.value);
    return Array.isArray(list) 
      ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
  } catch (err) {
    console.error('[CONTACT] Failed to fetch contact messages registry:', err);
    return [];
  }
}

/**
 * Mark a contact message as read / unread
 */
export async function markContactMessageAsRead(id: string, isRead = true): Promise<{ success: boolean }> {
  try {
    const all = await getContactMessages();
    const target = all.find(m => m.id === id);
    if (target) {
      target.isRead = isRead;
      await prisma.setting.upsert({
        where: { key: CONTACT_SETTING_KEY },
        create: { key: CONTACT_SETTING_KEY, value: JSON.stringify(all) },
        update: { value: JSON.stringify(all) },
      });
    }
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * Delete a contact message
 */
export async function deleteContactMessage(id: string): Promise<{ success: boolean }> {
  try {
    const all = await getContactMessages();
    const filtered = all.filter(m => m.id !== id);
    await prisma.setting.upsert({
      where: { key: CONTACT_SETTING_KEY },
      create: { key: CONTACT_SETTING_KEY, value: JSON.stringify(filtered) },
      update: { value: JSON.stringify(filtered) },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * Client submits contact form
 */
export async function submitContactMessage(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rateLimit = await checkRateLimit(`contact_${ip}`, 5, 600); // 5 messages per 10 minutes per IP
    if (!rateLimit.success) {
      return { error: 'Too many requests. Please wait a few minutes before sending another message.' };
    }

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const locale = String(formData.get('locale') || '').trim() || 'fr';

    if (!name || !email || !message) {
      const t = await getTranslations('Contact');
      return { error: t('missing_fields') };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Please provide a valid email address.' };
    }

    // Limit field lengths to prevent abuse
    if (name.length > 200 || email.length > 254 || (subject && subject.length > 500) || message.length > 5000) {
      const t = await getTranslations('Contact');
      return { error: t('fields_too_long') };
    }

    // 1. SAVE MESSAGE TO DB REGISTRY (guarantees message is never lost)
    const messageId = `MSG-${Date.now().toString().slice(-6)}`;
    const newRecord: ContactMessageRecord = {
      id: messageId,
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    try {
      const all = await getContactMessages();
      all.unshift(newRecord);
      if (all.length > 200) all.pop(); // keep last 200 messages
      await prisma.setting.upsert({
        where: { key: CONTACT_SETTING_KEY },
        create: { key: CONTACT_SETTING_KEY, value: JSON.stringify(all) },
        update: { value: JSON.stringify(all) },
      });
    } catch (saveErr) {
      console.error('[CONTACT] Failed to save contact message to registry:', saveErr);
    }

    // 2. CREATE IN-APP NOTIFICATION FOR ADMIN
    try {
      await prisma.notification.create({
        data: {
          isAdmin: true,
          type: 'SYSTEM',
          message: `Nouveau message de contact de ${name} (${email}) : ${subject || 'Demande générale'}`,
          link: '/admin/pages/contact',
        },
      });
    } catch (notifErr) {
      console.error('[CONTACT] Failed to create in-app notification:', notifErr);
    }

    // 3. SEND EMAIL TO ADMIN (info@golayinvest.com) with customer reply-to
    try {
      await sendAdminContactNotification({
        name,
        email,
        phone,
        subject,
        message,
        date: new Date(),
      });
    } catch (emailErr) {
      console.error('[CONTACT] Failed to send email alert to admin:', emailErr);
    }

    // 4. SEND CONFIRMATION / AUTO-REPLY TO CUSTOMER
    try {
      await sendClientContactConfirmation({
        name,
        email,
        subject,
      }, locale);
    } catch (clientEmailErr) {
      console.error('[CONTACT] Failed to send acknowledgment email to client:', clientEmailErr);
    }

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error('Contact submission error:', error);
    const t = await getTranslations('Contact');
    return { error: t('error_sending') };
  }
}

export async function submitNewsletter(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rateLimit = await checkRateLimit(`newsletter_${ip}`, 5, 3600); // 5 subscriptions per hour per IP
    if (!rateLimit.success) {
      return { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' };
    }

    const email = String(formData.get('email') || '').trim().toLowerCase();

    if (!email) {
      return { error: 'Veuillez entrer une adresse e-mail valide.' };
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return { error: 'Adresse e-mail invalide.' };
    }

    const cookieStore = await cookies();
    const locale = String(formData.get('locale') || '').trim() || cookieStore.get('NEXT_LOCALE')?.value || 'fr';

    const secret = process.env.NEWSLETTER_SECRET || process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRON_SECRET || process.env.DATABASE_URL || 'fallback-newsletter-key';
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const payload = `${email}|${expiry}|${locale}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}|${signature}`).toString('base64');
    const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

    try {
      const { sendNewsletterDoubleOptInEmail } = await import('@/lib/mailer');
      await sendNewsletterDoubleOptInEmail(email, confirmUrl, locale);
    } catch (emailErr) {
      console.error('[NEWSLETTER] Failed to send opt-in email:', emailErr);
    }

    const successMessages: Record<string, string> = {
      fr: 'Veuillez vérifier votre boîte de réception pour confirmer votre inscription à la newsletter (code privilège 25 € offert).',
      en: 'Please check your inbox to confirm your newsletter subscription (and receive your €25 welcome voucher).',
      de: 'Bitte überprüfen Sie Ihren Posteingang, um Ihre Newsletter-Anmeldung zu bestätigen (25 € Gutschein inklusive).',
      es: 'Por favor, compruebe su bandeja de entrada para confirmar su suscripción (cupón de bienvenida de 25 € incluido).',
      it: 'Controlla la tua casella di posta per confermare l\'iscrizione (buono di benvenuto di 25 € incluso).',
      nl: 'Controleer uw inbox om uw aanmelding te bevestigen (inclusief welkomstvoucher van € 25).',
      pt: 'Por favor, verifique a sua caixa de entrada para confirmar a inscrição (cupão de boas-vindas de 25 € incluído).',
      da: 'Tjek venligst din indbakke for at bekræfte din tilmelding (inklusive 25 € velkomstkupon).',
      hu: 'Kérjük, ellenőrizze a beérkező leveleit a feliratkozás megerősítéséhez (25 € üdvözlő kuponnal).',
    };

    return { success: true, message: successMessages[locale] || successMessages.fr };
  } catch (error) {
    console.error('Newsletter submission error:', error);
    return { error: "Une erreur est survenue lors de l'inscription." };
  }
}
