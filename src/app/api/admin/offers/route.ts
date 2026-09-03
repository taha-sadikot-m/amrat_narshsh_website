import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const offers = await prisma.offer.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ offers });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const text = String(body?.text ?? '').trim();
  if (!text) return NextResponse.json({ error: 'Offer text is required.' }, { status: 400 });
  const count = await prisma.offer.count();
  const offer = await prisma.offer.create({
    data: {
      text,
      ctaLabel: body?.ctaLabel ? String(body.ctaLabel) : null,
      href: body?.href ? String(body.href) : '/shop',
      active: body?.active !== false,
      sortOrder: Number(body?.sortOrder ?? count),
      startsAt: body?.startsAt ? new Date(body.startsAt) : null,
      endsAt: body?.endsAt ? new Date(body.endsAt) : null,
    },
  });
  revalidatePath('/');
  return NextResponse.json({ offer });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const offer = await prisma.offer.update({
    where: { id },
    data: {
      text: body?.text !== undefined ? String(body.text) : undefined,
      ctaLabel: body?.ctaLabel !== undefined ? body.ctaLabel || null : undefined,
      href: body?.href !== undefined ? body.href || '/shop' : undefined,
      active: body?.active !== undefined ? Boolean(body.active) : undefined,
      sortOrder: body?.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      startsAt: body?.startsAt !== undefined ? (body.startsAt ? new Date(body.startsAt) : null) : undefined,
      endsAt: body?.endsAt !== undefined ? (body.endsAt ? new Date(body.endsAt) : null) : undefined,
    },
  });
  revalidatePath('/');
  return NextResponse.json({ offer });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  await prisma.offer.delete({ where: { id } });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
