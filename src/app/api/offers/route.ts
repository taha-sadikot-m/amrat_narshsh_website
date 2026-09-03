import { NextResponse } from 'next/server';
import { getActiveOffers } from '@/lib/site-content';

export async function GET() {
  const offers = await getActiveOffers();
  return NextResponse.json({
    offers: offers.map((o) => ({
      id: o.id,
      text: o.text,
      ctaLabel: o.ctaLabel,
      href: o.href || '/shop',
    })),
  });
}
