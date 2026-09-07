import type { Product } from '../types';

export function defaultPack(product: Product) {
  return product.packSizes.find((pack) => pack.isDefault) ?? product.packSizes[0];
}

export function categoryLabel(category: Product['category']) {
  if (category === 'sweet-moments') return 'Sweet';
  if (category === 'traditional-favourites') return 'Farali';
  return 'Instant Mix';
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export const TAB_PRODUCT_IDS = {
  bestsellers: ['bhajiya', 'dalwada', 'handwa', 'gulab-jamun', 'gota'],
  arrivals: ['gobapuri', 'khichu', 'khatawada', 'farali-atta', 'surti-locho'],
  festival: ['gulab-jamun', 'gota', 'farali-atta', 'bhajiya', 'handwa'],
} as const;
