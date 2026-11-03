import PDFDocument from 'pdfkit';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export interface QuotePDFData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: {
    title: string;
    quantity: number;
    price: number;
    total?: number;
  }[];
  total: number;
  subtotal?: number;
  notes?: string;
  createdAt: string | Date;
  validUntil?: string | Date;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(d);
};

const formatPaymentMethod = (method: string) => {
  switch (method?.toUpperCase()) {
    case 'BANK_TRANSFER':
      return 'Virement bancaire';
    case 'STRIPE':
      return 'Carte bancaire (Stripe)';
    case 'PAYPAL':
      return 'PayPal';
    default:
      return method || 'N/A';
  }
};

async function getStoreLogoAndInfo() {
  let logoBuffer: Buffer | null = null;
  let storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Gold & Silver Invest';
  let storeEmail = 'contact@goldsilversinvest.com';
  let storePhone = '+33 (0)1 89 71 22 00';
  let storeAddress = '10 Place Vendôme, 75001 Paris, France';

  try {
    const settingsDb = await prisma.setting.findMany({
      where: { key: { in: ['HEADER_LOGO_IMAGE', 'NEXT_PUBLIC_STORE_NAME', 'CONTACT_RECEIVER_EMAIL', 'STORE_PHONE', 'STORE_ADDRESS'] } }
    });
    const sMap = settingsDb.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
    if (sMap.NEXT_PUBLIC_STORE_NAME) storeName = sMap.NEXT_PUBLIC_STORE_NAME;
    if (sMap.CONTACT_RECEIVER_EMAIL) storeEmail = sMap.CONTACT_RECEIVER_EMAIL;
    if (sMap.STORE_PHONE) storePhone = sMap.STORE_PHONE;
    if (sMap.STORE_ADDRESS) storeAddress = sMap.STORE_ADDRESS;

    const logoSetting = sMap['HEADER_LOGO_IMAGE'];
    if (logoSetting && /^https?:\/\//i.test(logoSetting)) {
      try {
        const res = await fetch(logoSetting);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          logoBuffer = Buffer.from(ab);
        }
      } catch (err) {
        // ignore
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback to local logo in public/
  if (!logoBuffer) {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'logo.png'),
      path.join(process.cwd(), 'public', 'logo.jpg')
    ];
    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(p)) {
          logoBuffer = fs.readFileSync(p);
          break;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  return { logoBuffer, storeName, storeEmail, storePhone, storeAddress };
}

// ─────────────────────────────────────────────────────────────
// 1. GENERATE INVOICE PDF (FACTURE)
// ─────────────────────────────────────────────────────────────
export async function generateInvoicePDF(order: any): Promise<Buffer> {
  const { logoBuffer, storeName, storeEmail, storePhone, storeAddress } = await getStoreLogoAndInfo();

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 45, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Parse customer details from order
      let customerName = 'Client';
      let customerEmail = order.user?.email || '';
      let customerPhone = '';
      let customerAddress = '';
      let shippingAddress = '';

      if (order.destinationAddress) {
        try {
          const metadata = typeof order.destinationAddress === 'string' ? JSON.parse(order.destinationAddress) : order.destinationAddress;
          const billing = metadata?.billing || metadata?.shipping;
          const shipping = metadata?.shipping;
          if (billing) {
            customerName = `${billing.firstName || ''} ${billing.lastName || ''}`.trim() || customerName;
            customerEmail = billing.email || customerEmail;
            customerPhone = billing.phone || '';
            const street = [billing.address1, billing.address2, billing.address].filter(Boolean).join(', ');
            const cityPostal = [billing.postalCode, billing.zipCode, billing.city].filter(Boolean).join(' ');
            customerAddress = [street, cityPostal, billing.country].filter(Boolean).join(', ').trim();
          }
          if (shipping) {
            const shipStreet = [shipping.address1, shipping.address2, shipping.address].filter(Boolean).join(', ');
            const shipCityPostal = [shipping.postalCode, shipping.zipCode, shipping.city].filter(Boolean).join(' ');
            shippingAddress = [shipStreet, shipCityPostal, shipping.country].filter(Boolean).join(', ').trim();
          }
        } catch (e) {
          customerAddress = order.destinationAddress;
        }
      }

      // Draw luxury header
      generateDocHeader(doc, logoBuffer, storeName, storeEmail, storePhone, storeAddress, 'FACTURE D\'ACHAT', `#FAC-${order.id.slice(-6).toUpperCase()}`);

      // Order info & customer block
      const startY = 150;
      generateCustomerAndMetaBlock(doc, startY, {
        documentNumberLabel: 'N° de Facture :',
        documentNumber: `#FAC-${order.id.slice(-6).toUpperCase()}`,
        dateLabel: 'Date d\'émission :',
        date: formatDate(new Date(order.createdAt)),
        extraLabel: 'Règlement :',
        extraValue: formatPaymentMethod(order.paymentMethod),
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        secondaryAddressLabel: shippingAddress ? 'Adresse de livraison :' : undefined,
        secondaryAddress: shippingAddress
      });

      // Table of items
      const items = (order.orderItems || []).map((item: any) => ({
        title: item.product?.title || 'Produit Or / Argent d\'investissement',
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }));

      generateTableAndTotals(doc, 290, items, order.total, {
        isInvoice: true,
        legalNotice: "Or d'investissement exonéré de TVA en application de l'article 262 ter I du Code Général des Impôts (CGI). Lingots et pièces certifiés conformes aux standards LBMA."
      });

      // Footer
      generateDocFooter(doc, storeName, storeEmail, storePhone);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 2. GENERATE QUOTE PDF (DEVIS)
// ─────────────────────────────────────────────────────────────
export async function generateQuotePDF(quote: QuotePDFData): Promise<Buffer> {
  const { logoBuffer, storeName, storeEmail, storePhone, storeAddress } = await getStoreLogoAndInfo();

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 45, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const quoteNum = quote.id.startsWith('#') ? quote.id : `#${quote.id}`;

      // Draw luxury header
      generateDocHeader(doc, logoBuffer, storeName, storeEmail, storePhone, storeAddress, 'DEVIS D\'INVESTISSEMENT', quoteNum);

      // Customer and meta block
      const startY = 150;
      generateCustomerAndMetaBlock(doc, startY, {
        documentNumberLabel: 'N° de Devis :',
        documentNumber: quoteNum,
        dateLabel: 'Date d\'émission :',
        date: formatDate(quote.createdAt),
        extraLabel: 'Validité du cours :',
        extraValue: quote.validUntil ? formatDate(quote.validUntil) : '72 heures (Cours LBMA)',
        customerName: quote.customerName || 'Client Investisseur',
        customerEmail: quote.customerEmail,
        customerPhone: quote.customerPhone,
        customerAddress: quote.customerAddress
      });

      // Items table
      const items = (quote.items || []).map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        total: item.total ?? (item.quantity * item.price)
      }));

      generateTableAndTotals(doc, 290, items, quote.total, {
        isInvoice: false,
        legalNotice: "Ce devis est établi sur la base des cours officiels des métaux précieux en direct (LBMA). Le cours et la disponibilité sont réservés pendant 72h à compter de l'émission. TVA 0% sur l'or d'investissement (Art. 262 ter I du CGI)."
      });

      // Bon pour accord section
      const signY = 620;
      doc
        .roundedRect(45, signY, 505, 75, 4)
        .lineWidth(1)
        .strokeColor('#E2E8F0')
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor('#0E2036')
        .text('BON POUR ACCORD ET COMMANDE FERME', 60, signY + 12);

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor('#64748B')
        .text('Date :', 60, signY + 35)
        .text('Signature du client précédée de la mention manuscrite « Bon pour accord » :', 230, signY + 35);

      // Footer
      generateDocFooter(doc, storeName, storeEmail, storePhone);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// REUSABLE DRAWING HELPERS (LUXURY GOLD & NAVY THEME)
