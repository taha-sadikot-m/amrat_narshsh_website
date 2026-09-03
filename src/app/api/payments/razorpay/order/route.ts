import { NextResponse } from 'next/server';
import {
  attachRazorpayOrder,
  createOrder,
  markPaymentSetupFailed,
  OrderInputError,
  priceOrder,
} from '@/lib/order-service';
import { createRazorpayClient, getRazorpayCredentials } from '@/lib/razorpay';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  let localOrderId: string | null = null;

  try {
    const quote = await priceOrder(body);
    const localOrder = await createOrder(quote, {
      paymentMethod: 'razorpay',
      status: 'Awaiting Payment',
      paymentStatus: 'Pending',
      adjustInventory: false,
    });
    localOrderId = localOrder.id;

    const razorpayOrder = await createRazorpayClient().orders.create({
      amount: quote.total * 100,
      currency: 'INR',
      receipt: localOrder.id,
      notes: {
        localOrderId: localOrder.id,
      },
    });
    const order = await attachRazorpayOrder(localOrder.id, razorpayOrder.id);
    const { keyId } = getRazorpayCredentials();

    return NextResponse.json({
      keyId,
      localOrderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Amrat Narsih',
      description: `Order ${order.id}`,
    });
  } catch (error) {
    if (localOrderId) {
      await markPaymentSetupFailed(localOrderId).catch(() => undefined);
    }
    if (error instanceof OrderInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Razorpay order setup failed', error);
    return NextResponse.json(
      { error: 'Could not start Razorpay Test Mode checkout. Please try again.' },
      { status: 500 },
    );
  }
}
