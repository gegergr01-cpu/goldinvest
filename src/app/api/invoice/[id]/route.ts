import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { generateInvoicePDF } from '@/lib/pdfGenerator';

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

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    // Permission check: either ADMIN or the order belongs to this user
    if (dbUser.role !== 'ADMIN' && order.userId !== dbUser.id && order.user?.email !== dbUser.email) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const pdfBuffer = await generateInvoicePDF(order);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="facture-${order.id.slice(-6).toUpperCase()}.pdf"`
      }
    });
  } catch (err: any) {
    console.error('Failed to generate invoice PDF:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération de la facture PDF' }, { status: 500 });
  }
}
