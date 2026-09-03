import { NextResponse } from 'next/server';
import {
  buildWhatsAppOrderUrl,
  createOrder,
  OrderInputError,
  priceOrder,
} from '@/lib/order-service';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const paymentMethod = String(body?.paymentMethod ?? 'cod');
  if (paymentMethod !== 'cod' && paymentMethod !== 'whatsapp') {
    return NextResponse.json(
      { error: 'Online payments must be started through Razorpay checkout.' },
      { status: 400 },
    );
  }

  try {
    const quote = await priceOrder(body);
    const isWhatsApp = paymentMethod === 'whatsapp';
    const order = await createOrder(quote, {
      paymentMethod,
      status: isWhatsApp ? 'Awaiting WhatsApp Confirmation' : 'Processing',
      paymentStatus: isWhatsApp ? 'Pending Confirmation' : 'Cash on Delivery',
      adjustInventory: true,
    });

    return NextResponse.json({
      order,
      ...(isWhatsApp ? { whatsappUrl: buildWhatsAppOrderUrl(order) } : {}),
    });
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Order creation failed', error);
    return NextResponse.json({ error: 'Could not place order.' }, { status: 500 });
  }
}
