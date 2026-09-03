import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = String(body?.code ?? '')
    .trim()
    .toUpperCase();
  const subtotal = Number(body?.subtotal ?? 0);

  if (!code) {
    return NextResponse.json({ success: false, message: 'Enter a coupon code.' }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) {
    return NextResponse.json(
      { success: false, message: 'Invalid coupon code. Try GUJARAT10 or HERITAGE1956.' },
      { status: 404 }
    );
  }

  if (subtotal < coupon.minOrderValue) {
    return NextResponse.json({
      success: false,
      message: `Add items worth ₹${coupon.minOrderValue - subtotal} more to use ${code}.`,
    });
  }

  return NextResponse.json({
    success: true,
    message: `Coupon applied! ${coupon.description}`,
    coupon: {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minOrderValue: coupon.minOrderValue,
      description: coupon.description,
    },
  });
}
