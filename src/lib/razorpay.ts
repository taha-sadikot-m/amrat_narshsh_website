import 'server-only';

import Razorpay from 'razorpay';

type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
};

export function getRazorpayCredentials(): RazorpayCredentials {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.RAZERPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? process.env.RAZERPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay Test Mode is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    );
  }

  return { keyId, keySecret };
}

export function createRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayCredentials();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}
