import prisma from '@/lib/prisma';
import { getAllQuotes } from '@/lib/quotes';
import AdminQuotesManager from '@/components/admin/AdminQuotesManager';

export const dynamic = 'force-dynamic';

export default async function AdminQuotesPage() {
  const [quotes, products, users] = await Promise.all([
    getAllQuotes(),
    prisma.product.findMany({
      where: { isDeleted: false },
      select: { id: true, title: true, price: true },
      take: 50,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      select: { id: true, email: true },
      take: 100,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <AdminQuotesManager
        initialQuotes={quotes}
        products={products}
        users={users}
      />
    </div>
  );
}

