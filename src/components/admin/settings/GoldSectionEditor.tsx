'use client';

import React, { useState } from 'react';

interface GoldSectionEditorProps {
  section: any;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  updateSectionSettings: (id: string, keyOrUpdates: string | Record<string, any>, value?: any) => void;
  handleUpload?: (id: string, key: string) => void;
  goBack: () => void;
  onDelete?: () => void;
}

export default function GoldSectionEditor({
  section,
  previewMode = 'desktop',
  updateSectionSettings,
  handleUpload,
  goBack,
  onDelete,
}: GoldSectionEditorProps) {
  // Independent collapsible accordions (Content on top, Design below)
  const [openContent, setOpenContent] = useState(true);
  const [openDesign, setOpenDesign] = useState(false);

  const s = section.settings || {};

  const handleFieldChange = (key: string, value: any) => {
    updateSectionSettings(section.id, key, value);
  };

  const triggerUpload = (fieldKey: string) => {
    if (handleUpload) {
      handleUpload(section.id, fieldKey);
    }
  };

  // Elementor-style typography & text styling controls
  const renderDesignTextControls = (label: string, baseKey: string, colorKey: string, defaultColor: string) => {
    const mode = (previewMode || 'desktop').toUpperCase();
    const sizeKey = `${baseKey}_SIZE_${mode}`;
    const lhKey = `${baseKey}_LINE_HEIGHT_${mode}`;
    const lsKey = `${baseKey}_LETTER_SPACING_${mode}`;

    const currentSize = s[sizeKey] ? parseInt(String(s[sizeKey]).replace('px', ''), 10) : (s[`${baseKey}_SIZE`] || 16);
    const currentLh = s[lhKey] || s[`${baseKey}_LH`] || '';
    const currentLs = s[lsKey] ? parseInt(String(s[lsKey]).replace('px', ''), 10) : (s[`${baseKey}_LS`] || 0);
    const currentColor = s[colorKey] || defaultColor;

    return (
      <div className="mb-5 flex flex-col gap-2">
        <label className="block text-xs font-medium text-gray-700">{label}</label>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {/* Size */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Taille</span>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white w-[72px] shrink-0" title="Taille (px)">
              <input
                type="number"
                value={currentSize || ''}
                onChange={(e) => handleFieldChange(sizeKey, e.target.value + 'px')}
                className="flex-1 w-full text-center text-[13px] border-0 py-1.5 px-1 outline-none bg-transparent min-w-0"
                placeholder="16"
              />
              <span className="text-[10px] text-gray-500 bg-gray-50 h-8 px-1.5 border-l border-gray-300 flex items-center justify-center shrink-0">px</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Interligne</span>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white w-[72px] shrink-0" title="Interligne (ex: 1.2)">
              <input
                type="number"
                step="0.1"
                value={currentLh}
                onChange={(e) => handleFieldChange(lhKey, e.target.value)}
                className="flex-1 w-full text-center text-[13px] border-0 py-1.5 px-1 outline-none bg-transparent min-w-0"
                placeholder="LH"
              />
              <span className="text-[10px] text-gray-500 bg-gray-50 h-8 px-1.5 border-l border-gray-300 flex items-center justify-center shrink-0">lh</span>
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Espace (lettres)</span>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white w-[72px] shrink-0" title="Espacement (px)">
              <input
                type="number"
                step="1"
                value={currentLs || 0}
                onChange={(e) => handleFieldChange(lsKey, e.target.value + 'px')}
                className="flex-1 w-full text-center text-[13px] border-0 py-1.5 px-1 outline-none bg-transparent min-w-0"
                placeholder="0"
              />
              <span className="text-[10px] text-gray-500 bg-gray-50 h-8 px-1.5 border-l border-gray-300 flex items-center justify-center shrink-0">px</span>
            </div>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Couleur</span>
            <div className="relative w-10 h-8 rounded border border-gray-300 overflow-hidden shadow-sm cursor-pointer">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => handleFieldChange(colorKey, e.target.value)}
                className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Background image box with Edit / Remove buttons
  const renderImageBox = (
    label: string,
    fieldKey: string,
    defaultImage: string,
    showKey?: string,
    showLabel?: string
  ) => {
    const rawVal = s[fieldKey];
    const imgVal = typeof rawVal !== 'undefined' ? rawVal : defaultImage;
    const hasImg = Boolean(imgVal && typeof imgVal === 'string' && imgVal.trim() !== '');

    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-red-700 mb-2">{label}</label>
        <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[120px] transition hover:bg-gray-100 overflow-hidden">
          {hasImg ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgVal}
                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-60"
                alt=""
              />
              <div className="relative z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerUpload(fieldKey)}
                  className="bg-white text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm border hover:bg-gray-50 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange(fieldKey, '')}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm hover:bg-red-600 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => triggerUpload(fieldKey)}
              className="flex flex-col items-center text-gray-500 hover:text-gray-600 transition cursor-pointer"
            >
              <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium">Add an image</span>
            </button>
          )}
        </div>

        {showKey && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id={`${showKey}_${section.id}`}
              checked={s[showKey] !== 'false'}
              onChange={(e) => handleFieldChange(showKey, e.target.checked ? 'true' : 'false')}
              className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor={`${showKey}_${section.id}`} className="text-xs text-gray-600 cursor-pointer">
              {showLabel || 'Show image'}
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
      {/* HEADER */}
      <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="text-gray-500 hover:text-gray-800 transition p-1.5 hover:bg-gray-200 rounded-full cursor-pointer"
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

      {/* BODY CONTENT : ELEMENTOR-STYLE ACCORDIONS (STACKED VERTICALLY) */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 bg-gray-50/30">

        {/* ============================================================ */}
        {/* 1. CONTENT SETTINGS ACCORDION */}
        {/* ============================================================ */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpenContent(!openContent)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-sm text-gray-800">Content Settings</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openContent ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openContent && (
            <div className="p-4 border-t border-gray-200 space-y-4">

              {/* SPECIFIC CONTENT FIELDS BY SECTION TYPE */}

              {/* A. GOLD HERO */}
              {section.type === 'GoldHero' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category / Tagline (texte or)
                    </label>
                    <input
                      type="text"
                      value={s.highlight ?? "valeur sûre"}
                      onChange={(e) => handleFieldChange('highlight', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none transition-colors"
                      placeholder="valeur sûre"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title ?? "Investissez dans la valeur sûre"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none transition-colors"
                      placeholder="Investissez dans la valeur sûre"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle / badge</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Pièces d'or, lingots d'or et d'argent au meilleur prix"}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none transition-colors"
                      placeholder="Pièces d'or, lingots d'or..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={s.btnText ?? "Découvrir notre gamme"}
                      onChange={(e) => handleFieldChange('btnText', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={s.btnUrl ?? "/shop"}
                      onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none transition-colors"
                      placeholder="/shop"
                    />
                  </div>
                </>
              )}

              {/* B. REASSURANCE BAR */}
              {section.type === 'ReassuranceBar' && (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((num) => {
                    const defTitles = ['Qualité garantie', 'Prix compétitifs', 'Livraison rapide', 'Service client réactif'];
                    const defDescs = ['Des produits certifiés et authentiques', 'Un excellent rapport qualité-prix', 'Partout en Europe', 'Notre équipe à votre écoute'];
                    return (
                      <div key={num} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                        <span className="text-xs font-bold text-gray-800 block">Avantage #{num}</span>
                        <input
                          type="text"
                          value={s[`item${num}_title`] ?? defTitles[num - 1]}
                          onChange={(e) => handleFieldChange(`item${num}_title`, e.target.value)}
                          placeholder="Titre"
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                        />
                        <input
                          type="text"
                          value={s[`item${num}_desc`] ?? defDescs[num - 1]}
                          onChange={(e) => handleFieldChange(`item${num}_desc`, e.target.value)}
                          placeholder="Description"
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* C. SELECTION GRID */}
              {section.type === 'SelectionGrid' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category / Tagline</label>
                    <input
                      type="text"
                      value={s.badge ?? "Notre sélection"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title ?? "Or & Argent"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="border-t pt-3 space-y-3">
                    <span className="text-xs font-bold text-gray-800 block">Les 4 Cartes de Produits</span>
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
                              placeholder="Titre"
                              className="border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                            />
                            <input
                              type="text"
                              value={s[`card${num}_desc`] ?? defDescs[num - 1]}
                              onChange={(e) => handleFieldChange(`card${num}_desc`, e.target.value)}
                              placeholder="Description"
                              className="border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                            />
                          </div>

                          {renderImageBox(`Image Carte #${num}`, `card${num}_img`, defImgs[num - 1])}

                          <input
                            type="text"
                            value={s[`card${num}_url`] ?? defUrls[num - 1]}
                            onChange={(e) => handleFieldChange(`card${num}_url`, e.target.value)}
                            placeholder="Lien /shop?category=..."
                            className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-orange-500 bg-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* D. WHY CHOOSE US */}
              {section.type === 'WhyChooseUs' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category / Tagline</label>
                    <input
                      type="text"
                      value={s.badge ?? "Pourquoi — nous choisir ?"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title ?? "Votre partenaire de confiance"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle / badge</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Nous vous accompagnons dans votre investissement avec transparence, sécurité et expertise."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={s.btnText ?? "En savoir plus"}
                        onChange={(e) => handleFieldChange('btnText', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={s.btnUrl ?? "/about"}
                        onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <span className="text-xs font-bold text-gray-800 block">Les 4 Piliers</span>
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-orange-500 bg-white"
                          />
                          <input
                            type="text"
                            value={s[`pillar${num}_desc`] ?? defDescs[num - 1]}
                            onChange={(e) => handleFieldChange(`pillar${num}_desc`, e.target.value)}
                            placeholder="Description"
                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-orange-500 bg-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* E. PRECIOUS METALS TICKER */}
              {section.type === 'PreciousMetalsTicker' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Mode des cours
                      </span>
                      <select
                        value={s.mode || 'auto'}
                        onChange={(e) => handleFieldChange('mode', e.target.value)}
                        className="border border-emerald-300 rounded px-2 py-1 text-xs font-semibold bg-white text-emerald-900 outline-none"
                      >
                        <option value="auto">Automatique (En direct)</option>
                        <option value="manual">Manuel (Fixe)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      {s.mode !== 'manual'
                        ? '✨ Les cours réels de l’or et de l’argent sont actualisés en temps réel depuis les marchés en Euros.'
                        : '⚙️ Mode manuel : définissez les montants personnalisés ci-dessous.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title ?? "Cours des métaux précieux"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle / badge</label>
                    <input
                      type="text"
                      value={s.subtitle ?? "Actualisé en temps réel"}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>

                  {s.mode === 'manual' && (
                    <div className="grid grid-cols-2 gap-2 bg-amber-50/50 p-2.5 rounded border border-amber-200">
                      <input
                        type="text"
                        value={s.gold_price ?? "€ 2 720,45"}
                        onChange={(e) => handleFieldChange('gold_price', e.target.value)}
                        placeholder="Prix Or"
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={s.gold_change ?? "+0,42%"}
                        onChange={(e) => handleFieldChange('gold_change', e.target.value)}
                        placeholder="Var. Or"
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={s.silver_price ?? "€ 32,17"}
                        onChange={(e) => handleFieldChange('silver_price', e.target.value)}
                        placeholder="Prix Argent"
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={s.silver_change ?? "+1,12%"}
                        onChange={(e) => handleFieldChange('silver_change', e.target.value)}
                        placeholder="Var. Argent"
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={s.btnText ?? "Voir les cours en détail"}
                        onChange={(e) => handleFieldChange('btnText', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={s.btnUrl ?? "/shop"}
                        onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* F. CTA BANNER */}
              {section.type === 'CtaBanner' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title ?? "Investissez dès aujourd’hui"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle / badge</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={s.btnText ?? "Découvrir notre gamme"}
                        onChange={(e) => handleFieldChange('btnText', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={s.btnUrl ?? "/shop"}
                        onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* G. TESTIMONIALS */}
              {section.type === 'Testimonials' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category / Tagline</label>
                    <input
                      type="text"
                      value={s.badge ?? "Ils nous font confiance"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
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
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                          />
                          <textarea
                            rows={2}
                            value={s[`review${num}_text`] ?? defQuotes[num - 1]}
                            onChange={(e) => handleFieldChange(`review${num}_text`, e.target.value)}
                            placeholder="Témoignage"
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 2. DESIGN SETTINGS ACCORDION (STACKED DIRECTLY UNDERNEATH) */}
        {/* ============================================================ */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpenDesign(!openDesign)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-sm text-gray-800">Design Settings</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openDesign ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDesign && (
            <div className="p-4 border-t border-gray-200 space-y-6">

              {/* BACKGROUND IMAGE WITH EDIT / REMOVE BUTTONS */}
              {(section.type === 'GoldHero' || section.type === 'CtaBanner') && (
                <div>
                  {renderImageBox(
                    'Background image',
                    section.type === 'CtaBanner' ? 'image' : 'bgImage',
                    section.type === 'CtaBanner' ? '/images/gold-banner-cta.jpg' : '/images/hero-bg-luxury.jpg',
                    'SHOW_BG_IMAGE',
                    'Show background image'
                  )}

                  {s.SHOW_BG_IMAGE !== 'false' && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dark Overlay</label>
                      <select
                        value={s.BG_OVERLAY || '40'}
                        onChange={(e) => handleFieldChange('BG_OVERLAY', e.target.value)}
                        className="w-full border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500 px-3 py-2 bg-white outline-none cursor-pointer"
                      >
                        <option value="0">None (0%)</option>
                        <option value="20">Light (20%)</option>
                        <option value="40">Medium (40%)</option>
                        <option value="60">Dark (60%)</option>
                        <option value="80">Very Dark (80%)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* MAIN IMAGE (PRODUCT / HERO VISUAL) */}
              {section.type === 'GoldHero' && (
                renderImageBox(
                  'Main image (Product)',
                  'image',
                  '/images/hero-gold-silver.jpg',
                  'SHOW_MAIN_IMAGE',
                  'Show main image'
                )
              )}

              {/* STYLES & ALIGNEMENT (3X3 GRID) */}
              <div className="border-t pt-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Styles & Alignement</h4>

                {/* Position (3x3 Grid) */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Position du Contenu</label>
                  <div className="grid grid-cols-3 gap-1 w-[88px] h-[88px] bg-gray-100 p-1.5 rounded-lg border border-gray-200 shadow-inner">
                    {['top', 'center', 'bottom'].map((v) =>
                      ['left', 'center', 'right'].map((h) => {
                        const currentV = s.CONTENT_VALIGN || 'center';
                        const currentH = s.CONTENT_ALIGN || 'left';
                        const isSelected = currentV === v && currentH === h;

                        let title = '';
                        if (v === 'top') title = 'Haut ';
                        if (v === 'center') title = 'Milieu ';
                        if (v === 'bottom') title = 'Bas ';
                        if (h === 'left') title += 'Gauche';
                        if (h === 'center') title += 'Centre';
                        if (h === 'right') title += 'Droite';

                        return (
                          <button
                            key={`${v}-${h}`}
                            type="button"
                            onClick={() => {
                              handleFieldChange('CONTENT_VALIGN', v);
                              handleFieldChange('CONTENT_ALIGN', h);
                            }}
                            className={`rounded-[4px] transition-all flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500 shadow-md ring-1 ring-orange-600 ring-inset'
                                : 'bg-white border border-gray-200 hover:bg-orange-50'
                            }`}
                            title={title}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300'}`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Gère l&apos;alignement horizontal et vertical</p>
                </div>

                {/* Style du Bouton (CTA) */}
                {(section.type === 'GoldHero' || section.type === 'WhyChooseUs' || section.type === 'CtaBanner' || section.type === 'PreciousMetalsTicker') && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Style du Bouton (CTA)</label>
                    <select
                      value={s.BTN_STYLE || 'pill'}
                      onChange={(e) => handleFieldChange('BTN_STYLE', e.target.value)}
                      className="w-full border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500 px-3 py-2 bg-white outline-none cursor-pointer"
                    >
                      <option value="pill">Pilule (Très arrondi)</option>
                      <option value="rounded">Arrondi léger</option>
                      <option value="square">Carré</option>
                    </select>
                  </div>
                )}

                {/* Style des Badges */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Style des Badges</label>
                  <select
                    value={s.BADGE_STYLE || 'gold'}
                    onChange={(e) => handleFieldChange('BADGE_STYLE', e.target.value)}
                    className="w-full border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500 px-3 py-2 bg-white outline-none cursor-pointer"
                  >
                    <option value="gold">Doré Élégant (Gold)</option>
                    <option value="light">Badge Clair (Effet verre)</option>
                    <option value="dark">Badge Sombre (Effet verre)</option>
                    <option value="none">Texte simple (Sans badge)</option>
                  </select>
                </div>

                {/* Background Overlay Type */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Background Overlay</label>
                  <select
                    value={s.OVERLAY_TYPE || 'grad-t'}
                    onChange={(e) => handleFieldChange('OVERLAY_TYPE', e.target.value)}
                    className="w-full border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500 px-3 py-2 bg-white outline-none cursor-pointer"
                  >
                    <option value="grad-t">Dégradé Bas ➔ Haut</option>
                    <option value="grad-r">Dégradé Gauche ➔ Droite</option>
                    <option value="solid">Couleur Unie</option>
                  </select>
                </div>
              </div>

              {/* TYPOGRAPHY & COLORS */}
              <div className="border-t pt-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Typography & Colors</h4>

                {section.type === 'GoldHero' && (
                  <>
                    {renderDesignTextControls('Category / Tagline (texte or)', 'CATEGORY', 'CATEGORY_COLOR', '#c59a3f')}
                    {renderDesignTextControls('Title', 'TITLE', 'TITLE_COLOR', '#ffffff')}
                    {renderDesignTextControls('Subtitle', 'SUBTITLE', 'SUBTITLE_COLOR', '#d1d5db')}
                    {renderDesignTextControls('Button', 'BTN', 'BTN_TEXT_COLOR', '#000000')}
                  </>
                )}

                {section.type === 'SelectionGrid' && (
                  <>
                    {renderDesignTextControls('Badge', 'BADGE', 'BADGE_COLOR', '#c59a3f')}
                    {renderDesignTextControls('Title', 'TITLE', 'TITLE_COLOR', '#111827')}
                  </>
                )}

                {section.type === 'WhyChooseUs' && (
                  <>
                    {renderDesignTextControls('Badge', 'BADGE', 'BADGE_COLOR', '#c59a3f')}
                    {renderDesignTextControls('Title', 'TITLE', 'TITLE_COLOR', '#ffffff')}
                    {renderDesignTextControls('Subtitle', 'SUBTITLE', 'SUBTITLE_COLOR', '#d1d5db')}
                    {renderDesignTextControls('Button', 'BTN', 'BTN_TEXT_COLOR', '#000000')}
                  </>
                )}

                {section.type === 'PreciousMetalsTicker' && (
                  <>
                    {renderDesignTextControls('Title', 'TITLE', 'TITLE_COLOR', '#111827')}
                    {renderDesignTextControls('Subtitle', 'SUBTITLE', 'SUBTITLE_COLOR', '#6b7280')}
                    {renderDesignTextControls('Button', 'BTN', 'BTN_TEXT_COLOR', '#374151')}
                  </>
                )}

                {section.type === 'CtaBanner' && (
                  <>
                    {renderDesignTextControls('Title', 'TITLE', 'TITLE_COLOR', '#ffffff')}
                    {renderDesignTextControls('Subtitle', 'SUBTITLE', 'SUBTITLE_COLOR', '#e5e7eb')}
                    {renderDesignTextControls('Button', 'BTN', 'BTN_TEXT_COLOR', '#000000')}
                  </>
                )}

                {section.type === 'Testimonials' && (
                  <>
                    {renderDesignTextControls('Badge', 'BADGE', 'BADGE_COLOR', '#c59a3f')}
                  </>
                )}
              </div>

              {/* BACKGROUND COLORS (BLOCK & BUTTON) */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-medium mb-1 text-gray-500">Block Background</label>
                  <div className="relative w-full h-10 rounded-md overflow-hidden border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="color"
                      value={s.BG_COLOR || s.bgColor || (section.type === 'GoldHero' || section.type === 'WhyChooseUs' ? '#0a0a0a' : '#ffffff')}
                      onChange={(e) => {
                        handleFieldChange('BG_COLOR', e.target.value);
                        handleFieldChange('bgColor', e.target.value);
                      }}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1 text-gray-500">Button Background</label>
                  <div className="relative w-full h-10 rounded-md overflow-hidden border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="color"
                      value={s.BTN_BG_COLOR || s.btnBgColor || '#c59a3f'}
                      onChange={(e) => {
                        handleFieldChange('BTN_BG_COLOR', e.target.value);
                        handleFieldChange('btnBgColor', e.target.value);
                      }}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* REDIRECT LINK (URL) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Redirect link (URL)</label>
                <input
                  type="text"
                  value={s.btnUrl || s.LINK || '/shop'}
                  onChange={(e) => {
                    handleFieldChange('btnUrl', e.target.value);
                    handleFieldChange('LINK', e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none text-gray-700"
                  placeholder="/shop"
                />
              </div>

            </div>
          )}
        </div>

      </div>

      {/* DELETE SECTION BUTTON AT BOTTOM (FROM SCREENSHOT) */}
      {onDelete && (
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
                onDelete();
              }
            }}
            className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1.5 p-1.5 rounded hover:bg-red-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete section</span>
          </button>
        </div>
      )}
    </div>
  );
}
