import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

const STATUSES = [
  'Awaiting Payment',
  'Awaiting WhatsApp Confirmation',
  'Payment Setup Failed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true, customer: { select: { id: true, phone: true, name: true } } },
  });
  return NextResponse.json({ orders });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = String(body?.status ?? '');
  const trackingNumber = body?.trackingNumber !== undefined ? String(body.trackingNumber).trim() : undefined;
  if (!id || (status && !STATUSES.includes(status))) {
    return NextResponse.json({ error: 'Invalid order or status.' }, { status: 400 });
  }
  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
    },
    include: { items: true },
  });
  revalidatePath(`/track-order/${id}`);
  return NextResponse.json({ order });
}
