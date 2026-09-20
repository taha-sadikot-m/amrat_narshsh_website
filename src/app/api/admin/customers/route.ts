import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });
  return NextResponse.json({
    customers: customers.map((row) => ({
      id: row.id,
      phone: row.phone,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
      orderCount: row._count.orders,
    })),
  });
}
