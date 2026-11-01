'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GoldSectionEditorProps {
  section: any;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  updateSectionSettings: (id: string, keyOrUpdates: string | Record<string, any>, value?: any) => void;
  handleUpload?: (id: string, key: string) => void;
  goBack: () => void;
}

export default function GoldSectionEditor({
  section,
  updateSectionSettings,
  handleUpload,
  goBack,
}: GoldSectionEditorProps) {
  const [openTab, setOpenTab] = useState<'content' | 'design'>('content');

  const s = section.settings || {};

  const handleFieldChange = (key: string, value: any) => {
    updateSectionSettings(section.id, key, value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
      {/* HEADER */}
      <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="text-gray-500 hover:text-gray-800 transition p-1.5 hover:bg-gray-200 rounded-full"
            title="Retour à la liste des sections"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">
              {section.name || section.type}
            </h3>
            <span className="text-xs font-semibold text-[#8c6414] bg-[#fbf0b9] px-2.5 py-0.5 rounded-full inline-block mt-0.5">
              {section.type}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        
        {/* 1. GOLD HERO EDITOR */}
        {section.type === 'GoldHero' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              💡 Vous pouvez personnaliser le titre principal, le sous-titre, le bouton d’action et l’image de fond des lingots.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Titre principal</label>
              <input
                type="text"
                value={s.title ?? "Investissez dans la valeur sûre"}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                placeholder="Investissez dans la valeur sûre"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mots mis en valeur (couleur or)</label>
              <input
                type="text"
                value={s.highlight ?? "valeur sûre"}
                onChange={(e) => handleFieldChange('highlight', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                placeholder="valeur sûre"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
              <textarea
                rows={2}
                value={s.subtitle ?? "Pièces d'or, lingots d'or et d'argent au meilleur prix"}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                placeholder="Pièces d'or, lingots d'or et d'argent au meilleur prix"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={s.btnText ?? "Découvrir notre gamme"}
                  onChange={(e) => handleFieldChange('btnText', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                <input
                  type="text"
                  value={s.btnUrl ?? "/shop"}
                  onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image du Hero</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={s.image ?? "/images/hero-gold-silver.jpg"}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
                {handleUpload && (
                  <button
                    type="button"
                    onClick={() => handleUpload(section.id, 'image')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg shrink-0"
                  >
                    Médiathèque
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. REASSURANCE BAR EDITOR */}
        {section.type === 'ReassuranceBar' && (
          <div className="space-y-5">
            {[1, 2, 3, 4].map((num) => {
              const defTitles = ['Qualité garantie', 'Prix compétitifs', 'Livraison rapide', 'Service client réactif'];
              const defDescs = ['Des produits certifiés et authentiques', 'Un excellent rapport qualité-prix', 'Partout en Europe', 'Notre équipe à votre écoute'];
              return (
                <div key={num} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-gray-800 block">Avantage #{num}</span>
                  <div>
                    <input
                      type="text"
                      value={s[`item${num}_title`] ?? defTitles[num - 1]}
                      onChange={(e) => handleFieldChange(`item${num}_title`, e.target.value)}
                      placeholder="Titre"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium outline-none focus:border-[#c59a3f] mb-1.5"
                    />
                    <input
                      type="text"
                      value={s[`item${num}_desc`] ?? defDescs[num - 1]}
                      onChange={(e) => handleFieldChange(`item${num}_desc`, e.target.value)}
                      placeholder="Description"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-[#c59a3f]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. SELECTION GRID EDITOR */}
        {section.type === 'SelectionGrid' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
                <input
                  type="text"
                  value={s.badge ?? "Notre sélection"}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la section</label>
                <input
                  type="text"
                  value={s.title ?? "Or & Argent"}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            {[1, 2, 3, 4].map((num) => {
              const defTitles = ["Pièces d'or", "Lingots d'or", "Lingots d'argent", "Pièces d'argent"];
              const defDescs = ["Un patrimoine intemporel", "Une valeur sûre", "Investir autrement", "Un investissement accessible"];
              const defImgs = ["/images/gold-coins.jpg", "/images/gold-bars.jpg", "/images/silver-bars.jpg", "/images/silver-coins.jpg"];
              const defUrls = ["/shop?category=pieces-dor", "/shop?category=lingots-dor", "/shop?category=lingots-dargent", "/shop?category=pieces-dargent"];

              return (
                <div key={num} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-gray-800 block">Carte #{num}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={s[`card${num}_title`] ?? defTitles[num - 1]}
                      onChange={(e) => handleFieldChange(`card${num}_title`, e.target.value)}
                      placeholder="Titre de la catégorie"
                      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                    <input
                      type="text"
                      value={s[`card${num}_desc`] ?? defDescs[num - 1]}
                      onChange={(e) => handleFieldChange(`card${num}_desc`, e.target.value)}
                      placeholder="Description"
                      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={s[`card${num}_img`] ?? defImgs[num - 1]}
                      onChange={(e) => handleFieldChange(`card${num}_img`, e.target.value)}
                      placeholder="Image URL"
                      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                    <input
                      type="text"
                      value={s[`card${num}_url`] ?? defUrls[num - 1]}
                      onChange={(e) => handleFieldChange(`card${num}_url`, e.target.value)}
                      placeholder="Lien"
                      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. WHY CHOOSE US EDITOR */}
        {section.type === 'WhyChooseUs' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
              <input
                type="text"
                value={s.badge ?? "Pourquoi — nous choisir ?"}
                onChange={(e) => handleFieldChange('badge', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Titre principal</label>
              <input
                type="text"
                value={s.title ?? "Votre partenaire de confiance"}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={s.subtitle ?? "Nous vous accompagnons dans votre investissement avec transparence, sécurité et expertise."}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={s.btnText ?? "En savoir plus"}
                  onChange={(e) => handleFieldChange('btnText', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                <input
                  type="text"
                  value={s.btnUrl ?? "/about"}
                  onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <span className="text-xs font-bold text-gray-800 block mb-3">Les 4 Piliers</span>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((num) => {
                  const defTitles = ['Produits certifiés', 'Transparence totale', 'Accompagnement personnalisé', 'Livraison sécurisée'];
                  const defDescs = ['Authenticité garantie', 'Des prix clairs', 'Une équipe à votre écoute', 'Dans toute l’Europe'];
                  return (
                    <div key={num} className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                      <input
                        type="text"
                        value={s[`pillar${num}_title`] ?? defTitles[num - 1]}
                        onChange={(e) => handleFieldChange(`pillar${num}_title`, e.target.value)}
                        placeholder="Titre pilier"
                        className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                      />
                      <input
                        type="text"
                        value={s[`pillar${num}_desc`] ?? defDescs[num - 1]}
                        onChange={(e) => handleFieldChange(`pillar${num}_desc`, e.target.value)}
                        placeholder="Description pilier"
                        className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. PRECIOUS METALS TICKER EDITOR */}
        {section.type === 'PreciousMetalsTicker' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={s.title ?? "Cours des métaux précieux"}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Cours de l’Or (€)</label>
                <input
                  type="text"
                  value={s.gold_price ?? "€ 2 720,45"}
                  onChange={(e) => handleFieldChange('gold_price', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Variation Or (%)</label>
                <input
                  type="text"
                  value={s.gold_change ?? "+0,42%"}
                  onChange={(e) => handleFieldChange('gold_change', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Cours de l’Argent (€)</label>
                <input
                  type="text"
                  value={s.silver_price ?? "€ 32,17"}
                  onChange={(e) => handleFieldChange('silver_price', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Variation Argent (%)</label>
                <input
                  type="text"
                  value={s.silver_change ?? "+1,12%"}
                  onChange={(e) => handleFieldChange('silver_change', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={s.btnText ?? "Voir les cours en détail"}
                  onChange={(e) => handleFieldChange('btnText', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                <input
                  type="text"
                  value={s.btnUrl ?? "/shop"}
                  onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. CTA BANNER EDITOR */}
        {section.type === 'CtaBanner' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la bannière</label>
              <input
                type="text"
                value={s.title ?? "Investissez dès aujourd’hui"}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
              <textarea
                rows={2}
                value={s.subtitle ?? "Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent."}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={s.btnText ?? "Découvrir notre gamme"}
                  onChange={(e) => handleFieldChange('btnText', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                <input
                  type="text"
                  value={s.btnUrl ?? "/shop"}
                  onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image de fond</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={s.image ?? "/images/gold-banner-cta.jpg"}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
                />
                {handleUpload && (
                  <button
                    type="button"
                    onClick={() => handleUpload(section.id, 'image')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded shrink-0"
                  >
                    Médiathèque
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. TESTIMONIALS SECTION EDITOR */}
        {section.type === 'Testimonials' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
              <input
                type="text"
                value={s.badge ?? "Ils nous font confiance"}
                onChange={(e) => handleFieldChange('badge', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f]"
              />
            </div>

            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((num) => {
                const defNames = ['Thomas D.', 'Sophie M.', 'Pierre L.'];
                const defQuotes = [
                  '« Service impeccable et livraison rapide. Je recommande vivement ! »',
                  '« Des prix très compétitifs et une équipe très professionnelle. »',
                  '« Une expérience d’achat parfaite. Je reviendrai sans hésiter. »'
                ];

                return (
                  <div key={num} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-gray-800 block">Avis #{num}</span>
                    <input
                      type="text"
                      value={s[`review${num}_name`] ?? defNames[num - 1]}
                      onChange={(e) => handleFieldChange(`review${num}_name`, e.target.value)}
                      placeholder="Nom du client"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                    <textarea
                      rows={2}
                      value={s[`review${num}_text`] ?? defQuotes[num - 1]}
                      onChange={(e) => handleFieldChange(`review${num}_text`, e.target.value)}
                      placeholder="Témoignage"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#c59a3f]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