// ─────────────────────────────────────────────────────────────

function generateDocHeader(
  doc: typeof PDFDocument,
  logoBuffer: Buffer | null,
  storeName: string,
  storeEmail: string,
  storePhone: string,
  storeAddress: string,
  docTypeTitle: string,
  docNumber: string
) {
  const headerTop = 45;

  // Navy / Gold accent top bar
  doc
    .rect(45, 30, 505, 3)
    .fill('#C8732A');

  // Logo or Store Title
  if (logoBuffer) {
    try {
      doc.image(logoBuffer, 45, headerTop, { width: 140, height: 45, fit: [140, 45] });
    } catch (e) {
      drawTextLogo(doc, storeName, headerTop);
    }
  } else {
    drawTextLogo(doc, storeName, headerTop);
  }

  // Company contact details under logo
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#64748B')
    .text(storeAddress, 45, headerTop + 50)
    .text(`Tél : ${storePhone}  •  Email : ${storeEmail}`, 45, headerTop + 62)
    .text('Spécialiste agréé en métaux précieux & Or d\'investissement LBMA', 45, headerTop + 74);

  // Document Type on Right (Gold/Navy badge style)
  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor('#0E2036')
    .text(docTypeTitle, 280, headerTop + 5, { align: 'right' });

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#C8732A')
    .text(docNumber, 280, headerTop + 30, { align: 'right' });

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor('#64748B')
    .text('Garantie LBMA 999.9‰  •  Coffres Haute Sécurité', 280, headerTop + 48, { align: 'right' });

  // Divider line
  doc
    .strokeColor('#E2E8F0')
    .lineWidth(1)
    .moveTo(45, 135)
    .lineTo(550, 135)
    .stroke();
}

