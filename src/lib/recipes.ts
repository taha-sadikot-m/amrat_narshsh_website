import type { Prisma } from '@prisma/client';
import type { Recipe, RecipeStep } from '../types';
import { prisma } from './prisma';

export const recipeInclude = {
  products: {
    include: { product: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ isPrimary: 'desc' as const }, { productId: 'asc' as const }],
  },
} satisfies Prisma.RecipeInclude;

type RecipeRow = Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>;

function asIngredientGroups(value: unknown): Recipe['ingredients'] {
  if (!Array.isArray(value)) return [];
  return value.map((group) => {
    const row = group as { sectionTitle?: string; items?: unknown };
    return {
      sectionTitle: row.sectionTitle ? String(row.sectionTitle) : undefined,
      items: Array.isArray(row.items) ? row.items.map((item) => String(item)) : [],
    };
  });
}

function asSteps(value: unknown): RecipeStep[] {
  if (!Array.isArray(value)) return [];
  return value.map((step, index) => {
    const row = step as { stepNumber?: number; instruction?: string; tip?: string };
    return {
      stepNumber: Number(row.stepNumber ?? index + 1),
      instruction: String(row.instruction ?? ''),
      ...(row.tip ? { tip: String(row.tip) } : {}),
    };
  });
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export function mapDbRecipe(row: RecipeRow): Recipe {
  const primary = row.products.find((item) => item.isPrimary) ?? row.products[0];
  const extras = row.products.filter((item) => item.productId !== primary?.productId);
  const difficulty = row.difficulty === 'Intermediate' || row.difficulty === 'Quick' ? row.difficulty : 'Easy';
  return {
    id: row.id,
    title: row.title,
    gujaratiTitle: row.gujaratiTitle,
    slug: row.slug,
    productId: primary?.productId ?? '',
    extraProductIds: extras.map((item) => item.productId),
    productName: primary?.product.name ?? '',
    productSlug: primary?.product.slug,
    published: row.published,
    imageUrl: row.imageUrl,
    heroDishColor: row.heroDishColor,
    prepTime: row.prepTime,
    cookTime: row.cookTime,
    totalTime: row.totalTime,
    servings: row.servings,
    difficulty,
    category: row.category,
    description: row.description,
    ingredients: asIngredientGroups(row.ingredients),
    steps: asSteps(row.steps),
    chefTips: asStringArray(row.chefTips),
    pairing: row.pairing,
    tags: asStringArray(row.tags),
  };
}

export async function getRecipes(options: { publishedOnly?: boolean } = {}): Promise<Recipe[]> {
  const publishedOnly = options.publishedOnly !== false;
  const rows = await prisma.recipe.findMany({
    where: publishedOnly ? { published: true } : undefined,
    include: recipeInclude,
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
  return rows.map(mapDbRecipe);
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const row = await prisma.recipe.findUnique({
    where: { slug },
    include: recipeInclude,
  });
  if (!row || !row.published) return null;
  return mapDbRecipe(row);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const row = await prisma.recipe.findUnique({
    where: { id },
    include: recipeInclude,
  });
  return row ? mapDbRecipe(row) : null;
}

export async function getRecipesByProductId(productId: string): Promise<Recipe[]> {
  const rows = await prisma.recipe.findMany({
    where: { published: true, products: { some: { productId } } },
    include: recipeInclude,
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
  return rows.map(mapDbRecipe);
}

export async function getRelatedRecipes(recipe: Recipe, limit = 3): Promise<Recipe[]> {
  const linkedIds = [recipe.productId, ...(recipe.extraProductIds ?? [])].filter(Boolean);
  const or: Prisma.RecipeWhereInput[] = [{ category: recipe.category }];
  if (linkedIds.length) {
    or.push({ products: { some: { productId: { in: linkedIds } } } });
  }
  const same = await prisma.recipe.findMany({
    where: {
      published: true,
      id: { not: recipe.id },
      OR: or,
    },
    include: recipeInclude,
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    take: limit,
  });
  if (same.length >= limit) return same.map(mapDbRecipe);
  const rest = await prisma.recipe.findMany({
    where: { published: true, id: { notIn: [recipe.id, ...same.map((item) => item.id)] } },
    include: recipeInclude,
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    take: limit - same.length,
  });
  return [...same, ...rest].map(mapDbRecipe);
}

export function slugifyRecipe(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
