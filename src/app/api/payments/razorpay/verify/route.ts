import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  finalizeRazorpayPayment,
  OrderInputError,
} from '@/lib/order-service';
import { getRazorpayCredentials } from '@/lib/razorpay';

const clean = (value: unknown) => String(value ?? '').trim();

function signaturesMatch(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const localOrderId = clean(body?.localOrderId);
  const razorpayOrderId = clean(body?.razorpay_order_id);
  const razorpayPaymentId = clean(body?.razorpay_payment_id);
  const razorpaySignature = clean(body?.razorpay_signature);

  if (!localOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: 'Incomplete Razorpay payment response.' }, { status: 400 });
  }

  try {
    const { keySecret } = getRazorpayCredentials();
    const expectedSignature = createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (!signaturesMatch(expectedSignature, razorpaySignature)) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
    }

    const order = await finalizeRazorpayPayment({
      localOrderId,
      razorpayOrderId,
      razorpayPaymentId,
    });
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Razorpay verification failed', error);
    return NextResponse.json(
      { error: 'Payment was received but the order could not be finalized. Please contact support.' },
      { status: 500 },
    );
  }
}