function drawTextLogo(doc: typeof PDFDocument, storeName: string, top: number) {
  doc
    .fillColor('#0E2036')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text(storeName.toUpperCase(), 45, top + 5);

  doc
    .fillColor('#C8732A')
    .fontSize(9)
    .font('Helvetica')
    .text('COMPTOIR PRIVÉ DES MÉTAUX PRÉCIEUX', 45, top + 26);
}

function generateCustomerAndMetaBlock(
  doc: typeof PDFDocument,
  y: number,
  data: {
    documentNumberLabel: string;
    documentNumber: string;
    dateLabel: string;
    date: string;
    extraLabel?: string;
    extraValue?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerAddress?: string;
    secondaryAddressLabel?: string;
    secondaryAddress?: string;
  }
) {
  // Left Box: Document metadata
  doc
    .roundedRect(45, y, 240, 115, 4)
    .fillAndStroke('#F8FAFC', '#E2E8F0');

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#0E2036')
    .text('RÉFÉRENCES DU DOSSIER', 55, y + 10);

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor('#64748B')
    .text(data.documentNumberLabel, 55, y + 30)
    .font('Helvetica-Bold')
    .fillColor('#0E2036')
    .text(data.documentNumber, 150, y + 30)

    .font('Helvetica')
    .fillColor('#64748B')
    .text(data.dateLabel, 55, y + 48)
    .font('Helvetica-Bold')
    .fillColor('#0E2036')
    .text(data.date, 150, y + 48);

  if (data.extraLabel && data.extraValue) {
    doc
      .font('Helvetica')
      .fillColor('#64748B')
      .text(data.extraLabel, 55, y + 66)
      .font('Helvetica-Bold')
      .fillColor('#0E2036')
      .text(data.extraValue, 150, y + 66);
  }

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#10B981')
    .text('✓ Certificat d\'authenticité inclus', 55, y + 90);

  // Right Box: Customer information
  doc
    .roundedRect(300, y, 250, 115, 4)
    .fillAndStroke('#F8FAFC', '#E2E8F0');

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#0E2036')
    .text('DESTINATAIRE / INVESTISSEUR', 312, y + 10);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#0E2036')
    .text(data.customerName, 312, y + 28);

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor('#475569');

  let currentY = y + 43;
  if (data.customerEmail) {
    doc.text(`Email : ${data.customerEmail}`, 312, currentY);
    currentY += 14;
  }
  if (data.customerPhone) {
    doc.text(`Tél : ${data.customerPhone}`, 312, currentY);
    currentY += 14;
  }
  if (data.customerAddress) {
    doc.text(data.customerAddress.replace(/\n/g, ', '), 312, currentY, { width: 228 });
  }
}

