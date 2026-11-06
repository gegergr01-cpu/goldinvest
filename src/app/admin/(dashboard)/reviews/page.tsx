import prisma from '@/lib/prisma';
import ReviewTable from '@/components/admin/ReviewTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import AdminPagination from '@/components/admin/AdminPagination';

export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const t = await getTranslations('AdminReviews');
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const status = resolvedParams.status || 'all';
  const limit = 20;
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (status === 'pending') {
    whereClause.isApproved = false;
  } else if (status === 'approved') {
    whereClause.isApproved = true;
  }

  const [reviews, total, pendingCount, approvedCount, allCount, products] = await Promise.all([
    prisma.review.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        product: { select: { id: true, title: true, slug: true } },
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.review.count({ where: whereClause }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.review.count(),
    prisma.product.findMany({
      where: { isDeleted: false },
      select: { id: true, title: true },
      orderBy: { title: 'asc' }
    })
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modérez les avis soumis par les clients et gérez les avis affichés sur la boutique et la page d&apos;accueil.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200 text-sm">
          <Link
            href="/admin/reviews?status=all"
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              status === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Tous</span>
            <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-700">{allCount}</span>
          </Link>
          <Link
            href="/admin/reviews?status=pending"
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              status === 'pending'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>En attente</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                pendingCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {pendingCount}
            </span>
          </Link>
          <Link
            href="/admin/reviews?status=approved"
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              status === 'approved'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Approuvés</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-medium">
              {approvedCount}
            </span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xs border border-gray-200">
        <ReviewTable reviews={reviews as any} products={products} />
      </div>
      <AdminPagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
