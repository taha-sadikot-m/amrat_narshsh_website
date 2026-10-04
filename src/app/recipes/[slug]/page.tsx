import { notFound } from 'next/navigation';
import { RecipeDetailPage } from '../../../components/recipes/RecipeDetailPage';
import { getRecipeBySlug, getRelatedRecipes } from '../../../lib/recipes';
import { prisma } from '../../../lib/prisma';
import { rankForks } from '../../../lib/recipe-forks';
import { getCustomerSession } from '../../../lib/customer-auth';

function asStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function asSteps(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((step) => {
    const row = step as { instruction?: string; tip?: string };
    return { instruction: String(row.instruction ?? ''), ...(row.tip ? { tip: String(row.tip) } : {}) };
  });
}

export default async function RecipeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();
  const [related, rows, customer] = await Promise.all([
    getRelatedRecipes(recipe),
    prisma.recipeFork.findMany({
      where: { recipeId: recipe.id },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    }),
    getCustomerSession(),
  ]);
  const forks = rankForks(rows).map((fork) => ({
    id: fork.id,
    title: fork.title,
    steps: asSteps(fork.steps),
    chefTips: asStringList(fork.chefTips),
    extras: asStringList(fork.extras),
    forkCount: fork.forkCount,
    author: fork.customer.name || 'A customer',
  }));
  return <RecipeDetailPage recipe={recipe} related={related} forks={forks} signedIn={Boolean(customer)} />;
}
