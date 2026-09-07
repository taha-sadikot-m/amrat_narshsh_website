import 'server-only';

import { randomInt } from 'node:crypto';
import { Prisma, type Order, type OrderItem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { FREE_SHIPPING_THRESHOLD, getProductBySlug, mapDbProduct, PAID_SHIPPING } from '@/lib/catalog';
import { comboQuantityFromLines, splitBundlePrices } from '@/lib/combo-pricing';
import type { ProductPackSize, PublicCombo } from '@/types';

export type IncomingOrderItem = {
  productId: string;
  weight: string;
  quantity: number;
  comboId?: string | null;
};

export type CheckoutAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
};

export type PricedOrderItem = {
  productId: string;
  name: string;
  gujaratiName: string;
  weight: string;
  price: number;
  quantity: number;
  heroColor: string;
};

export type OrderQuote = {
  items: PricedOrderItem[];
  address: CheckoutAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
};

export type SavedOrder = Order & { items: OrderItem[] };

export class OrderInputError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = 'OrderInputError';
  }
}

const clean = (value: unknown) => String(value ?? '').trim();

async function priceCatalogItem(rawItem: IncomingOrderItem): Promise<PricedOrderItem> {
  const productId = clean(rawItem?.productId);
  const product = await getProductBySlug(productId);
  if (!product) {
    throw new OrderInputError(`Unknown product: ${productId}`);
  }

  const pack =
    product.packSizes.find((candidate: ProductPackSize) => candidate.weight === clean(rawItem?.weight)) ??
    product.packSizes[0];
  const quantity = Math.max(1, Math.floor(Number(rawItem?.quantity) || 1));
  const availableStock = Number(pack.stock ?? 0);

  if (!product.inStock || availableStock < quantity) {
    throw new OrderInputError(
      `${product.name} (${pack.weight}) has only ${availableStock} units available.`,
      409,
    );
  }

  return {
    productId: product.id,
    name: product.name,
    gujaratiName: product.gujaratiName,
    weight: pack.weight,
    price: pack.price,
    quantity,
    heroColor: product.heroColor,
  };
}

async function priceComboGroup(comboId: string, rawItems: IncomingOrderItem[]): Promise<PricedOrderItem[] | null> {
  const row = await prisma.combo.findUnique({
    where: { id: comboId },
    include: { items: { include: { product: true } } },
  });
  if (!row?.active) return null;

  const products = row.items.map((item) => mapDbProduct(item.product));
  const comboItems = row.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) return null;
    const pack = product.packSizes.find((candidate) => candidate.isDefault) ?? product.packSizes[0];
    return {
      productId: product.id,
      quantity: item.quantity,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      weight: pack?.weight ?? product.defaultWeight,
      price: pack?.price ?? product.defaultPrice,
      makesText: product.makesText,
      heroColor: product.heroColor,
      gujaratiName: product.gujaratiName,
    };
  });
  if (comboItems.some((item) => item == null)) return null;
  const definedItems = comboItems as NonNullable<(typeof comboItems)[number]>[];

  const comboProductIds = new Set(definedItems.map((item) => item.productId));
  const cartProductIds = new Set(rawItems.map((item) => clean(item.productId)));
  if (comboProductIds.size !== cartProductIds.size) return null;
  for (const id of comboProductIds) {
    if (!cartProductIds.has(id)) return null;
  }

  const combo: PublicCombo = {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    compareAtPrice: definedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    discount: 0,
    sortOrder: row.sortOrder,
    items: definedItems,
  };

  const comboQty = comboQuantityFromLines(
    rawItems.map((item) => {
      const unit = definedItems.find((entry) => entry.productId === clean(item.productId))?.quantity ?? 1;
      return { productId: clean(item.productId), quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)), comboUnitQty: unit };
    }),
  );
  if (comboQty < 1) return null;

  const priced = splitBundlePrices(combo);
  const result: PricedOrderItem[] = [];
  for (const line of priced) {
    const catalog = await priceCatalogItem({
      productId: line.productId,
      weight: line.weight,
      quantity: line.quantity * comboQty,
    });
    result.push({ ...catalog, price: line.unitPrice });
  }
  return result;
}

export async function priceOrder(body: unknown): Promise<OrderQuote> {
  const request = (body ?? {}) as Record<string, unknown>;
  const rawItems = request.items;
  const rawAddress = (request.address ?? {}) as Record<string, unknown>;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new OrderInputError('Cart is empty.');
  }

  const address: CheckoutAddress = {
    fullName: clean(rawAddress.fullName),
    email: clean(rawAddress.email),
    phone: clean(rawAddress.phone),
    addressLine1: clean(rawAddress.addressLine1),
    addressLine2: clean(rawAddress.addressLine2) || null,
    city: clean(rawAddress.city),
    state: clean(rawAddress.state),
    pincode: clean(rawAddress.pincode),
  };

  if (
    !address.fullName ||
    !address.email ||
    !address.phone ||
    !address.addressLine1 ||
    !address.city ||
    !address.state ||
    !address.pincode
  ) {
    throw new OrderInputError('Please complete the shipping address.');
  }

  const items: PricedOrderItem[] = [];
  const standalone: IncomingOrderItem[] = [];
  const comboGroups = new Map<string, IncomingOrderItem[]>();

  for (const rawItem of rawItems as IncomingOrderItem[]) {
    const comboId = clean(rawItem?.comboId);
    if (comboId) {
      const group = comboGroups.get(comboId) ?? [];
      group.push(rawItem);
      comboGroups.set(comboId, group);
    } else {
      standalone.push(rawItem);
    }
  }

  for (const [comboId, group] of comboGroups) {
    const comboPriced = await priceComboGroup(comboId, group);
    if (comboPriced) items.push(...comboPriced);
    else {
      for (const rawItem of group) items.push(await priceCatalogItem(rawItem));
    }
  }

  for (const rawItem of standalone) {
    items.push(await priceCatalogItem(rawItem));
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const requestedCoupon = request.couponCode ? clean(request.couponCode).toUpperCase() : null;
  let couponCode: string | null = null;
  let discount = 0;

  if (requestedCoupon) {
    const coupon = await prisma.coupon.findUnique({ where: { code: requestedCoupon } });
    if (coupon && subtotal >= coupon.minOrderValue) {
      couponCode = coupon.code;
      discount = Math.round((subtotal * coupon.discountPercentage) / 100);
    }
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : PAID_SHIPPING;
  const total = Math.max(0, subtotal - discount + shipping);

  return { items, address, subtotal, discount, shipping, total, couponCode };
}

async function runSerializable<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
      if (!retryable || attempt === 2) throw error;
    }
  }
  throw new Error('Could not complete the order transaction.');
}

