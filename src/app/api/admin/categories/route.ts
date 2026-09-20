import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';
import { mapDbCategory } from '@/lib/catalog';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ categories: rows.map(mapDbCategory) });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  const id = String(body?.id || slugify(name)).trim();
  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: {
      id,
      name,
      gujaratiName: String(body?.gujaratiName ?? name),
      description: String(body?.description ?? ''),
      color: String(body?.color ?? '#D46A1E'),
      tagline: String(body?.tagline ?? ''),
      sortOrder: Number(body?.sortOrder ?? count),
    },
  });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ category: mapDbCategory(category) });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body?.name !== undefined ? String(body.name) : undefined,
      gujaratiName: body?.gujaratiName !== undefined ? String(body.gujaratiName) : undefined,
      description: body?.description !== undefined ? String(body.description) : undefined,
      color: body?.color !== undefined ? String(body.color) : undefined,
      tagline: body?.tagline !== undefined ? String(body.tagline) : undefined,
      sortOrder: body?.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    },
  });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ category: mapDbCategory(category) });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const inUse = await prisma.product.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${inUse} product(s) still use this category.` },
      { status: 409 },
    );
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ ok: true });
}
