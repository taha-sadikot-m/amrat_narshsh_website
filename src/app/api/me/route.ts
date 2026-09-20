import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomerApi, toPublicCustomer } from '@/lib/customer-auth';

export async function GET() {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  return NextResponse.json({ customer: toPublicCustomer(customer) });
}

export async function PATCH(request: Request) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? '').trim() || null;
  const emailRaw = String(body?.email ?? '').trim();
  const email = emailRaw ? emailRaw : null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: { name, email },
  });
  return NextResponse.json({ customer: toPublicCustomer(updated) });
}
