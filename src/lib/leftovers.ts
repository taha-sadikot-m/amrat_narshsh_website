export const PANTRY_ITEMS = [
  { id: 'rice', label: 'Leftover rice' },
  { id: 'onion', label: 'Half an onion' },
  { id: 'potato', label: 'Potato' },
  { id: 'curd', label: 'Curd' },
  { id: 'bread', label: 'Stale bread' },
  { id: 'chilli', label: 'Green chilli' },
] as const;

export type PantryId = (typeof PANTRY_ITEMS)[number]['id'];

export type LeftoverRecipe = {
  slug: string;
  title: string;
  productId: string;
  required: readonly PantryId[];
};

export function rescueLeftovers(selected: readonly PantryId[], recipes: readonly LeftoverRecipe[]) {
  if (selected.length === 0) return { matches: [] as LeftoverRecipe[], suggestion: null };

  const chosen = new Set(selected);
  const matches = recipes.filter((recipe) => recipe.required.every((item) => chosen.has(item)));
  if (matches.length > 0) return { matches: [...matches], suggestion: null };

  const almost = recipes
    .map((recipe) => ({
      recipe,
      missing: recipe.required.filter((item) => !chosen.has(item)),
      overlap: recipe.required.some((item) => chosen.has(item)),
    }))
    .filter((entry) => entry.missing.length === 1)
    .sort((a, b) => Number(b.overlap) - Number(a.overlap));

  const next = almost[0];
  if (!next) return { matches: [], suggestion: null };
  return {
    matches: [],
    suggestion: { pantry: next.missing[0], recipe: next.recipe },
  };
}
