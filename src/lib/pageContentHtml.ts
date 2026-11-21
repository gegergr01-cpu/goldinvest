/**
 * High-grade localized body HTML content for institutional & legal pages
 * Covering English (EN), German (DE), Spanish (ES), Italian (IT), French (FR)
 * and providing structured multilingual support across all 9 target markets.
 */

export function getPageContentHtml(slug: string, locale: string = 'fr'): string | undefined {
  const lang = locale.toLowerCase();

  // 1. ABOUT US (À PROPOS DE LA MAISON GOLAY INVEST)
  if (slug === 'about') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-[#0E2036] mb-3">Unsere Philosophie</h3>
            <p class="text-sm leading-relaxed mb-3">
              In einem weltweiten wirtschaftlichen Umfeld, das von schleichender Geldentwertung, Bankenunsicherheit und anhaltender Inflation geprägt ist, bleibt physisches Gold der ultimative sichere Hafen und das einzige Sachwert-Geld ohne Gegenparteirisiko.
            </p>
            <p class="text-sm leading-relaxed text-gray-600">
              Gegründet unter der Leitung von <strong>Edna Golay</strong> in Savièse (Kanton Wallis, Schweiz — Handelsregister-Nr.: CH-626.1.022.620-4), hat sich die Maison <strong>GOLAY INVEST</strong> zum Ziel gesetzt, den Erwerb, die bankenunabhängige Verwahrung und die Weitergabe physischer Edelmetalle für jeden Anleger sicher, transparent und unkompliziert zu gestalten.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🇨🇭 Schweizer Sorgfalt</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Gewissenhafte Einhaltung höchster Standards an Neutralität, Diskretion und helvetischer Präzision bei der Auswahl jedes LBMA-akkreditierten Anlageprodukts.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">⚖️ Echte Preistransparenz</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Fortlaufende Kursanbindung an die London Bullion Market Association (LBMA), transparente Margen und garantierte 0% Mehrwertsteuerbefreiung auf Anlagegold.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🔒 Garantierte Liquidität</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Dauerhafte Rückkaufgarantie für alle unsere Barren und Münzen zur sofortigen, reibungslosen Auszahlung bei Wiederverkauf.
              </p>
            </div>
          </div>
        </div>
      </div>`;
    }

    if (lang === 'es') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-[#0E2036] mb-3">Nuestra Filosofía</h3>
            <p class="text-sm leading-relaxed mb-3">
              En un entorno económico global marcado por la depreciación de las divisas, la volatilidad bancaria y la inflación, el oro físico sigue siendo el valor refugio definitivo y el único dinero tangible sin deuda como contrapartida.
            </p>
            <p class="text-sm leading-relaxed text-gray-600">
              Fundada bajo la dirección de <strong>Edna Golay</strong> en Savièse (Valais, Suiza — Registro mercantil: CH-626.1.022.620-4), la Maison <strong>GOLAY INVEST</strong> tiene por vocación facilitar la adquisición, custodia y transmisión de metales preciosos físicos con total transparencia, seguridad y rigor.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🇨🇭 Rigor Suizo</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Estricto cumplimiento de los estándares de neutralidad, confidencialidad y precisión helvética en la selección de lingotes y monedas de inversión.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">⚖️ Transparencia de Precios</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Precios indexados en tiempo real sobre las cotizaciones oficiales de la LBMA, comisiones claras y exención legal total del IVA (0% IVA).
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🔒 Liquidez Garantizada</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Compromiso de recompra permanente sobre todos nuestros lingotes y monedas para garantizarle una salida de posición rápida y segura.
              </p>
            </div>
          </div>
        </div>
      </div>`;
    }

    if (lang === 'it') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-[#0E2036] mb-3">La Nostra Filosofia</h3>
            <p class="text-sm leading-relaxed mb-3">
              In un contesto economico globale segnato dall'erosione monetaria, dalla volatilità bancaria e dall'inflazione, l'oro fisico rimane il bene rifugio per eccellenza e l'unica valuta tangibile priva di debito di controparte.
            </p>
            <p class="text-sm leading-relaxed text-gray-600">
              Fondata sotto la direzione di <strong>Edna Golay</strong> a Savièse (Vallese, Svizzera — Reg. Commercio: CH-626.1.022.620-4), la Maison <strong>GOLAY INVEST</strong> si prefigge di rendere l'acquisto, la custodia e la trasmissione di metalli preziosi fisici semplici, trasparenti e sicuri.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🇨🇭 Rigore Svizzero</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Rispetto scrupoloso dei canoni di neutralità, riservatezza e precisione elvetica nella selezione di ogni prodotto certificato LBMA.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">⚖️ Trasparenza dei Corsi</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Prezzi indicizzati in tempo reale sulle quotazioni LBMA di Londra, commissioni chiare ed esenzione totale dall'IVA (0% IVA).
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🔒 Liquidità Garantita</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Garanzia di riacquisto permanente su lingotti e monete per consentirvi un disinvestimento rapido, fluido e protetto.
              </p>
            </div>
          </div>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-[#0E2036] mb-3">Our Philosophy</h3>
            <p class="text-sm leading-relaxed mb-3">
              In a global economic landscape shaped by monetary debasement, banking instability, and persistent inflation, physical gold remains the ultimate safe haven and the only tangible currency carrying zero counterparty liability.
            </p>
            <p class="text-sm leading-relaxed text-gray-600">
              Founded under the leadership of <strong>Edna Golay</strong> in Savièse (Valais, Switzerland — Registered UID: CH-626.1.022.620-4), the Maison <strong>GOLAY INVEST</strong> is dedicated to making the purchase, private custody, and generational transmission of physical investment bullion simple, transparent, and bank-grade secure.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🇨🇭 Swiss Precision</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Strict adherence to Swiss standards of neutrality, discretion, and precision in sourcing LBMA Good Delivery certified bullion.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">⚖️ Real-Time Transparency</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Live prices benchmarked against the London Bullion Market Association (LBMA), transparent spreads, and guaranteed 0% VAT exemption on investment gold.
              </p>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="font-serif font-bold text-[#0E2036] mb-2">🔒 Complete Liquidity</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                Permanent buyback guarantee across all our bars and coins, providing you with swift, hassle-free market exits whenever you require.
              </p>
            </div>
          </div>
        </div>
      </div>`;
    }
  }

  // 2. SECURITY (SÉCURITÉ & GARDIENNAGE)
  if (slug === 'security') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- LBMA -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-[#C8732A] flex items-center justify-center text-2xl font-bold mb-4">
              🏅
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">LBMA Good Delivery zertifizierte Schmelzen</h3>
            <p class="text-sm text-gray-600 mb-3">
              Jeder von GOLAY INVEST vertriebene Barren stammt unmittelbar von Schmelzereien mit Akkreditierung der <strong>London Bullion Market Association</strong> (Umicore, Heraeus, Valcambi, Argor-Heraeus).
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ Zertifizierte Feingoldreinheit von 999,9‰ (24 Karat)</li>
              <li>✓ Fälschungssicherer Original-Sicherheitsblister mit Prüfzertifikat</li>
              <li>✓ Eingravierte individuelle Seriennummer</li>
            </ul>
          </div>

          <!-- Verwahrkette -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">
              🛡️
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">100% lückenlose Verwahrkette</h3>
            <p class="text-sm text-gray-600 mb-3">
              Von der Schmelzeproduktion bis zur Versiegelung verbleiben die Edelmetalle ausnahmslos im akkreditierten Wertlogistiknetz.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ Lückenlose Rückverfolgbarkeit jedes Barrens</li>
              <li>✓ Sofortige Rückkaufgarantie ohne Gutachterabzug</li>
              <li>✓ Strikte Übereinstimmung mit Schweizer Zoll- und Importvorschriften</li>
            </ul>
          </div>

          <!-- Werttransport -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
              🚚
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">Diskrete & 100% versicherte Lieferung</h3>
            <p class="text-sm text-gray-600 mb-3">
              Für Anleger mit Lieferwunsch nach Hause erfolgt der Versand über spezialisierte Wertkuriere in vollkommen neutralen Verpackungen.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ 100% All-Risk-Wiederbeschaffungsversicherung</li>
              <li>✓ Persönliche Übergabe ausschließlich gegen Unterschrift und Lichtbildausweis</li>
              <li>✓ Null Risiko bis zum tatsächlichen Empfang der Ware</li>
            </ul>
          </div>

          <!-- Schweizer Tresore -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold mb-4">
              🇨🇭
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">Schweizer Hochsicherheits-Tresorlagerung</h3>
            <p class="text-sm text-gray-600 mb-3">
              Möglichkeit zur sicheren Verwahrung Ihrer Edelmetalle in Zollfreilagern und Tresoren in Genf oder Zürich — vollkommen bankenunabhängig.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ 100% Einzeleigentum auf Ihren Namen ohne Insolvenzrisiko</li>
              <li>✓ Regelmäßige Audits durch unabhängige Notare und Wirtschaftsprüfer</li>
              <li>✓ Vollkommener Schutz vor Bankenrettungen (Bail-in)</li>
            </ul>
          </div>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pillar 1: LBMA -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-[#C8732A] flex items-center justify-center text-2xl font-bold mb-4">
              🏅
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">LBMA Good Delivery Certified Refiners</h3>
            <p class="text-sm text-gray-600 mb-3">
              Every bullion bar sold by GOLAY INVEST is sourced directly from refiners accredited by the <strong>London Bullion Market Association</strong> (Umicore, Heraeus, Valcambi, Argor-Heraeus).
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ Certified fine purity of 999.9‰ (24-karat fine gold)</li>
              <li>✓ Tamper-evident sealed security blister with official assay certificate</li>
              <li>✓ Individual serial number cast and engraved on every bar</li>
            </ul>
          </div>

          <!-- Pillar 2: Chain of Custody -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">
              🛡️
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">100% Uncompromised Chain of Custody</h3>
            <p class="text-sm text-gray-600 mb-3">
              From refinery output to client blister sealing or secure Swiss vault intake, our precious metals never leave certified security logistics circuits.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ Direct serial traceability for each registered bar</li>
              <li>✓ Instant buyback guarantee without destructive assay fees</li>
              <li>✓ Strict compliance with Swiss and international customs standards</li>
            </ul>
          </div>

          <!-- Pillar 3: Insured Delivery -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
              🚚
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">Discreet & 100% Insured Delivery</h3>
            <p class="text-sm text-gray-600 mb-3">
              For clients opting for direct address delivery, authorized armored transport partners deliver parcels in unbranded, discreet packaging.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ 100% ad-valorem replacement insurance covering the full market value</li>
              <li>✓ Exclusive personal handover against signature and valid photo ID</li>
              <li>✓ Zero risk until physical possession is securely confirmed</li>
            </ul>
          </div>

          <!-- Pillar 4: Swiss Storage -->
          <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold mb-4">
              🇨🇭
            </div>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mb-2">High-Security Vault Storage in Switzerland</h3>
            <p class="text-sm text-gray-600 mb-3">
              Store your precious metals in bonded, high-security vault facilities in Geneva or Zurich, completely outside the banking system.
            </p>
            <ul class="text-xs space-y-1.5 text-gray-500">
              <li>✓ Direct segregated ownership held under your personal legal name</li>
              <li>✓ Annual independent physical audits by licensed notaries</li>
              <li>✓ Complete immunity from bank insolvency, freezes, or bail-in procedures</li>
            </ul>
          </div>
        </div>
      </div>`;
    }
  }

  // 3. HOW TO ORDER (COMMENT COMMANDER)
  if (slug === 'how-to-order') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Schritt 1</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Wählen Sie Ihre Edelmetalle</h3>
            <p class="text-sm text-gray-600">
              Wählen Sie Goldbarren (1g bis 1kg), bankhandelsfähige Anlagemünzen (Krügerrand, Wiener Philharmoniker, Maple Leaf, Vreneli) oder Feinsilber nach Ihrem Anlageziel aus.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Schritt 2</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Fixieren Sie den Live-Börsenkurs</h3>
            <p class="text-sm text-gray-600">
              Sobald Sie Ihren Warenkorb bestätigen, wird der offizielle LBMA-Marktkurs sofort unveränderlich festgeschrieben. Künftige Preisschwankungen haben keinen Einfluss mehr auf Ihre Bestellung.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Schritt 3</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Sichere Bezahlung</h3>
            <p class="text-sm text-gray-600">
              Zahlen Sie bequem per SEPA- oder internationaler Banküberweisung innerhalb von 48-72 Stunden oder per Kreditkarte mit starker 3D-Secure-Authentifizierung.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Schritt 4</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Versicherte Lieferung oder Schweizer Tresor</h3>
            <p class="text-sm text-gray-600">
              Erhalten Sie Ihr vollversichertes, diskretes Paket persönlich gegen Unterschrift oder wählen Sie die sichere Einlagerung in bankenunabhängigen Schweizer Tresoren in Genf oder Zürich.
            </p>
          </div>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Step 1</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Select Your Precious Metals</h3>
            <p class="text-sm text-gray-600">
              Browse and select certified investment gold bars (1g to 1kg), official bullion coins (Krugerrand, Sovereign, Maple Leaf, Vreneli), or fine silver bars matching your allocation goals.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Step 2</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Lock Real-Time Market Prices</h3>
            <p class="text-sm text-gray-600">
              Upon confirming your basket, the official LBMA market rate is instantaneously locked and guaranteed for your transaction. Subsequent market fluctuations will never alter your contracted price.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Step 3</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Secure Settlement</h3>
            <p class="text-sm text-gray-600">
              Complete your payment via SEPA or international bank wire within 48 to 72 hours, or securely via credit card with 3D-Secure biometric two-factor authentication.
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-xs font-mono font-bold text-[#C8732A] bg-amber-50 px-3 py-1 rounded-full uppercase">Step 4</span>
            <h3 class="text-lg font-serif font-bold text-[#0E2036] mt-3 mb-2">Insured Delivery or Swiss Vault Custody</h3>
            <p class="text-sm text-gray-600">
              Receive your discreet, 100% insured parcel signed-for with ID check, or allocate your bullion into high-security unbanked vault facilities in Zurich or Geneva.
            </p>
          </div>
        </div>
      </div>`;
    }
  }

  // 4. TAXATION (FISCALITÉ OR ET ARGENT)
  if (slug === 'taxation') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">1. Vollständige Mehrwertsteuerbefreiung beim Kauf (0% MwSt.)</h3>
            <p class="text-sm leading-relaxed mb-3">
              In Anwendung der <strong>EU-Richtlinie 2006/112/EG</strong> und des Schweizer Mehrwertsteuergesetzes ist der Kauf von Anlagegold <strong>vollständig von jeglicher Mehrwertsteuer befreit (0% MwSt.)</strong>.
            </p>
            <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200">
              Als Anlagegold gelten Goldbarren und -plättchen mit einem Feingehalt von mindestens 995‰ (24 Karat) sowie nach 1800 geprägte Goldmünzen mit einem Feingehalt von mindestens 900‰, die gesetzliches Zahlungsmittel waren oder sind.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">2. Steuerliche Behandlung beim Wiederverkauf</h3>
            <p class="text-sm leading-relaxed mb-3">
              Beim Wiederverkauf von physischem Gold profitieren Anleger im europäischen Raum von überaus attraktiven Steuerregelungen (je nach steuerlichem Wohnsitz):
            </p>
            <ul class="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
              <li><strong>Deutschland & Österreich:</strong> Veräußerungsgewinne aus physischem Gold sind nach einer Haltedauer von mindestens 12 Monaten (1 Jahr) gemäß § 23 EStG **vollkommen steuerfrei**.</li>
              <li><strong>Frankreich & weitere EU-Länder:</strong> Wahlrecht zwischen dem Realsatz mit jährlichen Haltefristenabschlägen (vollständige Steuerfreiheit nach 22 Jahren) oder der pauschalen Edelmetallabgabe.</li>
            </ul>
          </div>

          <div class="p-5 bg-amber-50 rounded-xl border border-amber-200 text-sm">
            <h4 class="font-bold text-amber-900 mb-1">💡 Bedeutung der namentlichen Rechnung & des Originalblisters</h4>
            <p class="text-amber-800 text-xs leading-relaxed">
              Um die steuerlichen Vorteile und Haltefristen geltend zu machen, ist es essenziell, die offizielle Kaufrechnung von GOLAY INVEST aufzubewahren und die Barren im unversehrten Original-Sicherheitsblister mit Seriennummer zu belassen.
            </p>
          </div>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">1. Total VAT Exemption on Purchase (0% VAT)</h3>
            <p class="text-sm leading-relaxed mb-3">
              Pursuant to <strong>European Union Directive 2006/112/EC</strong> and Swiss tax legislation, the purchase of investment-grade gold is <strong>strictly exempt from Value Added Tax (0% VAT)</strong> across the entire European Economic Area and Switzerland.
            </p>
            <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200">
              Qualifying investment gold includes bars and ingots of a purity of at least 995‰ (24-karat fine gold) and legal-tender coins minted after 1800 with a fine purity of at least 900‰.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">2. Tax Framework upon Liquidation & Resale</h3>
            <p class="text-sm leading-relaxed mb-3">
              When liquidating physical precious metals, investors generally benefit from advantageous domestic capital gains treatments according to their tax residency:
            </p>
            <ul class="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
              <li><strong>Holding-Period Taper Relief:</strong> In many jurisdictions (such as Germany and Austria), capital gains on physical bullion held for more than 12 months are **100% tax-free**. In France and others, progressive annual allowances lead to total tax exemption over statutory holding durations.</li>
              <li><strong>Flat-Rate Precious Metal Tax:</strong> In certain EU countries, an optional flat-rate transaction tax applies without requiring historical purchase proof.</li>
            </ul>
          </div>

          <div class="p-5 bg-amber-50 rounded-xl border border-amber-200 text-sm">
            <h4 class="font-bold text-amber-900 mb-1">💡 Essential Value of Named Invoices & Intact Blister Seals</h4>
            <p class="text-amber-800 text-xs leading-relaxed">
              To substantiate your holding period and obtain full tax exemptions, it is essential to retain your original nominative purchase invoice issued by GOLAY INVEST and keep your bullion bars and coins within their intact, numbered security blisters.
            </p>
          </div>
        </div>
      </div>`;
    }
  }

  // 5. LEGAL NOTICE & IMPRESSUM (MENTIONS LÉGALES)
  if (slug === 'mentions-legales') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <!-- Impressum Schweiz -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">1.</span> Anbieterkennzeichnung & Schweizer Unternehmensangaben
          </h3>
          <p class="mb-4">
            Die Internetseite <strong>https://golayinvest.com</strong> wird betrieben von der Schweizer Gesellschaft <strong>GOLAY Invest</strong>, ordnungsgemäß eingetragen im Schweizer Handelsregister:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Firmenname</p>
              <p class="font-bold text-gray-900 text-base">GOLAY Invest</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Handelsregister-Nr. (UID)</p>
              <p class="font-bold text-gray-900 font-mono text-base">CH-626.1.022.620-4</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Inhaberin / Geschäftsführung</p>
              <p class="font-bold text-gray-900">Edna Golay</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Offizielle E-Mail</p>
              <p class="font-bold text-[#C8732A]"><a href="mailto:info@golayinvest.com">info@golayinvest.com</a></p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-500 uppercase font-semibold">Hauptsitz</p>
              <p class="font-bold text-gray-900">Chemin du Grand Roe 11, 1965 Savièse, Schweiz</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Europäische Niederlassung</p>
              <p class="text-gray-800">Chaussée de Tirlemont 110, 5030 Gembloux, Belgien</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">UK Repräsentanzbüro</p>
              <p class="text-gray-800">100 Pall Mall, London SW1Y 5NQ, United Kingdom</p>
            </div>
          </div>
        </div>

        <!-- Hostinganbieter -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">2.</span> Hostinganbieter (Webhosting & Server)
          </h3>
          <p class="mb-4">
            Die Internetplattform <strong>golayinvest.com</strong> wird auf hochsicheren europäischen Serversystemen gehostet von:
          </p>
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm space-y-1">
            <p><strong>Unternehmen:</strong> SiteGround Spain S.L.</p>
            <p><strong>Adresse:</strong> Calle de Prim 19, 28004 Madrid, Spanien</p>
            <p><strong>Webseite:</strong> <a href="https://www.siteground.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">https://www.siteground.com</a></p>
            <p class="text-xs text-gray-500 mt-2">
              Die Rechenzentren von SiteGround verfügen über vollständige ISO 27001-Zertifizierungen, 24/7-Überwachung und 256-Bit-SSL/TLS-Verschlüsselung nach modernsten Sicherheitskriterien.
            </p>
          </div>
        </div>

        <!-- Regulierung -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">3.</span> Geschäftstätigkeit & Edelmetallbestimmungen
          </h3>
          <p class="mb-3">
            Gegenstand der <strong>GOLAY Invest</strong> ist der professionelle Handel, die Vermittlung sowie der Kauf und Verkauf physischer Anlageedelmetalle (Gold, Silber, Platin, Palladium) in Form von LBMA-zertifizierten Barren und offiziellen Anlagemünzen.
          </p>
          <p class="mb-3">
            Das angebotene Anlagegold entspricht uneingeschränkt den Kriterien der EU-Richtlinie 2006/112/EG sowie des Schweizer Steuerrechts (Feingehalt ab 995‰ bei Barren und ab 900‰ bei nach 1800 geprägten Münzen). Entsprechend gilt die **vollständige Mehrwertsteuerbefreiung (0% MwSt.)**.
          </p>
        </div>

        <!-- Urheberrecht -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">4.</span> Urheberrecht & Geistiges Eigentum
          </h3>
          <p class="mb-3">
            Alle Elemente der Webseite golayinvest.com (Texte, Bildmaterial, Marken, Kursrechner und Softwarekomponenten) sind ausschließliches Eigentum der GOLAY Invest oder lizenziert. Jede nicht autorisierte Nutzung unterliegt den Bestimmungen des Schweizer Urheberrechtsgesetzes (URG).
          </p>
        </div>

        <!-- Risikohinweis -->
        <div class="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-sm">
          <h4 class="font-bold text-amber-900 mb-2 flex items-center gap-2">
            ⚠️ Gesetzlicher Risikohinweis zu Edelmetallmärkten
          </h4>
          <p class="text-amber-800 leading-relaxed">
            Der Erwerb von Anlageedelmetallen unterliegt Marktpreisschwankungen an den internationalen Rohstoffbörsen (London Bullion Market Association LBMA). Die auf dieser Webseite veröffentlichten Informationsbeiträge und Marktübersichten dienen rein dokumentarischen Zwecken und stellen keine individuelle Anlageberatung dar.
          </p>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <!-- Section 1 : Company Publisher -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">1.</span> Corporate Disclosure & Swiss Legal Identification
          </h3>
          <p class="mb-4">
            The website accessible at <strong>https://golayinvest.com</strong> is published and operated by <strong>GOLAY Invest</strong>, duly registered under Swiss commercial law:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Company Name</p>
              <p class="font-bold text-gray-900 text-base">GOLAY Invest</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Swiss Commercial Registry Number (UID)</p>
              <p class="font-bold text-gray-900 font-mono text-base">CH-626.1.022.620-4</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Proprietor / Managing Director</p>
              <p class="font-bold text-gray-900">Edna Golay</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">Official Email</p>
              <p class="font-bold text-[#C8732A]"><a href="mailto:info@golayinvest.com">info@golayinvest.com</a></p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-500 uppercase font-semibold">Registered Headquarters</p>
              <p class="font-bold text-gray-900">Chemin du Grand Roe 11, 1965 Savièse, Switzerland</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">European Branch Counter</p>
              <p class="text-gray-800">Chaussée de Tirlemont 110, 5030 Gembloux, Belgium</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold">UK Representative Office</p>
              <p class="text-gray-800">100 Pall Mall, London SW1Y 5NQ, United Kingdom</p>
            </div>
          </div>
        </div>

        <!-- Section 2 : Hosting Provider -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">2.</span> Website Hosting Provider (Hostinganbieter)
          </h3>
          <p class="mb-4">
            The platform <strong>golayinvest.com</strong> is hosted on high-security enterprise European cloud infrastructure by:
          </p>
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm space-y-1">
            <p><strong>Company:</strong> SiteGround Spain S.L.</p>
            <p><strong>Address:</strong> Calle de Prim 19, 28004 Madrid, Spain (Spanien)</p>
            <p><strong>Website:</strong> <a href="https://www.siteground.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">https://www.siteground.com</a></p>
            <p class="text-xs text-gray-500 mt-2">
              SiteGround data centres comply with top-tier physical and electronic security frameworks, featuring ISO 27001 certifications, 24/7 on-site monitoring, and advanced 256-bit SSL/TLS end-to-end encryption.
            </p>
          </div>
        </div>

        <!-- Section 3 : Precious Metals Regulation -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">3.</span> Business Activities & Bullion Regulations
          </h3>
          <p class="mb-3">
            <strong>GOLAY Invest</strong> engages in the wholesale and retail brokerage, trading, purchase, and storage of investment-grade physical precious metals (gold, silver, platinum, palladium) in LBMA Good Delivery certified ingots and official legal-tender bullion coins.
          </p>
          <p class="mb-3">
            All investment gold traded strictly qualifies under European Union Directive 2006/112/EC and Swiss Federal Tax Law (minimum fine purity of 995‰ for bars and 900‰ for post-1800 coins). Consequently, purchases benefit from an absolute <strong>0% VAT exemption</strong>.
          </p>
        </div>

        <!-- Section 4 : Intellectual Property -->
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 flex items-center gap-2 border-b pb-3">
            <span class="text-[#C8732A]">4.</span> Intellectual Property & Copyright
          </h3>
          <p class="mb-3">
            All contents, layout, trademarks, product imagery, market data tools, and codebase on golayinvest.com are the exclusive intellectual property of GOLAY Invest or used under valid license. Unauthorized copying or redistribution is strictly forbidden under the Swiss Federal Act on Copyright (LDA) and international conventions.
          </p>
        </div>

        <!-- Section 5 : Financial Risk Warning -->
        <div class="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-sm">
          <h4 class="font-bold text-amber-900 mb-2 flex items-center gap-2">
            ⚠️ Regulatory Financial Market Risk Notice
          </h4>
          <p class="text-amber-800 leading-relaxed">
            The acquisition of investment bullion carries price fluctuation risks tied to international physical commodities markets (London Bullion Market Association LBMA spot fixing). Past performance is no guarantee of future returns. Informational materials, articles, and guides on this website are published solely for general documentary purposes and do not constitute personal financial or investment advice.
          </p>
        </div>
      </div>`;
    }
  }

  // 6. GENERAL TERMS & CONDITIONS OF SALE (CONDITIONS GÉNÉRALES DE VENTE)
  if (slug === 'conditions-generales-de-vente') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Artikel 1 — Geltungsbereich & Verkäuferangaben
          </h3>
          <p class="mb-3">
            Diese Allgemeinen Geschäftsbedingungen (nachfolgend «AGB») gelten für alle Kaufverträge, die über die Handelsplattform <strong>https://golayinvest.com</strong> mit der Gesellschaft <strong>GOLAY Invest</strong> (Handelsregister-Nr.: CH-626.1.022.620-4, Chemin du Grand Roe 11, 1965 Savièse, Schweiz, Inhaberin Edna Golay) geschlossen werden.
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Artikel 2 — Produkte & LBMA-Zertifizierung
          </h3>
          <p class="mb-3">
            Die zum Verkauf stehenden Erzeugnisse sind ausschließlich physische Anlageedelmetalle:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-sm mb-4">
            <li><strong>Anlagegoldbarren:</strong> Feingehalt von mindestens 999,9‰ (24 Karat), ausschließlich von Schmelzereien der <em>London Bullion Market Association (LBMA)</em>: Umicore, Heraeus, Valcambi, Argor-Heraeus. Auslieferung in unversehrtem Sicherheitsblister mit eingravierter Seriennummer.</li>
            <li><strong>Anlagegoldmünzen:</strong> Bankhandelsfähige Anlagemünzen (Krügerrand, Maple Leaf, Wiener Philharmoniker, Vreneli) mit einem Mindestfeingehalt von 900‰.</li>
            <li><strong>Feinsilber:</strong> Barren und Münzen mit einem Feingehalt von 999‰ in manipulationssicherer Verpackung.</li>
          </ul>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Artikel 3 — Live-Kurse & Kursfixierung
          </h3>
          <p class="mb-3">
            Die Preise verstehen sich wahlweise in EUR, CHF, DKK, HUF, GBP oder USD. Sie sind fortlaufend an die amtlichen Kurse der internationalen Edelmetallbörsen (LBMA) gekoppelt.
          </p>
          <p class="mb-3">
            <strong>Verbindliche Kursfixierung:</strong> Mit Abschluss der Online-Bestellung wird der Ankaufskurs verbindlich festgeschrieben. Eine nachträgliche Preisänderung ist beiderseits ausgeschlossen.
          </p>
          <p class="text-sm text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            ✓ <strong>Mehrwertsteuerbefreiung:</strong> Gemäß EU-Richtlinie 2006/112/EG und Schweizer Steuerrecht ist Anlagegold steuerbefreit (0% MwSt.).
          </p>
        </div>

        <div class="bg-amber-50 p-7 rounded-2xl border-2 border-amber-300 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-amber-950 mb-3 flex items-center gap-2">
            ⚠️ Artikel 4 — Gesetzlicher Ausschluss des Widerrufsrechts
          </h3>
          <p class="text-amber-900 font-semibold mb-3">
            WICHTIGER GESETZLICHER VERBRAUCHERHINWEIS:
          </p>
          <p class="text-amber-900 text-sm leading-relaxed mb-3">
            Gemäß § 312g Abs. 2 Nr. 8 BGB, Art. 16 Buchstabe b der EU-Verbraucherrechterichtlinie 2011/83/EU sowie nach Schweizer Recht:
          </p>
          <div class="bg-white p-4 rounded-xl border border-amber-300 text-amber-950 font-serif italic text-sm mb-3">
            «Das gesetzliche Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, deren Preis von Schwankungen auf dem Finanzmarkt abhängt, auf die der Unternehmer keinen Einfluss hat und die innerhalb der Widerrufsfrist auftreten können.»
          </div>
          <p class="text-xs text-amber-900 leading-relaxed">
            Da die Kurse von Gold und Silber ständigen tagesaktuellen Börsenschwankungen unterliegen, ist das Widerrufsrecht für sämtliche Bestellungen von Edelmetallen <strong>vollständig und unwiderruflich ausgeschlossen</strong>. Jede getätigte Bestellung ist verbindlich.
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Artikel 5 — Zahlung & Geldwäscheprävention (GwG)
          </h3>
          <p class="mb-3 text-sm">
            Die Zahlung erfolgt innerhalb von 48 bis 72 Stunden per SEPA-Banküberweisung. Gemäß dem Schweizer Geldwäschereigesetz (GwG) und den europäischen AML-Richtlinien behält sich GOLAY Invest vor, Legitimationsnachweise (Personalausweis, Adressnachweis) anzufordern.
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Artikel 6 — Anwendbares Recht & Gerichtsstand
          </h3>
          <p class="mb-3 text-sm">
            Auf alle Rechtsbeziehungen findet ausschließlich materielles <strong>Schweizer Recht</strong> (Schweizerisches Obligationenrecht OR) Anwendung. Ausschließlicher Gerichtsstand für alle Streitigkeiten ist der Sitz des Unternehmens im <strong>Kanton Wallis (Schweiz)</strong>.
          </p>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Article 1 — Scope of Application & Seller Identification
          </h3>
          <p class="mb-3">
            These General Terms and Conditions of Sale (hereinafter the "GTC") apply without restriction or reservation to all bullion sales contracted via the online platform <strong>https://golayinvest.com</strong> by <strong>GOLAY Invest</strong> (Swiss Commercial Register: CH-626.1.022.620-4, Chemin du Grand Roe 11, 1965 Savièse, Switzerland, Proprietor Edna Golay).
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Article 2 — Products, Authenticity & LBMA Standards
          </h3>
          <p class="mb-3">
            The products offered for sale consist exclusively of investment-grade physical precious metals:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-sm mb-4">
            <li><strong>Investment Gold Bullion Bars:</strong> Purity of at least 999.9‰ (24-karat fine gold), sourced exclusively from <em>London Bullion Market Association (LBMA)</em> accredited refiners (Umicore, Heraeus, Valcambi, Argor-Heraeus), delivered in tamper-evident security packaging with serial number.</li>
            <li><strong>Official Gold Bullion Coins:</strong> Official legal-tender coins (Krugerrand, Sovereign, Maple Leaf, Vienna Philharmonic, Vreneli) with a purity of at least 900‰.</li>
            <li><strong>Fine Silver Bars & Coins:</strong> Minimum fine purity of 999‰, packaged in sealed protective cases.</li>
          </ul>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Article 3 — Live Pricing & Binding Price Locking
          </h3>
          <p class="mb-3">
            Prices are displayed in EUR, CHF, DKK, HUF, GBP, or USD/CAD and reflect real-time London Bullion Market Association (LBMA) fixing benchmarks.
          </p>
          <p class="mb-3">
            <strong>Binding Price Lock:</strong> Once the Client confirms their order online, the purchase price is irrevocably locked and guaranteed. No subsequent market fluctuations will modify the agreed amount.
          </p>
          <p class="text-sm text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            ✓ <strong>0% VAT Exemption:</strong> In compliance with European Directive 2006/112/EC and Swiss tax legislation, investment gold is strictly exempt from Value Added Tax (0% VAT).
          </p>
        </div>

        <div class="bg-amber-50 p-7 rounded-2xl border-2 border-amber-300 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-amber-950 mb-3 flex items-center gap-2">
            ⚠️ Article 4 — Statutory Exclusion of the Right of Withdrawal
          </h3>
          <p class="text-amber-900 font-semibold mb-3">
            IMPORTANT STATUTORY NOTICE TO CONSUMERS:
          </p>
          <p class="text-amber-900 text-sm leading-relaxed mb-3">
            Pursuant to Article 16(b) of European Directive 2011/83/EU on Consumer Rights and Swiss federal commercial law:
          </p>
          <div class="bg-white p-4 rounded-xl border border-amber-300 text-amber-950 font-serif italic text-sm mb-3">
            "The right of withdrawal cannot be exercised for the supply of goods or services whose price is dependent on fluctuations in the financial market which cannot be controlled by the trader and which may occur within the withdrawal period."
          </div>
          <p class="text-xs text-amber-900 leading-relaxed">
            Because precious metal quotes fluctuate continuously on international financial exchanges, <strong>the statutory cooling-off and cancellation period does NOT apply</strong> to any precious metals purchase. Every confirmed order is definitively binding.
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Article 5 — Payment & Anti-Money Laundering (AML/KYC)
          </h3>
          <p class="mb-3 text-sm">
            Payments must be settled within 48 to 72 hours via verified bank wire. Under Swiss Federal AML regulations and European directives, GOLAY Invest conducts mandatory identity verification (passport/ID card and proof of address) when applicable.
          </p>
        </div>

        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-4 border-b pb-3">
            Article 6 — Applicable Law & Exclusive Jurisdiction
          </h3>
          <p class="mb-3 text-sm">
            All contractual relationships are governed exclusively by <strong>Swiss substantive law</strong> (Swiss Code of Obligations). Any disputes arising shall be submitted to the exclusive jurisdiction of the competent courts of the <strong>Canton of Valais, Switzerland</strong>.
          </p>
        </div>
      </div>`;
    }
  }

  // 7. PRIVACY POLICY (POLITIQUE DE CONFIDENTIALITÉ)
  if (slug === 'politique-de-confidentialite') {
    if (lang === 'de') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">1. Verantwortliche Stelle</h3>
            <p class="text-sm">
              Verantwortlich für die Datenverarbeitung auf golayinvest.com ist:<br/>
              <strong>GOLAY Invest</strong>, Inhaberin Edna Golay<br/>
              Chemin du Grand Roe 11, 1965 Savièse, Schweiz (CH-626.1.022.620-4)<br/>
              E-Mail: <a href="mailto:info@golayinvest.com" class="text-[#C8732A] font-semibold">info@golayinvest.com</a>
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">2. Erhobene personenbezogene Daten</h3>
            <p class="text-sm mb-2">Wir erheben ausschließlich Daten, die zur Abwicklung der Edelmetallkäufe erforderlich sind:</p>
            <ul class="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li><strong>Identitätsdaten:</strong> Name, Vorname, Geburtsdatum.</li>
              <li><strong>Kontaktdaten:</strong> Rechnungsadresse, versicherte Lieferadresse, E-Mail-Adresse, Telefonnummer.</li>
              <li><strong>Transaktionsdaten:</strong> Bestellte Barren und Münzen, Zahlungsart, Seriennummern und Lieferscheine.</li>
              <li><strong>Legitimationsdaten (GwG/KYC):</strong> Ausweiskopie und Adressnachweis nach Maßgabe der Geldwäschebestimmungen.</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">3. Zwecke & Rechtsgrundlagen</h3>
            <ul class="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
              <li><strong>Vertragserfüllung:</strong> Abwicklung von Bestellungen, Kursfixierung, Rechnungsstellung und Werttransport.</li>
              <li><strong>Gesetzliche Pflichten:</strong> Zehnjährige kaufmännische Aufbewahrungspflicht (OR Art. 958f) und Einhaltung des Geldwäschereigesetzes (GwG).</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">4. Webhosting & Datensicherheit</h3>
            <p class="text-sm mb-2">
              Die Plattform und Datenbanken werden gehostet bei <strong>SiteGround Spain S.L.</strong> (Calle de Prim 19, 28004 Madrid, Spanien) auf europäischen Servern innerhalb des EWR.
            </p>
            <p class="text-sm text-gray-600">
              Alle Datenübertragungen erfolgen verschlüsselt nach aktuellem SSL/TLS-Standard (256 Bit). Ihre Daten werden unter keinen Umständen an Dritte zu Werbezwecken weitergegeben.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">5. Aufbewahrungsdauer</h3>
            <p class="text-sm text-gray-600">
              Rechnungen, Buchungsbelege und Vertragsdokumente werden gemäß Art. 958f des Schweizer Obligationenrechts für eine Dauer von <strong>10 Jahren</strong> archiviert.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">6. Ihre Rechte als betroffene Person</h3>
            <p class="text-sm mb-2">
              Gemäß dem Schweizer revDSG und der EU-DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit.
            </p>
            <p class="text-sm">
              Zur Wahrnehmung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:info@golayinvest.com" class="text-[#C8732A] font-bold">info@golayinvest.com</a>.
            </p>
          </div>
        </div>
      </div>`;
    }

    // Default international English
    if (lang !== 'fr') {
      return `<div class="legal-page space-y-6 text-gray-700 leading-relaxed">
        <div class="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">1. Data Controller</h3>
            <p class="text-sm">
              The data controller responsible for personal data on golayinvest.com is:<br/>
              <strong>GOLAY Invest</strong>, Proprietor Edna Golay<br/>
              Chemin du Grand Roe 11, 1965 Savièse, Switzerland (CH-626.1.022.620-4)<br/>
              Email: <a href="mailto:info@golayinvest.com" class="text-[#C8732A] font-semibold">info@golayinvest.com</a>
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">2. Personal Data Collected</h3>
            <p class="text-sm mb-2">We process only data strictly necessary for order fulfillment and regulatory compliance:</p>
            <ul class="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li><strong>Identity Details:</strong> Full name, title, date of birth.</li>
              <li><strong>Contact Information:</strong> Billing address, insured delivery address, email, telephone number.</li>
              <li><strong>Transaction Data:</strong> Ordered bullion products, payment method, serial numbers, and delivery receipts.</li>
              <li><strong>Compliance Records (KYC/AML):</strong> Official photo ID and proof of address where mandated by anti-money laundering regulations.</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">3. Purposes & Legal Bases</h3>
            <ul class="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
              <li><strong>Contract Performance:</strong> Order processing, live price locking, invoicing, and insured transport logistics.</li>
              <li><strong>Legal Compliance:</strong> Statutory book-keeping obligations (Swiss Code of Obligations Art. 958f) and Swiss/EU anti-money laundering compliance (AML/GwG).</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">4. Cloud Hosting & Technical Security</h3>
            <p class="text-sm mb-2">
              The platform and databases are securely hosted by <strong>SiteGround Spain S.L.</strong> (Calle de Prim 19, 28004 Madrid, Spain), guaranteeing EEA sovereign data residency.
            </p>
            <p class="text-sm text-gray-600">
              All communications are safeguarded using 256-bit SSL/TLS cryptographic encryption. Your personal data is never sold, leased, or distributed to advertising third parties.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">5. Data Retention Period</h3>
            <p class="text-sm text-gray-600">
              Accounting documents, invoices, and contractual communications are archived for <strong>10 years</strong> pursuant to mandatory Swiss statutory requirements (Art. 958f CO).
            </p>
          </div>

          <div>
            <h3 class="text-xl font-serif font-bold text-[#0E2036] mb-3 border-b pb-2">6. Your Data Rights</h3>
            <p class="text-sm mb-2">
              Under the revised Swiss Data Protection Act (revFADP) and EU General Data Protection Regulation (GDPR), you hold the right to access, rectify, restrict, or request the deletion of your personal data.
            </p>
            <p class="text-sm">
              To exercise your rights, please submit your request to: <a href="mailto:info@golayinvest.com" class="text-[#C8732A] font-bold">info@golayinvest.com</a>.
            </p>
          </div>
        </div>
      </div>`;
    }
  }

  return undefined;
}
