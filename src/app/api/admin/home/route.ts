import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';
import { parseHomeMerch } from '@/lib/home-merch';

function idList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const row = await prisma.homeMerch.findUnique({ where: { id: 'default' } });
  return NextResponse.json({ merch: parseHomeMerch(row) });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const merch = {
    featuredIds: idList(body?.featuredIds),
    bestsellers: idList(body?.bestsellers),
    arrivals: idList(body?.arrivals),
    festival: idList(body?.festival),
  };
  const row = await prisma.homeMerch.upsert({
    where: { id: 'default' },
    update: merch,
    create: { id: 'default', ...merch },
  });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ merch: parseHomeMerch(row) });
}
