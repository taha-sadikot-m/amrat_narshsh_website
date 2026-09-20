import { NextResponse } from 'next/server';
import {
  attachRazorpayOrder,
  createOrder,
  markPaymentSetupFailed,
  OrderInputError,
} from '@/lib/order-service';
import { createRazorpayClient, getRazorpayCredentials } from '@/lib/razorpay';
import { requireCustomerApi } from '@/lib/customer-auth';
import { priceCustomerOrder } from '@/lib/checkout-customer';

export async function POST(request: Request) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;

  const body = await request.json().catch(() => null);
  let localOrderId: string | null = null;

  try {
    const quote = await priceCustomerOrder(body, customer);
    const localOrder = await createOrder(quote, {
      paymentMethod: 'razorpay',
      status: 'Awaiting Payment',
      paymentStatus: 'Pending',
      adjustInventory: false,
      customerId: customer.id,
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
      prefill: {
        name: quote.address.fullName,
        email: quote.address.email,
        contact: quote.address.phone,
      },
    });
  } catch (caught) {
    if (localOrderId) {
      await markPaymentSetupFailed(localOrderId).catch(() => undefined);
    }
    if (caught instanceof OrderInputError) {
      return NextResponse.json({ error: caught.message }, { status: caught.status });
    }
    console.error('Razorpay order setup failed', caught);
    return NextResponse.json(
      { error: 'Could not start Razorpay Test Mode checkout. Please try again.' },
      { status: 500 },
    );
  }
}
