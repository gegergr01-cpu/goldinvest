'use client';
import { useState, useEffect, useRef } from 'react';
import { getMediaList, uploadMediaAction, uploadMultipleMediaAction, deleteMediaAction } from '@/actions/media';
import { useTranslations } from 'next-intl';
import Image from "next/image";

type Tab = 'library' | 'upload';

export default function MediaPickerModal({ 
  onClose, 
  onSelect,
  onSelectMultiple,
  multiple = false,
}: { 
  onClose: () => void; 
  onSelect: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const [media, setMedia] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Multi-select state for library
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  // Multi-upload state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations('AdminMedia');

  const fetchMedia = async (p = 1, s = '') => {
    setIsLoading(true);
    try {
      const res = await getMediaList(p, 20, s);
      setMedia(res.items);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error('Error fetching media', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'library') {
      fetchMedia(page, search);
    }
  }, [page, search, activeTab]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;
    setUploadFiles(prev => multiple ? [...prev, ...files] : [files[0]]);
    setUploadError('');
    setUploadSuccess('');
  };

  const handleRemoveUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    try {
      const formData = new FormData();
      uploadFiles.forEach(f => formData.append('files', f));

      const res = await uploadMultipleMediaAction(formData);
      if (res.error) {
        setUploadError(res.error);
      } else if (res.urls && res.urls.length > 0) {
        setUploadSuccess(`${res.urls.length} fichier(s) téléversé(s) avec succès !`);
        if (multiple && onSelectMultiple) {
          onSelectMultiple(res.urls);
          onClose();
        } else {
          onSelect(res.urls[0]);
          onClose();
        }
      }
    } catch (e) {
      setUploadError('Erreur lors du téléversement.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length > 0) {
      setUploadFiles(prev => multiple ? [...prev, ...dropped] : [dropped[0]]);
      setUploadError('');
      setUploadSuccess('');
    }
  };

  const toggleSelectUrl = (url: string) => {
    if (!multiple) {
      onSelect(url);
      onClose();
      return;
    }
    setSelectedUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleConfirmMultiSelection = () => {
    if (selectedUrls.length === 0) return;
    if (onSelectMultiple) {
      onSelectMultiple(selectedUrls);
    } else if (selectedUrls[0]) {
      onSelect(selectedUrls[0]);
    }
    onClose();
  };

  const isImageFile = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(name);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-gray-900">Médiathèque</h2>
            {multiple && (
              <span className="text-xs bg-amber-100 text-amber-900 font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                Sélection multiple
              </span>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'library' 
                ? 'border-[#C8732A] text-[#B8641C]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Bibliothèque de médias
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'upload' 
                ? 'border-[#C8732A] text-[#B8641C]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {multiple ? 'Téléverser des fichiers (multiple)' : 'Téléverser un fichier'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-hidden flex flex-col">

          {/* LIBRARY TAB */}
          {activeTab === 'library' && (
            <>
              <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white">
                <input 
                  type="text" 
                  placeholder="Rechercher des médias..."
                  className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#C8732A] focus:border-[#C8732A] outline-none"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />

                {multiple && selectedUrls.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                      ✓ {selectedUrls.length} photo{selectedUrls.length > 1 ? 's' : ''} sélectionnée{selectedUrls.length > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedUrls([])}
                      className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                    >
                      Désélectionner tout
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[#C8732A] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : media.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <svg className="w-16 h-16 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Aucun média trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {media.map(m => {
                      const isSelected = selectedUrls.includes(m.url);
                      const selectedIndex = selectedUrls.indexOf(m.url);

                      return (
                        <div 
                          key={m.id} 
                          onClick={() => toggleSelectUrl(m.url)}
                          className={`relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer group transition-all shadow-sm ${
                            isSelected 
                              ? 'border-[#C8732A] ring-2 ring-[#C8732A]/40' 
                              : 'border-transparent hover:border-[#C8732A]/60'
                          }`}
                        >
                          {isImageFile(m.url) ? (
                            <Image width={800} height={800} unoptimized src={m.url} alt={m.altText || m.title || 'media'} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
                              <svg className="w-8 h-8 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="text-[10px] text-gray-500 truncate w-full text-center">{m.title || 'Fichier'}</span>
                            </div>
                          )}

                          {/* Multi-select checkmark pill */}
                          {multiple && (
                            <div className="absolute top-2 left-2 z-10">
                              {isSelected ? (
                                <div className="w-6 h-6 rounded-full bg-[#C8732A] text-white flex items-center justify-center text-xs font-bold shadow">
                                  {selectedIndex + 1}
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-white/90 bg-black/30 group-hover:block hidden shadow" />
                              )}
                            </div>
                          )}

                          {/* Overlay button in single mode */}
                          {!multiple && (
                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center pointer-events-none">
                              <span className="bg-[#c59a3f] text-black text-xs font-bold px-3 py-1 rounded-full shadow pointer-events-auto">Sélectionner</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette image ?")) {
                                await deleteMediaAction(m.id);
                                setSelectedUrls(prev => prev.filter(u => u !== m.url));
                                fetchMedia(page, search);
                              }
                            }}
                            className="absolute top-1.5 right-1.5 z-20 w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                            title="Supprimer ce média"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom bar with Pagination and Multi-Select action */}
              <div className="p-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50">
                <div className="flex gap-2 items-center">
                  <button 
                    type="button"
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-sm bg-white hover:bg-gray-100 transition cursor-pointer"
                  >
                    ← Précédent
                  </button>
                  <span className="text-sm text-gray-500">Page {page} / {Math.max(totalPages, 1)}</span>
                  <button 
                    type="button"
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => p + 1)} 
                    className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-sm bg-white hover:bg-gray-100 transition cursor-pointer"
                  >
                    Suivant →
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium transition cursor-pointer"
                  >
                    Annuler
                  </button>

                  {multiple && (
                    <button
                      type="button"
                      disabled={selectedUrls.length === 0}
                      onClick={handleConfirmMultiSelection}
                      className="px-5 py-2 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white rounded-lg text-sm font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Insérer {selectedUrls.length > 0 ? `(${selectedUrls.length})` : ''}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-grow">
              
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  uploadFiles.length > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/20'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-[#B8641C]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {multiple ? 'Glissez-déposez une ou plusieurs photos ici' : 'Glissez-déposez un fichier ici'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">ou cliquez pour sélectionner depuis votre ordinateur</p>
                  </div>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP, GIF, SVG (max 15 Mo par fichier)</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  className="hidden"
                  onChange={handleFilesChange}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
              </div>

              {/* Upload Previews List */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">
                      {uploadFiles.length} fichier{uploadFiles.length > 1 ? 's' : ''} sélectionné{uploadFiles.length > 1 ? 's' : ''} :
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadFiles([])}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Tout retirer
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {uploadFiles.map((file, idx) => (
                      <div key={idx} className="relative group bg-gray-100 rounded-lg p-2 border border-gray-200 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-gray-800 font-medium truncate w-full" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveUploadFile(idx); }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600 cursor-pointer"
                          title="Retirer ce fichier"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                  ✓ {uploadSuccess}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploadFiles.length === 0 || isUploading || !!uploadSuccess}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#C8732A] via-[#B8641C] to-[#9C4E0F] hover:from-[#D88334] hover:to-[#A85514] text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Téléversement ({uploadFiles.length})...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {multiple 
                        ? `Téléverser et insérer ${uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}` 
                        : 'Téléverser et sélectionner'
                      }
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
