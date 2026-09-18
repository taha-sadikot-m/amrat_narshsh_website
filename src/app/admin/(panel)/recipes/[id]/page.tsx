'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RecipeEditor } from '../../../../../components/admin/RecipeEditor';
import type { Recipe } from '@/types';

export default function EditRecipePage() {
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/recipes?id=${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recipe) setRecipe(data.recipe);
        else setMissing(true);
      })
      .catch(() => setMissing(true));
  }, [params.id]);

  if (missing) return <p className="text-sm">Recipe not found.</p>;
  if (!recipe) return <p className="text-sm">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black">Edit {recipe.title}</h1>
      <RecipeEditor initial={recipe} />
    </div>
  );
}
