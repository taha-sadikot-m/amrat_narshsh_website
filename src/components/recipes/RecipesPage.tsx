'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChefHat, Clock, Leaf, Package, Soup, UtensilsCrossed, Users } from 'lucide-react';
import { RECIPES } from '../../data/recipes';

export const RecipesPage: React.FC = () => {
  return (
    <main id="recipes-page" className="bg-[#FFFBF5] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="flex items-center justify-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#D46A1E]">
          <UtensilsCrossed className="h-3.5 w-3.5" />
          {RECIPES.length} recipes
        </p>
        <h1 className="font-display mt-2 text-center text-[2rem] font-bold text-[#3E2723] sm:text-[2.4rem]">
          Recipes
        </h1>
        <p className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-1.5 text-center text-sm text-[#8D6E63]">
          <Leaf className="h-4 w-4 shrink-0 text-[#2E7D32]" />
          All vegetarian, made with Amrat Narsih mixes.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECIPES.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#F0E4D0] bg-white shadow-[0_2px_12px_rgba(62,39,35,0.07)] transition-all duration-200 hover:-translate-y-1 hover:border-[#D46A1E] hover:shadow-[0_12px_28px_rgba(62,39,35,0.12)]"
            >
              <div className="relative h-48 overflow-hidden bg-[#FFF3E0]">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6F3E24]">
                  <Soup className="h-3 w-3 text-[#D46A1E]" />
                  {recipe.category}
                </span>
              </div>
              <div className="space-y-2 p-4">
                <h2 className="font-display text-lg font-bold text-[#3E2723]">{recipe.title}</h2>
                <p className="font-gujarati text-sm text-[#8D6E63]">{recipe.gujaratiTitle}</p>
                <p className="line-clamp-2 text-sm text-[#6D584F]">{recipe.description}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs font-semibold text-[#8D6E63]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#D46A1E]" />
                    {recipe.totalTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ChefHat className="h-3.5 w-3.5 text-[#D46A1E]" />
                    {recipe.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-[#D46A1E]" />
                    {recipe.servings}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#F0E4D0] pt-2.5 text-xs font-bold">
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-[#D46A1E]">
                    <Package className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{recipe.productName}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#D46A1E] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
