'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Recipe } from '@/types';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const load = () =>
    fetch('/api/admin/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data.recipes || []));

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this recipe?')) return;
    await fetch(`/api/admin/recipes?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Recipes</h1>
          <p className="mt-1 text-sm text-gray-600">Write recipes and link them to mixes.</p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="btn-vibrant-cta rounded-full px-5 py-2.5 text-center text-xs font-black uppercase"
        >
          New recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="rounded-3xl border border-[#EADFCB] bg-white px-5 py-10 text-center text-sm text-gray-500">
          No recipes yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#EADFCB] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FCFAF5] text-[11px] font-black uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Primary mix</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-t border-[#EADFCB]">
                  <td className="px-4 py-3 font-semibold">{recipe.title}</td>
                  <td className="px-4 py-3 text-gray-500">{recipe.slug}</td>
                  <td className="px-4 py-3">{recipe.productName || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                        recipe.published === false
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {recipe.published === false ? 'Draft' : 'Published'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/recipes/${recipe.id}`} className="mr-3 text-xs font-black uppercase text-[#C90018]">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(recipe.id)}
                      className="text-xs font-black uppercase text-gray-400 hover:text-[#C90018]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
