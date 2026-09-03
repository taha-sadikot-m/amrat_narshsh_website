import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';
import { clampAutoplayInterval } from '@/lib/site-content';

function revalidateHero() {
  revalidatePath('/');
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const [hero, slides] = await Promise.all([
    prisma.heroSetting.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);
  return NextResponse.json({ hero, slides });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);

  if (typeof body?.id === 'string' && body.id) {
    const slide = await prisma.heroSlide.update({
      where: { id: body.id },
      data: {
        productId: body.productId !== undefined ? (body.productId ? String(body.productId) : null) : undefined,
        desktopImageUrl: body.desktopImageUrl !== undefined ? String(body.desktopImageUrl).trim() : undefined,
        mobileImageUrl: body.mobileImageUrl !== undefined ? String(body.mobileImageUrl).trim() : undefined,
        altText: body.altText !== undefined ? String(body.altText) : undefined,
        active: body.active !== undefined ? Boolean(body.active) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    });
    revalidateHero();
    return NextResponse.json({ slide });
  }

  const hero = await prisma.heroSetting.upsert({
    where: { id: 'default' },
    update: {
      overlayOpacity: Math.min(90, Math.max(0, Number(body?.overlayOpacity ?? 45))),
      autoplayIntervalMs: clampAutoplayInterval(Number(body?.autoplayIntervalMs ?? 4500)),
    },
    create: {
      id: 'default',
      overlayOpacity: Math.min(90, Math.max(0, Number(body?.overlayOpacity ?? 45))),
      autoplayIntervalMs: clampAutoplayInterval(Number(body?.autoplayIntervalMs ?? 4500)),
    },
  });
  revalidateHero();
  return NextResponse.json({ hero });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const desktopImageUrl = String(body?.desktopImageUrl ?? '').trim();
  const mobileImageUrl = String(body?.mobileImageUrl ?? '').trim();
  if (!desktopImageUrl || !mobileImageUrl) {
    return NextResponse.json({ error: 'Desktop and mobile images are required.' }, { status: 400 });
  }
  const count = await prisma.heroSlide.count();
  const slide = await prisma.heroSlide.create({
    data: {
      productId: body?.productId ? String(body.productId) : null,
      desktopImageUrl,
      mobileImageUrl,
      altText: String(body?.altText ?? ''),
      active: body?.active !== false,
      sortOrder: Number(body?.sortOrder ?? count),
    },
  });
  revalidateHero();
  return NextResponse.json({ slide });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  await prisma.heroSlide.delete({ where: { id } });
  revalidateHero();
  return NextResponse.json({ ok: true });
}
