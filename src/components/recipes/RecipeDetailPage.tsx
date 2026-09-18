'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChefHat,
  Clock,
  CookingPot,
  Lightbulb,
  ListChecks,
  type LucideIcon,
  Package,
  ShoppingBag,
  Soup,
  Sparkles,
  Timer,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import type { Recipe } from '../../types';
import { ProductPackshot } from '../../data/brandAssets';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="font-display flex items-center gap-2.5 text-xl font-bold text-[#3E2723]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E0] text-[#D46A1E]">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}

export const RecipeDetailPage: React.FC<{ recipe: Recipe; related?: Recipe[] }> = ({ recipe, related = [] }) => {
  const { products, showToast, navigateTo } = useStore();
  const { addItem } = useCart();
  const mixIds = [recipe.productId, ...(recipe.extraProductIds ?? [])];
  const mixes = mixIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const addMix = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const pack = product.packSizes.find((item) => item.isDefault) ?? product.packSizes[0];
    addItem({
      productId: product.id,
      name: product.name,
      gujaratiName: product.gujaratiName,
      weight: pack?.weight ?? product.defaultWeight,
      price: pack?.price ?? product.defaultPrice,
      quantity: 1,
      heroColor: product.heroColor,
      makesText: product.makesText,
    });
    showToast('Added to Basket', `${product.name} is in your basket.`, 'success');
  };

  return (
    <article id="recipe-detail-page" className="bg-[#FFFBF5] pb-16">
      <div className="relative h-[280px] overflow-hidden sm:h-[380px] lg:h-[460px]">
        <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <Link href="/recipes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            All recipes
          </Link>
          <p className="mt-3 flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#F5A623]">
            <Soup className="h-3.5 w-3.5" />
            {recipe.category}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-white sm:text-5xl">{recipe.title}</h1>
          <p className="font-gujarati mt-1 text-lg text-white/80">{recipe.gujaratiTitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative z-10 -mt-6 flex flex-wrap gap-2">
          {[
            { icon: Clock, label: recipe.totalTime },
            { icon: ChefHat, label: recipe.difficulty },
            { icon: Users, label: recipe.servings },
          ].map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E4D0] bg-white px-3 py-1.5 text-xs font-bold text-[#6F3E24] shadow-sm"
            >
              <chip.icon className="h-3.5 w-3.5 text-[#D46A1E]" />
              {chip.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E0] px-3 py-1.5 text-xs font-bold text-[#D46A1E]">
            <Timer className="h-3.5 w-3.5" />
            Prep {recipe.prepTime} · Cook {recipe.cookTime}
          </span>
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[#6D584F]">{recipe.description}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-3xl border border-[#F0E4D0] bg-white p-6">
            <SectionHeading icon={ListChecks}>Ingredients</SectionHeading>
            <div className="mt-4 space-y-5">
              {recipe.ingredients.map((group) => (
                <div key={group.sectionTitle ?? group.items[0]}>
                  {group.sectionTitle && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#D46A1E]">{group.sectionTitle}</p>
                  )}
                  <ul className="mt-2 space-y-1.5 text-sm text-[#3E2723]">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D46A1E]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 flex gap-2 border-t border-[#F0E4D0] pt-4 text-sm text-[#6D584F]">
              <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-[#D46A1E]" />
              <span>
                <span className="font-bold text-[#3E2723]">Serve with: </span>
                {recipe.pairing}
              </span>
            </p>
          </section>

          <section>
            <SectionHeading icon={CookingPot}>Method</SectionHeading>
            <ol className="mt-4 space-y-4">
              {recipe.steps.map((step) => (
                <li key={step.stepNumber} className="flex gap-4 rounded-2xl border border-[#F0E4D0] bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D46A1E] text-sm font-bold text-white">
                    {step.stepNumber}
                  </span>
                  <div>
                    <p className="text-sm leading-relaxed text-[#3E2723]">{step.instruction}</p>
                    {step.tip && (
                      <p className="mt-2 flex gap-1.5 text-xs font-medium text-[#D46A1E]">
                        <Lightbulb className="mt-px h-3.5 w-3.5 shrink-0" />
                        {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {recipe.chefTips.length > 0 && (
              <div className="mt-6 rounded-2xl bg-[#FFF8EC] p-5">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#6F3E24]">
                  <Lightbulb className="h-3.5 w-3.5 text-[#D46A1E]" />
                  Notes
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-[#6D584F]">
                  {recipe.chefTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {mixes.length > 0 && (
          <section className="mt-12 rounded-3xl border border-[#F0E4D0] bg-white p-6">
            <SectionHeading icon={Package}>Mixes used</SectionHeading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {mixes.map((product) => {
                const pack = product.packSizes.find((item) => item.isDefault) ?? product.packSizes[0];
                return (
                  <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-[#F0E4D0] p-3">
                    <div className="h-20 w-16 shrink-0">
                      <ProductPackshot productId={product.id} src={product.imageUrl} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-[#3E2723]">{product.name}</p>
                      <p className="text-xs text-[#8D6E63]">
                        {pack?.weight ?? product.defaultWeight} · ₹{pack?.price ?? product.defaultPrice}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => addMix(product.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#D46A1E] px-3 py-1.5 text-[11px] font-bold text-white"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add mix
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('product-detail', { productId: product.id })}
                          className="text-[11px] font-bold text-[#D46A1E] hover:underline"
                        >
                          View product
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <SectionHeading icon={Sparkles}>More recipes</SectionHeading>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/recipes/${item.slug}`}
                  className="overflow-hidden rounded-2xl border border-[#F0E4D0] bg-white"
                >
                  <img src={item.imageUrl} alt="" className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-display text-sm font-bold text-[#3E2723]">{item.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#8D6E63]">
                      <Clock className="h-3 w-3 text-[#D46A1E]" />
                      {item.totalTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
