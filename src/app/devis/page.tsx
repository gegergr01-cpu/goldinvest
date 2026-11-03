'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitQuoteAction } from '@/actions/quotes';
import LuxuryArrow from '@/components/ui/LuxuryArrow';

export default function DevisPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedQuoteId, setGeneratedQuoteId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const res = await submitQuoteAction(formData);

    if (res.error) {
      setStatus('error');
      setErrorMessage(res.error);
    } else if (res.success) {
      setStatus('success');
      setGeneratedQuoteId(res.quoteId || '');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0E2036]">
      
      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#0E2036] text-white py-16 lg:py-20 overflow-hidden border-b border-[#C8732A]/30">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#E8A63D 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#C8732A]/40 text-[#E8A63D] text-xs font-mono tracking-widest uppercase mb-4">
            <span>✨</span> Service Privé d&apos;Investissement
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Demande de Devis Personnalisé
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Obtenez une proposition chiffrée sous 24 à 48h aux cours officiels du marché en direct. 
            Nos devis bénéficient de la garantie de cours LBMA et sont certifiés conformes au régime fiscal d&apos;exonération de TVA.
          </p>
        </div>
      </section>

      {/* ── FORM CONTAINER ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        {status === 'success' ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#C8732A]/30 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#C8732A] uppercase">
                Demande transmise avec succès
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2036]">
                Votre devis a été pris en charge
              </h2>
              <div className="inline-block bg-[#0E2036] text-[#E8A63D] font-mono text-sm px-4 py-1.5 rounded-md mt-2 font-bold tracking-wider">
                RÉFÉRENCE : {generatedQuoteId}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
              Un conseiller patrimonial étudie actuellement votre requête. Dès son émission, votre 
              <strong> devis officiel au format PDF</strong> sera disponible directement dans votre espace client 
              et une copie scellée vous sera transmise par e-mail.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account/quotes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white text-sm font-semibold transition-colors shadow-md"
              >
                <span>Accéder à mes devis</span>
                <LuxuryArrow className="w-3 h-3 brightness-0 invert" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200/90 shadow-lg space-y-8">
            
            <div className="border-b border-gray-100 pb-5">
              <h2 className="font-serif text-2xl font-bold text-[#0E2036]">
                Formulaire d&apos;estimation d&apos;investissement
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Remplissez les détails ci-dessous pour recevoir une tarification transparente et adaptée à vos objectifs.
              </p>
            </div>

            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Identité */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                  1. Vos Coordonnées
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="ex: Jean Dupont"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jean.dupont@exemple.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Ville / Code Postal
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="ex: 75008 Paris, France"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Critères d'investissement */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold font-mono tracking-wider text-[#C8732A] uppercase">
                  2. Votre Projet d&apos;Investissement
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Type de métal souhaité
                    </label>
                    <select
                      name="metalType"
                      defaultValue="Or d'investissement"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                    >
                      <option value="Or d'investissement (Lingots & Pièces)">Or d&apos;investissement (Lingots & Pièces)</option>
                      <option value="Argent Métal (Lingots 1kg & Onces)">Argent Métal (Lingots 1kg & Onces)</option>
                      <option value="Lingots Or LBMA (50g, 100g, 250g, 1kg)">Lingots Or LBMA (50g, 100g, 250g, 1kg)</option>
                      <option value="Pièces d'Or boursables (Napoléon, Souverain, Krugerrand)">Pièces d&apos;Or boursables (Napoléon, Souverain...)</option>
                      <option value="Portefeuille diversifié (Or + Argent + Platine)">Portefeuille diversifié (Or + Argent + Platine)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Budget estimé
                    </label>
                    <select
                      name="investmentAmount"
                      defaultValue="5 000 € à 15 000 €"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                    >
                      <option value="Moins de 5 000 €">Moins de 5 000 €</option>
                      <option value="5 000 € à 15 000 €">5 000 € à 15 000 €</option>
                      <option value="15 000 € à 50 000 €">15 000 € à 50 000 €</option>
                      <option value="50 000 € à 150 000 €">50 000 € à 150 000 €</option>
                      <option value="Plus de 150 000 € (Gestion privée)">Plus de 150 000 € (Gestion privée)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mode de conservation privilégié
                  </label>
                  <select
                    name="deliveryPreference"
                    defaultValue="Livraison sécurisée avec assurance ad valorem"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none bg-white text-gray-800"
                  >
                    <option value="Livraison sécurisée avec assurance ad valorem">
                      Livraison sécurisée assurée à 100% à domicile (scellé discret)
                    </option>
                    <option value="Retrait sécurisé en agence privée">
                      Retrait sécurisé sur rendez-vous en agence privée
                    </option>
                    <option value="Stockage sécurisé en coffres-forts haute sécurité (Zurich / Genève)">
                      Stockage sécurisé en coffres-forts haute sécurité (Zurich / Genève / Paris)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Produits recherchés ou instructions particulières
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Précisez ici vos souhaits (ex: 2 x lingots de 100g C.Hafner, 10 x Napoléons 20 Francs, livraison rapide...)"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#C8732A] focus:ring-1 focus:ring-[#C8732A] outline-none"
                  />
                </div>
              </div>

              {/* Legal Notice Box */}
              <div className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-lg p-3.5 text-[11.5px] text-gray-600 space-y-1">
                <p className="font-semibold text-[#0E2036] flex items-center gap-1.5">
                  <span className="text-[#C8732A]">🛡️</span> Garanties et Certification LBMA
                </p>
                <p>
                  L&apos;or d&apos;investissement est légalement exonéré de TVA (CGI art. 262 ter I). Vos informations sont strictement confidentielles et ne feront l&apos;objet d&apos;aucun démarchage commercial abusif.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-[#0E2036] hover:bg-[#1A3353] text-white text-sm font-semibold transition-colors shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <span>Transmission en cours...</span>
                  ) : (
                    <>
                      <span>Recevoir mon devis d&apos;investissement officiel</span>
                      <LuxuryArrow className="w-3 h-3 brightness-0 invert" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

    </div>
  );
}