async function decrementInventory(
  tx: Prisma.TransactionClient,
  items: PricedOrderItem[],
): Promise<void> {
  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      throw new OrderInputError(`Unknown product: ${item.productId}`);
    }

    const packs = (product.packSizes as unknown as ProductPackSize[]).map((pack) => ({ ...pack }));
    const pack = packs.find((candidate) => candidate.weight === item.weight);
    if (!pack) {
      throw new OrderInputError(`${product.name} (${item.weight}) is no longer available.`, 409);
    }

    const availableStock = Number(pack.stock ?? product.stockCount);
    if (!product.inStock || availableStock < item.quantity) {
      throw new OrderInputError(
        `${product.name} (${item.weight}) has only ${availableStock} units available.`,
        409,
      );
    }

    pack.stock = availableStock - item.quantity;
    const stockCount = packs.reduce((sum, candidate) => sum + Number(candidate.stock ?? 0), 0);
    await tx.product.update({
      where: { id: product.id },
      data: {
        packSizes: JSON.parse(JSON.stringify(packs)),
        stockCount,
        inStock: stockCount > 0,
      },
    });
  }
}

type CreateOrderOptions = {
  paymentMethod: 'cod' | 'whatsapp' | 'razorpay';
  status: string;
  paymentStatus: string;
  adjustInventory: boolean;
};

export async function createOrder(
  quote: OrderQuote,
  options: CreateOrderOptions,
): Promise<SavedOrder> {
  return runSerializable(async (tx) => {
    if (options.adjustInventory) {
      await decrementInventory(tx, quote.items);
    }

    const id = `AN-${randomInt(100000, 1000000)}`;
    const estimated = new Date();
    estimated.setDate(estimated.getDate() + 3);

    return tx.order.create({
      data: {
        id,
        status: options.status,
        paymentMethod: options.paymentMethod,
        paymentStatus: options.paymentStatus,
        inventoryAdjusted: options.adjustInventory,
        subtotal: quote.subtotal,
        discount: quote.discount,
        shipping: quote.shipping,
        total: quote.total,
        couponCode: quote.couponCode,
        trackingNumber: `BD${id.replace('AN-', '')}`,
        estimatedDelivery: estimated.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        ...quote.address,
        items: { create: quote.items },
      },
      include: { items: true },
    });
  });
}

export async function attachRazorpayOrder(
  localOrderId: string,
  razorpayOrderId: string,
): Promise<SavedOrder> {
  return prisma.order.update({
    where: { id: localOrderId },
    data: { razorpayOrderId },
    include: { items: true },
  });
}

export async function markPaymentSetupFailed(localOrderId: string): Promise<void> {
  await prisma.order.updateMany({
    where: { id: localOrderId, paymentStatus: 'Pending' },
    data: { status: 'Payment Setup Failed', paymentStatus: 'Failed' },
  });
}

export async function finalizeRazorpayPayment(input: {
  localOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}): Promise<SavedOrder> {
  return runSerializable(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.localOrderId },
      include: { items: true },
    });
    if (!order || order.razorpayOrderId !== input.razorpayOrderId) {
      throw new OrderInputError('The payment does not match this order.', 400);
    }

    if (order.paymentStatus === 'Paid') {
      if (order.razorpayPaymentId !== input.razorpayPaymentId) {
        throw new OrderInputError('This order was completed with a different payment.', 409);
      }
      return order;
    }

    if (!order.inventoryAdjusted) {
      await decrementInventory(tx, order.items);
    }

    return tx.order.update({
      where: { id: order.id },
      data: {
        status: 'Processing',
        paymentStatus: 'Paid',
        razorpayPaymentId: input.razorpayPaymentId,
        inventoryAdjusted: true,
      },
      include: { items: true },
    });
  });
}

export function buildWhatsAppOrderUrl(order: SavedOrder): string {
  const itemLines = order.items.map(
    (item, index) =>
      `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}`,
  );
  const address = [
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.state,
    order.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const lines = [
    'Hello Amrat Narsih, I would like to confirm this order:',
    '',
    `Order ID: ${order.id}`,
    ...itemLines,
    '',
    `Subtotal: ₹${order.subtotal}`,
    order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ''}: -₹${order.discount}` : null,
    `Delivery: ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}`,
    `Grand Total: ₹${order.total}`,
    '',
    `Customer: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Delivery Address: ${address}`,
    '',
    'Please confirm availability and payment details on WhatsApp.',
  ].filter((line): line is string => line !== null);

  return `https://wa.me/919825131883?text=${encodeURIComponent(lines.join('\n'))}`;
}
