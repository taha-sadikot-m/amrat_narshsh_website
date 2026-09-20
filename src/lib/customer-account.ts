import 'server-only';

import type { Customer } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { indianPhoneDigits } from '@/lib/phone';

export async function upsertCustomerFromFirebase(input: { firebaseUid: string; phone: string }) {
  const existingByUid = await prisma.customer.findUnique({ where: { firebaseUid: input.firebaseUid } });
  if (existingByUid) {
    if (existingByUid.phone !== input.phone) {
      return prisma.customer.update({
        where: { id: existingByUid.id },
        data: { phone: input.phone },
      });
    }
    return existingByUid;
  }

  const existingByPhone = await prisma.customer.findUnique({ where: { phone: input.phone } });
  if (existingByPhone) {
    return prisma.customer.update({
      where: { id: existingByPhone.id },
      data: { firebaseUid: input.firebaseUid },
    });
  }

  return prisma.customer.create({
    data: {
      firebaseUid: input.firebaseUid,
      phone: input.phone,
    },
  });
}

export async function linkGuestOrders(customer: Customer) {
  const digits = indianPhoneDigits(customer.phone);
  if (!digits) return;

  const candidates = await prisma.order.findMany({
    where: { customerId: null },
    select: { id: true, phone: true },
  });
  const ids = candidates
    .filter((order) => indianPhoneDigits(order.phone) === digits)
    .map((order) => order.id);
  if (ids.length === 0) return;

  await prisma.order.updateMany({
    where: { id: { in: ids } },
    data: { customerId: customer.id },
  });
}

export async function unsetOtherDefaultAddresses(customerId: string, keepId?: string) {
  await prisma.address.updateMany({
    where: {
      customerId,
      isDefault: true,
      ...(keepId ? { id: { not: keepId } } : {}),
    },
    data: { isDefault: false },
  });
}
