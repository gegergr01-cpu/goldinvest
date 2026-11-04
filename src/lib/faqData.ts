export interface FaqTopic {
  id: string;
  category: string;
  icon: string;
  badge: string;
  items: {
    q: string;
    a: string;
    keywords?: string[];
  }[];
}

export const FAQ_DATA: FaqTopic[] = [
  {
    id: 'authenticity',
    category: 'Authenticité & Certification LBMA',
    icon: '🛡️',
    badge: 'Normes Good Delivery',
    items: [
      {
        q: "Comment l'authenticité et la pureté des métaux précieux sont-elles garanties ?",
        a: "Tous nos lingots et pièces proviennent exclusivement de fondeurs et d'affineurs certifiés par la prestigieuse London Bullion Market Association (LBMA) tels que C.Hafner, Valcambi, Heraeus et Umicore. Chaque lingot ou monnaie d'investissement est livré neuf de frappe, sous blister scellé inviolable avec son numéro de série individuel gravé et son certificat d'essai officiel garantissant une pureté minimale de 999.9‰ (24 carats) pour les lingots et de 900‰ à 999.9‰ pour les pièces boursables.",
        keywords: ['lbma', 'purete', 'authenticite', 'certificat', 'valcambi', 'heraeus', 'titrage', 'or pur']
      },
      {
        q: "Qu'est-ce que le label LBMA \"Good Delivery\" et pourquoi est-il crucial ?",
        a: "La London Bullion Market Association (LBMA) est l'autorité suprême de régulation des métaux précieux dans le monde. Le label Good Delivery atteste que l'affineur respecte les critères les plus drastiques de l'industrie en matière de pureté, de pesée, d'intégrité et de conformité éthique. Détenir un produit certifié Good Delivery vous garantit une négociabilité immédiate sur toutes les bourses mondiales (Paris, Londres, Zurich, New York, Tokyo) sans aucune décote ni frais d'analyse complémentaire.",
        keywords: ['good delivery', 'bourse', 'liquidite', 'negoce', 'international', 'fiabilite']
      },
      {
        q: "Pourquoi privilégier des pièces et lingots scellés sous blister d'origine ?",
        a: "Le blister scellé d'origine fait office de certificat d'authenticité infalsifiable et protège l'or de toute rayure, oxydation ou altération physique. Il comporte le poinçon du fondeur essayeur juré, le numéro de série individuel et la date. De plus, sur le plan fiscal, le blister scellé prouve formellement la traçabilité de votre acquisition et permet de bénéficier du régime fiscal de la plus-value réelle dégressive.",
        keywords: ['blister', 'scelle', 'inviolable', 'tracabilite', 'protection', 'poincon']
      },
      {
        q: "Comment vérifier le numéro de série d'un lingot ou lingotin ?",
        a: "Chaque lingot (de 1g à 1kg) possède un numéro de série unique directement gravé au laser dans le métal précieux ainsi qu'imprimé sur le blister sécurisé. Ce même numéro figure sur votre facture officielle d'achat certifiée téléchargeable en PDF dans votre espace client, assurant une parfaite concordance juridique.",
        keywords: ['numero de serie', 'laser', 'facture', 'espace client', 'concordance']
      }
    ]
  },
  {
    id: 'taxation',
    category: 'Fiscalité & Réglementation',
    icon: '💶',
    badge: 'TVA 0% & Plus-Values',
    items: [
      {
        q: "L'or d'investissement est-il soumis à la TVA à l'achat ?",
        a: "Non. En application de la directive européenne 98/80/CE transposée à l'article 262 ter I du Code Général des Impôts (CGI), l'or d'investissement (pièces d'une pureté minimale de 900‰ ayant eu cours légal et lingots d'au moins 995‰) est totalement et légalement exonéré de TVA à l'achat dans l'ensemble de l'Union Européenne.",
        keywords: ['tva', 'exoneration', 'impots', 'cgi', 'taxe', 'reglementation', '262 ter']
      },
      {
        q: "Quelle est la fiscalité applicable à la revente de métaux précieux ?",
        a: "Lors de la revente, l'investisseur résident fiscal français a le choix entre deux régimes fiscaux très avantageux : 1) La Taxe Forfaitaire sur les Métaux Précieux (TMP) fixée à 11,5% du montant brut de la vente, ou 2) Le régime des Plus-Values Réelles (TPV) fixé à 36,2% sur la plus-value nette uniquement, avec un abattement de 5% par an dès la 3ème année de détention. Ce second régime aboutit à une exonération totale d'impôt (0% d'impôt) au bout de 22 ans de détention, sur simple présentation de votre facture d'achat nominative.",
        keywords: ['revente', 'fiscalite', 'plus-value', 'tmp', 'tpv', 'abattement', 'exoneration 22 ans']
      },
      {
        q: "L'or physique est-il soumis à l'Impôt sur la Fortune Immobilière (IFI) ?",
        a: "Non. L'IFI ne concerne strictement que les actifs immobiliers. Les métaux précieux (or, argent, platine physique) sont des biens meubles corporels et n'entrent absolument pas dans l'assiette de calcul de l'IFI.",
        keywords: ['ifi', 'fortune', 'patrimoine', 'assiette', 'meuble', 'declaration']
      },
      {
        q: "L'argent physique bénéficie-t-il également d'une exonération de TVA ?",
        a: "Contrairement à l'or d'investissement, l'argent physique livré à domicile est soumis à la TVA en Europe. Cependant, grâce à notre solution de stockage en coffres sécurisés en zone franche (notamment à Zurich et Singapour), vous pouvez acheter et détenir de l'argent et du platine en totale suspension de TVA (0% TVA) tant que les métaux demeurent dans les coffres francs sous douane.",
        keywords: ['argent', 'zone franche', 'suisse', 'zurich', 'suspension', 'hors taxe']
      }
    ]
  },
  {
    id: 'storage',
    category: 'Stockage Sécurisé & Coffres Hors Banques',
    icon: '🏦',
    badge: 'Zurich · Genève · Paris',
    items: [
      {
        q: "Pourquoi stocker ses métaux précieux hors du système bancaire ?",
        a: "Les coffres bancaires traditionnels sont vulnérables aux faillites des établissements de crédit, aux gels d'avoirs étatiques ou aux fermetures administratives en cas de crise systémique (bail-in financier). Notre solution de stockage s'effectue auprès de gardiens privés indépendants accrédités (Malca-Amit, Loomis, Brink's) dans des zones franches sécurisées, totalement hors de tout bilan bancaire.",
        keywords: ['coffre', 'faillite', 'hors banque', 'suisse', 'loomis', 'brinks', 'malca-amit', 'crise']
      },
      {
        q: "Mes métaux sont-ils détenus en nom propre (100% alloués) ?",
        a: "Oui, sans aucune ambiguïté. Vos métaux sont 100% alloués et ségrégués en nom propre. Vous recevez un certificat de dépôt nominatif officiel avec l'inventaire précis et les numéros de série de vos lingots. Vous demeurez l'unique et direct propriétaire légal à 100%.",
        keywords: ['nom propre', 'alloue', 'segregue', 'certificat de depot', 'proprietaire']
      },
      {
        q: "Comment mes avoirs en coffre sont-ils assurés et audités ?",
        a: "L'intégralité de vos métaux en coffre est couverte par une police d'assurance tous risques souscrite auprès des Lloyd's de Londres à 100% de la valeur de marché boursière en temps réel. De plus, un audit physique indépendant contradictoire est réalisé deux fois par an par des commissaires aux comptes certifiés.",
        keywords: ['assurance', 'lloyds', 'audit', 'commissaire aux comptes', 'securite']
      },
      {
        q: "Puis-je visiter mes coffres ou retirer mes métaux à tout moment ?",
        a: "Oui. En tant que propriétaire direct, vous disposez d'un droit d'accès permanent à vos avoirs. Sur simple notification préalable de 48 heures ouvrées pour organiser le protocole sécurisé, vous pouvez vous rendre sur place dans nos salons privés pour inspecter vos pièces ou procéder à un retrait physique en main propre.",
        keywords: ['visite', 'acces', 'retrait physique', 'salon prive', 'recuperation']
      }
    ]
  },
  {
    id: 'delivery',
    category: 'Livraison Sécurisée & Retrait Privé',
    icon: '🚚',
    badge: 'Assurance 100% Ad Valorem',
    items: [
      {
        q: "Comment se déroule la livraison physique et la discrétion est-elle garantie ?",
        a: "Nos expéditions sont réalisées via des transporteurs spécialisés dans le fret de valeurs (Brink's, Loomis, Malca-Amit ou DHL Express Valeurs). Les colis sont scellés avec un ruban adhésif de sécurité inviolable, neutres et totalement banalisés (aucune mention d'or, d'argent ou du nom commercial n'apparaît sur le paquet). La remise se fait exclusivement en main propre contre signature et vérification d'une pièce d'identité.",
        keywords: ['livraison', 'discretion', 'colis neutre', 'transport', 'signature', 'identite']
      },
      {
        q: "Que se passe-t-il en cas de perte, de vol ou de retard du transporteur ?",
        a: "Vous ne prenez aucun risque financier : nos expéditions sont intégralement couvertes par une assurance ad valorem à 100% de leur valeur marchande. Notre responsabilité contractuelle et celle de l'assureur s'étendent jusqu'au moment où vous apposez physiquement votre signature sur le bordereau de réception. En cas d'incident, un remplacement immédiat ou un remboursement intégral à 100% est exécuté sous 48h.",
        keywords: ['perte', 'vol', 'assurance transport', 'garantie', 'remboursement', 'ad valorem']
      },
      {
        q: "Quels sont les délais d'expédition après validation du règlement ?",
        a: "Pour tous les produits signalés 'En stock', les commandes sont préparées, scellées et expédiées sous 24 à 48 heures ouvrées dès réception du règlement bancaire. Un code de suivi GPS crypté et confidentiel vous est transmis dès l'enlèvement pour suivre le trajet de votre colis en direct.",
        keywords: ['delai', 'expedition', 'suivi gps', '24-48h', 'preparation']
      },
      {
        q: "Puis-je retirer ma commande en main propre dans vos salons privés ?",
        a: "Oui. Si vous préférez éviter le transport postal, nous proposons un service de retrait sécurisé sur rendez-vous dans nos salons privés à Paris, Zurich et Genève. Vous êtes accueilli dans un espace confidentiel haute sécurité pour vérifier vos scellés et prendre possession immédiate de vos actifs.",
        keywords: ['retrait agence', 'main propre', 'paris', 'zurich', 'geneve', 'salon prive']
      }
    ]
  },
  {
    id: 'buyback',
    category: 'Rachat Garanti & Devis d\'Investissement',
    icon: '🔁',
    badge: 'Liquidité sous 24-48h',
    items: [
      {
        q: "Garantissez-vous le rachat de mes pièces et lingots ultérieurement ?",
        a: "Oui, sans aucune restriction de durée. Nous garantissons le rachat permanent de tous les lingots et pièces acquis chez Gold Silver Invest, dès lors que les produits sont conservés dans leur scellé d'origine intact. Pour les métaux stockés dans nos coffres partenaires, le rachat est instantané en un clic car la chaîne de garde est restée 100% inviolée.",
        keywords: ['rachat garanti', 'liquidite', 'reprise', 'chaine de garde', 'revente']
      },
      {
        q: "À quel prix mes métaux sont-ils rachetés et sous quel délai suis-je payé ?",
        a: "Nos prix de rachat sont indexés en temps réel et en toute transparence sur les cours officiels de la bourse de Londres (fixing LBMA) et de Paris, sans décote arbitraire. Dès validation du rachat, le règlement est exécuté par virement bancaire SEPA ou international sous 24 à 48 heures ouvrées sur votre compte bancaire nominatif.",
        keywords: ['prix rachat', 'cours spot', 'fixing', 'virement', 'paiement 24h']
      },
      {
        q: "Comment obtenir un devis personnalisé pour un ordre d'investissement ?",
        a: "Pour les ordres patrimoniaux ou d'entreprises (au-delà de 10 000 €), vous pouvez formuler une demande de devis directement sur notre page dédiée (/devis). Nos spécialistes vous transmettent sous 2h un devis officiel certifié en PDF avec fixation du cours spot, détails d'allocation et conditions de garde ou de livraison.",
        keywords: ['devis', 'devis officiel', 'pdf', 'gros volume', 'patrimoine', 'tresorerie']
      },
      {
        q: "Rachetez-vous également des métaux précieux achetés auprès d'un autre établissement ?",
        a: "Oui. Notre service d'expertise numismatique et de rachat étudie également les pièces d'or boursables (Napoléon 20F, Souverain, Krugerrand...) et les lingots certifiés LBMA acquis auprès d'autres maisons, sous réserve d'un contrôle d'authenticité et de la présentation des justificatifs légaux d'acquisition.",
        keywords: ['expertise', 'autre maison', 'rachat externe', 'napoleon', 'lingot externe']
      }
    ]
  }
];

