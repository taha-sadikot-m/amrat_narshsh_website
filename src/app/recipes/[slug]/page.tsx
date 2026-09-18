import { notFound } from 'next/navigation';
import { RecipeDetailPage } from '../../../components/recipes/RecipeDetailPage';
import { getRecipeBySlug, getRelatedRecipes } from '../../../lib/recipes';

export default async function RecipeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();
  const related = await getRelatedRecipes(recipe);
  return <RecipeDetailPage recipe={recipe} related={related} />;
}
