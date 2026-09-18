'use client';

import { RecipeEditor } from '../../../../../components/admin/RecipeEditor';

export default function NewRecipePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black">New recipe</h1>
      <RecipeEditor />
    </div>
  );
}
