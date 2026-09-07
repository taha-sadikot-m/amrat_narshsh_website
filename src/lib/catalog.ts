import type { Category as DbCategory, Product as DbProduct } from '@prisma/client';
import type { Category, Product, PublicCombo } from '../types';
import { prisma } from './prisma';

export function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    gujaratiName: row.gujaratiName,
    hindiName: row.hindiName ?? undefined,
    slug: row.slug,
    category: row.category as Product['category'],
    categoryName: row.categoryName,
    tagline: row.tagline,
    description: row.description,
    culinaryStory: row.culinaryStory,
    heroColor: row.heroColor,
    accentColor: row.accentColor,
    badgeColor: row.badgeColor ?? undefined,
    packSizes: row.packSizes as unknown as Product['packSizes'],
    defaultWeight: row.defaultWeight,
    defaultPrice: row.defaultPrice,
    compareAtPrice: row.compareAtPrice ?? undefined,
    rating: row.rating,
    reviewCount: row.reviewCount,
    makesText: row.makesText,
    badges: row.badges as string[],
    ingredients: row.ingredients as string[],
    verifiedNutrition: row.verifiedNutrition as unknown as Product['verifiedNutrition'],
    preparationSteps: row.preparationSteps as unknown as Product['preparationSteps'],
    cookingTimeMinutes: row.cookingTimeMinutes,
    difficulty: row.difficulty as Product['difficulty'],
    servingSuggestion: row.servingSuggestion,
    pairingChutney: row.pairingChutney,
    allergens: row.allergens as string[],
    shelfLife: row.shelfLife,
    moodTags: row.moodTags as Product['moodTags'],
    isBestseller: row.isBestseller,
    isFeatured: row.isFeatured,
    isNew: row.isNew,
    inStock: row.inStock,
    stockCount: row.stockCount,
    imageUrl: row.imageUrl ?? undefined,
  };
}

export type ProductQuery = {
  category?: string | null;
  mood?: string | null;
  dietary?: string | null;
  q?: string | null;
};

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  const list = rows.map(mapDbProduct);

  const category = query.category && query.category !== 'all' ? query.category : null;
  const mood = query.mood && query.mood !== 'all' ? query.mood : null;
  const q = query.q?.trim().toLowerCase() ?? '';

  return list.filter((product) => {
    if (category && product.category !== category) return false;
    if (mood && !product.moodTags.includes(mood as Product['moodTags'][number])) return false;
    if (q) {
      const hay = [
        product.name,
        product.gujaratiName,
        product.hindiName ?? '',
        product.tagline,
        ...product.ingredients,
        ...product.badges,
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  return row ? mapDbProduct(row) : null;
}

export function mapDbCategory(row: DbCategory): Category {
  return {
    id: row.id as Category['id'],
    name: row.name,
    gujaratiName: row.gujaratiName,
    description: row.description,
    color: row.color,
    tagline: row.tagline,
    sortOrder: row.sortOrder,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map(mapDbCategory);
}

export const FREE_SHIPPING_THRESHOLD = 499;
export const PAID_SHIPPING = 49;

function defaultPackPrice(product: Product) {
  const pack = product.packSizes.find((item) => item.isDefault) ?? product.packSizes[0];
  return {
    weight: pack?.weight ?? product.defaultWeight,
    price: pack?.price ?? product.defaultPrice,
    makesText: product.makesText,
    heroColor: product.heroColor,
  };
}

export async function getPublicCombos(activeOnly = true): Promise<PublicCombo[]> {
  const rows = await prisma.combo.findMany({
    where: activeOnly ? { active: true } : undefined,
    include: { items: { include: { product: true } } },
    orderBy: { sortOrder: 'asc' },
  });

  return rows
    .map((combo) => {
      const items = combo.items
        .map((item) => {
          const product = mapDbProduct(item.product);
          const pack = defaultPackPrice(product);
          return {
            productId: product.id,
            quantity: item.quantity,
            name: product.name,
            slug: product.slug,
            imageUrl: product.imageUrl,
            weight: pack.weight,
            price: pack.price,
            makesText: pack.makesText,
            heroColor: pack.heroColor,
            gujaratiName: product.gujaratiName,
          };
        })
        .filter((item) => item.price > 0);
      const compareAtPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount =
        compareAtPrice > combo.price ? Math.round(((compareAtPrice - combo.price) / compareAtPrice) * 100) : 0;
      return {
        id: combo.id,
        name: combo.name,
        tagline: combo.tagline,
        price: combo.price,
        compareAtPrice,
        discount,
        sortOrder: combo.sortOrder,
        items,
      };
    })
    .filter((combo) => combo.items.length > 0);
}
