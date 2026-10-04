import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomerApi } from '@/lib/customer-auth';
import { getRecipeBySlug } from '@/lib/recipes';
import { ALLOWED_FORK_EXTRAS, rankForks, validateRecipeFork, type ForkStep } from '@/lib/recipe-forks';

function ingredientText(recipe: { ingredients: { items: string[] }[] }) {
  return recipe.ingredients.flatMap((group) => group.items);
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  const forks = await prisma.recipeFork.findMany({
    where: { recipeId: recipe.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const ranked = rankForks(forks).map((fork) => ({
    id: fork.id,
    title: fork.title,
    steps: fork.steps,
    chefTips: fork.chefTips,
    extras: fork.extras,
    forkCount: fork.forkCount,
    author: fork.customer.name || 'A customer',
  }));
  return NextResponse.json({ forks: ranked });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { customer, error } = await requireCustomerApi();
  if (error || !customer) return error;
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const steps = Array.isArray(body?.steps)
    ? body.steps.map((step: ForkStep) => ({
        instruction: String(step?.instruction ?? ''),
        ...(step?.tip ? { tip: String(step.tip) } : {}),
      }))
    : [];
  const chefTips = Array.isArray(body?.chefTips) ? body.chefTips.map((tip: unknown) => String(tip)) : [];
  const extras = Array.isArray(body?.extras) ? body.extras.map((item: unknown) => String(item)) : [];
  const result = validateRecipeFork({
    title: String(body?.title ?? ''),
    steps,
    chefTips,
    extras,
    parentIngredients: ingredientText(recipe),
    allowedExtras: ALLOWED_FORK_EXTRAS,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const parentForkId = body?.parentForkId ? String(body.parentForkId) : null;
  if (parentForkId) {
    const parent = await prisma.recipeFork.findFirst({ where: { id: parentForkId, recipeId: recipe.id } });
    if (!parent) return NextResponse.json({ error: 'Parent fork not found.' }, { status: 404 });
  }

  const fork = await prisma.recipeFork.create({
    data: {
      recipeId: recipe.id,
      customerId: customer.id,
      parentForkId,
      title: String(body.title).trim(),
      steps,
      chefTips,
      extras,
      status: 'pending',
    },
  });
  return NextResponse.json({ fork: { id: fork.id, status: fork.status } }, { status: 201 });
}
