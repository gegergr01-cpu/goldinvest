'use client';

import React, { useState } from 'react';

interface GoldSectionEditorProps {
  section: any;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  updateSectionSettings: (id: string, keyOrUpdates: string | Record<string, any>, value?: any) => void;
  handleUpload?: (id: string, key: string) => void;
  goBack: () => void;
}

// Reusable Visual Image Picker (NO raw text input field!)
interface ImagePickerFieldProps {
  label: string;
  value?: string;
  onPick: () => void;
  onClear: () => void;
  helperText?: string;
}

function ImagePickerField({ label, value, onPick, onClear, helperText }: ImagePickerFieldProps) {
  const hasImage = Boolean(value && typeof value === 'string' && value.trim() !== '');

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      {helperText && <p className="text-[11px] text-gray-500">{helperText}</p>}

      {hasImage ? (
        <div className="relative rounded-xl border border-gray-200 bg-gray-900 p-2 overflow-hidden shadow-sm flex items-center gap-3">
          {/* Thumbnail preview */}
          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action buttons */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onPick}
              className="px-3 py-1.5 bg-[#c59a3f] hover:bg-[#b08733] text-black font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Changer l&apos;image</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 border border-red-500/20 cursor-pointer"
              title="Supprimer l'image"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="w-full border-2 border-dashed border-gray-300 hover:border-[#c59a3f] rounded-xl p-4 text-center transition-all bg-gray-50 hover:bg-amber-50/40 group flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-[#c59a3f]/15 text-gray-500 group-hover:text-[#c59a3f] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
            Choisir une image dans la médiathèque
          </span>
        </button>
      )}
    </div>
  );
}

