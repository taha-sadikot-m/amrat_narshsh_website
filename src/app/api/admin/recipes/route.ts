import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';
import { getRecipeById, mapDbRecipe, recipeInclude, slugifyRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types';

type RecipeBody = Partial<Recipe> & {
  id?: string;
  extraProductIds?: string[];
  published?: boolean;
  sortOrder?: number;
};

function json(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? []));
}

async function linkedSlugs(productIds: string[]) {
  if (!productIds.length) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { slug: true },
  });
  return products.map((product) => product.slug);
}

function revalidateRecipe(slug: string, productSlugs: string[]) {
  revalidatePath('/');
  revalidatePath('/recipes');
  revalidatePath(`/recipes/${slug}`);
  for (const productSlug of productSlugs) {
    revalidatePath(`/product/${productSlug}`);
  }
}

function parseProducts(body: RecipeBody | null) {
  const primary = String(body?.productId ?? '').trim();
  const extras = Array.isArray(body?.extraProductIds)
    ? [...new Set(body.extraProductIds.map((id) => String(id).trim()).filter(Boolean))]
    : [];
  return { primary, extras: extras.filter((id) => id !== primary) };
}

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const recipe = await getRecipeById(id);
    if (!recipe) return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 });
    return NextResponse.json({ recipe });
  }
  const rows = await prisma.recipe.findMany({
    include: recipeInclude,
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
  return NextResponse.json({ recipes: rows.map(mapDbRecipe) });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as RecipeBody | null;
  const title = String(body?.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
  const { primary, extras } = parseProducts(body);
  if (!primary) return NextResponse.json({ error: 'Pick a primary mix.' }, { status: 400 });
  const productIds = [primary, ...extras];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products were not found.' }, { status: 400 });
  }
  const slug = String(body?.slug || slugifyRecipe(title)).trim() || slugifyRecipe(title);
  const id = String(body?.id || slug).trim() || slug;
  const count = await prisma.recipe.count();
  const recipe = await prisma.recipe.create({
    data: {
      id,
      slug,
      title,
      gujaratiTitle: String(body?.gujaratiTitle ?? '').trim(),
      imageUrl: String(body?.imageUrl ?? '').trim(),
      heroDishColor: String(body?.heroDishColor ?? '#D46A1E'),
      prepTime: String(body?.prepTime ?? '').trim(),
      cookTime: String(body?.cookTime ?? '').trim(),
      totalTime: String(body?.totalTime ?? '').trim(),
      servings: String(body?.servings ?? '').trim(),
      difficulty: body?.difficulty || 'Easy',
      category: String(body?.category ?? '').trim(),
      description: String(body?.description ?? '').trim(),
      ingredients: json(body?.ingredients ?? []),
      steps: json(body?.steps ?? []),
      chefTips: json(body?.chefTips ?? []),
      pairing: String(body?.pairing ?? '').trim(),
      tags: json(body?.tags ?? []),
      published: body?.published !== false,
      sortOrder: Number.isFinite(Number(body?.sortOrder)) ? Number(body?.sortOrder) : count,
      products: {
        create: productIds.map((productId, index) => ({
          productId,
          isPrimary: index === 0,
        })),
      },
    },
    include: recipeInclude,
  });
  revalidateRecipe(recipe.slug, await linkedSlugs(productIds));
  return NextResponse.json({ recipe: mapDbRecipe(recipe) });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as RecipeBody | null;
  const id = String(body?.id ?? '').trim();
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const existing = await prisma.recipe.findUnique({
    where: { id },
    include: { products: { include: { product: { select: { slug: true } } } } },
  });
  if (!existing) return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 });

  const title = String(body?.title ?? existing.title).trim();
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
  const { primary, extras } = parseProducts(body);
  if (!primary) return NextResponse.json({ error: 'Pick a primary mix.' }, { status: 400 });
  const productIds = [primary, ...extras];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products were not found.' }, { status: 400 });
  }

  const slug = String(body?.slug || existing.slug).trim();
  await prisma.recipeProduct.deleteMany({ where: { recipeId: id } });
  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      slug,
      title,
      gujaratiTitle: String(body?.gujaratiTitle ?? '').trim(),
      imageUrl: String(body?.imageUrl ?? '').trim(),
      heroDishColor: String(body?.heroDishColor ?? existing.heroDishColor),
      prepTime: String(body?.prepTime ?? '').trim(),
      cookTime: String(body?.cookTime ?? '').trim(),
      totalTime: String(body?.totalTime ?? '').trim(),
      servings: String(body?.servings ?? '').trim(),
      difficulty: body?.difficulty || existing.difficulty,
      category: String(body?.category ?? '').trim(),
      description: String(body?.description ?? '').trim(),
      ingredients: json(body?.ingredients ?? existing.ingredients),
      steps: json(body?.steps ?? existing.steps),
      chefTips: json(body?.chefTips ?? existing.chefTips),
      pairing: String(body?.pairing ?? '').trim(),
      tags: json(body?.tags ?? existing.tags),
      published: body?.published !== false,
      products: {
        create: productIds.map((productId, index) => ({
          productId,
          isPrimary: index === 0,
        })),
      },
    },
    include: recipeInclude,
  });
  const oldSlugs = existing.products.map((item) => item.product.slug);
  revalidateRecipe(existing.slug, oldSlugs);
  revalidateRecipe(recipe.slug, await linkedSlugs(productIds));
  return NextResponse.json({ recipe: mapDbRecipe(recipe) });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const existing = await prisma.recipe.findUnique({
    where: { id },
    include: { products: { include: { product: { select: { slug: true } } } } },
  });
  if (!existing) return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 });
  await prisma.recipe.delete({ where: { id } });
  revalidateRecipe(
    existing.slug,
    existing.products.map((item) => item.product.slug),
  );
  return NextResponse.json({ ok: true });
}
