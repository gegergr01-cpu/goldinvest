'use server';

import { 
  createClientQuoteRequest, 
  adminFinalizeAndSendQuote, 
  adminCreateDirectInvoice, 
  getAllQuotes, 
  getQuoteById, 
  getUserQuotes,
  QuoteItem
} from '@/lib/quotes';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Client submits quote request form
 */
export async function submitQuoteAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const customerName = formData.get('name') as string;
    const customerEmail = formData.get('email') as string;
    const customerPhone = formData.get('phone') as string;
    const customerAddress = formData.get('address') as string;
    const investmentAmount = formData.get('investmentAmount') as string;
    const metalType = formData.get('metalType') as string;
    const deliveryPreference = formData.get('deliveryPreference') as string;
    const message = formData.get('message') as string;

    if (!customerName || !customerEmail) {
      return { error: 'Veuillez renseigner votre nom et votre adresse email.' };
    }

    const res = await createClientQuoteRequest({
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      investmentAmount,
      metalType,
      deliveryPreference,
      message,
      userId: user?.id
    });

    if (res.success) {
      revalidatePath('/account/quotes');
      revalidatePath('/admin/quotes');
      return { success: true, quoteId: res.quoteId };
    } else {
      return { error: res.error || 'Erreur lors de la soumission de la demande de devis.' };
    }
  } catch (err: any) {
    return { error: err.message || 'Erreur inattendue.' };
  }
}

/**
 * Admin updates and sends quote PDF to client
 */
export async function adminSendQuoteAction(
  quoteId: string, 
  items: QuoteItem[], 
  total: number, 
  notes?: string, 
  validityDays?: number
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Non authentifié.' };

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Accès réservé aux administrateurs.' };

    const res = await adminFinalizeAndSendQuote(quoteId, {
      items,
      total,
      notes,
      validityDays
    });

    if (res.success) {
      revalidatePath('/admin/quotes');
      revalidatePath('/account/quotes');
      return { success: true };
    } else {
      return { error: res.error };
    }
  } catch (err: any) {
    return { error: err.message || 'Erreur inattendue.' };
  }
}

/**
 * Admin creates manual invoice for client
 */
export async function adminCreateInvoiceAction(data: {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: { productId?: string; title: string; quantity: number; price: number }[];
  total: number;
  paymentMethod?: string;
  status?: 'PAID' | 'PENDING';
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Non authentifié.' };

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Accès réservé aux administrateurs.' };

    const res = await adminCreateDirectInvoice(data);

    if (res.success) {
      revalidatePath('/admin/orders');
      revalidatePath('/admin/quotes');
      revalidatePath('/account/orders');
      return { success: true, orderId: res.orderId };
    } else {
      return { error: res.error };
    }
  } catch (err: any) {
    return { error: err.message || 'Erreur inattendue.' };
  }
}

/**
 * Fetch quote details by ID
 */
export async function getQuoteAction(id: string) {
  return await getQuoteById(id);
}

