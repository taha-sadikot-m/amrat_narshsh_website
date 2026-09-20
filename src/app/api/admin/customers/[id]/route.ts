import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: { createdAt: 'desc' } },
      orders: { orderBy: { createdAt: 'desc' }, include: { items: true } },
    },
  });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ customer });
}
