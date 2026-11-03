'use client';

import React, { useState } from 'react';
import { QuoteRecord, QuoteItem } from '@/lib/quotes';
import { adminSendQuoteAction, adminCreateInvoiceAction } from '@/actions/quotes';

interface AdminQuotesManagerProps {
  initialQuotes: QuoteRecord[];
  products: { id: string; title: string; price: number }[];
  users: { id: string; email: string }[];
}

export default function AdminQuotesManager({
  initialQuotes,
  products,
  users
}: AdminQuotesManagerProps) {
  const [activeTab, setActiveTab] = useState<'quotes' | 'manual_invoice'>('quotes');
  const [quotes, setQuotes] = useState<QuoteRecord[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);

  // Quote editing state
  const [editItems, setEditItems] = useState<QuoteItem[]>([]);
  const [editNotes, setEditNotes] = useState('');
  const [editValidity, setEditValidity] = useState(3);
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');

  // Manual invoice state
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [invoiceName, setInvoiceName] = useState('');
  const [invoicePhone, setInvoicePhone] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState('BANK_TRANSFER');
  const [invoiceItems, setInvoiceItems] = useState<{ productId?: string; title: string; quantity: number; price: number }[]>([
    { title: "Lingot d'Or 100g LBMA 999.9‰", quantity: 1, price: 7450 }
  ]);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceSuccessMsg, setInvoiceSuccessMsg] = useState('');
  const [invoiceErrorMsg, setInvoiceErrorMsg] = useState('');

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  // Open quote editor
  const handleOpenQuote = (q: QuoteRecord) => {
    setSelectedQuote(q);
    setQuoteSuccessMsg('');
    setEditNotes(q.notes || `Devis établi aux cours officiels LBMA. Validité 72h. Or d'investissement exonéré de TVA (Art. 262 ter I du CGI).`);
    setEditValidity(3);
    if (q.items && q.items.length > 0 && q.items[0].price > 0) {
      setEditItems(q.items);
    } else {
      // Default initial line
      setEditItems([
        {
          title: q.metalType || "Lingot d'Or 100g LBMA",
          quantity: 1,
          price: 7450,
          total: 7450
        }
      ]);
    }
  };

  // Calculate quote total
  const quoteTotal = editItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  // Add line item to quote
  const handleAddQuoteItem = () => {
    setEditItems([
      ...editItems,
      { title: "20 Francs Napoléon III Or", quantity: 1, price: 445, total: 445 }
    ]);
  };

  // Update item in quote
  const handleUpdateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...editItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      updated[index].total = Number(updated[index].quantity) * Number(updated[index].price);
    }
    setEditItems(updated);
  };

  // Remove line item from quote
  const handleRemoveQuoteItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  // Submit and send quote
  const handleSendQuote = async () => {
    if (!selectedQuote) return;
    setIsSendingQuote(true);
    setQuoteSuccessMsg('');

    const res = await adminSendQuoteAction(
      selectedQuote.id,
      editItems,
      quoteTotal,
      editNotes,
      editValidity
    );

    setIsSendingQuote(false);

    if (res.success) {
      setQuoteSuccessMsg(`Devis ${selectedQuote.id} généré en PDF et envoyé avec succès à ${selectedQuote.customerEmail} !`);
      // Update local state
      setQuotes(quotes.map(q => q.id === selectedQuote.id ? {
        ...q,
        items: editItems,
        total: quoteTotal,
        notes: editNotes,
        status: 'SENT'
      } : q));
    } else {
      alert(res.error || "Erreur lors de l'envoi du devis");
    }
  };

  // Manual invoice calculations
  const invoiceTotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleAddInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { title: "Lingot d'Or 50g LBMA", quantity: 1, price: 3725 }
    ]);
  };

  const handleUpdateInvoiceItem = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    setInvoiceItems(updated);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const email = e.target.value;
    if (email) {
      setInvoiceEmail(email);
      setInvoiceName(email.split('@')[0]);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceEmail || !invoiceName) {
      alert("Veuillez renseigner le nom et l'email du client destinataire.");
      return;
    }

    setIsCreatingInvoice(true);
    setInvoiceSuccessMsg('');
    setInvoiceErrorMsg('');

    const res = await adminCreateInvoiceAction({
      customerEmail: invoiceEmail,
      customerName: invoiceName,
      customerPhone: invoicePhone,
      customerAddress: invoiceAddress,
      items: invoiceItems,
      total: invoiceTotal,
      paymentMethod: invoicePaymentMethod,
      status: invoiceStatus
    });

    setIsCreatingInvoice(false);

    if (res.success) {
      setInvoiceSuccessMsg(`Facture générée avec succès (Commande #${res.orderId?.slice(-6).toUpperCase()}) ! Le client peut la retrouver dans son espace client et une copie PDF lui a été transmise par e-mail.`);
      setInvoiceItems([{ title: "Lingot d'Or 100g LBMA 999.9‰", quantity: 1, price: 7450 }]);
    } else {
      setInvoiceErrorMsg(res.error || "Erreur lors de la création de la facture");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Devis & Factures</h1>
          <p className="text-xs text-gray-500 mt-1">
            Traitez les demandes de devis clients et générez des factures officielles avec logo en PDF.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'quotes'
                ? 'bg-[#0E2036] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Demandes de Devis ({quotes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual_invoice')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'manual_invoice'
                ? 'bg-[#0E2036] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🧾 Créer une Facture Client
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: DEMANDES DE DEVIS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Toutes les demandes de devis</h2>
              <span className="text-xs text-gray-500 font-mono">Total : {quotes.length} demande(s)</span>
            </div>

            {quotes.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                Aucune demande de devis enregistrée pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 font-semibold text-gray-600 uppercase">
                    <tr>
                      <th className="px-4 py-3">Réf.</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Projet / Métal</th>
                      <th className="px-4 py-3">Budget estimé</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quotes.map((q) => {
                      const isSent = q.status === 'SENT' || q.status === 'ACCEPTED';
                      return (
                        <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-gray-900">
                            {q.id}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {formatDate(q.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-900">{q.customerName}</p>
                            <a href={`mailto:${q.customerEmail}`} className="text-orange-700 hover:underline">
                              {q.customerEmail}
                            </a>
                            {q.customerPhone && (
                              <p className="text-[11px] text-gray-400">{q.customerPhone}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-800">{q.metalType || "Or"}</span>
                            {q.deliveryPreference && (
                              <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
                                {q.deliveryPreference}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {isSent && q.total > 0 ? (
                              <span className="font-bold text-emerald-700">{formatPrice(q.total)}</span>
                            ) : (
                              <span className="text-gray-500 italic">{q.investmentAmount || 'À définir'}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isSent ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                                <span>✓</span> Devis émis
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800">
                                <span>⏳</span> À chiffrer
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenQuote(q)}
                              className="px-3 py-1.5 rounded bg-[#0E2036] hover:bg-[#1A3353] text-white font-medium text-xs transition-colors"
                            >
                              {isSent ? '✏️ Modifier / Renvoyer' : '⚡ Chiffrer & Transmettre'}
                            </button>
                            {isSent && (
                              <a
                                href={`/api/quote/${q.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-colors"
                                title="Télécharger PDF"
                              >
                                📄 PDF
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── MODAL : ÉDITION ET ENVOI DE DEVIS ── */}
          {selectedQuote && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#C8732A] uppercase">
                      Éditeur de Devis Officiel
                    </span>
                    <h3 className="text-xl font-bold text-[#0E2036]">
                      Devis {selectedQuote.id} pour {selectedQuote.customerName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Success alert */}
                {quoteSuccessMsg && (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
                    <span>{quoteSuccessMsg}</span>
                    <a
                      href={`/api/quote/${selectedQuote.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold ml-2"
                    >
                      Ouvrir le PDF généré →
                    </a>
                  </div>
                )}

                {/* Recap client */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-lg text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400 block">Email :</span>
                    <strong className="text-gray-900">{selectedQuote.customerEmail}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Téléphone :</span>
                    <strong className="text-gray-900">{selectedQuote.customerPhone || 'Non renseigné'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Budget estimé :</span>
                    <strong className="text-amber-800">{selectedQuote.investmentAmount || 'Non spécifié'}</strong>
                  </div>
                  {selectedQuote.message && (
                    <div className="col-span-1 sm:col-span-3 pt-1 border-t border-gray-200">
                      <span className="text-gray-400">Demande client : </span>
                      <span className="italic">{selectedQuote.message}</span>
                    </div>
                  )}
                </div>

                {/* Table of items to quote */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Articles & Cours du Devis
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddQuoteItem}
                      className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[#C8732A] text-xs font-bold border border-[#C8732A]/30 transition-colors"
                    >
                      + Ajouter une ligne
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editItems.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2.5 rounded border border-gray-200 text-xs">
                        <div className="col-span-5">
                          <label className="text-[10px] text-gray-500 block mb-0.5">Désignation produit</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateQuoteItem(idx, 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-gray-500 block mb-0.5">Quantité</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuoteItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                            className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none text-center"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="text-[10px] text-gray-500 block mb-0.5">Prix unitaire (€)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleUpdateQuoteItem(idx, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none text-right font-mono"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-between pt-4">
                          <span className="font-bold text-gray-800 font-mono text-right flex-1 pr-2">
                            {formatPrice(item.quantity * item.price)}
                          </span>
                          {editItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuoteItem(idx)}
                              className="text-red-500 hover:text-red-700 font-bold px-1"
                              title="Supprimer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total line */}
                  <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">Montant Total du Devis (TVA 0% Or) :</span>
                    <span className="font-bold text-xl text-[#0E2036] font-mono">{formatPrice(quoteTotal)}</span>
                  </div>
                </div>

                {/* Notes and validity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Durée de validité du cours LBMA
                    </label>
                    <select
                      value={editValidity}
                      onChange={(e) => setEditValidity(parseInt(e.target.value, 10))}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white outline-none"
                    >
                      <option value="1">24 heures</option>
                      <option value="2">48 heures</option>
                      <option value="3">72 heures (Standard)</option>
                      <option value="7">7 jours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mentions / Conseils pour le client
                    </label>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    disabled={isSendingQuote}
                    onClick={handleSendQuote}
                    className="px-6 py-2.5 rounded-lg bg-[#0E2036] hover:bg-[#1A3353] text-white text-xs font-bold transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
                  >
                    {isSendingQuote ? (
                      <span>Génération PDF & Envoi en cours...</span>
                    ) : (
                      <>
                        <span>📄 Générer le Devis PDF & Transmettre au Client</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: CRÉATION D'UNE FACTURE MANUELLE DIRECTE
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'manual_invoice' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Génération d&apos;une Facture Client depuis l&apos;Administration
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Définissez le client destinataire. La facture PDF avec logo lui sera automatiquement envoyée par email et 
              enregistrée dans son espace client pour consultation.
            </p>
          </div>

          {invoiceSuccessMsg && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              ✓ {invoiceSuccessMsg}
            </div>
          )}

          {invoiceErrorMsg && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              ⚠️ {invoiceErrorMsg}
            </div>
          )}

          <form onSubmit={handleCreateInvoice} className="space-y-6">
            
            {/* Destinataire */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                1. Client Destinataire
              </h3>

              {users.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sélectionner un compte existant (optionnel)
                  </label>
                  <select
                    onChange={handleSelectUser}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white outline-none"
                  >
                    <option value="">-- Saisie libre ou sélectionner un utilisateur --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.email}>{u.email}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nom complet du client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceName}
                    onChange={(e) => setInvoiceName(e.target.value)}
                    placeholder="ex: Alexandre De la Tour"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Adresse e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={invoiceEmail}
                    onChange={(e) => setInvoiceEmail(e.target.value)}
                    placeholder="client@exemple.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={invoicePhone}
                    onChange={(e) => setInvoicePhone(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Adresse de facturation
                  </label>
                  <input
                    type="text"
                    value={invoiceAddress}
                    onChange={(e) => setInvoiceAddress(e.target.value)}
                    placeholder="15 Rue de la Paix, 75002 Paris"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Articles de la facture */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                  2. Lignes de la Facture
                </h3>
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[#C8732A] text-xs font-bold border border-[#C8732A]/30 transition-colors"
                >
                  + Ajouter un produit
                </button>
              </div>

              <div className="space-y-2">
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2.5 rounded border border-gray-200 text-xs">
                    <div className="col-span-5">
                      <label className="text-[10px] text-gray-500 block mb-0.5">Désignation</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-gray-500 block mb-0.5">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                        className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-gray-500 block mb-0.5">Prix unitaire (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 bg-white outline-none text-right font-mono"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-4">
                      <span className="font-bold text-gray-800 font-mono text-right flex-1 pr-2">
                        {formatPrice(item.quantity * item.price)}
                      </span>
                      {invoiceItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInvoiceItem(idx)}
                          className="text-red-500 hover:text-red-700 font-bold px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total line */}
              <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-between text-sm">
                <span className="font-bold text-gray-700">Total Net Facture (TVA 0% Exonérée) :</span>
                <span className="font-bold text-xl text-[#0E2036] font-mono">{formatPrice(invoiceTotal)}</span>
              </div>
            </div>

            {/* Statut & Règlement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Statut de la facture
                </label>
                <select
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white outline-none"
                >
                  <option value="PAID">Payée (Acquittée)</option>
                  <option value="PENDING">En attente de paiement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mode de règlement
                </label>
                <select
                  value={invoicePaymentMethod}
                  onChange={(e) => setInvoicePaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white outline-none"
                >
                  <option value="BANK_TRANSFER">Virement bancaire</option>
                  <option value="STRIPE">Carte bancaire (Stripe)</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isCreatingInvoice}
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#0E2036] hover:bg-[#1A3353] text-white text-xs font-bold transition-colors shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isCreatingInvoice ? 'Création et transmission en cours...' : '🧾 Générer la Facture PDF & Transmettre au Client'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