// Collapsible Setting Group Card (Vertical stacked layout)
function SettingGroup({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50/90 hover:bg-gray-100/90 px-4 py-3 border-b border-gray-200 flex items-center justify-between transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c59a3f]/10 text-[#c59a3f] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[11px] text-gray-500 font-normal leading-tight mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400">
            {isOpen ? 'Réduire' : 'Déplier'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function GoldSectionEditor({
  section,
  updateSectionSettings,
  handleUpload,
  goBack,
}: GoldSectionEditorProps) {
  const s = section.settings || {};

  const handleFieldChange = (key: string, value: any) => {
    updateSectionSettings(section.id, key, value);
  };

  const triggerUpload = (fieldKey: string) => {
    if (handleUpload) {
      handleUpload(section.id, fieldKey);
    }
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

      {/* BODY CONTENT : VERTICAL STACKED (PARAMÈTRES CONTENU EN HAUT, DESIGN EN DESSOUS) */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 bg-gray-50/40">

        {/* ============================================================ */}
        {/* 1. GOLD HERO */}
        {/* ============================================================ */}
        {section.type === 'GoldHero' && (
          <>
            {/* PARAMÈTRES CONTENU */}
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Titre, sous-titre, bouton et visuels du Hero"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre principal</label>
                <input
                  type="text"
                  value={s.title ?? "Investissez dans la valeur sûre"}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mots mis en valeur (couleur or)</label>
                <input
                  type="text"
                  value={s.highlight ?? "valeur sûre"}
                  onChange={(e) => handleFieldChange('highlight', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
                <textarea
                  rows={2}
                  value={s.subtitle ?? "Pièces d'or, lingots d'or et d'argent au meilleur prix"}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <input
                    type="text"
                    value={s.btnText ?? "Découvrir notre gamme"}
                    onChange={(e) => handleFieldChange('btnText', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                  <input
                    type="text"
                    value={s.btnUrl ?? "/shop"}
                    onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
              </div>

              {/* IMAGE PRINCIPALE DU HERO */}
              <ImagePickerField
                label="Image principale du Hero (visuel lingots / pièces de droite)"
                value={s.image ?? "/images/hero-gold-silver.jpg"}
                onPick={() => triggerUpload('image')}
                onClear={() => handleFieldChange('image', '')}
                helperText="L'image principale présentée à droite dans la section Hero."
              />

              {/* IMAGE DE FOND DU HERO */}
              <ImagePickerField
                label="Image de fond du Hero (Background)"
                value={s.bgImage ?? "/images/hero-bg-luxury.jpg"}
                onPick={() => triggerUpload('bgImage')}
                onClear={() => handleFieldChange('bgImage', '')}
                helperText="Texture ou ambiance sombre de luxe affichée en arrière-plan."
              />
            </SettingGroup>

            {/* PARAMÈTRES DESIGN (L'UN EN DESSOUS DE L'AUTRE) */}
            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan, opacité et couleurs des boutons"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#0a0a0a"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#0a0a0a"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Opacité de l&apos;image de fond (BG)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={typeof s.bgOpacity !== 'undefined' ? s.bgOpacity : 0.45}
                  onChange={(e) => handleFieldChange('bgOpacity', parseFloat(e.target.value))}
                  className="w-full accent-[#c59a3f]"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>0% (Discrète)</span>
                  <span className="font-bold text-gray-800">{Math.round((typeof s.bgOpacity !== 'undefined' ? s.bgOpacity : 0.45) * 100)}%</span>
                  <span>100% (Visible)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;accentuation (Or)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.highlightColor || "#c59a3f"}
                    onChange={(e) => handleFieldChange('highlightColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.highlightColor || "#c59a3f"}
                    onChange={(e) => handleFieldChange('highlightColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fond du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 2. REASSURANCE BAR */}
        {/* ============================================================ */}
        {section.type === 'ReassuranceBar' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Les 4 avantages affichés dans la barre de réassurance"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
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
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium outline-none focus:border-[#c59a3f] bg-white"
                    />
                    <input
                      type="text"
                      value={s[`item${num}_desc`] ?? defDescs[num - 1]}
                      onChange={(e) => handleFieldChange(`item${num}_desc`, e.target.value)}
                      placeholder="Description"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-[#c59a3f] bg-white"
                    />
                  </div>
                );
              })}
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan de la barre"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#ffffff"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#ffffff"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 3. SELECTION GRID */}
        {/* ============================================================ */}
        {section.type === 'SelectionGrid' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Titres et cartes de sélection de la gamme Or & Argent"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
                  <input
                    type="text"
                    value={s.badge ?? "Notre sélection"}
                    onChange={(e) => handleFieldChange('badge', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la section</label>
                  <input
                    type="text"
                    value={s.title ?? "Or & Argent"}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
              </div>

              {[1, 2, 3, 4].map((num) => {
                const defTitles = ["Pièces d'or", "Lingots d'or", "Lingots d'argent", "Pièces d'argent"];
                const defDescs = ["Un patrimoine intemporel", "Une valeur sûre", "Investir autrement", "Un investissement accessible"];
                const defImgs = ["/images/gold-coins.jpg", "/images/gold-bars.jpg", "/images/silver-bars.jpg", "/images/silver-coins.jpg"];
                const defUrls = ["/shop?category=pieces-dor", "/shop?category=lingots-dor", "/shop?category=lingots-dargent", "/shop?category=pieces-dargent"];

                return (
                  <div key={num} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-gray-800 block">Carte #{num}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={s[`card${num}_title`] ?? defTitles[num - 1]}
                        onChange={(e) => handleFieldChange(`card${num}_title`, e.target.value)}
                        placeholder="Titre de la catégorie"
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                      <input
                        type="text"
                        value={s[`card${num}_desc`] ?? defDescs[num - 1]}
                        onChange={(e) => handleFieldChange(`card${num}_desc`, e.target.value)}
                        placeholder="Description"
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>

                    {/* SÉLECTEUR D'IMAGE SANS INPUT URL */}
                    <ImagePickerField
                      label={`Image de la Carte #${num}`}
                      value={s[`card${num}_img`] ?? defImgs[num - 1]}
                      onPick={() => triggerUpload(`card${num}_img`)}
                      onClear={() => handleFieldChange(`card${num}_img`, '')}
                    />

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Lien de redirection</label>
                      <input
                        type="text"
                        value={s[`card${num}_url`] ?? defUrls[num - 1]}
                        onChange={(e) => handleFieldChange(`card${num}_url`, e.target.value)}
                        placeholder="/shop?category=..."
                        className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan de la section et fond des cartes"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan de la section</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fond des cartes produits</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.cardBgColor || "#151515"}
                    onChange={(e) => handleFieldChange('cardBgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.cardBgColor || "#151515"}
                    onChange={(e) => handleFieldChange('cardBgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 4. WHY CHOOSE US */}
        {/* ============================================================ */}
        {section.type === 'WhyChooseUs' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Titre, argumentaire et les 4 piliers de réassurance"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
                <input
                  type="text"
                  value={s.badge ?? "Pourquoi — nous choisir ?"}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre principal</label>
                <input
                  type="text"
                  value={s.title ?? "Votre partenaire de confiance"}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={s.subtitle ?? "Nous vous accompagnons dans votre investissement avec transparence, sécurité et expertise."}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <input
                    type="text"
                    value={s.btnText ?? "En savoir plus"}
                    onChange={(e) => handleFieldChange('btnText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                  <input
                    type="text"
                    value={s.btnUrl ?? "/about"}
                    onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
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
                      <div key={num} className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        <input
                          type="text"
                          value={s[`pillar${num}_title`] ?? defTitles[num - 1]}
                          onChange={(e) => handleFieldChange(`pillar${num}_title`, e.target.value)}
                          placeholder="Titre pilier"
                          className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f] bg-white"
                        />
                        <input
                          type="text"
                          value={s[`pillar${num}_desc`] ?? defDescs[num - 1]}
                          onChange={(e) => handleFieldChange(`pillar${num}_desc`, e.target.value)}
                          placeholder="Description pilier"
                          className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#c59a3f] bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan et style du bouton"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#0d0d0d"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#0d0d0d"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fond du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 5. PRECIOUS METALS TICKER */}
        {/* ============================================================ */}
        {section.type === 'PreciousMetalsTicker' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Mode de synchronisation temps réel, cours et libellés"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              {/* Dynamic Live Ticker Mode Selector */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Mode des cours de l&apos;Or & de l&apos;Argent
                  </span>
                  <select
                    value={s.mode || 'auto'}
                    onChange={(e) => handleFieldChange('mode', e.target.value)}
                    className="border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-emerald-900 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="auto">Automatique (En direct)</option>
                    <option value="manual">Manuel (Fixe)</option>
                  </select>
                </div>
                {s.mode !== 'manual' ? (
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    ✨ <strong>Cours réels en temps réel :</strong> Les prix du Lingot / Once d&apos;or et d&apos;argent sont automatiquement synchronisés avec les marchés financiers en Euros (€).
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    ⚙️ <strong>Mode Manuel activé :</strong> Vous pouvez définir des valeurs fixes personnalisées ci-dessous.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la section</label>
                <input
                  type="text"
                  value={s.title ?? "Cours des métaux précieux"}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={s.subtitle ?? "Actualisé en temps réel"}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              {/* Show manual override fields only if mode is manual */}
              {s.mode === 'manual' && (
                <>
                  <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">Cours Or (€)</label>
                      <input
                        type="text"
                        value={s.gold_price ?? "€ 2 720,45"}
                        onChange={(e) => handleFieldChange('gold_price', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">Variation Or (%)</label>
                      <input
                        type="text"
                        value={s.gold_change ?? "+0,42%"}
                        onChange={(e) => handleFieldChange('gold_change', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Cours Argent (€)</label>
                      <input
                        type="text"
                        value={s.silver_price ?? "€ 32,17"}
                        onChange={(e) => handleFieldChange('silver_price', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Variation Argent (%)</label>
                      <input
                        type="text"
                        value={s.silver_change ?? "+1,12%"}
                        onChange={(e) => handleFieldChange('silver_change', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <input
                    type="text"
                    value={s.btnText ?? "Voir les cours en détail"}
                    onChange={(e) => handleFieldChange('btnText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                  <input
                    type="text"
                    value={s.btnUrl ?? "/shop"}
                    onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
              </div>
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan et affichage des graphiques"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Afficher les graphiques de tendance (Sparklines)</label>
                <select
                  value={s.showCharts !== false && s.showCharts !== 'false' ? 'true' : 'false'}
                  onChange={(e) => handleFieldChange('showCharts', e.target.value === 'true')}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-[#c59a3f] bg-white cursor-pointer"
                >
                  <option value="true">Oui, afficher les graphiques</option>
                  <option value="false">Non, masquer les graphiques</option>
                </select>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 6. CTA BANNER */}
        {/* ============================================================ */}
        {section.type === 'CtaBanner' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Titre, sous-titre, bouton et image de fond"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la bannière</label>
                <input
                  type="text"
                  value={s.title ?? "Investissez dès aujourd’hui"}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
                <textarea
                  rows={2}
                  value={s.subtitle ?? "Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent."}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <input
                    type="text"
                    value={s.btnText ?? "Découvrir notre gamme"}
                    onChange={(e) => handleFieldChange('btnText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lien du bouton</label>
                  <input
                    type="text"
                    value={s.btnUrl ?? "/shop"}
                    onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
                  />
                </div>
              </div>

              {/* SÉLECTEUR D'IMAGE VISUEL */}
              <ImagePickerField
                label="Image de fond de la bannière"
                value={s.image ?? "/images/gold-banner-cta.jpg"}
                onPick={() => triggerUpload('image')}
                onClear={() => handleFieldChange('image', '')}
                helperText="L'image de lingots dorés affichée sous la bannière."
              />
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan et style du bouton"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fond du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnBgColor || "#c59a3f"}
                      onChange={(e) => handleFieldChange('btnBgColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Texte du bouton</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={s.btnTextColor || "#000000"}
                      onChange={(e) => handleFieldChange('btnTextColor', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-24 uppercase bg-white"
                    />
                  </div>
                </div>
              </div>
            </SettingGroup>
          </>
        )}

        {/* ============================================================ */}
        {/* 7. TESTIMONIALS */}
        {/* ============================================================ */}
        {section.type === 'Testimonials' && (
          <>
            <SettingGroup
              title="Paramètres Contenu"
              subtitle="Titre et 3 avis clients"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sur-titre</label>
                <input
                  type="text"
                  value={s.badge ?? "Ils nous font confiance"}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#c59a3f] bg-white"
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
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                      <textarea
                        rows={2}
                        value={s[`review${num}_text`] ?? defQuotes[num - 1]}
                        onChange={(e) => handleFieldChange(`review${num}_text`, e.target.value)}
                        placeholder="Témoignage"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#c59a3f] bg-white"
                      />
                    </div>
                  );
                })}
              </div>
            </SettingGroup>

            <SettingGroup
              title="Paramètres Design"
              subtitle="Couleur d'arrière-plan de la section et des cartes"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.bgColor || "#fcfbf9"}
                    onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur des cartes de témoignages</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.cardBgColor || "#ffffff"}
                    onChange={(e) => handleFieldChange('cardBgColor', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={s.cardBgColor || "#ffffff"}
                    onChange={(e) => handleFieldChange('cardBgColor', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono w-28 uppercase bg-white"
                  />
                </div>
              </div>
            </SettingGroup>
          </>
        )}

      </div>
    </div>
  );
}
