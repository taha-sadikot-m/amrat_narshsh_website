import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const coupons = await prisma.coupon.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const code = String(body?.code ?? '')
    .trim()
    .toUpperCase();
  if (!code) return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
  const coupon = await prisma.coupon.upsert({
    where: { code },
    update: {
      discountPercentage: Number(body?.discountPercentage ?? 10),
      minOrderValue: Number(body?.minOrderValue ?? 0),
      description: String(body?.description ?? ''),
    },
    create: {
      code,
      discountPercentage: Number(body?.discountPercentage ?? 10),
      minOrderValue: Number(body?.minOrderValue ?? 0),
      description: String(body?.description ?? ''),
    },
  });
  return NextResponse.json({ coupon });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code.' }, { status: 400 });
  await prisma.coupon.delete({ where: { code } });
  return NextResponse.json({ ok: true });
}
