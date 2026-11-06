'use client';

import { useState } from 'react';
import { toggleReviewApproval, deleteReview, updateReview, createAdminReview } from '@/actions/reviews';
import { useTranslations, useLocale } from 'next-intl';

type Review = {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  product: { id?: string; title: string; slug: string };
  reviewerName?: string | null;
  reviewerEmail?: string | null;
  user?: { email: string } | null;
};

interface ReviewTableProps {
  reviews: Review[];
  products?: Array<{ id: string; title: string }>;
}

export default function ReviewTable({ reviews, products = [] }: ReviewTableProps) {
  const t = useTranslations('AdminReviews');
  const locale = useLocale();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '', createdAtStr: '' });
  
  // Add Review Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    productId: products[0]?.id || '',
    reviewerName: '',
    reviewerEmail: '',
    rating: 5,
    comment: '',
    isApproved: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleReviewApproval(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('confirm_delete') || 'Voulez-vous vraiment supprimer cet avis ?')) {
      await deleteReview(id);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
      createdAtStr: new Date(review.createdAt).toISOString().slice(0, 16),
    });
  };

  const handleSave = async (id: string) => {
    await updateReview(id, editForm.rating, editForm.comment, editForm.createdAtStr);
    setEditingId(null);
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!addForm.productId) {
      setAddError('Veuillez sélectionner un produit.');
      return;
    }
    if (!addForm.comment.trim()) {
      setAddError('Le commentaire ne peut pas être vide.');
      return;
    }

    setIsSubmitting(true);
    const res = await createAdminReview({
      productId: addForm.productId,
      reviewerName: addForm.reviewerName.trim() || 'Client vérifié',
      reviewerEmail: addForm.reviewerEmail.trim() || undefined,
      rating: addForm.rating,
      comment: addForm.comment,
      isApproved: addForm.isApproved,
    });
    setIsSubmitting(false);

    if (res?.error) {
      setAddError(res.error);
    } else {
      setIsAddOpen(false);
      setAddForm({
        productId: products[0]?.id || '',
        reviewerName: '',
        reviewerEmail: '',
        rating: 5,
        comment: '',
        isApproved: true,
      });
    }
  };

  return (
    <div>
      {/* Top action header */}
      <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Les avis avec le statut <strong className="text-emerald-700">Approuvé</strong> sont publiés directement sur la boutique et dans la section Témoignages de la page d&apos;accueil.
          </span>
        </div>

        {products.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter un avis vérifié</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">{t('col_product')}</th>
              <th className="px-6 py-3">{t('col_customer')}</th>
              <th className="px-6 py-3">{t('col_rating_comment')}</th>
              <th className="px-6 py-3">{t('col_date')}</th>
              <th className="px-6 py-3">{t('col_status')}</th>
              <th className="px-6 py-3 text-right">{t('col_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">
                  {review.product.title}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {review.reviewerName || 'Client vérifié'}
                  </div>
                  {(review.reviewerEmail || review.user?.email) && (
                    <div className="text-xs text-gray-400">
                      {review.reviewerEmail || review.user?.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 min-w-[300px]">
                  {editingId === review.id ? (
                    <div className="space-y-2">
                      <select 
                        value={editForm.rating} 
                        onChange={e => setEditForm({...editForm, rating: Number(e.target.value)})}
                        className="border border-gray-300 rounded p-1 w-20 text-sm bg-white"
                      >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}★</option>)}
                      </select>
                      <textarea 
                        value={editForm.comment}
                        onChange={e => setEditForm({...editForm, comment: e.target.value})}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-bold mb-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-gray-700 line-clamp-2 text-xs leading-relaxed font-sans">
                        {review.comment}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                  {editingId === review.id ? (
                    <input 
                      type="datetime-local" 
                      value={editForm.createdAtStr}
                      onChange={e => setEditForm({...editForm, createdAtStr: e.target.value})}
                      className="border border-gray-300 rounded p-1 text-xs"
                    />
                  ) : (
                    new Date(review.createdAt).toLocaleDateString(locale)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    type="button"
                    onClick={() => handleToggle(review.id, review.isApproved)}
                    title={review.isApproved ? "Cliquez pour masquer de la boutique" : "Cliquez pour approuver et publier sur la boutique & landing page"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs border ${
                      review.isApproved 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${review.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{review.isApproved ? (t('approved') || 'Approuvé') : (t('pending') || 'En attente')}</span>
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  {editingId === review.id ? (
                    <>
                      <button 
                        type="button" 
                        onClick={() => handleSave(review.id)} 
                        className="text-emerald-600 font-bold hover:underline text-xs"
                      >
                        {t('save') || 'Enregistrer'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)} 
                        className="text-gray-500 hover:underline text-xs"
                      >
                        {t('cancel') || 'Annuler'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={() => startEdit(review)} 
                        className="text-blue-600 font-medium hover:underline text-xs"
                      >
                        {t('edit') || 'Modifier'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDelete(review.id)} 
                        className="text-red-600 font-medium hover:underline text-xs ml-2"
                      >
                        {t('delete') || 'Supprimer'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">⭐</span>
                    <p className="font-medium text-gray-700">Aucun avis dans cette catégorie.</p>
                    <p className="text-xs text-gray-400">
                      Les avis laissés par vos clients apparaîtront ici pour modération avant d&apos;être publiés sur la landing page.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Review Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Ajouter un avis vérifié
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Produit associé *
                </label>
                <select
                  value={addForm.productId}
                  onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={addForm.reviewerName}
                    onChange={(e) => setAddForm({ ...addForm, reviewerName: e.target.value })}
                    placeholder="Ex: Thomas D. (Paris)"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Note
                  </label>
                  <select
                    value={addForm.rating}
                    onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{'★'.repeat(r)} ({r}/5)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Commentaire client *
                </label>
                <textarea
                  value={addForm.comment}
                  onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                  placeholder="Partagez le retour d'expérience client..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsApproved"
                  checked={addForm.isApproved}
                  onChange={(e) => setAddForm({ ...addForm, isApproved: e.target.checked })}
                  className="rounded text-[#C8732A] focus:ring-[#C8732A] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="modalIsApproved" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Approuver immédiatement et publier sur la landing page
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Publication...' : 'Publier l\'avis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
