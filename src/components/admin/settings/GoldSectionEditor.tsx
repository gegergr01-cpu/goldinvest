'use client';

import React, { useState } from 'react';

interface GoldSectionEditorProps {
  section: any;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  updateSectionSettings: (id: string, keyOrUpdates: string | Record<string, any>, value?: any) => void;
  handleUpload?: (id: string, key: string) => void;
  goBack: () => void;
  onDelete?: () => void;
  categories?: any[];
  allProducts?: any[];
}

type ElementorTab = 'content' | 'style' | 'advanced';

// -------------------------------------------------------------
// REUSABLE ELEMENTOR-STYLE UI COMPONENTS
// -------------------------------------------------------------

// Accordion section with ▾ / ▸ arrow
function ElementorAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-left select-none"
      >
        <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
          <svg
            className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 pt-1 pb-5 space-y-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// 4-box Spacing input (Haut, Droite, Bas, Gauche) with link chain
function Elementor4BoxInput({
  label,
  baseKey,
  settings,
  onChange,
}: {
  label: string;
  baseKey: string;
  settings: Record<string, any>;
  onChange: (key: string, value: any) => void;
}) {
  const [isLinked, setIsLinked] = useState(true);

  const top = settings[`${baseKey}_top`] ?? '';
  const right = settings[`${baseKey}_right`] ?? '';
  const bottom = settings[`${baseKey}_bottom`] ?? '';
  const left = settings[`${baseKey}_left`] ?? '';

  const handleChange = (pos: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    if (isLinked) {
      onChange(`${baseKey}_top`, val);
      onChange(`${baseKey}_right`, val);
      onChange(`${baseKey}_bottom`, val);
      onChange(`${baseKey}_left`, val);
    } else {
      onChange(`${baseKey}_${pos}`, val);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-gray-600">{label}</label>
        <span className="text-[10px] text-gray-400">px</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="grid grid-cols-4 gap-1 flex-1">
          <div className="text-center">
            <input
              type="number"
              value={top}
              onChange={(e) => handleChange('top', e.target.value)}
              className="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center outline-none focus:border-gray-500"
              placeholder="0"
            />
            <span className="text-[9px] text-gray-400 block mt-0.5">Haut</span>
          </div>
          <div className="text-center">
            <input
              type="number"
              value={right}
              onChange={(e) => handleChange('right', e.target.value)}
              className="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center outline-none focus:border-gray-500"
              placeholder="0"
            />
            <span className="text-[9px] text-gray-400 block mt-0.5">Droite</span>
          </div>
          <div className="text-center">
            <input
              type="number"
              value={bottom}
              onChange={(e) => handleChange('bottom', e.target.value)}
              className="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center outline-none focus:border-gray-500"
              placeholder="0"
            />
            <span className="text-[9px] text-gray-400 block mt-0.5">Bas</span>
          </div>
          <div className="text-center">
            <input
              type="number"
              value={left}
              onChange={(e) => handleChange('left', e.target.value)}
              className="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center outline-none focus:border-gray-500"
              placeholder="0"
            />
            <span className="text-[9px] text-gray-400 block mt-0.5">Gauche</span>
          </div>
        </div>

        {/* Chain icon button */}
        <button
          type="button"
          onClick={() => setIsLinked(!isLinked)}
          className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${
            isLinked ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-white border-gray-200 text-gray-400'
          }`}
          title={isLinked ? 'Dissocier les valeurs' : 'Lier les valeurs'}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Elementor Image Box with visual thumbnail, Edit & Hover Corbeille (Trash)
function ElementorImageBox({
  label,
  value,
  onPick,
  onRemove,
  showCheckboxKey,
  showCheckboxLabel,
  showCheckboxVal = true,
  onCheckboxChange,
}: {
  label: string;
  value?: string;
  onPick: () => void;
  onRemove: () => void;
  showCheckboxKey?: string;
  showCheckboxLabel?: string;
  showCheckboxVal?: boolean;
  onCheckboxChange?: (val: boolean) => void;
}) {
  const hasImage = Boolean(value && typeof value === 'string' && value.trim() !== '');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {hasImage && (
          <span className="text-[10px] text-gray-400">Survoler pour supprimer</span>
        )}
      </div>

      {hasImage ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-video max-h-40 w-full shadow-xs">
          {/* Crisp image preview without dimming unless hovered */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
            alt={label}
          />

          {/* Hover Overlay with trash can and edit button */}
          <div
            onClick={onPick}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          >
            {/* Center Edit button */}
            <button
              type="button"
              onClick={onPick}
              className="px-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold rounded-md shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Modifier</span>
            </button>

            {/* Trash icon (corbeille) top-right on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Supprimer ce média"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100/80 rounded-lg py-5 px-3 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-600 group-hover:border-gray-300 shadow-xs transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900">
            Choisir une image
          </span>
        </button>
      )}

      {showCheckboxKey && onCheckboxChange && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id={showCheckboxKey}
            checked={showCheckboxVal}
            onChange={(e) => onCheckboxChange(e.target.checked)}
            className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer w-3.5 h-3.5"
          />
          <label htmlFor={showCheckboxKey} className="text-[11px] text-gray-600 cursor-pointer select-none">
            {showCheckboxLabel || 'Afficher l\'image'}
          </label>
        </div>
      )}
    </div>
  );
}

// Color picker row with swatch
function ElementorColorRow({
  label,
  value,
  onChange,
  defaultColor = '#ffffff',
}: {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  defaultColor?: string;
}) {
  const color = value || defaultColor;

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-600 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-gray-400 uppercase">{color}</span>
        <div className="relative w-7 h-7 rounded border border-gray-300 shadow-sm overflow-hidden cursor-pointer">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT: GOLD SECTION EDITOR (ELEMENTOR ARCHITECTURE)
// -------------------------------------------------------------
export default function GoldSectionEditor({
  section,
  previewMode = 'desktop',
  updateSectionSettings,
  handleUpload,
  goBack,
  onDelete,
  categories = [],
  allProducts = [],
}: GoldSectionEditorProps) {
  // 3 Elementor Tabs: Contenu | Style | Avancé
  const [activeTab, setActiveTab] = useState<ElementorTab>('content');

  // Accordion open/close states
  const [accordions, setAccordions] = useState<Record<string, boolean>>({
    general: true,
    features: true,
    media: true,
    action: true,
    titleStyle: true,
    subTitleStyle: false,
    imageStyle: false,
    buttonStyle: false,
    boxStyle: false,
    layoutAdvanced: true,
    responsive: false,
    customCss: false,
  });

  const toggleAccordion = (key: string) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full select-none">

      {/* TOP HEADER */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="text-gray-500 hover:text-gray-800 transition p-1 hover:bg-gray-200 rounded-full cursor-pointer"
            title="Retour à la liste"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight">
              {section.name || section.type}
            </h3>
            <span className="text-[10px] font-semibold text-[#8c6414] bg-[#fbf0b9] px-2 py-0.2 rounded-full inline-block mt-0.5">
              {section.type}
            </span>
          </div>
        </div>
      </div>

      {/* ELEMENTOR 3 TABS (CONTENU / STYLE / AVANCÉ) */}
      <div className="grid grid-cols-3 border-b border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`py-2.5 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
            activeTab === 'content'
              ? 'border-gray-900 text-gray-900 bg-gray-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Contenu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`py-2.5 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
            activeTab === 'style'
              ? 'border-gray-900 text-gray-900 bg-gray-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 006 6v-12a6 6 0 00-6 6z" clipRule="evenodd" />
          </svg>
          <span>Style</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`py-2.5 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
            activeTab === 'advanced'
              ? 'border-gray-900 text-gray-900 bg-gray-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Avancé</span>
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">

        {/* ============================================================ */}
        {/* TAB 1: CONTENU */}
        {/* ============================================================ */}
        {activeTab === 'content' && (
          <div>
            {/* Accordion 1: Général */}
            <ElementorAccordion
              title="Général"
              isOpen={accordions.general}
              onToggle={() => toggleAccordion('general')}
            >
              {section.type === 'GoldHero' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sur-titre / Slogan (Tagline)
                    </label>
                    <input
                      type="text"
                      value={s.tagline ?? "OR & ARGENT — INVESTISSEMENT EN TOUTE CONFIANCE"}
                      onChange={(e) => handleFieldChange('tagline', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre principal</label>
                    <input
                      type="text"
                      value={s.title ?? "L'excellence de l'or physique, votre patrimoine en sécurité ."}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mots mis en valeur (badge orange)
                    </label>
                    <input
                      type="text"
                      value={s.highlight ?? "sécurité ."}
                      onChange={(e) => handleFieldChange('highlight', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre descriptif</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Négoce de pièces d'or cotées et lingots d'or et d'argent purs 999.9. Produits certifiés, scellés avec traçabilité et livraison assurée à 100%."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  {/* Hauteur du Hero (Slider & Presets rapides) */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Hauteur minimale du Hero
                      </label>
                      <span className="text-xs font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                        {s.HERO_HEIGHT || s.heroHeight || 780}px
                      </span>
                    </div>

                    <input
                      type="range"
                      min="500"
                      max="1000"
                      step="10"
                      value={parseInt(String(s.HERO_HEIGHT || s.heroHeight || 780), 10)}
                      onChange={(e) => {
                        handleFieldChange('HERO_HEIGHT', e.target.value);
                        handleFieldChange('heroHeight', e.target.value);
                      }}
                      className="w-full accent-amber-600 cursor-pointer"
                    />

                    {/* Presets rapides (Elementor Style) */}
                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                      {[
                        { label: 'Compact', val: '620' },
                        { label: 'Standard', val: '720' },
                        { label: 'Grand (recommandé)', val: '780' },
                        { label: 'Plein écran', val: '900' },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            handleFieldChange('HERO_HEIGHT', preset.val);
                            handleFieldChange('heroHeight', preset.val);
                          }}
                          className={`py-1 text-[10px] rounded border transition cursor-pointer text-center ${
                            String(s.HERO_HEIGHT || s.heroHeight || 780) === preset.val
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-xs'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {(section.type === 'BestDeals' || section.type === 'SilverDeals') && (
                <>
                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80 mb-2">
                    <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                      {section.type === 'SilverDeals' || s.metal === 'silver' ? 'Argent d’Investissement' : 'Or d’Investissement'}
                    </span>
                    <p className="text-[10px] text-amber-800">
                      Cette section intègre 2 onglets interactifs permettant au visiteur de basculer entre Pièces et Lingots.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Badge sur-titre</label>
                    <input
                      type="text"
                      value={s.badge ?? (section.type === 'SilverDeals' ? "INVESTIR DANS L'ARGENT" : "INVESTIR DANS L'OR")}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mots mis en valeur (couleur accent)</label>
                    <input
                      type="text"
                      value={s.highlight ?? (section.type === 'SilverDeals' ? "Argent d'Investissement" : "Or d'Investissement")}
                      onChange={(e) => handleFieldChange('highlight', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre principal</label>
                    <input
                      type="text"
                      value={s.title ?? (section.type === 'SilverDeals' ? "Achetez de l'Argent d'Investissement" : "Achetez de l'Or d'Investissement")}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? (section.type === 'SilverDeals' ? "Pièces d'argent pures 999‰ et lingots certifiés LBMA sous blister scellé pour diversifier votre patrimoine." : "Pièces d'or d'investissement boursables et lingots certifiés LBMA sous blister scellé pour sécuriser votre épargne.")}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="p-2.5 bg-white rounded border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-800 block mb-1.5">🪙 Onglet 1 (Pièces)</span>
                      <div className="space-y-1.5">
                        <div>
                          <label className="block text-[10px] text-gray-600">Nom de l'onglet</label>
                          <input
                            type="text"
                            value={s.tab1_title ?? (section.type === 'SilverDeals' ? "Pièces d'argent" : "Pièces d'or")}
                            onChange={(e) => handleFieldChange('tab1_title', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600">Texte du bouton CTA</label>
                          <input
                            type="text"
                            value={s.tab1_btn_text ?? (section.type === 'SilverDeals' ? "Voir toutes les pièces d'argent" : "Voir toutes les pièces d'or")}
                            onChange={(e) => handleFieldChange('tab1_btn_text', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600">Lien du bouton</label>
                          <input
                            type="text"
                            value={s.tab1_btn_url ?? (section.type === 'SilverDeals' ? "/shop?category=pieces-dargent" : "/shop?category=pieces-dor")}
                            onChange={(e) => handleFieldChange('tab1_btn_url', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-800 block mb-1.5">🧱 Onglet 2 (Lingots)</span>
                      <div className="space-y-1.5">
                        <div>
                          <label className="block text-[10px] text-gray-600">Nom de l'onglet</label>
                          <input
                            type="text"
                            value={s.tab2_title ?? (section.type === 'SilverDeals' ? "Lingots d'argent" : "Lingots d'or")}
                            onChange={(e) => handleFieldChange('tab2_title', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600">Texte du bouton CTA</label>
                          <input
                            type="text"
                            value={s.tab2_btn_text ?? (section.type === 'SilverDeals' ? "Voir tous les lingots d'argent" : "Voir tous les lingots d'or")}
                            onChange={(e) => handleFieldChange('tab2_btn_text', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-600">Lien du bouton</label>
                          <input
                            type="text"
                            value={s.tab2_btn_url ?? (section.type === 'SilverDeals' ? "/shop?category=lingots-dargent" : "/shop?category=lingots-dor")}
                            onChange={(e) => handleFieldChange('tab2_btn_url', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre maximum de produits</label>
                    <select
                      value={s.maxProducts || '4'}
                      onChange={(e) => handleFieldChange('maxProducts', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none focus:border-gray-500 cursor-pointer"
                    >
                      <option value="4">4 produits (1 rangée standard - comme la maquette)</option>
                      <option value="8">8 produits (2 rangées)</option>
                      <option value="12">12 produits (3 rangées)</option>
                    </select>
                  </div>
                </>
              )}

              {section.type === 'SelectionGrid' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Badge</label>
                    <input
                      type="text"
                      value={s.badge ?? "Notre sélection"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={s.title ?? "Or & Argent"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                </>
              )}

              {section.type === 'WhyChooseUs' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Badge</label>
                    <input
                      type="text"
                      value={s.badge ?? "NOS SERVICES EXCLUSIFS"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={s.title ?? "Nos services"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre (Accroche dorée)</label>
                    <input
                      type="text"
                      value={s.subtitle ?? "L'excellence et la maîtrise de vos investissements en métaux précieux."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={s.description ?? "De l'achat de lingots et pièces certifiés au gardiennage en coffre sécurisé hors système bancaire, nous vous offrons un écosystème haut de gamme complet, liquide et transparent."}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                </>
              )}

              {section.type === 'CtaBanner' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre de la bannière</label>
                    <input
                      type="text"
                      value={s.title ?? "Investissez dès aujourd’hui"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Profitez de la stabilité et de la valeur intemporelle de l’or et de l’argent."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                </>
              )}

              {section.type === 'PreciousMetalsTicker' && (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Mode de flux
                      </span>
                      <select
                        value={s.mode || 'auto'}
                        onChange={(e) => handleFieldChange('mode', e.target.value)}
                        className="border border-emerald-300 rounded px-2 py-0.5 text-xs bg-white text-emerald-900 outline-none"
                      >
                        <option value="auto">Automatique (En direct)</option>
                        <option value="manual">Manuel</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={s.title ?? "Cours des métaux précieux"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre</label>
                    <input
                      type="text"
                      value={s.subtitle ?? "Actualisé en temps réel"}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                </>
              )}

              {section.type === 'ReassuranceBar' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="p-2.5 bg-gray-50 border border-gray-200 rounded space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-700 block">Avantage #{num}</span>
                      <input
                        type="text"
                        value={s[`item${num}_title`] ?? ''}
                        onChange={(e) => handleFieldChange(`item${num}_title`, e.target.value)}
                        placeholder="Titre"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                      />
                      <input
                        type="text"
                        value={s[`item${num}_desc`] ?? ''}
                        onChange={(e) => handleFieldChange(`item${num}_desc`, e.target.value)}
                        placeholder="Description"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none text-gray-600"
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'Testimonials' && (
                <div className="space-y-4">
                  {/* Titres & Badges */}
                  <div className="space-y-3 pb-3 border-b border-gray-200">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                      <input
                        type="text"
                        value={s.badge ?? "AVIS CLIENTS VÉRIFIÉS"}
                        onChange={(e) => handleFieldChange('badge', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Titre de la section</label>
                      <input
                        type="text"
                        value={s.title ?? "Ils nous font confiance"}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Sous-titre</label>
                      <textarea
                        rows={2}
                        value={s.subtitle ?? "Découvrez les retours d’expérience de nos clients investisseurs en métaux précieux physiques."}
                        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>

                  {/* Statistiques globales d'avis & Investisseurs */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded space-y-3">
                    <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                      ⭐ Badge de confiance & Chiffre clé
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Note globale</label>
                        <input
                          type="text"
                          value={s.rating_score ?? "4.9 / 5"}
                          onChange={(e) => handleFieldChange('rating_score', e.target.value)}
                          placeholder="ex: 4.9 / 5"
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Texte Investisseurs</label>
                        <input
                          type="text"
                          value={s.investors_text ?? "Plus de 450 investisseurs accompagnés"}
                          onChange={(e) => handleFieldChange('investors_text', e.target.value)}
                          placeholder="ex: Plus de 450 investisseurs accompagnés"
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none font-medium text-orange-950"
                        />
                      </div>
                    </div>
                    <p className="text-[10.5px] text-gray-500">
                      Ce texte s’affiche directement dans le macaron d’évaluation de la section.
                    </p>
                  </div>

                  {/* Liste des avis clients (1 à 6) */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-800 block">
                      Avis clients & Étoiles dynamiques
                    </span>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div key={num} className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-800 text-[10px] flex items-center justify-center font-bold">
                              {num}
                            </span>
                            Avis client #{num}
                          </span>
                          {/* Note / Étoiles dynamique */}
                          <div className="flex items-center gap-1.5">
                            <label className="text-[10.5px] font-medium text-gray-600">Note :</label>
                            <select
                              value={s[`review${num}_rating`] ?? '5'}
                              onChange={(e) => handleFieldChange(`review${num}_rating`, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-0.5 text-xs bg-white font-medium text-amber-700 outline-none"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                              <option value="4">⭐⭐⭐⭐ 4/5</option>
                              <option value="3">⭐⭐⭐ 3/5</option>
                              <option value="2">⭐⭐ 2/5</option>
                              <option value="1">⭐ 1/5</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={s[`review${num}_name`] ?? ''}
                            onChange={(e) => handleFieldChange(`review${num}_name`, e.target.value)}
                            placeholder="Nom client (ex: Thomas D.)"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                          />
                          <input
                            type="text"
                            value={s[`review${num}_city`] ?? ''}
                            onChange={(e) => handleFieldChange(`review${num}_city`, e.target.value)}
                            placeholder="Ville (ex: Paris, France)"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={s[`review${num}_asset`] ?? ''}
                            onChange={(e) => handleFieldChange(`review${num}_asset`, e.target.value)}
                            placeholder="Produit acheté (ex: Lingot d'Or 100g)"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none text-[#C8732A] font-medium"
                          />
                          <input
                            type="text"
                            value={s[`review${num}_date`] ?? ''}
                            onChange={(e) => handleFieldChange(`review${num}_date`, e.target.value)}
                            placeholder="Date (ex: Il y a 3 jours)"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={s[`review${num}_text`] ?? ''}
                          onChange={(e) => handleFieldChange(`review${num}_text`, e.target.value)}
                          placeholder="Témoignage du client..."
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none text-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.type === 'Faq' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Badge</label>
                    <input
                      type="text"
                      value={s.badge ?? "QUESTIONS FRÉQUENTES"}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={s.title ?? "Tout savoir sur l'investissement dans les métaux précieux"}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre</label>
                    <textarea
                      rows={2}
                      value={s.subtitle ?? "Retrouvez les réponses de nos experts sur la certification LBMA, la fiscalité, la livraison sécurisée et nos garanties de rachat."}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    />
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <span className="text-[11px] font-bold text-gray-800 block">Bloc de contact (Colonne gauche)</span>
                    <div>
                      <label className="block text-[10.5px] text-gray-600 mb-0.5">Titre carte contact</label>
                      <input
                        type="text"
                        value={s.cta_title ?? "Vous avez une question spécifique sur votre investissement ?"}
                        onChange={(e) => handleFieldChange('cta_title', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] text-gray-600 mb-0.5">Description contact</label>
                      <textarea
                        rows={2}
                        value={s.cta_desc ?? "Nos conseillers spécialistes de l'or physique vous accompagnent du lundi au vendredi."}
                        onChange={(e) => handleFieldChange('cta_desc', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10.5px] text-gray-600 mb-0.5">Texte bouton</label>
                        <input
                          type="text"
                          value={s.cta_btn_text ?? "Contacter un conseiller"}
                          onChange={(e) => handleFieldChange('cta_btn_text', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] text-gray-600 mb-0.5">Lien bouton</label>
                        <input
                          type="text"
                          value={s.cta_btn_url ?? "/contact"}
                          onChange={(e) => handleFieldChange('cta_btn_url', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white outline-none font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ElementorAccordion>

            {/* Accordion: 4 Cartes flottantes (GoldHero - Capture 3) */}
            {section.type === 'GoldHero' && (
              <ElementorAccordion
                title="4 Cartes flottantes (Hero)"
                isOpen={accordions.features}
                onToggle={() => toggleAccordion('features')}
              >
                <div className="p-2 bg-amber-50/60 rounded border border-amber-200/60 text-[11px] text-amber-900 mb-2">
                  Chaque carte affiche automatiquement l'icône de sa catégorie et le <strong>produit du jour</strong> (changeant chaque 24h) avec photo et prix en direct.
                </div>

                {/* Carte 1 */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Carte 1 (Gold bars)
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Titre</label>
                    <input
                      type="text"
                      value={s.card1_title ?? "Gold bars"}
                      onChange={(e) => handleFieldChange('card1_title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                {/* Carte 2 */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Carte 2 (Silver bars)
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Titre</label>
                    <input
                      type="text"
                      value={s.card2_title ?? "Silver bars"}
                      onChange={(e) => handleFieldChange('card2_title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                {/* Carte 3 */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Carte 3 (Gold coins)
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Titre</label>
                    <input
                      type="text"
                      value={s.card3_title ?? "Gold coins"}
                      onChange={(e) => handleFieldChange('card3_title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                {/* Carte 4 */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Carte 4 (Silver coins)
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Titre</label>
                    <input
                      type="text"
                      value={s.card4_title ?? "Silver coins"}
                      onChange={(e) => handleFieldChange('card4_title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>
              </ElementorAccordion>
            )}

            {/* Accordion 2: Images & Médias */}
            {(section.type === 'GoldHero' || section.type === 'CtaBanner' || section.type === 'SelectionGrid') && (
              <ElementorAccordion
                title="Images & Médias"
                isOpen={accordions.media}
                onToggle={() => toggleAccordion('media')}
              >
                {section.type === 'GoldHero' && (
                  <>
                    <ElementorImageBox
                      label="Image Principale (Hero)"
                      value={s.image ?? '/images/hero-gold-silver.jpg'}
                      onPick={() => triggerUpload('image')}
                      onRemove={() => handleFieldChange('image', '')}
                      showCheckboxKey="SHOW_MAIN_IMAGE"
                      showCheckboxLabel="Afficher l'image principale"
                      showCheckboxVal={s.SHOW_MAIN_IMAGE !== 'false'}
                      onCheckboxChange={(val) => handleFieldChange('SHOW_MAIN_IMAGE', val ? 'true' : 'false')}
                    />

                    <ElementorImageBox
                      label="Image d'arrière-plan (BG)"
                      value={s.bgImage ?? '/images/hero-bg-luxury.jpg'}
                      onPick={() => triggerUpload('bgImage')}
                      onRemove={() => handleFieldChange('bgImage', '')}
                      showCheckboxKey="SHOW_BG_IMAGE"
                      showCheckboxLabel="Afficher l'image d'arrière-plan"
                      showCheckboxVal={s.SHOW_BG_IMAGE !== 'false'}
                      onCheckboxChange={(val) => handleFieldChange('SHOW_BG_IMAGE', val ? 'true' : 'false')}
                    />
                  </>
                )}

                {section.type === 'CtaBanner' && (
                  <ElementorImageBox
                    label="Image de fond (Bannière)"
                    value={s.image ?? '/images/gold-banner-cta.jpg'}
                    onPick={() => triggerUpload('image')}
                    onRemove={() => handleFieldChange('image', '')}
                  />
                )}

                {section.type === 'SelectionGrid' && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="p-2 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                        <span className="text-[11px] font-bold text-gray-700 block">Carte #{num}</span>
                        <input
                          type="text"
                          value={s[`card${num}_title`] ?? ''}
                          onChange={(e) => handleFieldChange(`card${num}_title`, e.target.value)}
                          placeholder="Titre catégorie"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                        />
                        <ElementorImageBox
                          label={`Visuel Carte #${num}`}
                          value={s[`card${num}_img`]}
                          onPick={() => triggerUpload(`card${num}_img`)}
                          onRemove={() => handleFieldChange(`card${num}_img`, '')}
                        />
                        <input
                          type="text"
                          value={s[`card${num}_url`] ?? ''}
                          onChange={(e) => handleFieldChange(`card${num}_url`, e.target.value)}
                          placeholder="/shop?category=..."
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ElementorAccordion>
            )}

            {/* Accordion 3: Bouton d'action (CTA) */}
            {(section.type === 'GoldHero' || section.type === 'WhyChooseUs' || section.type === 'CtaBanner' || section.type === 'PreciousMetalsTicker') && (
              <ElementorAccordion
                title="Bouton d'action (CTA)"
                isOpen={accordions.action}
                onToggle={() => toggleAccordion('action')}
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Texte du bouton principal</label>
                  <input
                    type="text"
                    value={s.btnText ?? "Découvrir notre gamme"}
                    onChange={(e) => handleFieldChange('btnText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Lien de redirection (URL)</label>
                  <input
                    type="text"
                    value={s.btnUrl ?? "/shop"}
                    onChange={(e) => handleFieldChange('btnUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                    placeholder="/shop"
                  />
                </div>

                {section.type === 'GoldHero' && (
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Texte du bouton secondaire</label>
                      <input
                        type="text"
                        value={s.btn2Text ?? "Demander un devis"}
                        onChange={(e) => handleFieldChange('btn2Text', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                        placeholder="Demander un devis ou Nous contacter"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Lien du bouton secondaire (URL)</label>
                      <input
                        type="text"
                        value={s.btn2Url ?? "/devis"}
                        onChange={(e) => handleFieldChange('btn2Url', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-500"
                        placeholder="/devis ou /contact"
                      />
                    </div>
                  </div>
                )}
              </ElementorAccordion>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: STYLE */}
        {/* ============================================================ */}
        {activeTab === 'style' && (
          <div>
            {/* Title Style */}
            <ElementorAccordion
              title="Title Style"
              isOpen={accordions.titleStyle}
              onToggle={() => toggleAccordion('titleStyle')}
            >
              <ElementorColorRow
                label="Color"
                value={s.TITLE_COLOR}
                onChange={(val) => handleFieldChange('TITLE_COLOR', val)}
                defaultColor="#ffffff"
              />

              {/* Slider Size */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Size (Taille)</span>
                  <span className="text-xs font-mono text-gray-700">{s.TITLE_SIZE || '48'}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={s.TITLE_SIZE || 48}
                  onChange={(e) => handleFieldChange('TITLE_SIZE', e.target.value)}
                  className="w-full accent-gray-800"
                />
              </div>

              {/* Alignement Grille 3x3 */}
              <div className="pt-2">
                <span className="text-xs text-gray-600 font-medium block mb-1.5">Alignement du Titre</span>
                <div className="grid grid-cols-3 gap-1 w-[80px] h-[80px] bg-gray-100 p-1.5 rounded-lg border border-gray-200">
                  {['top', 'center', 'bottom'].map((v) =>
                    ['left', 'center', 'right'].map((h) => {
                      const isSelected = (s.CONTENT_VALIGN || 'center') === v && (s.CONTENT_ALIGN || 'left') === h;
                      return (
                        <button
                          key={`${v}-${h}`}
                          type="button"
                          onClick={() => {
                            handleFieldChange('CONTENT_VALIGN', v);
                            handleFieldChange('CONTENT_ALIGN', h);
                          }}
                          className={`rounded transition-all flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 shadow-sm ring-1 ring-orange-600'
                              : 'bg-white border border-gray-200 hover:bg-orange-50'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300'}`} />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </ElementorAccordion>

            {/* Sub Title Style */}
            <ElementorAccordion
              title="Sub Title Style"
              isOpen={accordions.subTitleStyle}
              onToggle={() => toggleAccordion('subTitleStyle')}
            >
              <ElementorColorRow
                label="Color"
                value={s.SUBTITLE_COLOR}
                onChange={(val) => handleFieldChange('SUBTITLE_COLOR', val)}
                defaultColor="#d1d5db"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Size</span>
                  <span className="text-xs font-mono text-gray-700">{s.SUBTITLE_SIZE || '18'}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={s.SUBTITLE_SIZE || 18}
                  onChange={(e) => handleFieldChange('SUBTITLE_SIZE', e.target.value)}
                  className="w-full accent-gray-800"
                />
              </div>
            </ElementorAccordion>

            {/* Button Settings */}
            <ElementorAccordion
              title="Button Settings"
              isOpen={accordions.buttonStyle}
              onToggle={() => toggleAccordion('buttonStyle')}
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Style de forme (CTA)</label>
                <select
                  value={s.BTN_STYLE || 'pill'}
                  onChange={(e) => handleFieldChange('BTN_STYLE', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="pill">Pilule (Très arrondi)</option>
                  <option value="rounded">Arrondi classique</option>
                  <option value="square">Carré</option>
                </select>
              </div>

              <ElementorColorRow
                label="Button Background"
                value={s.BTN_BG_COLOR || s.btnBgColor}
                onChange={(val) => {
                  handleFieldChange('BTN_BG_COLOR', val);
                  handleFieldChange('btnBgColor', val);
                }}
                defaultColor="#c59a3f"
              />

              <ElementorColorRow
                label="Button Text Color"
                value={s.BTN_TEXT_COLOR || s.btnTextColor}
                onChange={(val) => {
                  handleFieldChange('BTN_TEXT_COLOR', val);
                  handleFieldChange('btnTextColor', val);
                }}
                defaultColor="#000000"
              />

              <Elementor4BoxInput
                label="Padding du Bouton"
                baseKey="btn_padding"
                settings={s}
                onChange={handleFieldChange}
              />
            </ElementorAccordion>

            {/* Box Style (Section Background & Overlays) */}
            <ElementorAccordion
              title="Box Style"
              isOpen={accordions.boxStyle}
              onToggle={() => toggleAccordion('boxStyle')}
            >
              <ElementorColorRow
                label="Block Background"
                value={s.BG_COLOR || s.bgColor}
                onChange={(val) => {
                  handleFieldChange('BG_COLOR', val);
                  handleFieldChange('bgColor', val);
                }}
                defaultColor={section.type === 'GoldHero' || section.type === 'WhyChooseUs' ? '#0a0a0a' : '#ffffff'}
              />

              {(section.type === 'GoldHero' || section.type === 'CtaBanner') && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Filtre Sombre (Dark Overlay)</label>
                  <select
                    value={s.BG_OVERLAY || '40'}
                    onChange={(e) => handleFieldChange('BG_OVERLAY', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none cursor-pointer"
                  >
                    <option value="0">None (0%)</option>
                    <option value="20">Light (20%)</option>
                    <option value="40">Medium (40%)</option>
                    <option value="60">Dark (60%)</option>
                    <option value="80">Very Dark (80%)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type de Dégradé</label>
                <select
                  value={s.OVERLAY_TYPE || 'grad-t'}
                  onChange={(e) => handleFieldChange('OVERLAY_TYPE', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="grad-t">Dégradé Bas ➔ Haut</option>
                  <option value="grad-r">Dégradé Gauche ➔ Droite</option>
                  <option value="solid">Couleur Unie</option>
                </select>
              </div>

              {section.type === 'GoldHero' && (
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">Hauteur minimale (Hero)</span>
                    <span className="text-xs font-mono font-bold text-gray-700">{s.HERO_HEIGHT || s.heroHeight || 780}px</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1000"
                    step="10"
                    value={parseInt(String(s.HERO_HEIGHT || s.heroHeight || 780), 10)}
                    onChange={(e) => {
                      handleFieldChange('HERO_HEIGHT', e.target.value);
                      handleFieldChange('heroHeight', e.target.value);
                    }}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              )}
            </ElementorAccordion>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: AVANCÉ */}
        {/* ============================================================ */}
        {activeTab === 'advanced' && (
          <div>
            {/* Mise en page */}
            <ElementorAccordion
              title="Mise en page"
              isOpen={accordions.layoutAdvanced}
              onToggle={() => toggleAccordion('layoutAdvanced')}
            >
              <Elementor4BoxInput
                label="Marge externe (Margin)"
                baseKey="margin"
                settings={s}
                onChange={handleFieldChange}
              />

              <Elementor4BoxInput
                label="Marge interne (Padding)"
                baseKey="padding"
                settings={s}
                onChange={handleFieldChange}
              />

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Largeur</label>
                <select
                  value={s.layoutWidth || 'default'}
                  onChange={(e) => handleFieldChange('layoutWidth', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="default">Par défaut (Plein écran)</option>
                  <option value="boxed">Encadré (Conteneur centré)</option>
                </select>
              </div>

              {/* Hauteur minimale */}
              <div className="space-y-1 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Hauteur minimale (Min-Height)</span>
                  <span className="text-xs font-mono text-gray-700">{s.HERO_HEIGHT || s.minHeight || (section.type === 'GoldHero' ? '780px' : 'Auto')}</span>
                </div>
                <input
                  type="text"
                  placeholder="ex: 780px ou 100vh"
                  value={s.HERO_HEIGHT || s.minHeight || ''}
                  onChange={(e) => {
                    handleFieldChange('HERO_HEIGHT', e.target.value);
                    handleFieldChange('minHeight', e.target.value);
                    handleFieldChange('heroHeight', e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Index-Z</label>
                <input
                  type="number"
                  value={s.zIndex ?? ''}
                  onChange={(e) => handleFieldChange('zIndex', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-gray-500"
                  placeholder="10"
                />
              </div>
            </ElementorAccordion>

            {/* Réactivité */}
            <ElementorAccordion
              title="Visibilité & Réactivité"
              isOpen={accordions.responsive}
              onToggle={() => toggleAccordion('responsive')}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-medium">Masquer sur Desktop</span>
                  <input
                    type="checkbox"
                    checked={s.hideDesktop === 'true'}
                    onChange={(e) => handleFieldChange('hideDesktop', e.target.checked ? 'true' : 'false')}
                    className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-medium">Masquer sur Tablette</span>
                  <input
                    type="checkbox"
                    checked={s.hideTablet === 'true'}
                    onChange={(e) => handleFieldChange('hideTablet', e.target.checked ? 'true' : 'false')}
                    className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-medium">Masquer sur Mobile</span>
                  <input
                    type="checkbox"
                    checked={s.hideMobile === 'true'}
                    onChange={(e) => handleFieldChange('hideMobile', e.target.checked ? 'true' : 'false')}
                    className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>
              </div>
            </ElementorAccordion>

            {/* Attributs CSS */}
            <ElementorAccordion
              title="Attributs & Classes CSS"
              isOpen={accordions.customCss}
              onToggle={() => toggleAccordion('customCss')}
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ID de CSS</label>
                <input
                  type="text"
                  value={s.cssId ?? ''}
                  onChange={(e) => handleFieldChange('cssId', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-gray-500"
                  placeholder="mon-id-section"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Classes CSS</label>
                <input
                  type="text"
                  value={s.cssClass ?? ''}
                  onChange={(e) => handleFieldChange('cssClass', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-gray-500"
                  placeholder="ma-classe-custom"
                />
              </div>
            </ElementorAccordion>
          </div>
        )}

      </div>

      {/* DELETE SECTION BUTTON AT BOTTOM */}
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
