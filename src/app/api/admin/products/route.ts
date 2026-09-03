import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';
import { mapDbProduct } from '@/lib/catalog';
import type { Product } from '@/types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function categoryName(id: string) {
  return (await prisma.category.findUnique({ where: { id } }))?.name ?? id;
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const rows = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json({ products: rows.map(mapDbProduct) });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as Partial<Product> & { id?: string };
  const name = String(body?.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  const id = String(body.id || slugify(name));
  const slug = String(body.slug || slugify(name));
  const packSizes = Array.isArray(body.packSizes) && body.packSizes.length
    ? body.packSizes
    : [{ weight: '200g', price: 65, sku: `${id.toUpperCase()}-200`, isDefault: true, stock: 0 }];
  const defaultPack = packSizes.find((p) => p.isDefault) ?? packSizes[0];
  const stockCount = packSizes.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
  const product = await prisma.product.create({
    data: {
      id,
      slug,
      name,
      gujaratiName: body.gujaratiName || name,
      hindiName: body.hindiName || null,
      category: body.category || 'instant-mixes',
      categoryName: await categoryName(body.category || 'instant-mixes'),
      tagline: body.tagline || '',
      description: body.description || '',
      culinaryStory: body.culinaryStory || '',
      heroColor: body.heroColor || '#C90018',
      accentColor: body.accentColor || '#F4C400',
      badgeColor: body.badgeColor || null,
      packSizes: JSON.parse(JSON.stringify(packSizes)),
      defaultWeight: defaultPack.weight,
      defaultPrice: defaultPack.price,
      compareAtPrice: body.compareAtPrice ?? null,
      rating: Number(body.rating ?? 5),
      reviewCount: Number(body.reviewCount ?? 0),
      makesText: body.makesText || '',
      badges: JSON.parse(JSON.stringify(body.badges ?? [])),
      ingredients: JSON.parse(JSON.stringify(body.ingredients ?? [])),
      verifiedNutrition: JSON.parse(JSON.stringify(body.verifiedNutrition ?? [])),
      preparationSteps: JSON.parse(JSON.stringify(body.preparationSteps ?? [])),
      cookingTimeMinutes: Number(body.cookingTimeMinutes ?? 15),
      difficulty: body.difficulty || 'Easy',
      servingSuggestion: body.servingSuggestion || '',
      pairingChutney: body.pairingChutney || '',
      allergens: JSON.parse(JSON.stringify(body.allergens ?? [])),
      shelfLife: body.shelfLife || '9 Months',
      moodTags: JSON.parse(JSON.stringify(body.moodTags ?? [])),
      isBestseller: Boolean(body.isBestseller),
      isFeatured: Boolean(body.isFeatured),
      isNew: Boolean(body.isNew),
      inStock: body.inStock !== false,
      stockCount,
      imageUrl: body.imageUrl || null,
    },
  });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ product: mapDbProduct(product) });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const body = (await request.json().catch(() => null)) as Partial<Product> & { id?: string };
  if (!body?.id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  const packSizes = Array.isArray(body.packSizes) ? body.packSizes : undefined;
  const defaultPack = packSizes?.find((p) => p.isDefault) ?? packSizes?.[0];
  const stockCount = packSizes
    ? packSizes.reduce((sum, p) => sum + Number(p.stock ?? 0), 0)
    : undefined;
  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      slug: body.slug,
      name: body.name,
      gujaratiName: body.gujaratiName,
      hindiName: body.hindiName ?? null,
      category: body.category,
      categoryName: body.category ? await categoryName(body.category) : undefined,
      tagline: body.tagline,
      description: body.description,
      culinaryStory: body.culinaryStory,
      heroColor: body.heroColor,
      accentColor: body.accentColor,
      badgeColor: body.badgeColor ?? null,
      packSizes: packSizes ? JSON.parse(JSON.stringify(packSizes)) : undefined,
      defaultWeight: defaultPack?.weight,
      defaultPrice: defaultPack?.price,
      compareAtPrice: body.compareAtPrice ?? null,
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : undefined,
      makesText: body.makesText,
      badges: body.badges,
      ingredients: body.ingredients,
      verifiedNutrition: body.verifiedNutrition ? JSON.parse(JSON.stringify(body.verifiedNutrition)) : undefined,
      preparationSteps: body.preparationSteps ? JSON.parse(JSON.stringify(body.preparationSteps)) : undefined,
      cookingTimeMinutes: body.cookingTimeMinutes !== undefined ? Number(body.cookingTimeMinutes) : undefined,
      difficulty: body.difficulty,
      servingSuggestion: body.servingSuggestion,
      pairingChutney: body.pairingChutney,
      allergens: body.allergens,
      shelfLife: body.shelfLife,
      moodTags: body.moodTags,
      isBestseller: body.isBestseller,
      isFeatured: body.isFeatured,
      isNew: body.isNew,
      inStock: body.inStock,
      stockCount,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl || null : undefined,
    },
  });
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/product/${product.slug}`);
  return NextResponse.json({ product: mapDbProduct(product) });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/shop');
  return NextResponse.json({ ok: true });
}
