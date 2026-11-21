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

    const contactSettings = await getContactSettings();
    const receiverEmail = contactSettings.formRecipient;

    // Send email to the configured admin/receiver (HTML échappé)
    try {
      const { sendEmail } = await import('@/lib/mailer');
      await sendEmail({
        to: receiverEmail,
        subject: subject ? `[GOLAY INVEST] ${escapeHtml(subject)} — de ${escapeHtml(name)}` : `[GOLAY INVEST] Nouveau message de ${escapeHtml(name)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #0E2036;">Nouveau message reçu depuis le formulaire de contact GOLAY INVEST</h2>
            <p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            ${phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p>` : ''}
            ${subject ? `<p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><strong>Message :</strong><br/><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
            <br/>
            <p style="color: #666; font-size: 13px;"><em>Répondez directement au client à l'adresse ${escapeHtml(email)}.</em></p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[CONTACT] Failed to send email:', emailErr);
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
