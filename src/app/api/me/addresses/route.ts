import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomerApi } from '@/lib/customer-auth';
import { unsetOtherDefaultAddresses } from '@/lib/customer-account';
import { indianPhoneDigits } from '@/lib/phone';

function readAddress(body: Record<string, unknown> | null, customerPhone: string) {
  return {
    label: String(body?.label ?? 'Home').trim() || 'Home',
    fullName: String(body?.fullName ?? '').trim(),
    email: String(body?.email ?? '').trim(),
    phone: indianPhoneDigits(customerPhone) ?? customerPhone,
    addressLine1: String(body?.addressLine1 ?? '').trim(),
    addressLine2: String(body?.addressLine2 ?? '').trim() || null,
    city: String(body?.city ?? '').trim(),
    state: String(body?.state ?? '').trim(),
    pincode: String(body?.pincode ?? '').trim(),
    isDefault: Boolean(body?.isDefault),
  };
}

function validateAddress(data: { fullName: string; email: string; addressLine1: string; city: string; state: string; pincode: string }) {
  if (!data.fullName || !data.email || !data.addressLine1 || !data.city || !data.state || !data.pincode) {
    return 'Please complete the address.';
  }
  return null;
}

export async function GET() {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const addresses = await prisma.address.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ addresses });
}

export async function POST(request: Request) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const data = readAddress(body, customer.phone);
  const invalid = validateAddress(data);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const count = await prisma.address.count({ where: { customerId: customer.id } });
  const isDefault = data.isDefault || count === 0;
  if (isDefault) await unsetOtherDefaultAddresses(customer.id);

  const address = await prisma.address.create({
    data: { ...data, isDefault, customerId: customer.id },
  });
  return NextResponse.json({ address });
}
