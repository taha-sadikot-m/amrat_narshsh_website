import 'server-only';

import type { Customer } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { indianPhoneDigits } from '@/lib/phone';
import { OrderInputError, priceOrder, type CheckoutAddress, type OrderQuote } from '@/lib/order-service';
import { blendDisplayName, packingNote, parseBlendCode } from '@/lib/apna-mix';
import { unsetOtherDefaultAddresses } from '@/lib/customer-account';

function clean(value: unknown) {
  return String(value ?? '').trim();
}

function addressFromRecord(row: {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
}): CheckoutAddress {
  return {
    fullName: row.fullName,
    email: row.email,
    phone: indianPhoneDigits(row.phone) ?? row.phone,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
  };
}

export async function priceCustomerOrder(body: unknown, customer: Customer): Promise<OrderQuote> {
  const request = (body ?? {}) as Record<string, unknown>;
  const addressId = clean(request.addressId);
  const customerPhone = indianPhoneDigits(customer.phone) ?? customer.phone;
  let address: CheckoutAddress;

  if (addressId) {
    const saved = await prisma.address.findFirst({
      where: { id: addressId, customerId: customer.id },
    });
    if (!saved) throw new OrderInputError('Saved address not found.', 404);
    address = addressFromRecord(saved);
    address.phone = customerPhone;
    if (customer.email) address.email = customer.email;
    if (customer.name) address.fullName = customer.name;
  } else {
    const raw = (request.address ?? {}) as Record<string, unknown>;
    address = {
      fullName: clean(raw.fullName) || customer.name || '',
      email: clean(raw.email) || customer.email || '',
      phone: customerPhone,
      addressLine1: clean(raw.addressLine1),
      addressLine2: clean(raw.addressLine2) || null,
      city: clean(raw.city),
      state: clean(raw.state),
      pincode: clean(raw.pincode),
    };
  }

  const quote = await priceOrder({
    ...request,
    address,
  });
  quote.items = quote.items.map((item) => {
    if (!item.blendCode) return item;
    const blend = parseBlendCode(item.blendCode);
    if (!blend) return item;
    const blendName = blendDisplayName(customer.name, item.name, blend.spice);
    return { ...item, blendName, packingNote: packingNote(blendName, blend) };
  });

  if (request.saveAddress && !addressId) {
    const count = await prisma.address.count({ where: { customerId: customer.id } });
    const makeDefault = Boolean(request.makeDefault) || count === 0;
    if (makeDefault) await unsetOtherDefaultAddresses(customer.id);
    await prisma.address.create({
      data: {
        customerId: customer.id,
        label: clean(request.addressLabel) || 'Home',
        fullName: quote.address.fullName,
        email: quote.address.email,
        phone: quote.address.phone,
        addressLine1: quote.address.addressLine1,
        addressLine2: quote.address.addressLine2,
        city: quote.address.city,
        state: quote.address.state,
        pincode: quote.address.pincode,
        isDefault: makeDefault,
      },
    });
  }

  return quote;
}
