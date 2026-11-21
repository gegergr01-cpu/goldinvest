/**
 * Localized metadata and content dictionary for institutional & legal pages
 * Covering 9 European markets: FR, EN, DE, ES, IT, NL, PT, DA, HU
 */

import { getPageContentHtml } from './pageContentHtml';

export interface LocalizedPageData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  badge: string;
  subtitle: string;
  contentHtml?: string;
}

export const PAGE_TRANSLATIONS: Record<string, Record<string, LocalizedPageData>> = {
  // 1. MENTIONS LÉGALES & IMPRESSUM
  'mentions-legales': {
    fr: {
      title: 'Mentions Légales & Impressum',
      metaTitle: 'Mentions Légales & Impressum | Maison GOLAY INVEST',
      metaDescription: 'Mentions légales et informations juridiques officielles de GOLAY INVEST, société suisse enregistrée sous le numéro CH-626.1.022.620-4.',
      metaKeywords: 'mentions légales, impressum, golay invest, suisse, registre commerce, siteground, edna golay',
      badge: 'Identification Juridique & Impressum',
      subtitle: 'Informations réglementaires relatives à la structure juridique suisse, hébergement et activités de négoce de métaux précieux physiques.',
    },
    en: {
      title: 'Legal Notice & Impressum',
      metaTitle: 'Legal Notice & Impressum | Maison GOLAY INVEST Switzerland',
      metaDescription: 'Official legal notice and company identification of GOLAY INVEST, Swiss company registered under number CH-626.1.022.620-4.',
      metaKeywords: 'legal notice, impressum, golay invest, switzerland, commercial register, siteground, edna golay, bullion trading',
      badge: 'Legal Disclosure & Impressum',
      subtitle: 'Regulatory information regarding the Swiss corporate structure, hosting provider and physical precious metals trading activities.',
    },
    de: {
      title: 'Impressum & Rechtliche Hinweise',
      metaTitle: 'Impressum & Rechtliche Hinweise | Maison GOLAY INVEST Schweiz',
      metaDescription: 'Offizielles Impressum und Unternehmensangaben der GOLAY INVEST, Schweizer Handelsregister-Nr. CH-626.1.022.620-4 in Savièse.',
      metaKeywords: 'impressum, rechtliche hinweise, golay invest, schweiz, handelsregister, siteground, edna golay, edelmetallhandel',
      badge: 'Gesetzliche Anbieterkennzeichnung & Impressum',
      subtitle: 'Rechtliche Pflichtangaben zur Schweizer Gesellschaft, Hostinganbieter und behördlichen Vorschriften zum physischen Edelmetallhandel.',
    },
    es: {
      title: 'Aviso Legal e Impressum',
      metaTitle: 'Aviso Legal e Impressum | Maison GOLAY INVEST Suiza',
      metaDescription: 'Aviso legal e identificación jurídica oficial de GOLAY INVEST, entidad suiza inscrita con el número CH-626.1.022.620-4.',
      metaKeywords: 'aviso legal, impressum, golay invest, suiza, registro mercantil, metales preciosos',
      badge: 'Identificación Jurídica Oficial',
      subtitle: 'Información societaria suiza, proveedor de alojamiento y marco regulatorio de metales preciosos.',
    },
    it: {
      title: 'Note Legali & Impressum',
      metaTitle: 'Note Legali & Impressum | Maison GOLAY INVEST Svizzera',
      metaDescription: 'Note legali e dati societari ufficiali di GOLAY INVEST, società svizzera registrata con il numero CH-626.1.022.620-4.',
      metaKeywords: 'note legali, impressum, golay invest, svizzera, registro di commercio, metalli preziosi',
      badge: 'Identificazione Giuridica Ufficiale',
      subtitle: 'Dati societari svizzeri, hosting provider e normativa sul commercio di metalli preziosi fisici.',
    },
    nl: {
      title: 'Juridische Informatie & Colofon',
      metaTitle: 'Juridische Informatie & Colofon | Maison GOLAY INVEST Zwitserland',
      metaDescription: 'Officiële juridische kennisgeving en bedrijfsgegevens van GOLAY INVEST, Zwitsers handelsregister nr. CH-626.1.022.620-4.',
      metaKeywords: 'juridische informatie, colofon, impressum, golay invest, zwitserland, handelsregister',
      badge: 'Officiële Bedrijfsgegevens',
      subtitle: 'Wettelijke informatie over de Zwitserse vennootschap, hostingprovider en edelmetaalhandel.',
    },
    pt: {
      title: 'Aviso Legal e Impressum',
      metaTitle: 'Aviso Legal e Impressum | Maison GOLAY INVEST Suíça',
      metaDescription: 'Aviso legal e dados societários oficiais da GOLAY INVEST, entidade suíça com o registo comercial CH-626.1.022.620-4.',
      metaKeywords: 'aviso legal, impressum, golay invest, suica, registo comercial, metais preciosos',
      badge: 'Identificação Jurídica Oficial',
      subtitle: 'Informações regulamentares sobre a empresa suíça, alojamento web e comércio de ouro físico.',
    },
    da: {
      title: 'Juridiske Oplysninger & Impressum',
      metaTitle: 'Juridiske Oplysninger & Impressum | Maison GOLAY INVEST Schweiz',
      metaDescription: 'Officielle juridiske oplysninger for GOLAY INVEST, schweizisk CVR-nr. CH-626.1.022.620-4 i Savièse.',
      metaKeywords: 'juridiske oplysninger, impressum, golay invest, schweiz, handelsregister',
      badge: 'Lovpligtige Selskabsoplysninger',
      subtitle: 'Regulatoriske oplysninger om det schweiziske selskab, webhost og handel med investeringsguld.',
    },
    hu: {
      title: 'Jogi Nyilatkozat & Impresszum',
      metaTitle: 'Jogi Nyilatkozat & Impresszum | Maison GOLAY INVEST Svájc',
      metaDescription: 'A GOLAY INVEST hivatalos cégadatai és jogi nyilatkozata. Svájci cégjegyzékszám: CH-626.1.022.620-4.',
      metaKeywords: 'jogi nyilatkozat, impresszum, golay invest, svajc, cegjegyzek, nemesfem kereskedelem',
      badge: 'Hivatalos Céginformáció & Impresszum',
      subtitle: 'A svájci társaság adatai, webtárhely-szolgáltató és nemesfém-kereskedelmi szabályozás.',
    }
  },

  // 2. CONDITIONS GÉNÉRALES DE VENTE (CGV / TERMS / AGB)
  'conditions-generales-de-vente': {
    fr: {
      title: 'Conditions Générales de Vente (CGV)',
      metaTitle: 'Conditions Générales de Vente (CGV) | Maison GOLAY INVEST',
      metaDescription: 'Conditions générales de vente de métaux précieux physiques d’investissement. Fixation des cours en direct LBMA et exclusion légale du droit de rétractation.',
      metaKeywords: 'cgv, conditions generales de vente, or investissement, lbma spot, exclusion retractation, livraison securisee, droit suisse',
      badge: 'Cadre Contractuel Officiel',
      subtitle: 'Règles contractuelles régissant les commandes fermes, la fixation des cours boursiers en direct et la livraison de métaux précieux.',
    },
    en: {
      title: 'General Terms & Conditions of Sale',
      metaTitle: 'General Terms of Sale (GTC) | Maison GOLAY INVEST Switzerland',
      metaDescription: 'Terms and conditions for buying physical bullion. Live LBMA spot fixing, no right of withdrawal on financial products, and insured delivery.',
      metaKeywords: 'terms of sale, gtc, bullion purchase, lbma spot, withdrawal right exclusion, insured shipment, swiss law',
      badge: 'Official Contractual Framework',
      subtitle: 'Contractual terms governing binding orders, real-time bullion market fixing, and insured high-security delivery.',
    },
    de: {
      title: 'Allgemeine Geschäftsbedingungen (AGB)',
      metaTitle: 'Allgemeine Geschäftsbedingungen (AGB) | Maison GOLAY INVEST Schweiz',
      metaDescription: 'AGB für den Kauf physischer Edelmetalle zur Kapitalanlage. Live-Fixing nach LBMA-Kursen und gesetzlicher Ausschluss des Widerrufsrechts.',
      metaKeywords: 'agb, allgemeine geschaeftsbedingungen, edelmetallkauf, lbma spot, widerrufsrecht ausschluss, versicherter transport, schweizer recht',
      badge: 'Vertragliche Bestimmungen',
      subtitle: 'Rechtliche Rahmenbedingungen für verbindliche Bestellungen, Echtzeit-Kursfixierung und vollversicherten Werttransport.',
    },
    es: {
      title: 'Condiciones Generales de Venta (CGV)',
      metaTitle: 'Condiciones Generales de Venta | Maison GOLAY INVEST Suiza',
      metaDescription: 'Condiciones de compraventa de oro y plata de inversión. Fijación de cotización spot LBMA y exclusión del derecho de desistimiento.',
      metaKeywords: 'condiciones de venta, cgv, compra oro, spot lbma, desistimiento, envio asegurado',
      badge: 'Marco Contractual Oficial',
      subtitle: 'Condiciones aplicables a las órdenes vinculantes de compra y entrega asegurada de metales preciosos.',
    },
    it: {
      title: 'Condizioni Generali di Vendita (CGV)',
      metaTitle: 'Condizioni Generali di Vendita | Maison GOLAY INVEST Svizzera',
      metaDescription: 'Condizioni generali per l’acquisto di oro e argento fisico. Fissazione del prezzo al corso spot LBMA ed esclusione del diritto di recesso.',
      metaKeywords: 'condizioni di vendita, cgv, lingotti oro, corso lbma, esclusione recesso, spedizione assicurata',
      badge: 'Quadro Contrattuale Ufficiale',
      subtitle: 'Termini applicabili agli ordini vincolanti e alla spedizione assicurata di metalli preziosi fisici.',
    },
    nl: {
      title: 'Algemene Verkoopvoorwaarden (AVV)',
      metaTitle: 'Algemene Verkoopvoorwaarden | Maison GOLAY INVEST Zwitserland',
      metaDescription: 'Voorwaarden voor aankoop van fysieke beleggingsmetalen. Realtime LBMA spotkoerskoppeling en wettelijke uitsluiting van herroepingsrecht.',
      metaKeywords: 'verkoopvoorwaarden, avv, goudbaren kopen, lbma spot, herroepingsrecht uitsluiting',
      badge: 'Contractuele Voorwaarden',
      subtitle: 'Voorwaarden voor bindende orders, realtime koersfixatie en verzekerd waardetransport.',
    },
    pt: {
      title: 'Termos e Condições Gerais de Venda',
      metaTitle: 'Condições Gerais de Venda | Maison GOLAY INVEST Suíça',
      metaDescription: 'Condições de aquisição de metais preciosos de investimento. Fixação do preço à cotação spot LBMA e exclusão do direito de livre resolução.',
      metaKeywords: 'termos de venda, cgv, compra ouro, spot lbma, direito livre resolucao, envio seguro',
      badge: 'Enquadramento Contratual Oficial',
      subtitle: 'Condições aplicáveis às encomendas vinculativas e entrega segura de metais preciosos.',
    },
    da: {
      title: 'Generelle Salgs- og Leveringsbetingelser',
      metaTitle: 'Salgsbetingelser | Maison GOLAY INVEST Schweiz',
      metaDescription: 'Salgsbetingelser for køb af fysiske investeringsmetaller. Fastlåsning til live LBMA-spotkurser og lovpligtig undtagelse fra fortrydelsesret.',
      metaKeywords: 'salgsbetingelser, guldhandel, lbma spotkurs, fortrydelsesret undtagelse, forsikret transport',
      badge: 'Officielle Salgsbetingelser',
      subtitle: 'Betingelser for bindende ordrer, realtids kursfastsættelse og fuldt forsikret levering.',
    },
    hu: {
      title: 'Általános Szerződési Feltételek (ÁSZF)',
      metaTitle: 'Általános Szerződési Feltételek | Maison GOLAY INVEST Svájc',
      metaDescription: 'Befektetési nemesfém vásárlási feltételek. Valós idejű LBMA árfolyam-rögzítés és a pénzügyi termékekre vonatkozó elállási jog kizárása.',
      metaKeywords: 'aszf, vasarlasi feltetelek, aranytomb vasarlas, lbma arfolyam, elallasi jog kizarasa',
      badge: 'Hivatalos Szerződési Keret',
      subtitle: 'Kötött megrendelések, valós idejű tőzsdei árfolyam-rögzítés és biztosított szállítási feltételek.',
    }
  },

  // 3. POLITIQUE DE CONFIDENTIALITÉ (PRIVACY POLICY / RGPD / DSGVO)
  'politique-de-confidentialite': {
    fr: {
      title: 'Politique de Confidentialité & RGPD / LPD',
      metaTitle: 'Politique de Confidentialité & RGPD / nLPD | Maison GOLAY INVEST',
      metaDescription: 'Protection de vos données personnelles selon la nLPD suisse et le RGPD européen. Confidentialité absolue de vos transactions sur l’or physique.',
      metaKeywords: 'politique confidentialite, rgpd, nlpd suisse, donnees personnelles, securite bancaire, discretion',
      badge: 'Protection des Données & Confidentialité',
      subtitle: 'Respect scrupuleux du secret d’affaires suisse, de la nouvelle Loi fédérale sur la Protection des Données (nLPD) et du RGPD.',
    },
    en: {
      title: 'Privacy Policy & GDPR / Swiss FADP',
      metaTitle: 'Privacy Policy (GDPR & Swiss FADP) | Maison GOLAY INVEST',
      metaDescription: 'Personal data protection compliant with the Swiss revised FADP and EU GDPR. Total privacy and discretion for physical precious metals transactions.',
      metaKeywords: 'privacy policy, gdpr, swiss fadp, data protection, financial privacy, swiss discretion',
      badge: 'Data Protection & Swiss Privacy',
      subtitle: 'Strict adherence to Swiss business confidentiality, the Swiss Federal Act on Data Protection (FADP), and the European GDPR.',
    },
    de: {
      title: 'Datenschutzerklärung (DSGVO & Schweizer DSG)',
      metaTitle: 'Datenschutzerklärung (revDSG & DSGVO) | Maison GOLAY INVEST',
      metaDescription: 'Schutz personenbezogener Daten gemäß dem neuen Schweizer Datenschutzgesetz (revDSG) und der EU-DSGVO. Maximale Diskretion beim Edelmetallkauf.',
      metaKeywords: 'datenschutzerklärung, revdsg schweiz, dsgvo, datenschutz, bankgeheimnis, diskretion edelmetalle',
      badge: 'Datenschutz & Schweizer Diskretion',
      subtitle: 'Strenge Einhaltung des Schweizer Berufsgeheimnisses, des revidierten Datenschutzgesetzes (revDSG) und der EU-DSGVO.',
    },
    es: {
      title: 'Política de Privacidad y RGPD / LPD Suiza',
      metaTitle: 'Política de Privacidad (RGPD y LPD Suiza) | Maison GOLAY INVEST',
      metaDescription: 'Tratamiento confidencial de datos según la LPD suiza y el RGPD europeo. Máxima discreción en la adquisición de metales preciosos.',
      metaKeywords: 'politica privacidad, rgpd, lpd suiza, proteccion datos, confidencialidad',
      badge: 'Protección de Datos y Discreción',
      subtitle: 'Conformidad con la legislación suiza de protección de datos y el Reglamento General de Protección de Datos de la UE.',
    },
    it: {
      title: 'Informativa sulla Privacy & RGPD / LPD Svizzera',
      metaTitle: 'Informativa Privacy (RGPD e LPD Svizzera) | Maison GOLAY INVEST',
      metaDescription: 'Protezione dei dati personali secondo la nuova LPD svizzera e il RGPD europeo. Riservatezza assoluta sulle transazioni in oro da investimento.',
      metaKeywords: 'informativa privacy, rgpd, lpd svizzera, protezione dati, riservatezza finanziaria',
      badge: 'Protezione dei Dati & Riservatezza',
      subtitle: 'Rigoroso rispetto del segreto professionale svizzero e degli standard europei di sicurezza dei dati.',
    },
    nl: {
      title: 'Privacybeleid (AVG & Zwitserse WBG)',
      metaTitle: 'Privacybeleid (AVG & Zwitserse WBG) | Maison GOLAY INVEST',
      metaDescription: 'Persoonsgegevensbescherming conform de herziene Zwitserse Datenschutzwet en de Europese AVG. Totale discretie bij goudtransacties.',
      metaKeywords: 'privacybeleid, avg, gdpr, zwitserse privacywet, gegevensbescherming',
      badge: 'Gegevensbescherming & Discretie',
      subtitle: 'Strikte naleving van het Zwitserse zakengeheim en de Europese privacyregelgeving.',
    },
    pt: {
      title: 'Política de Privacidade e RGPD / LPD Suíça',
      metaTitle: 'Política de Privacidade (RGPD & LPD Suíça) | Maison GOLAY INVEST',
      metaDescription: 'Proteção de dados pessoais de acordo com a nLPD suíça e o RGPD da UE. Máxima discrição na aquisição de ouro e prata físicos.',
      metaKeywords: 'politica privacidade, rgpd, lpd suica, protecao dados, sigilo financeiro',
      badge: 'Proteção de Dados & Sigilo',
      subtitle: 'Cumprimento integral dos regulamentos de privacidade suíço e europeu.',
    },
    da: {
      title: 'Privatlivspolitik & GDPR / Schweizisk DSG',
      metaTitle: 'Privatlivspolitik (GDPR & Schweizisk Lov) | Maison GOLAY INVEST',
      metaDescription: 'Beskyttelse af personoplysninger i overensstemmelse med schweizisk databeskyttelseslov og EU-GDPR. Fuld diskretion ved ædelmetalhandler.',
      metaKeywords: 'privatlivspolitik, gdpr, schweizisk databeskyttelse, datasikkerhed',
      badge: 'Databeskyttelse & Schweizisk Diskretion',
      subtitle: 'Fuld overholdelse af den schweiziske databeskyttelseslov og EU’s persondataforordning.',
    },
    hu: {
      title: 'Adatvédelmi Tájékoztató (GDPR & Svájci DSG)',
      metaTitle: 'Adatvédelmi Tájékoztató (GDPR) | Maison GOLAY INVEST Svájc',
      metaDescription: 'Személyes adatok védelme a svájci adatvédelmi törvény és az EU GDPR előírásai szerint. Teljes diszkréció nemesfém vásárlásakor.',
      metaKeywords: 'adatvedelmi tajekoztato, gdpr, svajci adatvedelem, szemelyes adatok vedelme',
      badge: 'Adatvédelem & Svájci Diszkréció',
      subtitle: 'A svájci üzleti titoktartási előírások és az európai adatvédelmi rendelet szigorú betartása.',
    }
  },

  // 4. SÉCURITÉ & GARDIENNAGE (SECURITY)
  'security': {
    fr: {
      title: 'Sécurité, Gardiennage & Certification LBMA',
      metaTitle: 'Sécurité, Gardiennage & Certification LBMA | Maison GOLAY INVEST',
      metaDescription: 'Conservation de vos lingots en coffres-forts haute sécurité en Suisse hors système bancaire. Assurance tous risques 100% Lloyd’s of London et lingots neufs certifiés.',
      metaKeywords: 'sécurité or, coffre suisse, gardiennage hors banque, assurance lloyds, certification lbma, valcambi',
      badge: 'Coffres Haute Sécurité & Assurance Lloyd’s',
      subtitle: 'Infrastructures ultra-sécurisées en Suisse, audits sous contrôle notarié et assurance intégrale à 100% au cours de remplacement.',
    },
    en: {
      title: 'Security, Vault Custody & LBMA Certification',
      metaTitle: 'Security, Vault Storage & LBMA Standards | Maison GOLAY INVEST',
      metaDescription: 'Allocate your bullion in high-security vaults in Switzerland outside the banking system. 100% all-risks insurance by Lloyd’s of London and certified LBMA ingots.',
      metaKeywords: 'gold security, swiss vault storage, unbanked custody, lloyds insurance, lbma certified, valcambi',
      badge: 'High-Security Vaults & Lloyd’s Cover',
      subtitle: 'Ultra-secure storage in Switzerland, audited under notary supervision and 100% insured at current replacement market value.',
    },
    de: {
      title: 'Sicherheit, Tresorlagerung & LBMA-Zertifizierung',
      metaTitle: 'Sicherheit, Tresorlagerung & LBMA-Standard | Maison GOLAY INVEST',
      metaDescription: 'Lagerung Ihrer Goldbarren in Schweizer Hochsicherheits-Tresoranlagen außerhalb des Bankensystems. 100% Vollkaskoversicherung über Lloyd’s of London.',
      metaKeywords: 'gold sicherheit, tresorlagerung schweiz, bankenunabhängig, lloyds versicherung, lbma zertifiziert, valcambi',
      badge: 'Hochsicherheitslagerung & Lloyd’s Versicherung',
      subtitle: 'Bankenunabhängige Tresorräume in der Schweiz, notariell überwachte Audits und 100% Wiederbeschaffungswert-Deckung.',
    },
    es: {
      title: 'Seguridad, Custodia en Suiza y Certificación LBMA',
      metaTitle: 'Seguridad, Bóvedas en Suiza y LBMA | Maison GOLAY INVEST',
      metaDescription: 'Almacenamiento en cámaras acorazadas en Suiza fuera del sistema bancario. Seguro a todo riesgo al 100% con Lloyd’s of London.',
      metaKeywords: 'seguridad oro, camaras acorazadas suiza, custodia fuera de banco, seguro lloyds, lbma',
      badge: 'Cámaras Acorazadas & Seguro Lloyd’s',
      subtitle: 'Custodia de máxima seguridad en territorio helvético con auditorías externas periódicas.',
    },
    it: {
      title: 'Sicurezza, Custodia in Caveau & Certificazione LBMA',
      metaTitle: 'Sicurezza, Caveau Svizzeri & Certificazione LBMA | GOLAY INVEST',
      metaDescription: 'Custodia dei lingotti in caveau di massima sicurezza in Svizzera al di fuori del circuito bancario. Copertura assicurativa 100% Lloyd’s of London.',
      metaKeywords: 'sicurezza oro, caveau svizzeri, custodia extra bancaria, assicurazione lloyds, certificazione lbma',
      badge: 'Caveau di Massima Sicurezza & Lloyd’s',
      subtitle: 'Stoccaggio protetto in Svizzera con inventari verificati e assicurazione integrale al valore spot.',
    },
    nl: {
      title: 'Veiligheid, Kluisopslag & LBMA-Certificering',
      metaTitle: 'Veiligheid, Zwitserse Kluisopslag & LBMA | GOLAY INVEST',
      metaDescription: 'Opslag van uw goudbaren in zwaarbeveiligde Zwitserse kluizen buiten het banksysteem. 100% verzekerd via Lloyd’s of London.',
      metaKeywords: 'goudveiligheid, zwitserse kluisopslag, niet bancair, lloyds verzekering, lbma gecertificeerd',
      badge: 'Zwaarbeveiligde Kluizen & Lloyd’s Dekking',
      subtitle: 'Bankonafhankelijke opslag in Zwitserland met notariële inventarisatie en 100% risicodekking.',
    },
    pt: {
      title: 'Segurança, Cofres na Suíça e Certificação LBMA',
      metaTitle: 'Segurança, Cofres na Suíça & LBMA | GOLAY INVEST',
      metaDescription: 'Armazenamento em cofres-fortes na Suíça fora do sistema bancário. Seguro total 100% Lloyd’s of London e barras certificadas LBMA.',
      metaKeywords: 'seguranca ouro, cofres suica, custodia fora da banca, seguro lloyds, certificacao lbma',
      badge: 'Cofres de Alta Segurança & Seguro Lloyd’s',
      subtitle: 'Instalações ultrasseguras na Suíça com cobertura integral à cotação do dia.',
    },
    da: {
      title: 'Sikkerhed, Boksopbevaring & LBMA-Certificering',
      metaTitle: 'Sikkerhed & Schweizisk Boksopbevaring | GOLAY INVEST',
      metaDescription: 'Opbevaring af guldbarrer i schweiziske højsikkerhedsbokse uden for banksystemet. 100% all-risk forsikring hos Lloyd’s of London.',
      metaKeywords: 'guldsikkerhed, boksopbevaring schweiz, uden om banken, lloyds forsikring, lbma certificeret',
      badge: 'Højsikkerhedsbokse & Lloyd’s Forsikring',
      subtitle: 'Bankuafhængig opbevaring i Schweiz med løbende revision og fuld dækning til dagskurs.',
    },
    hu: {
      title: 'Biztonság, Széfőrzés & LBMA Minősítés',
      metaTitle: 'Biztonság, Svájci Széfőrzés & LBMA | GOLAY INVEST',
      metaDescription: 'Nemesfémek őrzése svájci szigorúan védett trezorokban a bankrendszeren kívül. 100%-os Lloyd’s of London összkockázati biztosítás.',
      metaKeywords: 'arany biztonsag, svajci szeforzes, bankfuggetlen trezor, lloyds biztositas, lbma tanusitvany',
      badge: 'Maximális Biztonságú Trezor & Lloyd’s',
      subtitle: 'Bankrendszertől független értékőrzés Svájcban rendszeres független leltárellenőrzéssel.',
    }
  },

  // 5. À PROPOS DE LA MAISON GOLAY INVEST (ABOUT)
  'about': {
    fr: {
      title: 'À Propos de la Maison GOLAY INVEST',
      metaTitle: 'À Propos de la Maison GOLAY INVEST | Négoce de Métaux Précieux Suisse',
      metaDescription: 'Découvrez l’histoire, l’expertise et les engagements de la Maison GOLAY INVEST, société suisse spécialisée dans l’or et l’argent physique d’investissement.',
      metaKeywords: 'a propos golay invest, maison golay, edna golay, saviese, negoce metaux precieux, or physique suisse',
      badge: 'Tradition & Rigueur Helvétique',
      subtitle: 'Une maison de négoce fondée sur l’intégrité, la transparence absolue des cours et l’excellence du service patrimonial.',
    },
    en: {
      title: 'About Maison GOLAY INVEST',
      metaTitle: 'About Maison GOLAY INVEST | Swiss Precious Metals Dealer',
      metaDescription: 'Discover the history, heritage and values of Maison GOLAY INVEST, independent Swiss dealer specializing in physical investment gold and silver.',
      metaKeywords: 'about golay invest, swiss bullion dealer, edna golay, saviese switzerland, gold investment, lbma bars',
      badge: 'Swiss Heritage & Precision',
      subtitle: 'A bullion trading house built on financial integrity, full price transparency, and private wealth excellence.',
    },
    de: {
      title: 'Über das Haus GOLAY INVEST',
      metaTitle: 'Über das Haus GOLAY INVEST | Schweizer Edelmetallhandel',
      metaDescription: 'Erfahren Sie mehr über Geschichte, Werte und Expertise von Maison GOLAY INVEST, Ihrem Schweizer Partner für physische Edelmetallinvestitionen.',
      metaKeywords: 'ueber golay invest, schweizer edelmetallhaus, edna golay, saviese schweiz, anlagegold, feinsilber',
      badge: 'Schweizer Tradition & Präzision',
      subtitle: 'Ein Handelshaus begründet auf Verlässlichkeit, transparenter Preisgestaltung und erstklassiger Vermögenssicherung.',
    },
    es: {
      title: 'Acerca de Maison GOLAY INVEST',
      metaTitle: 'Acerca de Maison GOLAY INVEST | Distribuidor Suizo de Metales Preciosos',
      metaDescription: 'Conozca la historia, valores y rigor de Maison GOLAY INVEST, empresa suiza experta en oro y plata física de inversión.',
      metaKeywords: 'acerca de golay invest, entidad suiza oro, edna golay, saviese suiza, lingotes certificados',
      badge: 'Tradición y Excelencia Suiza',
      subtitle: 'Dedicados a la preservación del patrimonio familiar con metales preciosos físicos de pureza garantizada.',
    },
    it: {
      title: 'Chi Siamo — Maison GOLAY INVEST',
      metaTitle: 'Chi Siamo | Maison GOLAY INVEST Svizzera',
      metaDescription: 'Scopri la storia, i valori e la solida esperienza di Maison GOLAY INVEST, società svizzera specializzata nel commercio di metalli preziosi fisici.',
      metaKeywords: 'chi siamo golay invest, operatore professionale oro, edna golay, saviese svizzera, lingotti lbma',
      badge: 'Tradizione & Precisione Svizzera',
      subtitle: 'Competenza elvetica al servizio della protezione e trasmissione del vostro patrimonio tangibile.',
    },
    nl: {
      title: 'Over Maison GOLAY INVEST',
      metaTitle: 'Over Maison GOLAY INVEST | Zwitserse Edelmetaalhandelaar',
      metaDescription: 'Lees meer over de geschiedenis en de waarden van Maison GOLAY INVEST, uw Zwitserse partner voor fysiek beleggingsgoud en -zilver.',
      metaKeywords: 'over golay invest, zwitsers goudhuis, edna golay, fysiek beleggen, gecertificeerde goudbaren',
      badge: 'Zwitserse Traditie & Betrouwbaarheid',
      subtitle: 'Een handelshuis gefundeerd op integriteit, directe beurskoppeling en discrete vermogensbescherming.',
    },
    pt: {
      title: 'Sobre a Maison GOLAY INVEST',
      metaTitle: 'Sobre a Maison GOLAY INVEST | Negociante Suíço de Ouro e Prata',
      metaDescription: 'Conheça a história e o compromisso da Maison GOLAY INVEST, empresa suíça especializada em metais preciosos físicos de investimento.',
      metaKeywords: 'sobre golay invest, empresa suica ouro, edna golay, metais preciosos fisicos, barras lbma',
      badge: 'Tradição & Rigor Suíço',
      subtitle: 'Uma casa de negociação assente na transparência integral de preços e na preservação de património.',
    },
    da: {
      title: 'Om Maison GOLAY INVEST',
      metaTitle: 'Om Maison GOLAY INVEST | Schweizisk Guld- og Sølvhandler',
      metaDescription: 'Lær om historien og værdierne hos Maison GOLAY INVEST, din uafhængige schweiziske partner til køb af fysiske ædelmetaller.',
      metaKeywords: 'om golay invest, schweizisk guldhandler, edna golay, investeringsguld, lbma barrer',
      badge: 'Schweizisk Tradition & Præcision',
      subtitle: 'Et ædelmetalhus bygget på fuldstændig gennemsigtighed, pålidelighed og sikker formuebeskyttelse.',
    },
    hu: {
      title: 'A Maison GOLAY INVEST Bemutatása',
      metaTitle: 'Rólunk | Maison GOLAY INVEST Svájc',
      metaDescription: 'Ismerje meg a Maison GOLAY INVEST történetét és szakértelmét. Svájci megbízhatóság fizikai arany és ezüst befektetések terén.',
      metaKeywords: 'rolunk golay invest, svajci aranykereskedo, edna golay, fizikai arany, vagyongyarapodas',
      badge: 'Svájci Tradíció & Precizitás',
      subtitle: 'Pénzügyi integritásra, valós idejű tőzsdei árazásra és független vagyonvédelemre épülő nemesfémház.',
    }
  },

  // 6. COMMENT COMMANDER (HOW TO ORDER)
  'how-to-order': {
    fr: {
      title: 'Comment Commander | Guide Pratique',
      metaTitle: 'Comment Commander de l’Or Physique | Guide Pratique GOLAY INVEST',
      metaDescription: 'Guide pratique étape par étape pour acheter des lingots et pièces d’or : cours spot en direct, virement bancaire sécurisé, KYC et livraison assurée ou garde en coffre.',
      metaKeywords: 'comment commander or, etapes achat lingot, paiement securise or, livraison blindee, kyc metaux precieux',
      badge: 'Guide Pratique d’Achat en 4 Étapes',
      subtitle: 'Processus d’acquisition simple, transparent et sécurisé selon les plus hauts standards bancaires suisses.',
    },
    en: {
      title: 'How to Order | Practical Buying Guide',
      metaTitle: 'How to Order Physical Bullion | GOLAY INVEST Practical Guide',
      metaDescription: 'Step-by-step guide to buying gold and silver bars and coins: live price locking, verified bank wire, KYC compliance, and fully insured delivery or vault custody.',
      metaKeywords: 'how to order gold, buy bullion online, price locking, insured delivery, bullion kyc',
      badge: '4-Step Practical Buying Guide',
      subtitle: 'A straightforward, transparent and bank-grade secure purchasing process under Swiss regulatory standards.',
    },
    de: {
      title: 'Bestellanleitung | Schritt-für-Schritt Leitfaden',
      metaTitle: 'So bestellen Sie Edelmetalle | GOLAY INVEST Leitfaden',
      metaDescription: 'Praktischer Leitfaden zum Kauf von Barren und Münzen: Live-Preisfixierung, Banküberweisung, Legitimationsprüfung und Werttransport oder Tresorlagerung.',
      metaKeywords: 'edelmetalle bestellen anleitung, goldbarren kaufen ablauf, kursfixierung, werttransport, kyc verfahren',
      badge: 'Praktischer 4-Schritte-Kaufleitfaden',
      subtitle: 'Einfacher, transparenter und bankenkonformer Bestellablauf nach Schweizer Qualitätskriterien.',
    },
    es: {
      title: 'Cómo Realizar un Pedido | Guía Práctica',
      metaTitle: 'Cómo Comprar Oro Físico | Guía GOLAY INVEST',
      metaDescription: 'Guía paso a paso para comprar lingotes y monedas: fijación del precio en directo, transferencia bancaria, KYC y entrega con seguro.',
      metaKeywords: 'como comprar oro, pasos compra lingotes, pago seguro, envio blindado',
      badge: 'Guía Práctica de Compra en 4 Pasos',
      subtitle: 'Proceso de compra sencillo, transparente y altamente protegido bajo estándares bancarios suizos.',
    },
    it: {
      title: 'Come Ordinare | Guida all’Acquisto',
      metaTitle: 'Come Acquistare Oro Fisico | Guida Pratica GOLAY INVEST',
      metaDescription: 'Guida passo per passo all’acquisto di lingotti e monete: blocco del prezzo in tempo reale, bonifico bancario, KYC e spedizione blindata assicurata.',
      metaKeywords: 'come ordinare oro, acquisto lingotti online, bonifico sicuro, spedizione assicurata oro',
      badge: 'Guida Pratica in 4 Semplici Passaggi',
      subtitle: 'Procedura d’acquisto lineare, trasparente e conforme ai più rigorosi standard bancari elvetici.',
    },
    nl: {
      title: 'Hoe te Bestellen | Praktische Gids',
      metaTitle: 'Hoe Fysiek Goud Bestellen | Gids GOLAY INVEST',
      metaDescription: 'Stap-voor-stap handleiding voor het kopen van goud en zilver: realtime koersvergrendeling, bankoverschrijving, KYC en verzekerde levering.',
      metaKeywords: 'hoe goud bestellen, goudbaren online kopen, koers vastzetten, verzekerd transport',
      badge: 'Praktische Koopgids in 4 Stappen',
      subtitle: 'Eenvoudig, transparant en optimaal beveiligd aankoopproces volgens Zwitserse maatstaven.',
    },
    pt: {
      title: 'Como Encomendar | Guia Prático',
      metaTitle: 'Como Comprar Ouro Físico | Guia GOLAY INVEST',
      metaDescription: 'Guia passo a passo para comprar barras e moedas: fixação da cotação em tempo real, transferência bancária, KYC e entrega 100% segura.',
      metaKeywords: 'como comprar ouro, passos compra barras, pagamento seguro, envio blindado',
      badge: 'Guia Prático de Compra em 4 Passos',
      subtitle: 'Processo de aquisição simples, transparente e com os mais elevados padrões bancários suíços.',
    },
    da: {
      title: 'Sådan Bestiller Du | Praktisk Købsguide',
      metaTitle: 'Sådan Køber Du Guld & Sølv | Guide GOLAY INVEST',
      metaDescription: 'Trin-for-trin vejledning til køb af guldbarrer og mønter: fastlåsning af live-kurs, bankoverførsel, KYC-verifikation og forsikret værditransport.',
      metaKeywords: 'hvordan kober man guld, bestilling af guldbarrer, sikker betaling, forsikret forsendelse',
      badge: 'Praktisk Købsguide i 4 Trin',
      subtitle: 'En ligetil, gennemskuelig og sikker købsproces efter schweiziske kvalitetsstandarder.',
    },
    hu: {
      title: 'Hogyan Rendelhet | Gyakorlati Útmutató',
      metaTitle: 'Hogyan Vásárolhat Nemesfémet | GOLAY INVEST Útmutató',
      metaDescription: 'Lépésről lépésre útmutató aranytömbök és érmék vásárlásához: valós idejű árfolyamrögzítés, banki átutalás, KYC és biztosított szállítás.',
      metaKeywords: 'hogyan rendelhet aranyat, aranyvasarlas lepesei, biztonsagos atutalas, ertekszallitas',
      badge: 'Gyakorlati Vásárlási Útmutató 4 Lépésben',
      subtitle: 'Átlátható, banki szinten védett vásárlási folyamat a legszigorúbb svájci előírások szerint.',
    }
  },

  // 7. FISCALITÉ (TAXATION & 0% VAT)
  'taxation': {
    fr: {
      title: 'Fiscalité de l’Or et de l’Argent d’Investissement',
      metaTitle: 'Fiscalité de l’Or d’Investissement (TVA 0%) | Maison GOLAY INVEST',
      metaDescription: 'Régime fiscal de l’or physique : exonération totale de TVA (Directive 2006/112/CE), taxe forfaitaire vs plus-values réelles dégressives et neutralité suisse.',
      metaKeywords: 'fiscalité or, tva or 0%, directive 2006 112 ce, taxe plus-values or, exoneration or suisse',
      badge: 'Exonération Fiscale 0% TVA',
      subtitle: 'Synthèse réglementaire des régimes fiscaux applicables à l’acquisition, la détention et la cession de métaux précieux en Europe et en Suisse.',
    },
    en: {
      title: 'Taxation of Investment Gold & Silver (0% VAT)',
      metaTitle: 'Gold Investment Taxation (0% VAT) | Maison GOLAY INVEST',
      metaDescription: 'Tax rules for investment precious metals: full VAT exemption under EU Directive 2006/112/EC, capital gains tax rules, and Swiss private capital neutrality.',
      metaKeywords: 'gold taxation, 0 vat gold, eu directive 2006 112 ec, gold capital gains, swiss tax neutrality',
      badge: '0% VAT Legal Exemption',
      subtitle: 'Regulatory summary of tax frameworks governing the acquisition, holding, and disposal of precious metals across Europe and Switzerland.',
    },
    de: {
      title: 'Besteuerung von Anlagegold & Silber (0% MwSt.)',
      metaTitle: 'Besteuerung von Anlagegold (0% MwSt.) | Maison GOLAY INVEST',
      metaDescription: 'Steuerregeln für physisches Anlagegold: Vollständige Mehrwertsteuerbefreiung (EU-Richtlinie 2006/112/EG), Haltefristen und Schweizer Steuerneutralität.',
      metaKeywords: 'anlagegold steuer, mwst befreiung gold, eu richtlinie 2006 112 eg, haltefrist 1 jahr, steuerfrei schweiz',
      badge: 'Gesetzliche 0% MwSt.-Befreiung',
      subtitle: 'Rechtliche Zusammenfassung der steuerlichen Rahmenbedingungen für Kauf, Verwahrung und Veräußerung von Edelmetallen in Europa und der Schweiz.',
    },
    es: {
      title: 'Fiscalidad del Oro y Plata de Inversión (0% IVA)',
      metaTitle: 'Fiscalidad del Oro de Inversión (0% IVA) | Maison GOLAY INVEST',
      metaDescription: 'Régimen fiscal del oro de inversión: exención total de IVA (Directiva 2006/112/CE), tributación de plusvalías y ventajas del marco fiscal suizo.',
      metaKeywords: 'fiscalidad oro, 0 iva oro, directiva 2006 112 ce, ganancias patrimoniales oro',
      badge: 'Exención Fiscal de IVA al 0%',
      subtitle: 'Marco normativo sobre la compra, posesión y venta de metales preciosos en la Unión Europea y Suiza.',
    },
    it: {
      title: 'Fiscalità dell’Oro da Investimento (IVA 0%)',
      metaTitle: 'Regime Fiscale dell’Oro da Investimento | Maison GOLAY INVEST',
      metaDescription: 'Normativa fiscale sull’oro fisico: esenzione totale da IVA (Direttiva 2006/112/CE), imposta sulle plusvalenze e neutralità fiscale in Svizzera.',
      metaKeywords: 'fiscalita oro, esenzione iva oro, direttiva 2006 112 ce, tassazione plusvalenze oro',
      badge: 'Esenzione Legale IVA al 0%',
      subtitle: 'Quadro normativo sui regimi fiscali applicabili all’acquisto, alla detenzione e alla cessione di metalli preziosi in Europa e Svizzera.',
    },
    nl: {
      title: 'Fiscaliteit van Beleggingsgoud (0% BTW)',
      metaTitle: 'Belastingregels Beleggingsgoud (0% BTW) | Maison GOLAY INVEST',
      metaDescription: 'Fiscale voordelen van fysiek goud: volledige BTW-vrijstelling (EU-Richtlijn 2006/112/EG), vermogensrendementsheffing en Zwitserse neutraliteit.',
      metaKeywords: 'belasting beleggingsgoud, 0 btw goud, eu richtlijn 2006 112 eg, box 3 goud',
      badge: 'Wettelijke 0% BTW-Vrijstelling',
      subtitle: 'Overzicht van de fiscale bepalingen bij aankoop, bezit en verkoop van edelmetalen in Europa en Zwitserland.',
    },
    pt: {
      title: 'Fiscalidade do Ouro de Investimento (0% IVA)',
      metaTitle: 'Regime Fiscal do Ouro de Investimento (0% IVA) | Maison GOLAY INVEST',
      metaDescription: 'Regime fiscal dos metais preciosos: isenção integral de IVA (Diretiva 2006/112/CE), tributação de mais-valias e vantagens fiscais helvéticas.',
      metaKeywords: 'fiscalidade ouro, isencao iva ouro, diretiva 2006 112 ce, mais valias ouro',
      badge: 'Isenção Legal de IVA a 0%',
      subtitle: 'Enquadramento regulamentar dos regimes fiscais aplicáveis à compra, detenção e alienação de ouro e prata.',
    },
    da: {
      title: 'Beskatning af Investeringsguld (0% Moms)',
      metaTitle: 'Beskatning af Investeringsguld (Momsfrit) | Maison GOLAY INVEST',
      metaDescription: 'Moms- og skatteregler for fysisk guld: Fuld momsfritagelse (EU-direktiv 2006/112/EF), kapitalgevinstbeskatning og schweiziske skattefordele.',
      metaKeywords: 'beskatning investeringsguld, momsfrit guld, eu direktiv 2006 112 ef, skat pa guldgevinster',
      badge: 'Lovpligtig 0% Momsfritagelse',
      subtitle: 'Regulatorisk oversigt over skatteregler for køb, besiddelse og salg af ædelmetaller i Europa og Schweiz.',
    },
    hu: {
      title: 'A Befektetési Arany Adózása (0% ÁFA)',
      metaTitle: 'Befektetési Arany Adózása (ÁFA-mentes) | Maison GOLAY INVEST',
      metaDescription: 'A fizikai arany adójogi megítélése: teljes ÁFA-mentesség (2006/112/EK irányelv), árfolyamnyereség adózása és a svájci adósemlegesség előnyei.',
      metaKeywords: 'arany adoztatas, afamentes arany, 2006 112 ek iranyelv, arany arfolyamnyereseg ado',
      badge: 'Törvényi 0% ÁFA-Mentesség',
      subtitle: 'Jogszabályi összefoglaló a nemesfémek beszerzésére, tartására és értékesítésére vonatkozó adózási szabályokról.',
    }
  }
};

/**
 * Returns localized page metadata, title, and texts for any supported locale
 */
export function getLocalizedPageData(slug: string, locale: string = 'fr'): LocalizedPageData | null {
  const pageEntries = PAGE_TRANSLATIONS[slug];
  if (!pageEntries) return null;

  const loc = pageEntries[locale] || pageEntries['en'] || pageEntries['fr'];
  if (!loc) return null;

  const dynamicContentHtml = getPageContentHtml(slug, locale);

  return {
    ...loc,
    contentHtml: dynamicContentHtml || loc.contentHtml,
  };
}
