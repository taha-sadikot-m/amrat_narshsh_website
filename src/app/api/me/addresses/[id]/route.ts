import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomerApi } from '@/lib/customer-auth';
import { unsetOtherDefaultAddresses } from '@/lib/customer-account';
import { indianPhoneDigits } from '@/lib/phone';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const { id } = await params;
  const existing = await prisma.address.findFirst({ where: { id, customerId: customer.id } });
  if (!existing) return NextResponse.json({ error: 'Address not found.' }, { status: 404 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const data = {
    label: String(body?.label ?? existing.label).trim() || 'Home',
    fullName: String(body?.fullName ?? existing.fullName).trim(),
    email: String(body?.email ?? existing.email).trim(),
    phone: indianPhoneDigits(customer.phone) ?? customer.phone,
    addressLine1: String(body?.addressLine1 ?? existing.addressLine1).trim(),
    addressLine2:
      body?.addressLine2 === undefined
        ? existing.addressLine2
        : String(body.addressLine2).trim() || null,
    city: String(body?.city ?? existing.city).trim(),
    state: String(body?.state ?? existing.state).trim(),
    pincode: String(body?.pincode ?? existing.pincode).trim(),
    isDefault: body?.isDefault === undefined ? existing.isDefault : Boolean(body.isDefault),
  };

  if (data.isDefault) await unsetOtherDefaultAddresses(customer.id, id);

  const address = await prisma.address.update({
    where: { id },
    data,
  });
  return NextResponse.json({ address });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const { id } = await params;
  const existing = await prisma.address.findFirst({ where: { id, customerId: customer.id } });
  if (!existing) return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