function generateTableAndTotals(
  doc: typeof PDFDocument,
  tableTop: number,
  items: { title: string; quantity: number; price: number; total: number }[],
  finalTotal: number,
  options: { isInvoice: boolean; legalNotice: string }
) {
  // Table Header
  doc
    .rect(45, tableTop, 505, 24)
    .fill('#0E2036');

  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor('#FFFFFF')
    .text('DÉSIGNATION DU PRODUIT', 55, tableTop + 7)
    .text('QTÉ', 340, tableTop + 7, { width: 40, align: 'center' })
    .text('PRIX UNITAIRE', 390, tableTop + 7, { width: 75, align: 'right' })
    .text('TOTAL HT / TTC', 475, tableTop + 7, { width: 65, align: 'right' });

  let position = tableTop + 28;

  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = item.title;
      const quantity = item.quantity;
      const price = item.price;
      const lineTotal = item.total ?? (quantity * price);

      // Alternate row backgrounds
      if (i % 2 === 1) {
        doc.rect(45, position - 4, 505, 24).fill('#F8FAFC');
      }

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor('#0E2036')
        .text(title.length > 48 ? title.substring(0, 48) + '...' : title, 55, position)
        .text(quantity.toString(), 340, position, { width: 40, align: 'center' })
        .text(formatPrice(price), 390, position, { width: 75, align: 'right' })
        .font('Helvetica-Bold')
        .text(formatPrice(lineTotal), 475, position, { width: 65, align: 'right' });

      // Line bottom border
      doc
        .strokeColor('#F1F5F9')
        .lineWidth(1)
        .moveTo(45, position + 20)
        .lineTo(550, position + 20)
        .stroke();

      position += 25;
    }
  } else {
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor('#64748B')
      .text('Aucun article spécifié', 55, position);
    position += 25;
  }

  // Totals Section
  const totalsY = Math.max(position + 15, 460);

  // Legal / Tax notice on the left
  doc
    .roundedRect(45, totalsY, 280, 80, 4)
    .fillAndStroke('#FFFBEB', '#FDE68A');

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor('#92400E')
    .text('RÉGIME FISCAL DES MÉTAUX PRÉCIEUX D\'INVESTISSEMENT', 55, totalsY + 8);

  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor('#78350F')
    .text(options.legalNotice, 55, totalsY + 22, { width: 260, lineGap: 1.5 });

  // Totals breakdown on the right
  const rightX = 335;
  const valX = 460;
  const valW = 80;

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#64748B')
    .text('Sous-total HT :', rightX, totalsY + 6)
    .text(formatPrice(finalTotal), valX, totalsY + 6, { width: valW, align: 'right' });

  doc
    .text('TVA (0% Or Investissement) :', rightX, totalsY + 24)
    .text('0,00 €', valX, totalsY + 24, { width: valW, align: 'right' });

  doc
    .text('Livraison assurée / Frais :', rightX, totalsY + 42)
    .text('Inclus', valX, totalsY + 42, { width: valW, align: 'right' });

  // Grand total highlight
  doc
    .rect(rightX - 5, totalsY + 60, 215, 26)
    .fill('#0E2036');

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor('#FFFFFF')
    .text('TOTAL NET À PAYER :', rightX + 5, totalsY + 67);

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#E8A63D')
    .text(formatPrice(finalTotal), valX, totalsY + 67, { width: valW, align: 'right' });
}

function generateDocFooter(doc: typeof PDFDocument, storeName: string, storeEmail: string, storePhone: string) {
  const footerY = 740;

  doc
    .strokeColor('#E2E8F0')
    .lineWidth(1)
    .moveTo(45, footerY)
    .lineTo(550, footerY)
    .stroke();

  doc
    .fontSize(7.5)
    .font('Helvetica-Bold')
    .fillColor('#0E2036')
    .text(`${storeName.toUpperCase()} — COMPTOIR D'ACHAT, DE VENTE ET DE STOCKAGE D'OR & D'ARGENT`, 45, footerY + 8, {
      align: 'center',
      width: 505
    });

  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor('#64748B')
    .text(
      `Pour toute question, contactez votre conseiller dédié au ${storePhone} ou par email à ${storeEmail}`,
      45,
      footerY + 20,
      { align: 'center', width: 505 }
    );
}
