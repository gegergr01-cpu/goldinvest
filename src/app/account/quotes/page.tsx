import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserQuotes } from '@/lib/quotes';
import LuxuryArrow from '@/components/ui/LuxuryArrow';

export const dynamic = 'force-dynamic';

export default async function AccountQuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/login');
  }

  const quotes = await getUserQuotes(user.email);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0E2036]">Mes Devis d&apos;Investissement</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Retrouvez l&apos;ensemble de vos estimations chiffrées et téléchargez vos devis officiels en PDF scellé.
          </p>
        </div>

        <Link
          href="/devis"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0E2036] hover:bg-[#1A3353] text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Nouveau devis</span>
          <LuxuryArrow className="w-2.5 h-2.5 brightness-0 invert" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        {quotes.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-4 bg-[#FAF9F5] rounded-xl border border-[#E8E4DA]/60">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl">
              📜
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-sm">Aucun devis pour le moment</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Vous n&apos;avez pas encore de devis actif. Soumettez une demande pour obtenir une tarification personnalisée aux cours LBMA.
              </p>
            </div>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white text-xs font-semibold transition-colors"
            >
              <span>Demander un devis d&apos;investissement</span>
              <LuxuryArrow className="w-2.5 h-2.5 brightness-0 invert" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Référence</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type / Projet</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {quotes.map((quote) => {
                  const isSent = quote.status === 'SENT' || quote.status === 'ACCEPTED';
                  return (
                    <tr key={quote.id} className="hover:bg-gray-50/80 transition-colors">
                      
                      {/* Ref */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-[#0E2036]">
                          {quote.id}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {formatDate(quote.createdAt)}
                      </td>

                      {/* Details */}
                      <td className="px-4 py-4 text-xs text-gray-700 max-w-[200px]">
                        <p className="font-medium truncate">{quote.metalType || "Or d'investissement"}</p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {quote.deliveryPreference || 'Livraison assurée'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span>✓</span> Devis officiel émis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>⏳</span> En cours d&apos;étude
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        {isSent && quote.total > 0 ? (
                          <span className="font-bold text-[#0E2036] text-sm">
                            {formatPrice(quote.total)}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">
                            {quote.investmentAmount || 'Sur estimation'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right text-xs">
                        {isSent ? (
                          <a
                            href={`/api/quote/${quote.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8732A] hover:bg-[#B8641C] text-white font-medium text-xs transition-colors shadow-sm"
                          >
                            <span>📄</span>
                            <span>Télécharger PDF</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            Disponible sous 24-48h
                          </span>
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

    </div>
  );
}
