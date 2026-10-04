import { PASSPORT_REGIONS } from '../data/passport';
import { getCustomerSession } from './customer-auth';
import { prisma } from './prisma';
import { visibleProducts } from './passport';

export async function purchasedProductIds(customerId: string | null) {
  if (!customerId) return [] as string[];
  const items = await prisma.orderItem.findMany({
    where: { order: { customerId } },
    select: { productId: true },
  });
  return items.map((item) => item.productId);
}

export async function filterStorefrontProducts<T extends { id: string }>(products: T[]) {
  const customer = await getCustomerSession();
  const purchased = await purchasedProductIds(customer?.id ?? null);
  return visibleProducts(products, purchased, PASSPORT_REGIONS);
}

export function isLockedReward(productId: string, purchasedProductIds: readonly string[]) {
  return !visibleProducts([{ id: productId }], purchasedProductIds, PASSPORT_REGIONS).some((item) => item.id === productId);
}
