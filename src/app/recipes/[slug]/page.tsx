import { notFound } from 'next/navigation';
import { RecipeDetailPage } from '../../../components/recipes/RecipeDetailPage';
import { getRecipeBySlug, RECIPES } from '../../../data/recipes';

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export default async function RecipeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();
  return <RecipeDetailPage recipe={recipe} />;
}
