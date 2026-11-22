import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import {
  EMAIL_TRANSLATIONS,
  normalizeEmailLocale,
  formatEmailPrice,
  formatEmailDate,
  type EmailLocale,
} from './emailTranslations';

// HTML escape utility to prevent XSS in email templates
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_STORE_NAME = 'GOLAY INVEST';
const DEFAULT_STORE_EMAIL = 'info@golayinvest.com';
const DEFAULT_STORE_ADDRESS = 'Chaussée de Tirlemont 110, 5030 Gembloux, Belgique • 100 Pall Mall, London SW1Y 5NQ, UK';

// Fetch SMTP settings and store brand info from DB
async function getTransporter() {
  const settingsDb = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          'SMTP_HOST',
          'SMTP_PORT',
          'SMTP_USER',
          'SMTP_PASS',
          'SMTP_FROM',
          'HEADER_LOGO_IMAGE',
          'NEXT_PUBLIC_STORE_NAME',
          'STORE_ADDRESS',
          'CONTACT_ADDRESS',
          'CONTACT_RECEIVER_EMAIL',
          'CONTACT_FORM_RECIPIENT',
        ],
      },
    },
  });

  const settings = settingsDb.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);

  if (!settings.SMTP_HOST || !settings.SMTP_USER || !settings.SMTP_PASS) {
    throw new Error('SMTP configuration is missing in the database.');
  }

  const transporter = nodemailer.createTransport({
    host: settings.SMTP_HOST,
    port: parseInt(settings.SMTP_PORT || '465', 10),
    secure: settings.SMTP_PORT === '465' || settings.SMTP_PORT === undefined,
    auth: {
      user: settings.SMTP_USER,
      pass: settings.SMTP_PASS,
    },
  });

  const storeName = settings.NEXT_PUBLIC_STORE_NAME || process.env.NEXT_PUBLIC_STORE_NAME || DEFAULT_STORE_NAME;
  const storeEmail = settings.CONTACT_RECEIVER_EMAIL || settings.CONTACT_FORM_RECIPIENT || DEFAULT_STORE_EMAIL;
  const defaultFromEmail = (storeEmail.split(',')[0] || DEFAULT_STORE_EMAIL).trim();
  const from = settings.SMTP_FROM || `"${storeName}" <${defaultFromEmail}>`;
  const logo = settings.HEADER_LOGO_IMAGE || '';
  const storeAddress = settings.STORE_ADDRESS || settings.CONTACT_ADDRESS || DEFAULT_STORE_ADDRESS;

  return { transporter, from, logo, storeName, storeEmail, storeAddress };
}

