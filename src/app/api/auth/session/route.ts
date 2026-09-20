import { NextResponse } from 'next/server';
import { applyCustomerCookie, signCustomerToken, toPublicCustomer } from '@/lib/customer-auth';
import { linkGuestOrders, upsertCustomerFromFirebase } from '@/lib/customer-account';
import { verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { normalizeIndianE164 } from '@/lib/phone';
import { clientIpFromHeaders, rateLimitAllow } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!rateLimitAllow(`auth-session:${ip}`)) {
    return NextResponse.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const idToken = String(body?.idToken ?? '').trim();
  if (!idToken) {
    return NextResponse.json({ error: 'Missing sign-in token.' }, { status: 400 });
  }

  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    const phone = normalizeIndianE164(decoded.phone_number ?? '');
    if (!phone) {
      return NextResponse.json(
        { error: 'Please use an Indian mobile number (+91).' },
        { status: 400 },
      );
    }

    const customer = await upsertCustomerFromFirebase({
      firebaseUid: decoded.uid,
      phone,
    });
    await linkGuestOrders(customer);
    const token = await signCustomerToken(customer.id, customer.phone);
    const response = NextResponse.json({ customer: toPublicCustomer(customer) });
    applyCustomerCookie(response, token);
    return response;
  } catch (error) {
    console.error('Customer session failed', error);
    return NextResponse.json({ error: 'Could not verify the OTP session.' }, { status: 401 });
  }
}
