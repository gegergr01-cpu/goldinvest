'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getBrands, createBrandAction, createProduct, uploadImage, getMinimalProducts, quickCreateCategoryAction } from '@/actions/admin';
import { uploadMultipleMediaAction } from '@/actions/media';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import MediaPickerModal from './MediaPickerModal';
import Image from "next/image";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ProductForm({ initialData }: { initialData?: any }) {
  const t = useTranslations('AdminProducts');

  const router = useRouter();
  const parseJSON = (data: any, fallback: any = []) => {
    if (!data) return fallback;
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return fallback; }
    }
    if (Array.isArray(data)) return data;
    return fallback;
  };

  const initialAttributes = parseJSON(initialData?.attributes);
  const initialVariations = parseJSON(initialData?.variations);
  const rawTags = parseJSON(initialData?.tags);
  const initialTags = rawTags.map((t: any) => typeof t === 'string' ? t : t.name).filter(Boolean);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories?.map((c: any) => c.id) || []);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryParentId, setNewCategoryParentId] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  const handleQuickCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      const res = await quickCreateCategoryAction(newCategoryName.trim(), newCategoryParentId || null);
      if (res.error) {
        setCategoryError(res.error);
      } else if (res.success && res.category) {
        // Refresh categories list immediately from database
        const updated = await getCategories();
        setCategories(updated);
        // Automatically check the new category
        setSelectedCategories((prev) => {
          if (!prev.includes(res.category.id)) {
            return [...prev, res.category.id];
          }
          return prev;
        });
        setNewCategoryName('');
        setNewCategoryParentId('');
        setCategorySuccess('Catégorie ajoutée et sélectionnée avec succès !');
        setTimeout(() => setCategorySuccess(''), 3000);
      }
    } catch (err: any) {
      setCategoryError(err?.message || "Erreur lors de la création de la catégorie");
    } finally {
      setIsCreatingCategory(false);
    }
  };
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialData?.brandId || '');
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [showBrandMediaPicker, setShowBrandMediaPicker] = useState(false);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [forceSalesIds, setForceSalesIds] = useState<string[]>(initialData?.forceSales?.map((p: any) => p.id) || []);
  const [saleTogetherIds, setSaleTogetherIds] = useState<string[]>(initialData?.saleTogether?.map((p: any) => p.id) || []);
  const [forceSalesSearch, setForceSalesSearch] = useState('');
  const [saleTogetherSearch, setSaleTogetherSearch] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(parseJSON(initialData?.images));
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null);
  const [showProductMediaPicker, setShowProductMediaPicker] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [galleryUploadCount, setGalleryUploadCount] = useState(0);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOverGallery, setIsDraggingOverGallery] = useState(false);

  const handleDirectGalleryUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setIsGalleryUploading(true);
    setGalleryUploadCount(files.length);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await uploadMultipleMediaAction(formData);
      if (res.urls && res.urls.length > 0) {
        setExistingImages(prev => [...prev, ...res.urls]);
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error('Error uploading gallery images:', err);
      alert('Erreur lors du téléversement des photos.');
    } finally {
      setIsGalleryUploading(false);
    }
  };
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  
  // Prix régulier = ancien prix barré (compareAtPrice en BDD)
  // Prix promotionnel = prix payé par le client (price en BDD)
  const [regularPrice, setRegularPrice] = useState(initialData?.compareAtPrice?.toString() || '');
  const [salePrice, setSalePrice] = useState(initialData?.price?.toString() || '');
  const [gtin, setGtin] = useState(initialData?.gtin || '');
  
  // Erreur si le prix promo est supérieur ou égal au prix régulier (promo doit être < régulier)
  const priceError = (salePrice && regularPrice && Number(salePrice) >= Number(regularPrice)) 
    ? t('price_error_msg') 
    : "";

  // Helper to slugify
  const generateSlug = (text: string) => 
    text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlug(newTitle));
    }
  };

  useEffect(() => {
    getCategories().then(setCategories);
    getBrands().then(setBrands);
    getMinimalProducts().then(prods => {
      // Exclude current product if editing
      setAllProducts(prods.filter((p: any) => p.id !== initialData?.id));
    });
  }, [initialData?.id]);

  const [productType, setProductType] = useState<'SIMPLE' | 'VARIABLE'>(initialData?.type || 'SIMPLE');

  // Dedicated Precious Metal Specs states
  const [metalType, setMetalType] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['métal', 'metal'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || 'Or');
    }
    return 'Or';
  });

  const [purity, setPurity] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['pureté', 'purete', 'titrage', 'purity'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || '');
    }
    return '';
  });

  const [fineWeight, setFineWeight] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['poids fin', 'poids or fin', 'fine weight'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || '');
    }
    return '';
  });

  const [grossWeight, setGrossWeight] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['poids brut', 'gross weight'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || '');
    }
    return '';
  });

  const [certification, setCertification] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['certification', 'certificat'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || '');
    }
    return 'Certifié LBMA';
  });

  const [mintYear, setMintYear] = useState<string>(() => {
    if (initialAttributes && Array.isArray(initialAttributes)) {
      const a = initialAttributes.find((x: any) => ['année', 'annee', 'year', 'millésime', 'millesime'].includes(String(x?.name || '').toLowerCase()));
      if (a) return Array.isArray(a.options) ? a.options[0] : (a.options || '');
    }
    return '';
  });

  const [attributes, setAttributes] = useState<Array<{ name: string, options: string }>>(
    initialAttributes
      .filter((a: any) => {
        const name = String(a?.name || '').toLowerCase();
        return !['métal', 'metal', 'pureté', 'purete', 'titrage', 'purity', 'poids fin', 'poids or fin', 'fine weight', 'poids brut', 'gross weight', 'certification', 'certificat', 'année', 'annee', 'year', 'millésime', 'millesime'].includes(name);
      })
      .map((a: any) => ({ 
        name: a?.name || '', 
        options: Array.isArray(a?.options) ? a.options.join(' | ') : (a?.options || '') 
      }))
  );
  const [variations, setVariations] = useState<Array<any>>(initialVariations);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');

  const addAttribute = () => setAttributes([...attributes, { name: '', options: '' }]);
  const removeAttribute = (idx: number) => setAttributes(attributes.filter((_, i) => i !== idx));

  const addVariation = () => setVariations([...variations, { id: crypto.randomUUID(), attributes: {}, price: '', stock: '' }]);
  const removeVariation = (id: string) => setVariations(variations.filter(v => v.id !== id));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (priceError) {
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData(e.currentTarget);
      
      // Formatting attributes: combine precious metals specs + generic attributes
      const formattedAttributes: Array<{ name: string; options: string[] }> = [];

      if (metalType) {
        formattedAttributes.push({ name: 'Métal', options: [metalType] });
      }
      if (purity.trim()) {
        formattedAttributes.push({ name: 'Pureté', options: [purity.trim()] });
      }
      if (fineWeight.trim()) {
        formattedAttributes.push({ name: 'Poids fin', options: [fineWeight.trim()] });
      }
      if (grossWeight.trim()) {
        formattedAttributes.push({ name: 'Poids brut', options: [grossWeight.trim()] });
      }
      if (certification.trim()) {
        formattedAttributes.push({ name: 'Certification', options: [certification.trim()] });
      }
      if (mintYear.trim()) {
        formattedAttributes.push({ name: 'Millésime', options: [mintYear.trim()] });
      }

      // Add generic / variable attributes
      attributes.forEach(a => {
        const opts = a.options.split('|').map(o => o.trim()).filter(Boolean);
        if (a.name.trim() && opts.length > 0) {
          formattedAttributes.push({ name: a.name.trim(), options: opts });
        }
      });
      
      let finalBrandId = selectedBrand;

      if (showNewBrand && newBrandName) {
        const brandFormData = new FormData();
        brandFormData.append('name', newBrandName);
        let logoUrl = newBrandLogo;
        const brandRes = await createBrandAction(brandFormData, logoUrl);
        if (brandRes.success && brandRes.brand) {
          finalBrandId = brandRes.brand.id;
        }
      }

      if (finalBrandId) {
        formData.append('brandId', finalBrandId);
      }

      formData.append('attributes', JSON.stringify(formattedAttributes));
      formData.append('variations', JSON.stringify(variations));
      formData.append('tags', JSON.stringify(tags));
      formData.append('forceSalesIds', JSON.stringify(forceSalesIds));
      formData.append('saleTogetherIds', JSON.stringify(saleTogetherIds));
      
      // Prevent original submit if textareas were still present
      formData.delete('shortDescription');
      formData.delete('description');
      
      formData.append('shortDescription', shortDescription);
      formData.append('description', description);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      
      const imageUrls: string[] = [...existingImages];

      formData.append('slug', slug);
      formData.append('categoryIds', JSON.stringify(selectedCategories));
      if (gtin) formData.append('gtin', gtin);

      // If editing, we will call updateProduct (to be created), otherwise createProduct
      if (isEditing) {
        formData.append('id', initialData.id);
        const { updateProduct } = await import('@/actions/admin');
        const res = await updateProduct(initialData.id, formData, imageUrls);
        if (res.error) alert(res.error);
        else router.push('/admin/products');
      } else {
        const res = await createProduct(formData, imageUrls);
        if (res.error) {
          alert(res.error);
        } else {
          router.push('/admin/products');
        }
      }
    } catch (err) {
      alert(t('save_error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {isEditing ? `${t('update_product_btn')} : ${initialData.title}` : t('add_product')}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Product type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("product_type")}</label>
          <select 
            name="type" 
            value={productType} 
            onChange={(e) => setProductType(e.target.value as any)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 font-semibold"
          >
            <option value="SIMPLE">{t("simple_product")}</option>
            <option value="VARIABLE">{t("variable_product")}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_title_label')}</label>
            <input 
              type="text" 
              name="title" 
              value={title} 
              onChange={handleTitleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('slug_label')}</label>
            <input 
              type="text" 
              name="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('categories_label')}</label>
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewCategory ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                </svg>
                <span>{showNewCategory ? 'Fermer' : '+ Ajouter une catégorie'}</span>
              </button>
            </div>

            {/* Formulaire d'ajout rapide de catégorie */}
            {showNewCategory && (
              <div className="mb-3 p-3 bg-white border border-amber-200 rounded-lg shadow-xs space-y-2.5">
                <span className="text-xs font-bold text-amber-900 block">Créer une nouvelle catégorie</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nom de la catégorie (ex: Pièces d'or, Lingots...)"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickCreateCategory();
                      }
                    }}
                  />
                  <select
                    value={newCategoryParentId}
                    onChange={(e) => setNewCategoryParentId(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[200px]"
                  >
                    <option value="">(Racine - Aucune)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        Parent: {c.displayName || c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                    onClick={handleQuickCreateCategory}
                    className="px-4 py-1.5 bg-[#c59a3f] hover:bg-[#b08733] text-black text-xs font-bold rounded shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isCreatingCategory ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Création...</span>
                      </>
                    ) : (
                      <span>Ajouter</span>
                    )}
                  </button>
                </div>
                {categoryError && (
                  <p className="text-[11px] text-red-600 font-medium">{categoryError}</p>
                )}
                {categorySuccess && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {categorySuccess}
                  </p>
                )}
              </div>
            )}

            <div className="border border-gray-300 rounded-md p-3 max-h-52 overflow-y-auto bg-white flex flex-col gap-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 hover:text-black">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, cat.id]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                      }
                    }}
                    className="rounded border-gray-300 text-amber-700 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>{cat.displayName || (cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name)}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-gray-400 italic">Aucune catégorie disponible. Cliquez sur &quot;+ Ajouter une catégorie&quot; ci-dessus.</p>
              )}
            </div>
          </div>
        </div>

        {/* Marque */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setShowNewBrand(true);
                  setSelectedBrand('');
                } else {
                  setShowNewBrand(false);
                  setSelectedBrand(e.target.value);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">{t('no_brand')}</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value="new" className="font-bold text-orange-700">{t('add_new_brand')}</option>
            </select>
            
            {showNewBrand && (
              <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-md space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('brand_name_label')}</label>
                  <input 
                    type="text" 
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t('brand_name_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('brand_logo_label')}</label>
                  {newBrandLogo && (
                    <Image width={800} height={800} src={newBrandLogo} alt="Logo" className="h-12 w-auto mb-2 border rounded" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowBrandMediaPicker(true)}
                    className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    Choisir un logo
                  </button>
                  {showBrandMediaPicker && (
                    <MediaPickerModal 
                      onClose={() => setShowBrandMediaPicker(false)}
                      onSelect={(url) => {
                        setNewBrandLogo(url);
                        setShowBrandMediaPicker(false);
                      }}
                    />
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowNewBrand(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  {t('cancel_brand')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price & Stock (for simple product or base price) */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (actuel) *</label>
            <input 
              type="number" step="0.01" name="price" 
              value={salePrice} 
              onChange={(e) => setSalePrice(e.target.value)} 
              required
              className={`w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${priceError ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {priceError && <p className="text-red-500 text-xs font-semibold mt-1">{priceError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ancien prix barré <span className="text-gray-400 font-normal">(si promo)</span></label>
            <input 
              type="number" step="0.01" name="compareAtPrice" 
              value={regularPrice} 
              onChange={(e) => setRegularPrice(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50" 
              placeholder="ex: 299.99"
            />
          </div>
          {productType === 'SIMPLE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('stock_label')}</label>
              <input type="number" name="stock" defaultValue={initialData?.stock ?? ''} placeholder={t('stock_placeholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
            </div>
          )}
        </div>

        {/* GTIN / EAN */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GTIN / EAN / Code-barres <span className="text-gray-500 font-normal">(optionnel)</span>
          </label>
          <input 
            type="text" 
            value={gtin}
            onChange={(e) => setGtin(e.target.value)}
            placeholder="ex: 4006381333931"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Si non renseigné, ce champ ne s'affichera pas sur la page produit.</p>
        </div>

        {/* ================= SECTION : SPÉCIFICATIONS MÉTAUX PRÉCIEUX ================= */}
        <div className="bg-gradient-to-br from-[#FAF5EB] to-white p-6 rounded-xl border border-[#E8A63D]/40 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8A63D]/25 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-lg bg-[#C8732A]/15 border border-[#C8732A]/30 flex items-center justify-center text-lg shadow-2xs">
                🪙
              </span>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">
                  Spécifications Métaux Précieux
                </h3>
                <p className="text-xs text-gray-500">
                  Renseignez la pureté et le poids pour enrichir automatiquement les cartes produits et la fiche technique.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#C8732A]/10 text-[#9C4E0F] border border-[#C8732A]/20">
              Or & Argent d&apos;investissement
            </span>
          </div>

          {/* LIGNE 1 : 1. Type de Métal | 2. Poids Brut Total | 3. Millésime / Année */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Type de Métal */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Type de Métal
              </label>
              <select
                value={metalType}
                onChange={(e) => setMetalType(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#C8732A] focus:border-transparent"
              >
                <option value="Or">Or (Gold)</option>
                <option value="Argent">Argent (Silver)</option>
                <option value="Platine">Platine (Platinum)</option>
                <option value="Palladium">Palladium</option>
              </select>
            </div>

            {/* 2. Poids Brut (optionnel) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Poids brut total <span className="text-gray-400 font-normal lowercase">(optionnel)</span>
              </label>
              <input
                type="text"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                placeholder="ex: 6,45 g (pour Napoléon 20F)"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C8732A] focus:border-transparent font-medium"
              />
            </div>

            {/* 3. Année / Millésime (optionnel) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Millésime / Année <span className="text-gray-400 font-normal lowercase">(optionnel)</span>
              </label>
              <input
                type="text"
                value={mintYear}
                onChange={(e) => setMintYear(e.target.value)}
                placeholder="ex: 1904, 1883, 2025"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C8732A] focus:border-transparent font-medium"
              />
            </div>
          </div>

          {/* LIGNE 2 : 4. Pureté / Titrage | 5. Poids Fin | 6. Certification & Sceau */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 border-t border-[#E8A63D]/20">
            {/* 4. Pureté / Titrage */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pureté / Titrage
                </label>
                <span className="text-[10px] text-gray-400">ex: 999.9‰</span>
              </div>
              <input
                type="text"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder="ex: 999.9‰ (24K) ou 900‰ (21.6K)"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C8732A] focus:border-transparent font-medium"
              />
              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['999.9‰ (24K)', '900‰ (21.6K)', '916.7‰ (22K)', 'Argent 999.9‰'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurity(p)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-[#FAF5EB] text-gray-600 hover:text-[#9C4E0F] border border-gray-200 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Poids Fin */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Poids fin en métal pur
                </label>
                <span className="text-[10px] text-gray-400">ex: 1 oz, 5.81g</span>
              </div>
              <input
                type="text"
                value={fineWeight}
                onChange={(e) => setFineWeight(e.target.value)}
                placeholder="ex: 1 oz (31,10 g) ou 5,81 g or fin"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C8732A] focus:border-transparent font-medium"
              />
              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['1 oz (31,10 g)', '1/2 oz (15,55 g)', '5,81 g or fin', '50 g', '100 g', '1 kg'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setFineWeight(w)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-[#FAF5EB] text-gray-600 hover:text-[#9C4E0F] border border-gray-200 transition-colors cursor-pointer"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Certification & Conditionnement */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Certification & Sceau
              </label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="ex: Certifié LBMA, Sous blister scellé"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C8732A] focus:border-transparent font-medium"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['Certifié LBMA', 'Sous blister scellé', 'Sachet scellé sécurisé'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCertification(c)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-[#FAF5EB] text-gray-600 hover:text-[#9C4E0F] border border-gray-200 transition-colors cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attributes & Variations */}
        {productType === 'VARIABLE' && (
          <div className="border border-blue-200 bg-blue-50/30 p-6 rounded-lg space-y-8">
            {/* Attributes section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t("attributes")}</h3>
                <button type="button" onClick={addAttribute} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                  {t('add_attribute_btn')}
                </button>
              </div>
              <div className="space-y-3">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white p-3 border border-gray-200 rounded">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">{t('attr_name_label')}</label>
                      <input 
                        type="text" 
                        value={attr.name} 
                        onChange={e => { const newAttr = [...attributes]; newAttr[idx].name = e.target.value; setAttributes(newAttr); }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder={t('attr_name_placeholder')}
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-xs text-gray-500 mb-1">{t('attr_val_label')}</label>
                      <input 
                        type="text" 
                        value={attr.options} 
                        onChange={e => { const newAttr = [...attributes]; newAttr[idx].options = e.target.value; setAttributes(newAttr); }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder={t('attr_val_placeholder')}
                      />
                    </div>
                    <button type="button" onClick={() => removeAttribute(idx)} className="mt-6 text-red-500 hover:text-red-700 p-1">
                      &times;
                    </button>
                  </div>
                ))}
                {attributes.length === 0 && <p className="text-sm text-gray-500 italic">{t("no_attributes")}</p>}
              </div>
            </div>

            {/* Variations section */}
            <div className="border-t border-blue-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t("variations")}</h3>
                <button type="button" onClick={addVariation} disabled={attributes.length === 0} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50">
                  {t('add_variation_btn')}
                </button>
              </div>
              <div className="space-y-3">
                {variations.map((v, idx) => (
                  <div key={v.id} className="bg-white p-4 border border-gray-200 rounded shadow-sm relative">
                    <button type="button" onClick={() => removeVariation(v.id)} className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700">
                      &times;
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {attributes.map(attr => (
                        <div key={attr.name}>
                          <label className="block text-xs text-gray-500 mb-1">{attr.name || 'Attribute'}</label>
                          <select 
                            value={v.attributes[attr.name] || ''}
                            onChange={e => {
                              const newV = [...variations];
                              newV[idx].attributes[attr.name] = e.target.value;
                              setVariations(newV);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="">Select...</option>
                            {attr.options.split('|').map(o => o.trim()).filter(Boolean).map(o => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('variation_price_label')}</label>
                        <input 
                          type="number" step="0.01" 
                          value={v.price} 
                          onChange={e => { const newV = [...variations]; newV[idx].price = e.target.value; setVariations(newV); }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder={t('variation_price_placeholder')}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('variation_stock_label')}</label>
                        <input 
                          type="number" 
                          value={v.stock} 
                          onChange={e => { const newV = [...variations]; newV[idx].stock = e.target.value; setVariations(newV); }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder={t('variation_stock_placeholder')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {variations.length === 0 && <p className="text-sm text-gray-500 italic">{t("add_variation_desc")}</p>}
              </div>
            </div>

          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('image_gallery_label')}</label>
          <p className="text-xs text-gray-500 mb-2">{t("image_gallery_desc")}</p>
          {existingImages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {existingImages.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  className="relative group cursor-move"
                  draggable
                  onDragStart={() => setDraggedImageIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedImageIdx === null || draggedImageIdx === idx) return;
                    const newImages = [...existingImages];
                    const draggedImg = newImages[draggedImageIdx];
                    newImages.splice(draggedImageIdx, 1);
                    newImages.splice(idx, 0, draggedImg);
                    setExistingImages(newImages);
                    setDraggedImageIdx(null);
                  }}
                >
                  <Image width={800} height={800} src={img} alt={`img-${idx}`} className="h-20 w-20 object-cover rounded border" />
                  <button 
                    type="button" 
                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    &times;
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] text-center opacity-0 group-hover:opacity-100 transition">
                    Order: {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Multi-upload dropzone & actions */}
          <input 
            type="file" 
            ref={galleryFileInputRef} 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleDirectGalleryUpload(Array.from(e.target.files));
                e.target.value = '';
              }
            }} 
          />

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOverGallery(true); }}
            onDragLeave={() => setIsDraggingOverGallery(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOverGallery(false);
              const droppedFiles = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
              if (droppedFiles.length > 0) {
                handleDirectGalleryUpload(droppedFiles);
              }
            }}
            className={`p-4 sm:p-5 border-2 border-dashed rounded-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              isDraggingOverGallery 
                ? 'border-[#C8732A] bg-amber-50/70 scale-[1.01]' 
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#C8732A] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {isDraggingOverGallery 
                    ? "Déposez vos images ici pour les ajouter..." 
                    : "Galerie"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Glissez-déposez plusieurs fichiers ou choisissez depuis vos dossiers / la médiathèque
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
              <button 
                type="button" 
                disabled={isGalleryUploading}
                onClick={() => galleryFileInputRef.current?.click()}
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-[#C8732A] to-[#A85514] hover:from-[#D88334] hover:to-[#B8641C] text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Téléverser des photos</span>
              </button>

              <button 
                type="button" 
                disabled={isGalleryUploading}
                onClick={() => setShowProductMediaPicker(true)}
                className="flex-1 sm:flex-none px-4 py-2 border border-[#C8732A]/50 bg-white hover:bg-amber-50 text-[#C8732A] rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Médiathèque</span>
              </button>
            </div>
          </div>

          {isGalleryUploading && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-900 text-sm animate-pulse">
              <div className="w-5 h-5 border-2 border-[#C8732A] border-t-transparent rounded-full animate-spin shrink-0"></div>
              <span>Téléversement en cours de {galleryUploadCount} image(s)... Veuillez patienter.</span>
            </div>
          )}

          {showProductMediaPicker && (
            <MediaPickerModal 
              multiple={true}
              onClose={() => setShowProductMediaPicker(false)} 
              onSelect={(url) => {
                setExistingImages(prev => [...prev, url]);
                setShowProductMediaPicker(false);
              }}
              onSelectMultiple={(urls) => {
                setExistingImages(prev => [...prev, ...urls]);
                setShowProductMediaPicker(false);
              }}
            />
          )}
        </div>

        {/* Short & Long Description */}
        <div className="space-y-8 pb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("short_desc")}</label>
            <div className="bg-white">
              <ReactQuill theme="snow" value={shortDescription} onChange={setShortDescription} className="h-32 mb-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("long_desc")}</label>
            <div className="bg-white">
              <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-64 mb-12" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">SEO (Référencement)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre SEO (Title)</label>
            <input 
              type="text" 
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="ex: Kaminholz kaufen | Kammergetrocknet"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Méta Description</label>
            <textarea 
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="ex: Günstig Kaminholz kaufen..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-sm"
            ></textarea>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("tags_label")}</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }
                }}
                placeholder={t("tags_placeholder")} 
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
              />
            <button 
              type="button" 
              onClick={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              {t('add_tag_btn')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
                {tag}
                <button 
                  type="button" 
                  onClick={() => setTags(tags.filter((_, i) => i !== idx))} 
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
            {tags.length === 0 && <p className="text-xs text-gray-500 italic">{t('no_tags_yet')}</p>}
          </div>
        </div>

        {/* Force Sales & Sale Together */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          {/* Achat Combiné (Force Sales) */}
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('force_sales')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('force_sales_desc')}</p>
            <div className="relative mb-2">
              <input 
                type="text" 
                placeholder={t('search_product_id')}
                value={forceSalesSearch}
                onChange={(e) => setForceSalesSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              {forceSalesSearch.trim() !== '' && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto top-full mt-1">
                  {allProducts
                    .filter(p => !forceSalesIds.includes(p.id) && (p.title.toLowerCase().includes(forceSalesSearch.toLowerCase()) || p.id.includes(forceSalesSearch)))
                    .slice(0, 20)
                    .map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => {
                          setForceSalesIds([...forceSalesIds, prod.id]);
                          setForceSalesSearch('');
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 text-sm transition"
                      >
                        {prod.images?.[0] && <Image width={800} height={800} src={prod.images[0]} alt="" className="w-8 h-8 object-cover rounded border border-gray-100" />}
                        <span className="line-clamp-1 text-gray-800">{prod.title}</span>
                      </div>
                    ))}
                    {allProducts.filter(p => !forceSalesIds.includes(p.id) && (p.title.toLowerCase().includes(forceSalesSearch.toLowerCase()) || p.id.includes(forceSalesSearch))).length === 0 && (
                      <div className="px-3 py-3 text-sm text-gray-500 text-center italic">{t('no_product_found')}</div>
                    )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
              {forceSalesIds.map(id => {
                const prod = allProducts.find(p => p.id === id);
                if (!prod) return null;
                return (
                  <div key={id} className="flex items-center justify-between bg-white border border-orange-200 rounded p-2 text-sm shadow-sm group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {prod.images?.[0] ? (
                        <Image width={800} height={800} src={prod.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0 text-gray-500 text-xs">img</div>
                      )}
                      <span className="line-clamp-2 text-gray-700 font-medium leading-tight">{prod.title}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setForceSalesIds(forceSalesIds.filter(fid => fid !== id))}
                      className="text-red-400 hover:text-red-600 p-2 shrink-0 bg-red-50 hover:bg-red-100 rounded transition opacity-0 group-hover:opacity-100"
                      title={t('remove_item')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                );
              })}
              {forceSalesIds.length === 0 && (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded text-gray-500 text-sm py-6">
                  {t('no_linked_product')}
                </div>
              )}
            </div>
          </div>

          {/* Vendus Ensemble (Sale Together) */}
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('sale_together')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('sale_together_desc')}</p>
            <div className="relative mb-2">
              <input 
                type="text" 
                placeholder={t('search_product_id')}
                value={saleTogetherSearch}
                onChange={(e) => setSaleTogetherSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              {saleTogetherSearch.trim() !== '' && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto top-full mt-1">
                  {allProducts
                    .filter(p => !saleTogetherIds.includes(p.id) && (p.title.toLowerCase().includes(saleTogetherSearch.toLowerCase()) || p.id.includes(saleTogetherSearch)))
                    .slice(0, 20)
                    .map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => {
                          setSaleTogetherIds([...saleTogetherIds, prod.id]);
                          setSaleTogetherSearch('');
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 text-sm transition"
                      >
                        {prod.images?.[0] && <Image width={800} height={800} src={prod.images[0]} alt="" className="w-8 h-8 object-cover rounded border border-gray-100" />}
                        <span className="line-clamp-1 text-gray-800">{prod.title}</span>
                      </div>
                    ))}
                    {allProducts.filter(p => !saleTogetherIds.includes(p.id) && (p.title.toLowerCase().includes(saleTogetherSearch.toLowerCase()) || p.id.includes(saleTogetherSearch))).length === 0 && (
                      <div className="px-3 py-3 text-sm text-gray-500 text-center italic">{t('no_product_found')}</div>
                    )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
              {saleTogetherIds.map(id => {
                const prod = allProducts.find(p => p.id === id);
                if (!prod) return null;
                return (
                  <div key={id} className="flex items-center justify-between bg-white border border-gray-200 rounded p-2 text-sm shadow-sm group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {prod.images?.[0] ? (
                        <Image width={800} height={800} src={prod.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0 text-gray-500 text-xs">img</div>
                      )}
                      <span className="line-clamp-2 text-gray-700 font-medium leading-tight">{prod.title}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSaleTogetherIds(saleTogetherIds.filter(fid => fid !== id))}
                      className="text-red-400 hover:text-red-600 p-2 shrink-0 bg-red-50 hover:bg-red-100 rounded transition opacity-0 group-hover:opacity-100"
                      title={t('remove_item')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                );
              })}
              {saleTogetherIds.length === 0 && (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded text-gray-500 text-sm py-6">
                  {t('no_linked_product')}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Flags / Labels */}
        <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center">
            <input type="checkbox" name="isBestSeller" id="isBestSeller" defaultChecked={initialData?.isBestSeller} className="w-4 h-4 text-orange-700 focus:ring-orange-500 border-gray-300 rounded" />
            <label htmlFor="isBestSeller" className="ml-2 block text-sm text-gray-900">{t('mark_best_seller')}</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isDealOfTheDay" id="isDealOfTheDay" defaultChecked={initialData?.isDealOfTheDay} className="w-4 h-4 text-orange-700 focus:ring-orange-500 border-gray-300 rounded" />
            <label htmlFor="isDealOfTheDay" className="ml-2 block text-sm text-gray-900">{t('mark_deal_day')}</label>
          </div>
          <div>
            <input type="text" name="discountLabel" defaultValue={initialData?.discountLabel} placeholder={t('discount_label_placeholder')} className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex justify-end">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium mr-4 hover:bg-gray-50 transition"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50"
          >
            {isLoading ? t('saving') : (isEditing ? t('update_product_btn') : t('add_product_btn'))}
          </button>
        </div>

      </form>
    </div>
  );
}
