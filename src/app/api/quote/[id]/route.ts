import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { getQuoteById } from '@/lib/quotes';
import { generateQuotePDF } from '@/lib/pdfGenerator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const quote = await getQuoteById(id);
    if (!quote) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
    }

    // Permission check: either ADMIN or quote email matches user email
    const isOwner = quote.customerEmail?.trim().toLowerCase() === dbUser.email?.trim().toLowerCase();
    if (dbUser.role !== 'ADMIN' && !isOwner) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

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

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="devis-${quote.id.replace('#', '')}.pdf"`
      }
    });
  } catch (err: any) {
    console.error('Failed to generate quote PDF:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération du devis PDF' }, { status: 500 });
  }
}
