const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING PRECIOUS METALS CATEGORIES & PRODUCTS ---');

  // 1. Parent category: Investissement
  let investCat = await prisma.category.findFirst({
    where: { OR: [{ slug: 'investissement' }, { name: 'Investissement' }] }
  });
  if (!investCat) {
    investCat = await prisma.category.create({
      data: { name: 'Investissement', slug: 'investissement' }
    });
  }

  // 2. The 4 Categories
  const categoryDefs = [
    { name: "Lingots d'Or", slug: 'lingots-dor', parentId: investCat.id },
    { name: "Lingots d'Argent", slug: 'lingots-dargent', parentId: investCat.id },
    { name: "Pièces d'Or", slug: 'pieces-dor', parentId: investCat.id },
    { name: "Pièces d'Argent", slug: 'pieces-dargent', parentId: investCat.id },
  ];

  const catMap = {};
  for (const def of categoryDefs) {
    let cat = await prisma.category.findFirst({
      where: { OR: [{ slug: def.slug }, { name: def.name }] }
    });
    if (!cat) {
      cat = await prisma.category.create({ data: def });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Found category: ${cat.name}`);
    }
    catMap[def.slug] = cat.id;
  }

  // 3. Attach existing products to their new categories
  const hafner = await prisma.product.findFirst({
    where: { slug: 'chafner-100-g-goldbarren-minted-gold-bar' },
    include: { categories: true }
  });
  if (hafner) {
    const hasCat = hafner.categories.some(c => c.slug === 'lingots-dor');
    if (!hasCat) {
      await prisma.product.update({
        where: { id: hafner.id },
        data: { categories: { connect: [{ id: catMap['lingots-dor'] }] } }
      });
      console.log('Linked C.Hafner to Lingots d\'Or');
    }
  }

  const existingCoins = await prisma.product.findMany({
    where: { categories: { some: { slug: 'goldm-nze' } } },
    include: { categories: true }
  });
  for (const coin of existingCoins) {
    const hasCat = coin.categories.some(c => c.slug === 'pieces-dor');
    if (!hasCat) {
      await prisma.product.update({
        where: { id: coin.id },
        data: { categories: { connect: [{ id: catMap['pieces-dor'] }] } }
      });
      console.log(`Linked coin ${coin.title} to Pièces d'Or`);
    }
  }

  // 4. Products to insert
  const productsToSeed = [
    // Lingots d'Or
    {
      title: "Lingot d'Or 1 kg LBMA 999.9‰ Valcambi",
      slug: "lingot-or-1kg-lbma-valcambi",
      price: 84500.00,
      images: ["/images/gold-bars.jpg"],
      categories: [catMap['lingots-dor'], investCat.id],
      shortDescription: "Lingot d'or fin 999.9‰ certifié LBMA, fondu par Valcambi Suisse avec certificat d'authenticité scellé."
    },
    {
      title: "Lingot d'Or 50 g C.Hafner Scellé",
      slug: "lingot-or-50g-c-hafner",
      price: 4350.00,
      images: ["/images/gold-bars.jpg"],
      categories: [catMap['lingots-dor'], investCat.id],
      shortDescription: "Lingot d'or 50 grammes C.Hafner sous blister sécurisé avec numéro de série unique certifié."
    },
    {
      title: "Lingot d'Or 1 oz PAMP Suisse Fortuna",
      slug: "lingot-or-1oz-pamp-suisse",
      price: 2680.00,
      images: ["/images/gold-bars.jpg"],
      categories: [catMap['lingots-dor'], investCat.id],
      shortDescription: "Lingot d'or 1 once (31,10g) PAMP Suisse représentant la déesse Fortuna, certificat CertiPAMP inclus."
    },

    // Lingots d'Argent
    {
      title: "Lingot d'Argent 1 kg LBMA 999‰ Heraeus",
      slug: "lingot-argent-1kg-lbma-heraeus",
      price: 1120.00,
      images: ["/images/silver-bars.jpg"],
      categories: [catMap['lingots-dargent'], investCat.id],
      shortDescription: "Lingot d'argent pur 999‰ de 1 kilogramme certifié LBMA produit par Heraeus Allemagne."
    },
    {
      title: "Lingot d'Argent 500 g Umicore Scellé",
      slug: "lingot-argent-500g-umicore",
      price: 580.00,
      images: ["/images/silver-bars.jpg"],
      categories: [catMap['lingots-dargent'], investCat.id],
      shortDescription: "Lingot d'argent fin 500g Umicore scellé d'origine avec numéro d'essai individuel."
    },
    {
      title: "Lingot d'Argent 100 oz Nadir Refinier",
      slug: "lingot-argent-100oz-nadir",
      price: 3450.00,
      images: ["/images/silver-bars.jpg"],
      categories: [catMap['lingots-dargent'], investCat.id],
      shortDescription: "Lingot d'argent d'investissement de 100 onces troy (3,11 kg) coulé par Nadir Refinery certifié LBMA."
    },
    {
      title: "Lingot d'Argent 250 g Valcambi Suisse",
      slug: "lingot-argent-250g-valcambi",
      price: 295.00,
      images: ["/images/silver-bars.jpg"],
      categories: [catMap['lingots-dargent'], investCat.id],
      shortDescription: "Lingot d'argent 250 grammes Valcambi Suisse avec emballage de sécurité inviolable."
    },

    // Pièces d'Argent
    {
      title: "1 Once Argent Silver Eagle USA 2025",
      slug: "1-once-argent-silver-eagle-usa-2025",
      price: 38.50,
      images: ["/images/silver-coins.jpg"],
      categories: [catMap['pieces-dargent'], investCat.id],
      shortDescription: "Pièce d'argent officielle de l'US Mint, 1 once d'argent pur 999‰ millésime 2025."
    },
    {
      title: "1 Once Argent Maple Leaf Canada",
      slug: "1-once-argent-maple-leaf-canada",
      price: 37.20,
      images: ["/images/silver-coins.jpg"],
      categories: [catMap['pieces-dargent'], investCat.id],
      shortDescription: "Pièce d'argent 1 oz Maple Leaf de la Monnaie Royale Canadienne, pureté 999.9‰ avec gravure laser anti-contrefaçon."
    },
    {
      title: "1 Once Argent Philharmonique Vienne",
      slug: "1-once-argent-philharmonique-vienne",
      price: 36.90,
      images: ["/images/silver-coins.jpg"],
      categories: [catMap['pieces-dargent'], investCat.id],
      shortDescription: "Pièce d'argent d'investissement autrichienne 1 once Philharmonique émise par la Münze Österreich."
    },
    {
      title: "1 Once Argent Britannia UK 2025",
      slug: "1-once-argent-britannia-uk-2025",
      price: 37.80,
      images: ["/images/silver-coins.jpg"],
      categories: [catMap['pieces-dargent'], investCat.id],
      shortDescription: "Pièce d'argent 1 oz Britannia de la Royal Mint britannique avec éléments holographiques de sécurité."
    },

    // Pièces d'Or (extra iconic)
    {
      title: "20 Francs Or Napoléon III Tête Nue",
      slug: "20-francs-or-napoleon-iii-tete-nue",
      price: 887.50,
      images: ["/images/gold-coins.jpg"],
      categories: [catMap['pieces-dor'], investCat.id],
      shortDescription: "Pièce d'or historique française de 20 Francs Napoléon III, 6,45g d'or 900‰ (5,8g d'or pur)."
    },
    {
      title: "1 Once Or Krugerrand Afrique du Sud 2025",
      slug: "1-once-or-krugerrand-2025",
      price: 2489.00,
      images: ["/images/gold-coins.jpg"],
      categories: [catMap['pieces-dor'], investCat.id],
      shortDescription: "La pièce d'or d'investissement la plus échangée au monde, 1 once troy d'or pur 22 carats (33,93g)."
    }
  ];

  for (const item of productsToSeed) {
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug }
    });
    if (!existing) {
      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          price: item.price,
          images: item.images,
          shortDescription: item.shortDescription,
          categories: {
            connect: item.categories.map(id => ({ id }))
          }
        }
      });
      console.log(`Created product: ${item.title}`);
    } else {
      console.log(`Product already exists: ${item.title}`);
    }
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

