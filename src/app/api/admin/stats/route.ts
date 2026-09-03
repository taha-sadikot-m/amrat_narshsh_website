import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const [productCount, orders, unreadMessages, products] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ select: { id: true, status: true, total: true } }),
    prisma.contactMessage.count({ where: { readAt: null } }),
    prisma.product.findMany({ select: { name: true, stockCount: true, inStock: true } }),
  ]);
  const openOrders = orders.filter((o) => o.status !== 'Delivered').length;
  const lowStock = products.filter((p) => !p.inStock || p.stockCount < 20);
  return NextResponse.json({
    productCount,
    openOrders,
    unreadMessages,
    orderCount: orders.length,
    lowStock,
  });
}
