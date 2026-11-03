import prisma from '@/lib/prisma';
import { generateQuotePDF, generateInvoicePDF } from '@/lib/pdfGenerator';
import { sendQuoteEmailToClient, sendDirectInvoiceEmailToClient } from '@/lib/mailer';

export interface QuoteItem {
  title: string;
  quantity: number;
  price: number;
  total: number;
}

export interface QuoteRecord {
  id: string; // e.g. "DEV-2026-0042"
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  investmentAmount?: string;
  metalType?: string; // Or, Argent, Platine, Diversifié
  deliveryPreference?: string; // Livraison sécurisée, Retrait agence, Stockage coffres
  message?: string;
  items: QuoteItem[];
  total: number;
  subtotal: number;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
  validUntil?: string;
  createdAt: string;
  sentAt?: string;
}

const SETTING_KEY = 'QUOTES_REGISTRY_JSON';

export async function getAllQuotes(): Promise<QuoteRecord[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY }
    });
    if (!setting || !setting.value) {
      return [];
    }
    const list: QuoteRecord[] = JSON.parse(setting.value);
    return Array.isArray(list) ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
  } catch (err) {
    console.error('Error fetching quotes from setting:', err);
    return [];
  }
}

export async function getQuoteById(id: string): Promise<QuoteRecord | null> {
  const all = await getAllQuotes();
  return all.find(q => q.id.toUpperCase() === id.toUpperCase()) || null;
}

export async function getUserQuotes(email: string): Promise<QuoteRecord[]> {
  if (!email) return [];
  const all = await getAllQuotes();
  const normalized = email.trim().toLowerCase();
  return all.filter(q => q.customerEmail.trim().toLowerCase() === normalized);
}

export async function saveQuote(quote: QuoteRecord): Promise<void> {
  const all = await getAllQuotes();
  const index = all.findIndex(q => q.id.toUpperCase() === quote.id.toUpperCase());
  if (index >= 0) {
    all[index] = quote;
  } else {
    all.unshift(quote);
  }

  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    create: {
      key: SETTING_KEY,
      value: JSON.stringify(all)
    },
    update: {
      value: JSON.stringify(all)
    }
  });
}

/**
 * 1. Client Submits Quote Request Form
 */
export async function createClientQuoteRequest(data: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  investmentAmount?: string;
  metalType?: string;
  deliveryPreference?: string;
  message?: string;
  userId?: string;
}): Promise<{ success: boolean; quoteId?: string; error?: string }> {
  try {
    const all = await getAllQuotes();
    const count = all.length + 1;
    const year = new Date().getFullYear();
    const quoteId = `DEV-${year}-${String(count).padStart(4, '0')}`;

    const newQuote: QuoteRecord = {
      id: quoteId,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || '',
      customerAddress: data.customerAddress || '',
      investmentAmount: data.investmentAmount || '',
      metalType: data.metalType || "Or d'investissement",
      deliveryPreference: data.deliveryPreference || 'Livraison sécurisée assurée',
      message: data.message || '',
      items: [
        {
          title: `Sélection sur-mesure (${data.metalType || "Or d'investissement"}) - Budget ${data.investmentAmount || 'À définir'}`,
          quantity: 1,
          price: 0,
          total: 0
        }
      ],
      total: 0,
      subtotal: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    await saveQuote(newQuote);

    // In-app notification for admin
    try {
      await prisma.notification.create({
        data: {
          isAdmin: true,
          type: 'SYSTEM',
          message: `Nouvelle demande de devis reçue de ${data.customerName} (${quoteId})`,
          link: `/admin/quotes`
        }
      });
    } catch (notifErr) {
      // ignore
    }

    return { success: true, quoteId };
  } catch (err: any) {
    console.error('Failed to create quote request:', err);
    return { success: false, error: err.message || 'Erreur lors de la création du devis.' };
  }
}

/**
 * 2. Admin Finalizes and Sends Quote (Generates PDF + Emails to client + Saves in client space)
 */
export async function adminFinalizeAndSendQuote(
  quoteId: string,
  updatedData: {
    items: QuoteItem[];
    total: number;
    notes?: string;
    validityDays?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const quote = await getQuoteById(quoteId);
    if (!quote) {
      return { success: false, error: 'Devis introuvable.' };
    }

    const validityDays = updatedData.validityDays || 3;
    const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

    quote.items = updatedData.items;
    quote.total = updatedData.total;
    quote.subtotal = updatedData.total;
    quote.notes = updatedData.notes || quote.notes;
    quote.validUntil = validUntil;
    quote.status = 'SENT';
    quote.sentAt = new Date().toISOString();

    // 1. Generate PDF with logo
    const pdfBuffer = await generateQuotePDF({
      id: quote.id,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      customerAddress: quote.customerAddress,
      items: quote.items,
      total: quote.total,
      notes: quote.notes,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil
    });

    // 2. Send Email with attached PDF
    await sendQuoteEmailToClient(quote, pdfBuffer);

    // 3. Save updated quote to registry (accessible in client's portal)
    await saveQuote(quote);

    return { success: true };
  } catch (err: any) {
    console.error('Failed to finalize and send quote:', err);
    return { success: false, error: err.message || "Erreur lors de l'envoi du devis." };
  }
}

/**
 * 3. Admin Creates Direct Invoice for a Customer
 * Creates order, generates PDF with logo, emails client, and client sees it in /account/orders
 */
export async function adminCreateDirectInvoice(data: {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: { productId?: string; title: string; quantity: number; price: number }[];
  total: number;
  paymentMethod?: string;
  status?: 'PAID' | 'PENDING';
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: data.customerEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.customerEmail,
          role: 'CUSTOMER'
        }
      });
    }

    // 2. Find a fallback product if none provided
    const defaultProduct = await prisma.product.findFirst({
      where: { isDeleted: false }
    });

    if (!defaultProduct) {
      return { success: false, error: 'Aucun produit disponible pour rattacher la ligne de facture.' };
    }

    const orderMetadata = {
      billing: {
        firstName: data.customerName.split(' ')[0] || data.customerName,
        lastName: data.customerName.split(' ').slice(1).join(' ') || '',
        email: data.customerEmail,
        phone: data.customerPhone || '',
        address: data.customerAddress || '',
        country: 'France'
      },
      shipping: {
        firstName: data.customerName.split(' ')[0] || data.customerName,
        lastName: data.customerName.split(' ').slice(1).join(' ') || '',
        address: data.customerAddress || '',
        country: 'France'
      },
      subTotal: data.total,
      shippingCost: 0,
      isManualInvoice: true
    };

    // 3. Create the Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: data.total,
        status: data.status || 'PAID',
        paymentMethod: (data.paymentMethod as any) || 'BANK_TRANSFER',
        destinationAddress: JSON.stringify(orderMetadata),
        orderItems: {
          create: data.items.map(item => ({
            productId: item.productId || defaultProduct.id,
            quantity: item.quantity,
            price: item.price,
            attributes: { manualTitle: item.title }
          }))
        }
      },
      include: {
        user: true,
        orderItems: { include: { product: true } }
      }
    });

    // 4. Generate PDF invoice with logo
    const pdfBuffer = await generateInvoicePDF(order);

    // 5. Send Email with attached PDF invoice
    await sendDirectInvoiceEmailToClient(order, data.customerEmail, data.customerName, pdfBuffer);

    return { success: true, orderId: order.id };
  } catch (err: any) {
    console.error('Failed to create manual invoice from admin:', err);
    return { success: false, error: err.message || "Erreur lors de la création de la facture." };
  }
}

