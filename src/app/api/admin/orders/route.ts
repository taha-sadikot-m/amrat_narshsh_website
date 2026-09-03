import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

const STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
  return NextResponse.json({ orders });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = String(body?.status ?? '');
  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid order or status.' }, { status: 400 });
  }
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });
  revalidatePath(`/track-order/${id}`);
  return NextResponse.json({ order });
}
