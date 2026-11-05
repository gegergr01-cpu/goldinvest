'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContactSettings, updateContactSettings } from '@/actions/contactSettings';
import { useTranslations } from 'next-intl';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface FontSizeControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  defaultVal: string;
  presets?: number[];
  helpText?: string;
  previewText?: string;
}

function FontSizeControl({
  label,
  value,
  onChange,
  defaultVal,
  presets = [13, 14, 16, 18, 20, 24, 28, 32, 40, 48],
  helpText,
  previewText = 'Aperçu de la typographie Gold Silver Invest',
}: FontSizeControlProps) {
  const currentVal = value || defaultVal;
  const numericVal = parseInt(currentVal, 10) || parseInt(defaultVal, 10) || 16;

  return (
    <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
            {label}
          </label>
          {helpText && <p className="text-[11px] text-gray-500">{helpText}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <input
              type="number"
              min="10"
              max="90"
              value={currentVal}
              onChange={(e) => onChange(e.target.value)}
              className="w-20 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            <span className="ml-1 text-xs text-gray-500 font-medium">px</span>
          </div>

          {value && value !== defaultVal && (
            <button
              type="button"
              onClick={() => onChange(defaultVal)}
              className="text-[11px] text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded border border-amber-200 transition-colors"
              title="Rétablir la taille par défaut"
            >
              Défaut ({defaultVal}px)
            </button>
          )}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10.5px] text-gray-400 uppercase tracking-wider mr-1">Raccourcis :</span>
        {presets.map((px) => (
          <button
            key={px}
            type="button"
            onClick={() => onChange(px.toString())}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              numericVal === px
                ? 'bg-[#0E2036] text-[#E8A63D] font-bold shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-800'
            }`}
          >
            {px}px
          </button>
        ))}
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 overflow-hidden">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
          Aperçu direct ({numericVal}px) :
        </span>
        <div
          style={{ fontSize: `${numericVal}px`, lineHeight: 1.25 }}
          className="font-serif text-[#0E2036] font-semibold truncate transition-all"
        >
          {previewText}
        </div>
      </div>
    </div>
  );
}

export default function AdminContactPageForm() {
  const t = useTranslations('AdminPages');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'typography'>('content');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    text: '',
    address: '',
    phone: '',
    emailDisplay: '',
    formRecipient: '',
    bottomText: '',
    phonePlaceholder: '',
    heroTitle: '',
    heroSubtitle: '',
    formTitle: '',
    formSubtitle: '',
    heroTitleFontSize: '',
    heroSubtitleFontSize: '',
    titleFontSize: '',
    textFontSize: '',
    formTitleFontSize: '',
    formSubtitleFontSize: '',
    bottomTextFontSize: '',
  });

  useEffect(() => {
    getContactSettings().then((data: any) => {
      setFormData({
        title: data.title || '',
        slug: data.slug || 'contact',
        text: data.text || '',
        address: data.address || '',
        phone: data.phone || '',
        emailDisplay: data.emailDisplay || '',
        formRecipient: data.formRecipient || '',
        bottomText: data.bottomText || '',
        phonePlaceholder: data.phonePlaceholder || '',
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        formTitle: data.formTitle || '',
        formSubtitle: data.formSubtitle || '',
        heroTitleFontSize: data.heroTitleFontSize || '',
        heroSubtitleFontSize: data.heroSubtitleFontSize || '',
        titleFontSize: data.titleFontSize || '',
        textFontSize: data.textFontSize || '',
        formTitleFontSize: data.formTitleFontSize || '',
        formSubtitleFontSize: data.formSubtitleFontSize || '',
        bottomTextFontSize: data.bottomTextFontSize || '',
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await updateContactSettings(formData);

    setSaving(false);
    if (res.success) {
      router.push('/admin/pages');
      router.refresh();
    } else {
      setError(res.error || t('save_error'));
    }
  };

  if (loading) return <div className="p-8 text-gray-500">{t('loading')}</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configuration de la page Contact
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gérez les coordonnées officielles, les textes et personnalisez la taille de la police de chaque section.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/pages')}
          className="text-gray-600 hover:text-gray-900 font-medium text-sm border border-gray-300 px-4 py-2 rounded-md bg-white hover:bg-gray-50 transition shrink-0"
        >
          {t('back')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'content'
              ? 'bg-[#0E2036] text-[#E8A63D] shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          📝 Textes & Coordonnées
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'typography'
              ? 'bg-[#0E2036] text-[#E8A63D] shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>🎨 Tailles des Polices</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full font-bold">
            Personnalisable
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= TAB 1: CONTENT ================= */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Hero Header Customization */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>🌟</span>
                <span>Bandeau d'en-tête (Hero)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Titre principal du Hero
                  </label>
                  <input
                    type="text"
                    placeholder="Laissez vide pour utiliser la traduction officielle"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Ex: <i>Contactez nos experts en métaux précieux</i>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Sous-titre du Hero
                  </label>
                  <input
                    type="text"
                    placeholder="Laissez vide pour utiliser la traduction officielle"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Ex: <i>Nos conseillers patrimoniaux vous accompagnent...</i>
                  </p>
                </div>
              </div>
            </div>

            {/* Presentation & Slug */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>💼</span>
                <span>Section Présentation & Conseil (Colonne Gauche)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Titre de la présentation
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Slug de la page (URL)
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Texte de présentation (Paragraphes)
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Les retours à la ligne créent automatiquement des paragraphes distincts.
                </p>
              </div>
            </div>

            {/* Channels & Phone (WITH CLEAR HIDE INSTRUCTION) */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>📍</span>
                  <span>Coordonnées Affichées au Public</span>
                </h2>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 mt-2">
                  💡 <b>Règle d'affichage :</b> Si vous laissez un champ vide (comme le <b>Numéro de téléphone</b>), 
                  la carte correspondante <b>ne s'affichera pas</b> sur la page de contact.
                </p>
              </div>

              {/* Phone Field */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
                    Numéro de téléphone public
                  </label>
                  {!formData.phone && (
                    <span className="text-[11px] text-amber-800 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                      🚫 Carte masquée sur la page
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Ex: +32 455 76 17 81 (ou laissez vide pour masquer)"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white transition"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <p className="text-[11px] text-gray-500">
                  Laissez ce champ <b>totalement vide</b> si vous ne souhaitez pas afficher de bloc téléphone.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  E-mail public affiché
                </label>
                <input
                  type="email"
                  placeholder="contact@goldsilverinvest.com"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                  value={formData.emailDisplay}
                  onChange={(e) => setFormData({ ...formData, emailDisplay: e.target.value })}
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Adresses des comptoirs & siège
                </label>
                <textarea
                  rows={3}
                  placeholder="Une adresse par ligne"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Chaque ligne sera affichée avec une puce dorée.
                </p>
              </div>

              {/* Phone placeholder in form */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Exemple dans le champ téléphone du formulaire
                </label>
                <input
                  type="text"
                  placeholder="+32 455 76 17 81"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                  value={formData.phonePlaceholder}
                  onChange={(e) => setFormData({ ...formData, phonePlaceholder: e.target.value })}
                />
              </div>
            </div>

            {/* Email Recipient */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>📬</span>
                <span>Réception des Demandes du Formulaire</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Adresse e-mail de notification
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@goldsilverinvest.com"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                  value={formData.formRecipient}
                  onChange={(e) => setFormData({ ...formData, formRecipient: e.target.value })}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Tous les messages envoyés par les investisseurs via le formulaire seront transmis à cette adresse.
                </p>
              </div>
            </div>

            {/* Bottom Rich Text */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>📄</span>
                <span>Texte Additionnel (Bas de page)</span>
              </h2>
              <div>
                <RichTextEditor
                  value={formData.bottomText}
                  onChange={(val) => setFormData({ ...formData, bottomText: val })}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Ce texte est facultatif. Laissez vide pour ne rien afficher.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TYPOGRAPHY (FONT SIZES) ================= */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0E2036] via-[#162A45] to-[#0E2036] text-white p-6 rounded-2xl shadow-md border border-[#E8A63D]/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✨</span>
                <h2 className="font-serif text-xl font-bold text-white">
                  Gestion Typographique & Tailles de Police
                </h2>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Ajustez précisément la taille en pixels (<b>px</b>) de chaque titre, paragraphe et description de la page Contact.
                Les modifications sont automatiquement appliquées et s'adaptent de façon fluide aux écrans mobiles et de bureau.
              </p>
            </div>

            {/* 1. Hero Typography */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#0E2036] border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>1.</span>
                <span>Bandeau d'en-tête (Hero)</span>
              </h3>

              <div className="space-y-4">
                <FontSizeControl
                  label="Titre principal du Hero"
                  value={formData.heroTitleFontSize}
                  onChange={(val) => setFormData({ ...formData, heroTitleFontSize: val })}
                  defaultVal="44"
                  presets={[28, 32, 36, 40, 44, 48, 54, 60]}
                  helpText="Taille de la police du grand titre en haut de page."
                  previewText={formData.heroTitle || 'Contactez nos experts en métaux précieux'}
                />

                <FontSizeControl
                  label="Sous-titre / Description du Hero"
                  value={formData.heroSubtitleFontSize}
                  onChange={(val) => setFormData({ ...formData, heroSubtitleFontSize: val })}
                  defaultVal="18"
                  presets={[14, 15, 16, 17, 18, 20, 22]}
                  helpText="Taille du texte explicatif sous le titre du Hero."
                  previewText={formData.heroSubtitle || 'Nos conseillers patrimoniaux vous accompagnent dans vos investissements.'}
                />
              </div>
            </div>

            {/* 2. Presentation Section Typography */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#0E2036] border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>2.</span>
                <span>Section Présentation & Conseil (Colonne Gauche)</span>
              </h3>

              <div className="space-y-4">
                <FontSizeControl
                  label="Titre de la présentation"
                  value={formData.titleFontSize}
                  onChange={(val) => setFormData({ ...formData, titleFontSize: val })}
                  defaultVal="22"
                  presets={[18, 20, 22, 24, 26, 28, 32]}
                  helpText="Titre de la carte conseil (ex: Conseil & Accompagnement Patrimonial)."
                  previewText={formData.title || 'Conseil & Accompagnement Patrimonial'}
                />

                <FontSizeControl
                  label="Texte des paragraphes de présentation"
                  value={formData.textFontSize}
                  onChange={(val) => setFormData({ ...formData, textFontSize: val })}
                  defaultVal="14"
                  presets={[12, 13, 14, 15, 16, 17, 18]}
                  helpText="Taille du texte des paragraphes décrivant les services aux investisseurs."
                  previewText="Nos conseillers et spécialistes en métaux précieux physiques vous accueillent et vous guident avec discrétion."
                />
              </div>
            </div>

            {/* 3. Form Section Typography */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#0E2036] border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>3.</span>
                <span>Formulaire de Contact (Colonne Droite)</span>
              </h3>

              <div className="space-y-4">
                <FontSizeControl
                  label="Titre du formulaire"
                  value={formData.formTitleFontSize}
                  onChange={(val) => setFormData({ ...formData, formTitleFontSize: val })}
                  defaultVal="26"
                  presets={[20, 22, 24, 26, 28, 30, 32]}
                  helpText="Titre de l'encadré du formulaire (ex: Envoyez-nous un message sécurisé)."
                  previewText={formData.formTitle || 'Envoyez-nous un message sécurisé'}
                />

                <FontSizeControl
                  label="Sous-titre / Description du formulaire"
                  value={formData.formSubtitleFontSize}
                  onChange={(val) => setFormData({ ...formData, formSubtitleFontSize: val })}
                  defaultVal="14"
                  presets={[12, 13, 14, 15, 16]}
                  helpText="Petite description sous le titre du formulaire."
                  previewText={formData.formSubtitle || 'Remplissez ce formulaire pour transmettre directement votre demande.'}
                />
              </div>
            </div>

            {/* 4. Bottom Text Typography */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#0E2036] border-b border-gray-100 pb-2 flex items-center gap-2">
                <span>4.</span>
                <span>Texte Additionnel (Bas de page)</span>
              </h3>

              <FontSizeControl
                label="Taille de la police du texte de bas de page"
                value={formData.bottomTextFontSize}
                onChange={(val) => setFormData({ ...formData, bottomTextFontSize: val })}
                defaultVal="12"
                presets={[11, 12, 13, 14, 15, 16]}
                helpText="Taille de la police du contenu riche additionnel tout en bas de page."
                previewText="Mentions additionnelles et informations complémentaires."
              />
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            {activeTab === 'typography' ? (
              <span>✨ Les tailles de police sont appliquées immédiatement après enregistrement.</span>
            ) : (
              <span>💡 Pensez à enregistrer vos modifications pour mettre à jour la page en direct.</span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:brightness-110 text-white font-bold py-2.5 px-8 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer text-sm"
          >
            {saving ? t('saving') : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
