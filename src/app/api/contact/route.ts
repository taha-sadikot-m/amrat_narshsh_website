import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const message = String(body?.message ?? '').trim();
  const subject = String(body?.subject ?? 'General Enquiry').trim();
  const phone = String(body?.phone ?? '').trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const record = await prisma.contactMessage.create({
    data: { name, email, message, subject, phone: phone || null },
  });

  return NextResponse.json({ ok: true, id: record.id });
}
