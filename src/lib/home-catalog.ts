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

export const FEATURED_PRODUCT_IDS = ['idli-idla', 'surti-locho', 'gota', 'handwa'] as const;

export function featuredRank(productId: string) {
  const index = FEATURED_PRODUCT_IDS.indexOf(productId as (typeof FEATURED_PRODUCT_IDS)[number]);
  return index === -1 ? FEATURED_PRODUCT_IDS.length : index;
}

export function compareByFeatured(a: { id: string }, b: { id: string }) {
  return featuredRank(a.id) - featuredRank(b.id);
}

export const TAB_PRODUCT_IDS = {
  bestsellers: ['idli-idla', 'surti-locho', 'gota', 'handwa', 'bhajiya'],
  arrivals: ['gobapuri', 'khichu', 'khatawada', 'farali-atta', 'surti-locho'],
  festival: ['gulab-jamun', 'gota', 'farali-atta', 'bhajiya', 'handwa'],
} as const;