// General email sender
export async function sendEmail({
  to,
  subject,
  html,
  attachments,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
  replyTo?: string;
}) {
  try {
    const { transporter, from } = await getTransporter();

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
      replyTo,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error };
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Client Order Confirmation (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendClientOrderConfirmation(
  order: any,
  userEmail: string,
  userName?: string,
  clientLocale?: string
) {
  try {
    const { logo, from, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      from: `"${DEFAULT_STORE_NAME}" <${DEFAULT_STORE_EMAIL}>`,
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    let metadata: any = {};
    if (order.destinationAddress) {
      try {
        metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
      } catch (e) {}
    }

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || metadata?.locale);
    const T = EMAIL_TRANSLATIONS[locale].orderConfirmation;
    const C = EMAIL_TRANSLATIONS[locale].common;
    const currency = (metadata?.currency as string) || 'EUR';

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 40px;"></div>`
      : '';

    const subTotal = metadata?.subTotal || order.orderItems?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || order.total;
    const shippingCostStr = metadata?.shippingCost === 0
      ? T.freeShipping
      : (metadata?.shippingCost ? formatEmailPrice(metadata.shippingCost, currency, locale) : formatEmailPrice(0, currency, locale));
    const shippingMethod = metadata?.shippingMethodName ? `(${metadata.shippingMethodName})` : '';

    // Addresses
    const b = metadata?.billing || {};
    const s = metadata?.shipping || b;
    const billingName = escapeHtml(`${b.firstName || ''} ${b.lastName || ''}`.trim() || userName || C.defaultCustomer);
    const shippingName = escapeHtml(`${s.firstName || ''} ${s.lastName || ''}`.trim()) || billingName;
    const billingAddressHtml = `${escapeHtml(b.address1 || '')}<br/>${escapeHtml(b.postalCode || '')} ${escapeHtml(b.city || '')}${b.country ? `, ${escapeHtml(b.country)}` : ''}`;
    const shippingAddressHtml = `${escapeHtml(s.address1 || '')}<br/>${escapeHtml(s.postalCode || '')} ${escapeHtml(s.city || '')}${s.country ? `, ${escapeHtml(s.country)}` : ''}`;

    // Payment Method mapping
    const pmKey = (order.paymentMethod as 'BANK_TRANSFER' | 'STRIPE' | 'PAYPAL') || 'BANK_TRANSFER';
    const paymentMethodStr = T.paymentMethods[pmKey] || order.paymentMethod;

    const orderId = order.id.slice(-6).toUpperCase();
    const formattedDate = formatEmailDate(new Date(order.createdAt), locale);

    const itemsHtml = order.orderItems?.map((item: any) => {
      let imageUrl = '';
      if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
        imageUrl = typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url;
      } else if (typeof item.product?.images === 'string') {
        try {
          const imgs = JSON.parse(item.product.images);
          if (imgs.length > 0) imageUrl = imgs[0];
        } catch (e) {}
      }

      const safeImageUrl = imageUrl && /^https?:\/\//i.test(imageUrl) ? escapeHtml(imageUrl) : '';
      const imgTag = safeImageUrl
        ? `<img src="${safeImageUrl}" alt="Product" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />`
        : '';

      const sku = item.product?.sku ? `(#${escapeHtml(item.product.sku)})` : '';

      return `
        <tr style="border-bottom: 1px dashed #eee;">
          <td style="padding: 15px 0;">
            <table style="width: 100%; border: none;">
              <tr>
                <td style="width: 65px; vertical-align: middle;">${imgTag}</td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 13px; color: #1a1a1a; font-weight: 500;">${escapeHtml(item.product?.title || T.productCol)}</span><br/>
                  ${sku ? `<span style="font-size: 12px; color: #666;">${sku}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
          <td style="padding: 15px 0; text-align: center; vertical-align: middle; color: #666; font-size: 13px;">×${item.quantity}</td>
          <td style="padding: 15px 0; text-align: right; vertical-align: middle; color: #1a1a1a; font-size: 13px; font-weight: 500;">${formatEmailPrice(item.price, currency, locale)}</td>
        </tr>
      `;
    }).join('') || '';

    // Bank Details logic
    let bankDetailsHtml = '';
    if (order.paymentMethod === 'BANK_TRANSFER') {
      const dbSettings = await prisma.setting.findMany({
        where: {
          key: {
            in: [
              'BANK_TRANSFER_ACCOUNT_HOLDER',
              'BANK_TRANSFER_IBAN',
              'BANK_TRANSFER_BIC',
              'BANK_TRANSFER_BANK_NAME',
              'BANK_TRANSFER_INSTRUCTIONS',
            ],
          },
        },
      });
      const settings = dbSettings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);

      bankDetailsHtml = `
        <div style="background-color: #fbf8f2; border: 1px solid #e7d8c0; border-radius: 6px; padding: 20px; margin-top: 25px; margin-bottom: 25px;">
          <h4 style="margin-top: 0; margin-bottom: 12px; color: #78350f; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${T.bankTransfer.title}</h4>
          <p style="font-size: 13px; color: #451a03; margin-bottom: 15px;">${T.bankTransfer.instructions(orderId)}</p>
          <table style="width: 100%; font-size: 13px; color: #1a1a1a; line-height: 1.8;">
            ${settings.BANK_TRANSFER_ACCOUNT_HOLDER ? `<tr><td style="width: 160px; color: #78350f;">${T.bankTransfer.accountHolder}</td><td><strong>${escapeHtml(settings.BANK_TRANSFER_ACCOUNT_HOLDER)}</strong></td></tr>` : ''}
            ${settings.BANK_TRANSFER_IBAN ? `<tr><td style="color: #78350f;">${T.bankTransfer.iban}</td><td><strong style="font-family: monospace; letter-spacing: 1px;">${escapeHtml(settings.BANK_TRANSFER_IBAN)}</strong></td></tr>` : ''}
            ${settings.BANK_TRANSFER_BIC ? `<tr><td style="color: #78350f;">${T.bankTransfer.bic}</td><td><strong style="font-family: monospace;">${escapeHtml(settings.BANK_TRANSFER_BIC)}</strong></td></tr>` : ''}
            ${settings.BANK_TRANSFER_BANK_NAME ? `<tr><td style="color: #78350f;">${T.bankTransfer.bank}</td><td><strong>${escapeHtml(settings.BANK_TRANSFER_BANK_NAME)}</strong></td></tr>` : ''}
          </table>
        </div>
      `;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: #0E2036; margin-top: 0; margin-bottom: 12px;">${T.title(orderId)}</h1>
        <p style="font-size: 14px; color: #475569;">${T.greeting(escapeHtml(userName || billingName))}</p>
        <p style="font-size: 13px; color: #64748B;">${T.intro(formattedDate)}</p>
        
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 30px; margin-bottom: 5px; color: #0E2036;">${T.summaryTitle}</h3>
        <p style="color: #C8732A; font-size: 12px; font-weight: bold; margin-top: 0; margin-bottom: 20px;">${T.orderSubtitle(orderId, formattedDate)}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead style="text-align: left; border-bottom: 1px solid #E2E8F0;">
            <tr>
              <th style="padding-bottom: 10px; font-weight: bold; font-size: 12px; color: #475569;">${T.productCol}</th>
              <th style="padding-bottom: 10px; text-align: center; font-weight: bold; font-size: 12px; color: #475569;">${T.qtyCol}</th>
              <th style="padding-bottom: 10px; text-align: right; font-weight: bold; font-size: 12px; color: #475569;">${T.priceCol}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 15px;">
          <table style="width: 100%; font-size: 13px; color: #475569; line-height: 2;">
            <tr>
              <td>${T.subtotal}</td>
              <td style="text-align: right; font-weight: 500;">${formatEmailPrice(subTotal, currency, locale)}</td>
            </tr>
            <tr>
              <td>${T.shipping} ${shippingMethod}</td>
              <td style="text-align: right; font-weight: 500;">${shippingCostStr}</td>
            </tr>
            <tr style="color: #0E2036; font-size: 15px; border-top: 1px solid #E2E8F0;">
              <td><strong>${T.total}</strong></td>
              <td style="text-align: right; color: #C8732A;"><strong style="font-size: 17px;">${formatEmailPrice(order.total, currency, locale)}</strong></td>
            </tr>
            <tr>
              <td>${T.paymentMethodLabel}</td>
              <td style="text-align: right;">${paymentMethodStr}</td>
            </tr>
          </table>
        </div>

        ${bankDetailsHtml}

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #0E2036;">
          ${T.invoiceAttached}
        </div>

        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-top: 25px; padding-top: 20px; padding-bottom: 20px;">
          <table style="width: 100%; font-size: 12px; color: #333; line-height: 1.5;">
            <tr>
              <td style="vertical-align: top; width: 50%;">
                <strong style="font-size: 13px; color: #0E2036;">${T.billingAddress}</strong><br/>
                <div style="margin-top: 8px;">
                  ${billingName}<br/>
                  ${billingAddressHtml}<br/>
                  ${b.phone ? `<span style="color: #C8732A;">${escapeHtml(b.phone)}</span><br/>` : ''}
                  ${b.email ? `<a href="mailto:${b.email}" style="color: #2563eb; text-decoration: underline;">${escapeHtml(b.email)}</a>` : ''}
                </div>
              </td>
              <td style="vertical-align: top; width: 50%;">
                <strong style="font-size: 13px; color: #0E2036;">${T.shippingAddress}</strong><br/>
                <div style="margin-top: 8px;">
                  ${shippingName}<br/>
                  ${shippingAddressHtml}<br/>
                  ${s.phone ? `<span style="color: #C8732A;">${escapeHtml(s.phone)}</span>` : ''}
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px; font-size: 13px; color: #475569;">
          <p>${T.helpText(storeEmail)}</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    const { generateInvoicePDF } = await import('./pdfGenerator');
    let pdfAttachment: any = null;
    try {
      const pdfBuffer = await generateInvoicePDF(order, locale);
      pdfAttachment = {
        filename: `facture-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      };
    } catch (pdfErr) {
      console.error('Failed to generate PDF invoice', pdfErr);
    }

    return sendEmail({
      to: userEmail,
      subject: T.subject(orderId, storeName),
      html,
      attachments: pdfAttachment ? [pdfAttachment] : [],
    });
  } catch (e) {
    console.error('[sendClientOrderConfirmation] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Admin New Order Notification
// ─────────────────────────────────────────────────────────────
export async function sendAdminOrderNotification(order: any, adminEmail: string, customerDetails: any) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 40px;"></div>`
      : '';

    let metadata: any = {};
    if (order.destinationAddress) {
      try {
        metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
      } catch (e) {}
    }

    const currency = (metadata?.currency as string) || 'EUR';
    const subTotal = metadata?.subTotal || order.orderItems?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || order.total;
    const shippingCostStr = metadata?.shippingCost === 0
      ? 'Gratuit'
      : (metadata?.shippingCost ? formatEmailPrice(metadata.shippingCost, currency, 'fr') : formatEmailPrice(0, currency, 'fr'));
    const shippingMethod = metadata?.shippingMethodName ? `(${metadata.shippingMethodName})` : '';

    const b = metadata?.billing || {};
    const s = metadata?.shipping || b;
    const billingName = escapeHtml(`${b.firstName || ''} ${b.lastName || ''}`.trim() || customerDetails?.name || 'Client');
    const shippingName = escapeHtml(`${s.firstName || ''} ${s.lastName || ''}`.trim()) || billingName;
    const billingAddressHtml = `${escapeHtml(b.address1 || '')}<br/>${escapeHtml(b.postalCode || '')} ${escapeHtml(b.city || '')}${b.country ? `, ${escapeHtml(b.country)}` : ''}`;
    const shippingAddressHtml = `${escapeHtml(s.address1 || '')}<br/>${escapeHtml(s.postalCode || '')} ${escapeHtml(s.city || '')}${s.country ? `, ${escapeHtml(s.country)}` : ''}`;

    let paymentMethodStr = order.paymentMethod;
    if (paymentMethodStr === 'BANK_TRANSFER') paymentMethodStr = 'Virement bancaire';
    if (paymentMethodStr === 'STRIPE') paymentMethodStr = 'Carte bancaire (Stripe)';
    if (paymentMethodStr === 'PAYPAL') paymentMethodStr = 'PayPal';

    const orderId = order.id.slice(-6).toUpperCase();
    const formattedDate = formatEmailDate(new Date(order.createdAt), 'fr');

    const itemsHtml = order.orderItems?.map((item: any) => {
      let imageUrl = '';
      if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
        imageUrl = typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url;
      } else if (typeof item.product?.images === 'string') {
        try {
          const imgs = JSON.parse(item.product.images);
          if (imgs.length > 0) imageUrl = imgs[0];
        } catch (e) {}
      }

      const safeImageUrl = imageUrl && /^https?:\/\//i.test(imageUrl) ? escapeHtml(imageUrl) : '';
      const imgTag = safeImageUrl
        ? `<img src="${safeImageUrl}" alt="Product" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />`
        : '';
      const sku = item.product?.sku ? `(#${escapeHtml(item.product.sku)})` : '';

      return `
        <tr style="border-bottom: 1px dashed #eee;">
          <td style="padding: 12px 0;">
            <table style="width: 100%; border: none;">
              <tr>
                <td style="width: 65px; vertical-align: middle;">${imgTag}</td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 13px; color: #1a1a1a; font-weight: 500;">${escapeHtml(item.product?.title || 'Produit')}</span><br/>
                  ${sku ? `<span style="font-size: 12px; color: #666;">${sku}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
          <td style="padding: 12px 0; text-align: center; vertical-align: middle; color: #666; font-size: 13px;">×${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; vertical-align: middle; color: #1a1a1a; font-size: 13px; font-weight: 500;">${formatEmailPrice(item.price, currency, 'fr')}</td>
        </tr>
      `;
    }).join('') || '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 14px 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">Nouvelle commande reçue : #${orderId}</h2>
          <p style="margin: 4px 0 0 0; color: #C8732A; font-size: 13px;">Montant total : ${formatEmailPrice(order.total, currency, 'fr')}</p>
        </div>

        <p style="font-size: 14px; color: #334155;">Nouvelle commande passée par <strong>${escapeHtml(customerDetails?.name || billingName)}</strong> (${escapeHtml(customerDetails?.email || order.user?.email)}) le ${formattedDate}.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead style="text-align: left; border-bottom: 1px solid #E2E8F0;">
            <tr>
              <th style="padding-bottom: 10px; font-size: 12px; color: #64748B;">Article</th>
              <th style="padding-bottom: 10px; text-align: center; font-size: 12px; color: #64748B;">Qté</th>
              <th style="padding-bottom: 10px; text-align: right; font-size: 12px; color: #64748B;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 15px;">
          <table style="width: 100%; font-size: 13px; color: #475569; line-height: 2;">
            <tr>
              <td>Sous-total :</td>
              <td style="text-align: right;">${formatEmailPrice(subTotal, currency, 'fr')}</td>
            </tr>
            <tr>
              <td>Livraison : ${shippingMethod}</td>
              <td style="text-align: right;">${shippingCostStr}</td>
            </tr>
            <tr style="color: #0E2036; font-size: 15px; border-top: 1px solid #E2E8F0;">
              <td><strong>Total :</strong></td>
              <td style="text-align: right; color: #C8732A;"><strong>${formatEmailPrice(order.total, currency, 'fr')}</strong></td>
            </tr>
            <tr>
              <td>Moyen de paiement :</td>
              <td style="text-align: right;">${paymentMethodStr}</td>
            </tr>
            ${metadata?.locale ? `<tr><td>Langue client :</td><td style="text-align: right;"><strong>${metadata.locale.toUpperCase()}</strong></td></tr>` : ''}
          </table>
        </div>

        <div style="border-top: 1px solid #eee; margin-top: 25px; padding-top: 20px;">
          <table style="width: 100%; font-size: 12px; color: #333; line-height: 1.5;">
            <tr>
              <td style="vertical-align: top; width: 50%;">
                <strong style="font-size: 13px; color: #0E2036;">Adresse de facturation</strong><br/>
                <div style="margin-top: 6px;">
                  ${billingName}<br/>
                  ${billingAddressHtml}<br/>
                  ${b.phone ? `<span style="color: #C8732A;">${escapeHtml(b.phone)}</span><br/>` : ''}
                </div>
              </td>
              <td style="vertical-align: top; width: 50%;">
                <strong style="font-size: 13px; color: #0E2036;">Adresse de livraison</strong><br/>
                <div style="margin-top: 6px;">
                  ${shippingName}<br/>
                  ${shippingAddressHtml}<br/>
                  ${s.phone ? `<span style="color: #C8732A;">${escapeHtml(s.phone)}</span>` : ''}
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 25px; text-align: center; font-size: 11px; color: #94A3B8;">
          <strong>${escapeHtml(storeName)}</strong> — Notification interne administrateur<br/>
          ${escapeHtml(storeAddress)}
        </div>
      </div>
    `;

    return sendEmail({
      to: adminEmail,
      subject: `[Nouvelle Commande] #${orderId} - ${formatEmailPrice(order.total, currency, 'fr')} (${customerDetails?.name || billingName})`,
      html,
    });
  } catch (e) {
    console.error('[sendAdminOrderNotification] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Client Order Status Update (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendOrderStatusUpdate(
  order: any,
  userEmail: string,
  status: string,
  clientLocale?: string
) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    let metadata: any = {};
    if (order.destinationAddress) {
      try {
        metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
      } catch (e) {}
    }

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || metadata?.locale);
    const T = EMAIL_TRANSLATIONS[locale].orderStatus;
    const C = EMAIL_TRANSLATIONS[locale].common;
    const currency = (metadata?.currency as string) || 'EUR';

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 40px;"></div>`
      : '';

    const orderId = order.id.slice(-6).toUpperCase();
    let title: string = T.updatedTitle;
    let message: string = T.updatedMessage(orderId);
    let subject: string = T.updatedSubject(orderId, storeName);
    let color: string = '#0E2036';

    if (status === 'SHIPPED') {
      title = T.shippedTitle;
      message = T.shippedMessage(orderId);
      subject = T.shippedSubject(orderId, storeName);
      color = '#16a34a';
    } else if (status === 'DELIVERED') {
      title = T.deliveredTitle;
      message = T.deliveredMessage(orderId);
      subject = T.deliveredSubject(orderId, storeName);
      color = '#16a34a';
    } else if (status === 'CANCELLED') {
      title = T.cancelledTitle;
      message = T.cancelledMessage(orderId);
      subject = T.cancelledSubject(orderId, storeName);
      color = '#dc2626';
    }

    const b = metadata?.billing || {};
    const customerName = escapeHtml(`${b.firstName || ''} ${b.lastName || ''}`.trim() || C.defaultCustomer);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: ${color}; margin-top: 0; margin-bottom: 15px;">${title}</h1>
        <p style="font-size: 14px; color: #475569;">${T.greeting(customerName)}</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">${message}</p>
        
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 15px; margin: 25px 0;">
          <table style="width: 100%; font-size: 13px; color: #475569;">
            <tr>
              <td>Référence :</td>
              <td style="text-align: right; font-weight: bold; color: #0E2036;">#${orderId}</td>
            </tr>
            <tr>
              <td>Montant total :</td>
              <td style="text-align: right; font-weight: bold; color: #C8732A;">${formatEmailPrice(order.total, currency, locale)}</td>
            </tr>
            <tr>
              <td>Statut actuel :</td>
              <td style="text-align: right; font-weight: bold; color: ${color};">${status}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px; font-size: 13px; color: #475569;">
          <p>${T.helpText(storeEmail)}</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: userEmail,
      subject,
      html,
    });
  } catch (e) {
    console.error('[sendOrderStatusUpdate] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Abandoned Cart Recovery Email (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendAbandonedCartRecoveryEmail(
  cart: any,
  userEmail: string,
  userName: string,
  checkoutUrl: string,
  clientLocale?: string
) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || cart?.locale);
    const T = EMAIL_TRANSLATIONS[locale].abandonedCart;
    const C = EMAIL_TRANSLATIONS[locale].common;

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 45px;"></div>`
      : '';

    let itemsHtml = '';
    if (Array.isArray(cart.cartData) && cart.cartData.length > 0) {
      const productIds = cart.cartData
        .map((i: any) => i?.productId)
        .filter((id: any): id is string => typeof id === 'string');

      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds }, isDeleted: false },
        select: { id: true, title: true, price: true, images: true, translations: { where: { locale } } },
      });
      const dbMap = new Map(dbProducts.map((p) => [p.id, p]));

      itemsHtml = cart.cartData.map((item: any) => {
        const dbProduct = item?.productId ? dbMap.get(item.productId) : null;
        const localizedTitle = dbProduct?.translations?.[0]?.title || dbProduct?.title || item?.title || 'Produit';
        const price = dbProduct?.price ?? (Number(item?.price) || 0);
        const rawImages = dbProduct?.images || item?.product?.images;

        let imageUrl = '';
        if (Array.isArray(rawImages) && rawImages.length > 0) {
          imageUrl = typeof rawImages[0] === 'string' ? rawImages[0] : rawImages[0]?.url || '';
        } else if (typeof rawImages === 'string') {
          try {
            const parsed = JSON.parse(rawImages);
            if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
          } catch {}
        }

        const safeImageUrl = imageUrl && /^https?:\/\//i.test(imageUrl) ? escapeHtml(imageUrl) : '';
        const imgTag = safeImageUrl
          ? `<img src="${safeImageUrl}" alt="Product" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />`
          : '';
        const qty = Math.min(Math.max(1, Number(item?.quantity) || 1), 999);

        return `
          <tr style="border-bottom: 1px dashed #eee;">
            <td style="padding: 12px 0;">
              <table style="width: 100%; border: none;">
                <tr>
                  <td style="width: 65px; vertical-align: middle;">${imgTag}</td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 13px; color: #1a1a1a; font-weight: 500;">${escapeHtml(localizedTitle)}</span>
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding: 12px 0; text-align: center; vertical-align: middle; color: #666; font-size: 13px;">×${qty}</td>
            <td style="padding: 12px 0; text-align: right; vertical-align: middle; color: #1a1a1a; font-size: 13px; font-weight: 500;">${formatEmailPrice(price, 'EUR', locale)}</td>
          </tr>
        `;
      }).join('');
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: #0E2036; margin-top: 0; margin-bottom: 15px;">${T.title}</h1>
        <p style="font-size: 14px; color: #475569;">${T.greeting(escapeHtml(userName) || C.defaultCustomer)}</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">${T.message}</p>
        
        <h3 style="font-size: 15px; font-weight: bold; margin-top: 30px; margin-bottom: 12px; color: #0E2036;">${T.summaryTitle}</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 35px; text-align: center;">
          <a href="${checkoutUrl}" style="background-color: #C8732A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; letter-spacing: 0.3px;">
            ${T.button}
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 35px; margin-bottom: 25px; font-size: 13px; color: #64748B;">
          <p>${T.helpText(storeEmail)}</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: userEmail,
      subject: T.subject(storeName),
      html,
    });
  } catch (e) {
    console.error('[sendAbandonedCartRecoveryEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Review Request Email (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendReviewRequestEmail(
  order: any,
  userEmail: string,
  userName: string,
  storeUrl: string,
  clientLocale?: string
) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    let metadata: any = {};
    if (order.destinationAddress) {
      try {
        metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
      } catch (e) {}
    }

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || metadata?.locale);
    const T = EMAIL_TRANSLATIONS[locale].reviewRequest;
    const C = EMAIL_TRANSLATIONS[locale].common;

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 45px;"></div>`
      : '';

    const orderId = order.id.slice(-6).toUpperCase();

    let itemsHtml = '';
    if (order.orderItems && order.orderItems.length > 0) {
      itemsHtml = order.orderItems.map((item: any) => {
        let imageUrl = '';
        if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
          imageUrl = typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url;
        } else if (typeof item.product?.images === 'string') {
          try {
            const imgs = JSON.parse(item.product.images);
            if (imgs.length > 0) imageUrl = imgs[0];
          } catch (e) {}
        }

        const imgTag = imageUrl
          ? `<img src="${imageUrl}" alt="Product" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />`
          : '';

        return `
          <tr style="border-bottom: 1px dashed #eee;">
            <td style="padding: 12px 0;">
              <table style="width: 100%; border: none;">
                <tr>
                  <td style="width: 65px; vertical-align: middle;">${imgTag}</td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 13px; color: #1a1a1a; font-weight: 500;">${escapeHtml(item.product?.title || 'Produit')}</span>
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding: 12px 0; text-align: right; vertical-align: middle;">
              <a href="${storeUrl}/product/${item.product?.slug || item.product?.id}" style="background-color: #0E2036; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 12px; display: inline-block;">
                ${T.action}
              </a>
            </td>
          </tr>
        `;
      }).join('');
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: #0E2036; margin-top: 0; margin-bottom: 15px;">${T.title}</h1>
        <p style="font-size: 14px; color: #475569;">${T.greeting(escapeHtml(userName) || C.defaultCustomer)}</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">${T.p1}</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">${T.p2}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: center; margin-top: 35px; margin-bottom: 25px; font-size: 13px; color: #64748B;">
          <p>${T.thankYou}</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: userEmail,
      subject: T.subject(orderId, storeName),
      html,
    });
  } catch (e) {
    console.error('[sendReviewRequestEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Newsletter Double Opt-In Email (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendNewsletterDoubleOptInEmail(userEmail: string, confirmUrl: string, clientLocale?: string) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const locale: EmailLocale = normalizeEmailLocale(clientLocale);
    const T = EMAIL_TRANSLATIONS[locale].newsletter;
    const C = EMAIL_TRANSLATIONS[locale].common;

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 45px;"></div>`
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: #0E2036; margin-top: 0; margin-bottom: 15px;">${T.doubleOptInTitle}</h1>
        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 25px;">${T.doubleOptInIntro}</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background-color: #C8732A; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
            ${T.doubleOptInButton}
          </a>
        </p>
        
        <p style="font-size: 12px; color: #64748B; margin-top: 25px;">${T.doubleOptInIgnore}</p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: userEmail,
      subject: T.doubleOptInSubject(storeName),
      html,
    });
  } catch (e) {
    console.error('[sendNewsletterDoubleOptInEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 7. Newsletter Welcome Email (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendNewsletterWelcomeEmail(userEmail: string, clientLocale?: string) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const locale: EmailLocale = normalizeEmailLocale(clientLocale);
    const T = EMAIL_TRANSLATIONS[locale].newsletter;
    const C = EMAIL_TRANSLATIONS[locale].common;

    const logoHtml = logo
      ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 45px;"></div>`
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 22px; color: #0E2036; margin-top: 0; margin-bottom: 15px;">${T.welcomeTitle}</h1>
        
        <p style="font-size: 14px; color: #334155; margin-bottom: 15px; line-height: 1.6;">${T.welcomeIntro}</p>
        <p style="font-size: 14px; color: #334155; margin-bottom: 20px;">${T.welcomeGift}</p>
        
        <div style="background-color: #FEF3C7; border: 1px dashed #D97706; padding: 18px; text-align: center; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 13px; color: #92400E;">Code promotionnel de bienvenue :</p>
          <p style="margin: 8px 0 0 0; font-size: 22px; font-weight: bold; color: #B45309; letter-spacing: 2px;">🏷️ ${T.welcomeCode}</p>
        </div>
        
        <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 12px; color: #0E2036;">${T.welcomeBenefitsTitle}</h3>
        <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin-bottom: 25px; line-height: 1.8;">
          <li>${T.benefit1}</li>
          <li>${T.benefit2}</li>
          <li>${T.benefit3}</li>
        </ul>
        
        <p style="font-size: 13px; color: #64748B; margin-top: 25px;">${T.closing}</p>
        <p style="font-size: 14px; font-weight: bold; color: #C8732A; margin-bottom: 30px;">L’Équipe ${escapeHtml(storeName)}</p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: userEmail,
      subject: T.welcomeSubject,
      html,
    });
  } catch (e) {
    console.error('[sendNewsletterWelcomeEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 7. Admin Low Stock Alert
// ─────────────────────────────────────────────────────────────
export async function sendLowStockAlertEmail(
  productTitle: string,
  variationName: string | null,
  currentStock: number,
  threshold: number,
  adminEmail: string,
  storeUrl: string,
  productId: string
) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="Logo" style="max-height: 40px;"></div>` : '';
    const productName = variationName ? `${productTitle} (${variationName})` : productTitle;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 20px; color: #DC2626; margin-top: 0; margin-bottom: 12px;">⚠️ Alerte : Stock Faible</h1>
        <p style="font-size: 13px; color: #475569;">Le niveau de stock du produit suivant est descendu sous le seuil d’alerte (${threshold} unités).</p>
        
        <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <h3 style="margin-top: 0; color: #991B1B; font-size: 15px;">${escapeHtml(productName)}</h3>
          <p style="margin-bottom: 0; font-size: 15px; color: #1a1a1a;"><strong>Stock restant : <span style="color: #DC2626;">${currentStock}</span></strong></p>
        </div>
        
        <p style="margin-top: 25px; text-align: center; margin-bottom: 30px;">
          <a href="${storeUrl}/admin/products" style="background-color: #0E2036; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px; display: inline-block;">
            Gérer le stock en administration
          </a>
        </p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8;">
          <strong>${escapeHtml(storeName)}</strong> — Notification interne administration<br/>
          ${escapeHtml(storeAddress)}
        </div>
      </div>
    `;

    return sendEmail({
      to: adminEmail,
      subject: `[Alerte Stock] ${productName} - Plus que ${currentStock} en réserve`,
      html,
    });
  } catch (e) {
    console.error('[sendLowStockAlertEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 8. Admin New Chat Message Notification
// ─────────────────────────────────────────────────────────────
export async function sendAdminNewChatMessageEmail(
  guestName: string,
  guestEmail: string | null,
  messageContent: string,
  adminEmail: string,
  storeUrl: string
) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo ? `<div style="text-align: left; margin-bottom: 20px;"><img src="${logo}" alt="Logo" style="max-height: 40px;"></div>` : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <h1 style="font-size: 20px; color: #0E2036; margin-top: 0; margin-bottom: 12px;">Nouveau message sur le Live Chat</h1>
        <p style="font-size: 13px; color: #475569;">Un visiteur vient de vous envoyer un message via le chat d'assistance.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background-color: #F8FAFC; padding: 15px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <tr>
            <td style="padding: 10px; font-size: 13px; color: #64748B; width: 90px;"><strong>Expéditeur :</strong></td>
            <td style="padding: 10px; font-size: 13px; color: #0E2036;"><strong>${escapeHtml(guestName) || 'Visiteur'}</strong> ${guestEmail ? `(<a href="mailto:${guestEmail}" style="color: #2563eb;">${escapeHtml(guestEmail)}</a>)` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 10px; vertical-align: top; font-size: 13px; color: #64748B;"><strong>Message :</strong></td>
            <td style="padding: 10px; font-size: 13px; font-style: italic; color: #334155; line-height: 1.6;">"${escapeHtml(messageContent)}"</td>
          </tr>
        </table>
        
        <p style="margin-top: 25px; text-align: center; margin-bottom: 30px;">
          <a href="${storeUrl}/admin/chat" style="background-color: #C8732A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px; display: inline-block;">
            Ouvrir la messagerie Live
          </a>
        </p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8;">
          <strong>${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}
        </div>
      </div>
    `;

    return sendEmail({
      to: adminEmail,
      subject: `[Support Live] Nouveau message de ${guestName || 'un visiteur'}`,
      html,
    });
  } catch (e) {
    console.error('[sendAdminNewChatMessageEmail] Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 9. Admin Alert Email (Live Supervision)
// ─────────────────────────────────────────────────────────────
export async function sendAdminAlertEmail({
  title,
  message,
  details,
}: {
  title: string;
  message: string;
  details?: Record<string, any>;
}) {
  try {
    const settingsDb = await prisma.setting.findMany({
      where: { key: { in: ['CONTACT_RECEIVER_EMAIL', 'SMTP_USER'] } },
    });
    const sMap = settingsDb.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
    const recipient = sMap['CONTACT_RECEIVER_EMAIL'] || sMap['SMTP_USER'] || DEFAULT_STORE_EMAIL;

    let detailsHtml = '';
    if (details && Object.keys(details).length > 0) {
      detailsHtml = `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-top: 15px;">
          <table style="width: 100%; font-size: 13px; color: #334155;">
            ${Object.entries(details).map(([k, v]) => `
              <tr>
                <td style="padding: 4px 8px; font-weight: bold; width: 140px; vertical-align: top;">${escapeHtml(k)}:</td>
                <td style="padding: 4px 8px; font-family: monospace;">${escapeHtml(typeof v === 'object' ? JSON.stringify(v) : String(v))}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
        <div style="background-color: #ef4444; color: white; padding: 12px 20px; border-radius: 6px 6px 0 0; font-size: 16px; font-weight: bold;">
          ⚠️ Supervision Live GOLAY INVEST : ${escapeHtml(title)}
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 6px 6px; background: white;">
          <p style="font-size: 14px; line-height: 1.6; margin-top: 0;">${escapeHtml(message)}</p>
          ${detailsHtml}
          <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
            Alerte automatique générée par le système de supervision live.
          </p>
        </div>
      </div>
    `;

    return sendEmail({
      to: recipient,
      subject: `🚨 [Alerte GOLAY INVEST] ${title}`,
      html,
    });
  } catch (err) {
    console.error('Failed to send admin alert email:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 10. Quote Email to Client (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendQuoteEmailToClient(quote: any, pdfBuffer: Buffer, clientLocale?: string) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || quote?.locale);
    const T = EMAIL_TRANSLATIONS[locale].quote;
    const C = EMAIL_TRANSLATIONS[locale].common;

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const quoteId = quote.id.startsWith('#') ? quote.id : `#${quote.id}`;
    const formattedTotal = formatEmailPrice(quote.total, 'EUR', locale);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 18px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">${T.title}</h2>
          <p style="margin: 6px 0 0 0; color: #C8732A; font-size: 13px; font-weight: bold;">${T.reference(quoteId)}</p>
        </div>

        <p style="font-size: 14px;">${T.greeting(escapeHtml(quote.customerName || C.defaultCustomer))}</p>
        <p style="font-size: 14px; color: #475569;">${T.intro}</p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px; margin: 25px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="color: #64748B;">${T.totalAmount}</td>
              <td style="text-align: right; font-weight: bold; color: #0E2036; font-size: 16px;">${formattedTotal}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.taxRegime}</td>
              <td style="text-align: right; color: #10B981; font-weight: 500;">${T.taxZeroVat}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.rateGuarantee}</td>
              <td style="text-align: right; color: #C8732A; font-weight: 500;">${T.rateGuarantee72h}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #475569;">${T.pdfAttached}</p>

        ${quote.notes ? `
          <div style="background-color: #FFFBEB; border-left: 3px solid #F59E0B; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #92400E;">
            <strong>${T.advisorNote}</strong><br/>
            ${escapeHtml(quote.notes)}
          </div>
        ` : ''}

        <p style="font-size: 13px; color: #475569;">${T.howToValidate}</p>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: quote.customerEmail,
      subject: T.subject(quoteId, storeName),
      html,
      attachments: [{
        filename: `devis-${quote.id.replace('#', '')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }],
    });
  } catch (err) {
    console.error('[sendQuoteEmailToClient] Error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 11. Direct Invoice Email to Client (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendDirectInvoiceEmailToClient(
  order: any,
  customerEmail: string,
  customerName: string,
  pdfBuffer: Buffer,
  clientLocale?: string
) {
  try {
    const { logo, storeName, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    let metadata: any = {};
    if (order.destinationAddress) {
      try {
        metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
      } catch (e) {}
    }

    const locale: EmailLocale = normalizeEmailLocale(clientLocale || metadata?.locale);
    const T = EMAIL_TRANSLATIONS[locale].directInvoice;
    const C = EMAIL_TRANSLATIONS[locale].common;
    const currency = (metadata?.currency as string) || 'EUR';

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const orderId = order.id.slice(-6).toUpperCase();
    const formattedTotal = formatEmailPrice(order.total, currency, locale);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 18px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">${T.title}</h2>
          <p style="margin: 6px 0 0 0; color: #C8732A; font-size: 13px; font-weight: bold;">${T.reference(orderId)}</p>
        </div>

        <p style="font-size: 14px;">${T.greeting(escapeHtml(customerName || C.defaultCustomer))}</p>
        <p style="font-size: 14px; color: #475569;">${T.intro}</p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px; margin: 25px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="color: #64748B;">${T.invoiceNumber}</td>
              <td style="text-align: right; font-weight: bold; color: #0E2036;">#FAC-${orderId}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.totalAmount}</td>
              <td style="text-align: right; font-weight: bold; color: #C8732A; font-size: 16px;">${formattedTotal}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.status}</td>
              <td style="text-align: right; color: ${order.status === 'PAID' ? '#10B981' : '#F59E0B'}; font-weight: bold;">
                ${order.status === 'PAID' ? T.statusPaid : T.statusPending}
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #475569;">${T.pdfAttached}</p>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${C.footerTagline}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: customerEmail,
      subject: T.subject(orderId, storeName),
      html,
      attachments: [{
        filename: `facture-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }],
    });
  } catch (err) {
    console.error('[sendDirectInvoiceEmailToClient] Error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 12. Admin Quote Request Notification
// ─────────────────────────────────────────────────────────────
export async function sendAdminQuoteNotification(quote: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  investmentAmount?: string;
  metalType?: string;
  deliveryPreference?: string;
  message?: string;
  createdAt?: string;
}) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const formattedDate = formatEmailDate(new Date(quote.createdAt || Date.now()), 'fr');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 20px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <span style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #E8A63D; display: block; margin-bottom: 5px;">Maison GOLAY INVEST • Savièse</span>
          <h2 style="margin: 0; font-size: 21px; letter-spacing: 0.5px;">Nouvelle Demande de Devis Reçue</h2>
          <p style="margin: 8px 0 0 0; color: #C8732A; font-size: 14px; font-weight: bold;">Réf. : ${escapeHtml(quote.id)}</p>
        </div>

        <p style="font-size: 14px; color: #475569;">
          Un nouvel investisseur a soumis une demande de devis personnalisée sur la plateforme <strong>${escapeHtml(storeName)}</strong> :
        </p>

        <!-- Coordonnées Client -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="font-size: 14px; color: #0E2036; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Coordonnées de l'Investisseur</h3>
          <table style="width: 100%; font-size: 13.5px; color: #334155; line-height: 1.8;">
            <tr>
              <td style="width: 35%; color: #64748B;">Nom complet :</td>
              <td style="font-weight: bold; color: #0E2036;">${escapeHtml(quote.customerName)}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">Email :</td>
              <td><a href="mailto:${escapeHtml(quote.customerEmail)}" style="color: #C8732A; font-weight: 600; text-decoration: none;">${escapeHtml(quote.customerEmail)}</a></td>
            </tr>
            ${quote.customerPhone ? `
            <tr>
              <td style="color: #64748B;">Téléphone :</td>
              <td style="font-weight: 500;">${escapeHtml(quote.customerPhone)}</td>
            </tr>` : ''}
            ${quote.customerAddress ? `
            <tr>
              <td style="color: #64748B;">Localisation :</td>
              <td>${escapeHtml(quote.customerAddress)}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #64748B;">Date & Heure :</td>
              <td>${formattedDate}</td>
            </tr>
          </table>
        </div>

        <!-- Critères d'Investissement -->
        <div style="background: #FDF8F3; border: 1px solid #F3DFC6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="font-size: 14px; color: #78350F; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #F3DFC6; padding-bottom: 8px;">Critères d'Investissement</h3>
          <table style="width: 100%; font-size: 13.5px; color: #78350F; line-height: 1.8;">
            <tr>
              <td style="width: 40%; color: #92400E;">Métal recherché :</td>
              <td style="font-weight: bold; color: #0E2036;">${escapeHtml(quote.metalType || "Or d'investissement")}</td>
            </tr>
            <tr>
              <td style="color: #92400E;">Budget envisagé :</td>
              <td style="font-weight: bold; color: #C8732A; font-size: 15px;">${escapeHtml(quote.investmentAmount || 'À définir')}</td>
            </tr>
            <tr>
              <td style="color: #92400E;">Mode de garde / livraison :</td>
              <td style="font-weight: 500;">${escapeHtml(quote.deliveryPreference || 'Livraison sécurisée')}</td>
            </tr>
          </table>
        </div>

        ${quote.message ? `
        <!-- Message client -->
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid #C8732A; border-radius: 6px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: bold;">Message de l'investisseur :</p>
          <p style="margin: 0; font-size: 13.5px; color: #1E293B; line-height: 1.6; font-style: italic;">« ${escapeHtml(quote.message).replace(/\n/g, '<br/>')} »</p>
        </div>` : ''}

        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="https://golayinvest.com/admin/quotes" style="display: inline-block; background-color: #C8732A; color: white; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(200, 115, 42, 0.35);">
            Traiter ce devis dans l'Administration ↗
          </a>
        </div>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">Système de notification automatique • info@golayinvest.com</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: storeEmail,
      replyTo: quote.customerEmail,
      subject: `[GOLAY INVEST] Nouvelle demande de devis #${quote.id} — ${quote.customerName}`,
      html,
    });
  } catch (err) {
    console.error('[sendAdminQuoteNotification] Error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 13. Client Quote Request Confirmation (Multi-language)
// ─────────────────────────────────────────────────────────────
export async function sendClientQuoteConfirmation(quote: {
  id: string;
  customerName: string;
  customerEmail: string;
  investmentAmount?: string;
  metalType?: string;
  deliveryPreference?: string;
}, clientLocale?: string) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const locale: EmailLocale = normalizeEmailLocale(clientLocale);

    const copy = {
      fr: {
        badge: 'Maison GOLAY INVEST • Savièse, Suisse',
        title: 'Confirmation de votre Demande de Devis',
        ref: `Réf. Devis : ${quote.id}`,
        greeting: `Bonjour ${escapeHtml(quote.customerName)},`,
        p1: 'Nous vous remercions pour votre confiance. Votre demande de devis personnalisée a été enregistrée avec succès auprès de notre département patrimonial.',
        summaryTitle: 'Récapitulatif de votre demande',
        metalLabel: 'Métaux précieux souhaités :',
        budgetLabel: 'Budget indicatif :',
        deliveryLabel: 'Option de livraison / garde :',
        p2: 'Un conseiller spécialisé en métaux précieux physiques étudie actuellement votre dossier afin d’établir une proposition chiffrée basée sur les cours spot officiels en direct. Vous recevrez votre devis formel par email sous 24 à 48 heures ouvrées.',
        support: 'Pour toute précision urgente, vous pouvez nous joindre à tout moment à l’adresse',
        footerTag: 'NÉGOCE DE MÉTAUX PRÉCIEUX PHYSIQUES • TRADITION & RIGUEUR HELVÉTIQUE',
        subject: `Votre demande de devis #${quote.id} — Maison GOLAY INVEST`
      },
      en: {
        badge: 'Maison GOLAY INVEST • Savièse, Switzerland',
        title: 'Quote Request Confirmation',
        ref: `Quote Ref: ${quote.id}`,
        greeting: `Dear ${escapeHtml(quote.customerName)},`,
        p1: 'Thank you for your trust. Your personalized bullion quote request has been successfully registered with our wealth advisory department.',
        summaryTitle: 'Summary of your request',
        metalLabel: 'Precious metals selected:',
        budgetLabel: 'Indicative budget:',
        deliveryLabel: 'Delivery / Custody option:',
        p2: 'A physical precious metals specialist is currently reviewing your request to prepare a firm quotation benchmarked against real-time LBMA spot prices. You will receive your official quote by email within 24 to 48 business hours.',
        support: 'For urgent inquiries, please contact our advisors directly at',
        footerTag: 'PHYSICAL BULLION TRADING • SWISS PRECISION & INTEGRITY',
        subject: `Your quote request #${quote.id} — Maison GOLAY INVEST`
      },
      de: {
        badge: 'Maison GOLAY INVEST • Savièse, Schweiz',
        title: 'Bestätigung Ihrer Angebotsanfrage',
        ref: `Angebots-Ref.: ${quote.id}`,
        greeting: `Guten Tag ${escapeHtml(quote.customerName)},`,
        p1: 'Vielen Dank für Ihr Vertrauen. Ihre persönliche Angebotsanfrage für Edelmetalle ist erfolgreich bei unserer Vermögensberatung eingegangen.',
        summaryTitle: 'Zusammenfassung Ihrer Anfrage',
        metalLabel: 'Gewählte Edelmetalle:',
        budgetLabel: 'Anlagebudget:',
        deliveryLabel: 'Lieferung / Verwahrung:',
        p2: 'Ein Edelmetall-Spezialist prüft Ihre Angaben, um ein Angebot auf Basis der aktuellen LBMA-Live-Kurse zu erstellen. Sie erhalten Ihr offizielles Angebot innerhalb von 24 bis 48 Stunden per E-Mail.',
        support: 'Bei dringenden Fragen erreichen Sie uns jederzeit unter',
        footerTag: 'PHYSISCHER EDELMETALLHANDEL • SCHWEIZER PRÄZISION & SICHERHEIT',
        subject: `Ihre Angebotsanfrage #${quote.id} — Maison GOLAY INVEST`
      },
      es: {
        badge: 'Maison GOLAY INVEST • Savièse, Suiza',
        title: 'Confirmación de su Solicitud de Cotización',
        ref: `Ref. Cotización: ${quote.id}`,
        greeting: `Estimado/a ${escapeHtml(quote.customerName)},`,
        p1: 'Gracias por su confianza. Su solicitud de cotización personalizada ha sido registrada con éxito en nuestro departamento patrimonial.',
        summaryTitle: 'Resumen de su solicitud',
        metalLabel: 'Metales seleccionados:',
        budgetLabel: 'Presupuesto indicativo:',
        deliveryLabel: 'Opción de entrega / custodia:',
        p2: 'Un asesor especializado en metales preciosos está revisando su solicitud para preparar una propuesta basada en las cotizaciones spot LBMA en tiempo real. Recibirá su cotización en un plazo de 24 a 48 horas.',
        support: 'Para cualquier consulta urgente, puede contactarnos en',
        footerTag: 'COMERCIO DE METALES PRECIOSOS FÍSICOS • RIGOR HELVÉTICO',
        subject: `Su solicitud de cotización #${quote.id} — Maison GOLAY INVEST`
      },
      it: {
        badge: 'Maison GOLAY INVEST • Savièse, Svizzera',
        title: 'Conferma della Richiesta di Preventivo',
        ref: `Rif. Preventivo: ${quote.id}`,
        greeting: `Gentile ${escapeHtml(quote.customerName)},`,
        p1: 'La ringraziamo per la fiducia accordataci. La sua richiesta di preventivo personalizzato è stata registrata con successo.',
        summaryTitle: 'Riepilogo della richiesta',
        metalLabel: 'Metalli selezionati:',
        budgetLabel: 'Budget indicativo:',
        deliveryLabel: 'Opzione di consegna / custodia:',
        p2: 'Un consulente dedicato sta elaborando la sua proposta basata sui corsi spot LBMA in tempo reale. Riceverà il preventivo formale via email entro 24-48 ore lavorative.',
        support: 'Per qualsiasi richiesta urgente, può contattarci all’indirizzo',
        footerTag: 'COMMERCIO DI METALLI PREZIOSI FISICI • RIGORE SVIZZERO',
        subject: `La sua richiesta di preventivo #${quote.id} — Maison GOLAY INVEST`
      }
    };

    const T = copy[locale as keyof typeof copy] || copy.en;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 20px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <span style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #E8A63D; display: block; margin-bottom: 5px;">${T.badge}</span>
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">${T.title}</h2>
          <p style="margin: 8px 0 0 0; color: #C8732A; font-size: 14px; font-weight: bold;">${T.ref}</p>
        </div>

        <p style="font-size: 14px;">${T.greeting}</p>
        <p style="font-size: 14px; color: #475569;">${T.p1}</p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin: 25px 0;">
          <h3 style="font-size: 13px; color: #0E2036; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">${T.summaryTitle}</h3>
          <table style="width: 100%; font-size: 13.5px; color: #334155; line-height: 1.8;">
            <tr>
              <td style="width: 42%; color: #64748B;">${T.metalLabel}</td>
              <td style="font-weight: bold; color: #0E2036;">${escapeHtml(quote.metalType || "Or d'investissement")}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.budgetLabel}</td>
              <td style="font-weight: bold; color: #C8732A;">${escapeHtml(quote.investmentAmount || 'À définir')}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">${T.deliveryLabel}</td>
              <td style="font-weight: 500;">${escapeHtml(quote.deliveryPreference || 'Livraison sécurisée')}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13.5px; color: #475569; line-height: 1.6;">${T.p2}</p>
        
        <p style="font-size: 12.5px; color: #64748B; margin-top: 20px;">
          ${T.support} <a href="mailto:${storeEmail}" style="color: #C8732A; font-weight: bold; text-decoration: none;">${storeEmail}</a>.
        </p>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${T.footerTag}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: quote.customerEmail,
      subject: T.subject,
      html,
    });
  } catch (err) {
    console.error('[sendClientQuoteConfirmation] Error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 14. Admin Contact Notification
// ─────────────────────────────────────────────────────────────
export async function sendAdminContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date?: Date;
}) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const formattedDate = formatEmailDate(data.date || new Date(), 'fr');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 18px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <span style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #E8A63D; display: block; margin-bottom: 5px;">Maison GOLAY INVEST</span>
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">Nouveau Message de Contact</h2>
          ${data.subject ? `<p style="margin: 6px 0 0 0; color: #C8732A; font-size: 13.5px; font-weight: bold;">Objet : ${escapeHtml(data.subject)}</p>` : ''}
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
          <table style="width: 100%; font-size: 13.5px; color: #334155; line-height: 1.8;">
            <tr>
              <td style="width: 30%; color: #64748B;">Expéditeur :</td>
              <td style="font-weight: bold; color: #0E2036;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="color: #64748B;">Email :</td>
              <td><a href="mailto:${escapeHtml(data.email)}" style="color: #C8732A; font-weight: 600; text-decoration: none;">${escapeHtml(data.email)}</a></td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="color: #64748B;">Téléphone :</td>
              <td style="font-weight: 500;">${escapeHtml(data.phone)}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #64748B;">Date & Heure :</td>
              <td>${formattedDate}</td>
            </tr>
          </table>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid #C8732A; border-radius: 6px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: bold;">Message reçu :</p>
          <p style="margin: 0; font-size: 14px; color: #1E293B; line-height: 1.6; white-space: pre-line;">${escapeHtml(data.message)}</p>
        </div>

        <p style="font-size: 12.5px; color: #64748B; margin-top: 25px;">
          <em>Vous pouvez répondre directement à cet email pour contacter ${escapeHtml(data.name)} à l'adresse ${escapeHtml(data.email)}.</em>
        </p>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">Formulaire de contact • info@golayinvest.com</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: storeEmail,
      replyTo: data.email,
      subject: data.subject ? `[GOLAY INVEST] ${data.subject} — de ${data.name}` : `[GOLAY INVEST] Nouveau message de ${data.name}`,
      html,
    });
  } catch (err) {
    console.error('[sendAdminContactNotification] Error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 15. Client Contact Acknowledgment
// ─────────────────────────────────────────────────────────────
export async function sendClientContactConfirmation(data: {
  name: string;
  email: string;
  subject?: string;
}, clientLocale?: string) {
  try {
    const { logo, storeName, storeEmail, storeAddress } = await getTransporter().catch(() => ({
      logo: '',
      storeName: DEFAULT_STORE_NAME,
      storeEmail: DEFAULT_STORE_EMAIL,
      storeAddress: DEFAULT_STORE_ADDRESS,
    }));

    const logoHtml = logo
      ? `<div style="text-align: center; margin-bottom: 25px;"><img src="${logo}" alt="${escapeHtml(storeName)}" style="max-height: 48px;" /></div>`
      : '';

    const locale: EmailLocale = normalizeEmailLocale(clientLocale);

    const copy = {
      fr: {
        badge: 'Maison GOLAY INVEST • Savièse, Suisse',
        title: 'Nous avons bien reçu votre message',
        greeting: `Bonjour ${escapeHtml(data.name)},`,
        p1: 'Votre message a bien été transmis à nos spécialistes des métaux précieux d’investissement.',
        p2: 'Un conseiller étudie actuellement votre demande et reviendra vers vous dans les meilleurs délais (généralement sous 24h ouvrées).',
        footerTag: 'NÉGOCE DE MÉTAUX PRÉCIEUX PHYSIQUES • TRADITION & RIGUEUR HELVÉTIQUE',
        subject: 'Maison GOLAY INVEST — Nous avons bien reçu votre message'
      },
      en: {
        badge: 'Maison GOLAY INVEST • Savièse, Switzerland',
        title: 'We have received your message',
        greeting: `Dear ${escapeHtml(data.name)},`,
        p1: 'Your message has been successfully delivered to our bullion investment specialists.',
        p2: 'An advisor is reviewing your request and will reply shortly (typically within 24 business hours).',
        footerTag: 'PHYSICAL BULLION TRADING • SWISS PRECISION & INTEGRITY',
        subject: 'Maison GOLAY INVEST — Message confirmation'
      },
      de: {
        badge: 'Maison GOLAY INVEST • Savièse, Schweiz',
        title: 'Wir haben Ihre Nachricht erhalten',
        greeting: `Guten Tag ${escapeHtml(data.name)},`,
        p1: 'Ihre Nachricht wurde erfolgreich an unsere Edelmetall-Spezialisten übermittelt.',
        p2: 'Ein Berater prüft Ihr Anliegen und wird sich zeitnah bei Ihnen melden (in der Regel innerhalb von 24 Arbeitsstunden).',
        footerTag: 'PHYSISCHER EDELMETALLHANDEL • SCHWEIZER PRÄZISION & SICHERHEIT',
        subject: 'Maison GOLAY INVEST — Eingangsbestätigung Ihrer Nachricht'
      }
    };

    const T = copy[locale as keyof typeof copy] || copy.en;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0E2036; line-height: 1.6; padding: 25px; border: 1px solid #E2E8F0; border-radius: 8px;">
        ${logoHtml}
        <div style="background-color: #0E2036; color: white; padding: 18px 24px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <span style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #E8A63D; display: block; margin-bottom: 5px;">${T.badge}</span>
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">${T.title}</h2>
        </div>

        <p style="font-size: 14px;">${T.greeting}</p>
        <p style="font-size: 14px; color: #475569;">${T.p1}</p>
        <p style="font-size: 14px; color: #475569;">${T.p2}</p>

        <p style="font-size: 12.5px; color: #64748B; margin-top: 25px;">
          Pour toute question complémentaire, écrivez-nous à <a href="mailto:${storeEmail}" style="color: #C8732A; font-weight: bold; text-decoration: none;">${storeEmail}</a>.
        </p>

        <div style="border-top: 1px solid #E2E8F0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.6;">
          <strong style="color: #0E2036; font-size: 12px; letter-spacing: 0.5px;">${escapeHtml(storeName)}</strong><br/>
          ${escapeHtml(storeAddress)}<br/>
          <span style="font-size: 10px; color: #C8732A;">${T.footerTag}</span>
        </div>
      </div>
    `;

    return sendEmail({
      to: data.email,
      subject: T.subject,
      html,
    });
  } catch (err) {
    console.error('[sendClientContactConfirmation] Error:', err);
  }
}

