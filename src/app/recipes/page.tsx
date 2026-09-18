import { RecipesPage } from '../../components/recipes/RecipesPage';
import { getRecipes } from '../../lib/recipes';

export default async function RecipesRoute() {
  const recipes = await getRecipes({ publishedOnly: true });
  return <RecipesPage recipes={recipes} />;
}
