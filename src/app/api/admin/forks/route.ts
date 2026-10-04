import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const forks = await prisma.recipeFork.findMany({
    where: { status: 'pending' },
    include: { customer: { select: { name: true, phone: true } }, recipe: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ forks });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = String(body?.status ?? '');
  if (!id || (status !== 'approved' && status !== 'rejected')) {
    return NextResponse.json({ error: 'Choose approve or reject.' }, { status: 400 });
  }
  const fork = await prisma.recipeFork.update({ where: { id }, data: { status } });
  return NextResponse.json({ fork });
}
