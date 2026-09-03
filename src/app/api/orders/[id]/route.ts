import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TIMELINE: Record<string, { label: string; detail: string }[]> = {
  'Awaiting Payment': [
    { label: 'Awaiting Payment', detail: 'Complete the Razorpay payment to confirm this order.' },
  ],
  'Awaiting WhatsApp Confirmation': [
    { label: 'WhatsApp Confirmation Pending', detail: 'Send the prefilled message to confirm your order.' },
  ],
  'Payment Setup Failed': [
    { label: 'Payment Not Completed', detail: 'Razorpay checkout was not completed for this order.' },
  ],
  Processing: [
    { label: 'Order Confirmed', detail: 'Order accepted. Batch queued at Surat unit.' },
  ],
  Shipped: [
    { label: 'Dispatched from Surat Production Unit', detail: 'Modi Foods Central Unit, Surat' },
    { label: 'Order Confirmed', detail: 'Payment recorded' },
  ],
  'Out for Delivery': [
    { label: 'Arrived at Local Delivery Hub', detail: 'Out for delivery soon' },
    { label: 'Dispatched from Surat Production Unit', detail: 'Modi Foods Central Unit, Surat' },
    { label: 'Order Confirmed', detail: 'Payment recorded' },
  ],
  Delivered: [
    { label: 'Delivered', detail: 'Parcel handed over' },
    { label: 'Arrived at Local Delivery Hub', detail: 'Express Transit Hub' },
    { label: 'Dispatched from Surat Production Unit', detail: 'Modi Foods Central Unit, Surat' },
    { label: 'Order Confirmed', detail: 'Payment recorded' },
  ],
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: decodeURIComponent(id) },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    order,
    timeline: TIMELINE[order.status] ?? TIMELINE.Processing,
  });
}
