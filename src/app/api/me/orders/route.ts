import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomerApi } from '@/lib/customer-auth';

export async function GET() {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ orders });
}
