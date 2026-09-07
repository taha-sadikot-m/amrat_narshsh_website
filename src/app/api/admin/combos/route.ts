import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type ComboBody = {
  id?: string;
  name?: string;
  tagline?: string;
  price?: number;
  active?: boolean;
  sortOrder?: number;
  productIds?: string[];
};

async function comboWithItems(id: string) {
  return prisma.combo.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const combos = await prisma.combo.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json({ combos });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as ComboBody | null;
  const name = String(body?.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  const productIds = Array.isArray(body?.productIds)
    ? [...new Set(body.productIds.map((id) => String(id).trim()).filter(Boolean))]
    : [];
  if (productIds.length < 2) {
    return NextResponse.json({ error: 'Pick at least two products.' }, { status: 400 });
  }
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products were not found.' }, { status: 400 });
  }
  const count = await prisma.combo.count();
  const combo = await prisma.combo.create({
    data: {
      id: String(body?.id || slugify(name)),
      name,
      tagline: String(body?.tagline ?? '').trim(),
      price: Math.max(1, Number(body?.price ?? 0)),
      active: body?.active !== false,
      sortOrder: Number.isFinite(Number(body?.sortOrder)) ? Number(body?.sortOrder) : count,
      items: {
        create: productIds.map((productId) => ({ productId, quantity: 1 })),
      },
    },
    include: { items: { include: { product: true } } },
  });
  revalidatePath('/');
  return NextResponse.json({ combo });
}

export async function PATCH(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as ComboBody | null;
  const id = String(body?.id ?? '').trim();
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const existing = await prisma.combo.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Combo not found.' }, { status: 404 });

  const productIds = Array.isArray(body?.productIds)
    ? [...new Set(body.productIds.map((item) => String(item).trim()).filter(Boolean))]
    : null;

  if (productIds) {
    if (productIds.length < 2) {
      return NextResponse.json({ error: 'Pick at least two products.' }, { status: 400 });
    }
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products were not found.' }, { status: 400 });
    }
    await prisma.comboItem.deleteMany({ where: { comboId: id } });
    await prisma.comboItem.createMany({
      data: productIds.map((productId) => ({ comboId: id, productId, quantity: 1 })),
    });
  }

  await prisma.combo.update({
    where: { id },
    data: {
      ...(body?.name !== undefined ? { name: String(body.name).trim() } : {}),
      ...(body?.tagline !== undefined ? { tagline: String(body.tagline).trim() } : {}),
      ...(body?.price !== undefined ? { price: Math.max(1, Number(body.price)) } : {}),
      ...(body?.active !== undefined ? { active: Boolean(body.active) } : {}),
      ...(body?.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) } : {}),
    },
  });

  revalidatePath('/');
  return NextResponse.json({ combo: await comboWithItems(id) });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  await prisma.combo.delete({ where: { id } });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
