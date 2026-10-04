'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LEFTOVER_RECIPES } from '../../data/leftovers';
import { PANTRY_ITEMS, rescueLeftovers, type PantryId } from '../../lib/leftovers';

const pantryLabel = (id: PantryId) => PANTRY_ITEMS.find((item) => item.id === id)?.label ?? id;

export function LeftoverRescuePage() {
  const [selected, setSelected] = useState<PantryId[]>([]);
  const result = useMemo(() => rescueLeftovers(selected, LEFTOVER_RECIPES), [selected]);

  const toggle = (id: PantryId) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <main id="leftover-rescue-page" className="bg-[#FFFBF5] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D46A1E]">Leftover Rescue</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#3E2723]">What is left in the fridge?</h1>
        <p className="mt-3 text-[#8D6E63]">Tick what you already have. We will show the premix that turns it into a snack.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {PANTRY_ITEMS.map((item) => {
            const on = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  on ? 'bg-[#D46A1E] text-white' : 'bg-white text-[#3E2723] ring-1 ring-[#F0E4D0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {selected.length === 0 ? (
          <p className="mt-8 text-sm text-[#8D6E63]">Tick at least one ingredient to see a snack.</p>
        ) : null}

        {result.matches.length > 0 && (
          <ul className="mt-8 space-y-3">
            {result.matches.map((recipe) => (
              <li key={recipe.slug} className="rounded-2xl bg-white p-5 ring-1 ring-[#F0E4D0]">
                <p className="font-semibold text-[#3E2723]">{recipe.title}</p>
                <div className="mt-3 flex gap-4 text-sm font-bold text-[#D46A1E]">
                  <Link href={`/recipes/${recipe.slug}`}>Open recipe</Link>
                  <Link href={`/product/${recipe.productId}`}>Get the mix</Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        {selected.length > 0 && result.matches.length === 0 && result.suggestion && (
          <p className="mt-8 rounded-2xl bg-white p-5 text-sm text-[#3E2723] ring-1 ring-[#F0E4D0]">
            Add {pantryLabel(result.suggestion.pantry).toLowerCase()} and you can make {result.suggestion.recipe.title}.
          </p>
        )}

        {selected.length > 0 && result.matches.length === 0 && !result.suggestion && (
          <p className="mt-8 text-sm text-[#8D6E63]">None of the current recipes use that combination.</p>
        )}
      </div>
    </main>
  );
}
