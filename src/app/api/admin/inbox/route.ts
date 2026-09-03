import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ messages });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { readAt: body?.read === false ? null : new Date() },
  });
  return NextResponse.json({ message });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
