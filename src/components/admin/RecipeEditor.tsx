'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, Recipe, RecipeStep } from '@/types';
import { RecipeDetailPage } from '../recipes/RecipeDetailPage';
import { StoreProvider } from '../../context/StoreContext';
import { CartProvider } from '../../context/CartContext';

type IngredientGroup = Recipe['ingredients'][number];

const emptyGroup = (): IngredientGroup => ({ sectionTitle: '', items: [''] });
const emptyStep = (n: number): RecipeStep => ({ stepNumber: n, instruction: '', tip: '' });

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function RecipeEditor({ initial }: { initial?: Recipe }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [gujaratiTitle, setGujaratiTitle] = useState(initial?.gujaratiTitle ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugLocked, setSlugLocked] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState(initial?.category ?? '');
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>(initial?.difficulty ?? 'Easy');
  const [prepTime, setPrepTime] = useState(initial?.prepTime ?? '');
  const [cookTime, setCookTime] = useState(initial?.cookTime ?? '');
  const [totalTime, setTotalTime] = useState(initial?.totalTime ?? '');
  const [servings, setServings] = useState(initial?.servings ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [pairing, setPairing] = useState(initial?.pairing ?? '');
  const [published, setPublished] = useState(initial?.published !== false);
  const [productId, setProductId] = useState(initial?.productId ?? '');
  const [extraProductIds, setExtraProductIds] = useState<string[]>(initial?.extraProductIds ?? []);
  const [ingredients, setIngredients] = useState<IngredientGroup[]>(
    initial?.ingredients?.length ? initial.ingredients : [emptyGroup()],
  );
  const [steps, setSteps] = useState<RecipeStep[]>(
    initial?.steps?.length ? initial.steps : [emptyStep(1)],
  );
  const [chefTips, setChefTips] = useState<string[]>(initial?.chefTips?.length ? initial.chefTips : ['']);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((response) => response.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const primaryProduct = products.find((product) => product.id === productId);

  const preview: Recipe = useMemo(
    () => ({
      id: initial?.id ?? 'preview',
      title: title || 'Untitled recipe',
      gujaratiTitle,
      slug: slug || 'untitled',
      productId,
      extraProductIds,
      productName: primaryProduct?.name ?? '',
      productSlug: primaryProduct?.slug,
      published,
      imageUrl: imageUrl || '/images/dishes/bhajiya.webp',
      heroDishColor: initial?.heroDishColor ?? '#D46A1E',
      prepTime: prepTime || '0 min',
      cookTime: cookTime || '0 min',
      totalTime: totalTime || '0 min',
      servings: servings || '—',
      difficulty,
      category: category || 'Recipe',
      description,
      ingredients: ingredients
        .map((group) => ({
          sectionTitle: group.sectionTitle || undefined,
          items: group.items.map((item) => item.trim()).filter(Boolean),
        }))
        .filter((group) => group.items.length),
      steps: steps
        .map((step, index) => ({
          stepNumber: index + 1,
          instruction: step.instruction,
          ...(step.tip?.trim() ? { tip: step.tip.trim() } : {}),
        }))
        .filter((step) => step.instruction.trim()),
      chefTips: chefTips.map((tip) => tip.trim()).filter(Boolean),
      pairing,
      tags: initial?.tags ?? [],
    }),
    [
      category,
      chefTips,
      cookTime,
      description,
      difficulty,
      extraProductIds,
      gujaratiTitle,
      imageUrl,
      ingredients,
      initial?.heroDishColor,
      initial?.id,
      initial?.tags,
      pairing,
      prepTime,
      primaryProduct?.name,
      primaryProduct?.slug,
      productId,
      published,
      servings,
      slug,
      steps,
      title,
      totalTime,
    ],
  );

  const upload = async (file: File) => {
    const data = new FormData();
    data.set('file', file);
    data.set('folder', 'recipes');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
    const json = await res.json();
    if (res.ok) setImageUrl(json.url);
    else setStatus(json.error || 'Upload failed');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId) {
      setStatus('Pick a primary mix.');
      return;
    }
    setSaving(true);
    setStatus('');
    const payload = {
      id: initial?.id,
      title,
      gujaratiTitle,
      slug: slug || slugify(title),
      category,
      difficulty,
      prepTime,
      cookTime,
      totalTime,
      servings,
      description,
      imageUrl,
      pairing,
      published,
      productId,
      extraProductIds,
      ingredients: preview.ingredients,
      steps: preview.steps,
      chefTips: preview.chefTips,
      tags: initial?.tags ?? [],
      heroDishColor: initial?.heroDishColor ?? '#D46A1E',
    };
    const res = await fetch('/api/admin/recipes', {
      method: initial ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin/recipes');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(data.error || 'Save failed');
    }
  };

  const field = 'mt-1 w-full rounded-xl border border-[#EADFCB] bg-white px-3 py-2 text-sm';

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold">
            Title
            <input
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugLocked) setSlug(slugify(event.target.value));
              }}
              className={field}
            />
          </label>
          <label className="text-xs font-bold">
            Gujarati title
            <input value={gujaratiTitle} onChange={(event) => setGujaratiTitle(event.target.value)} className={field} />
          </label>
          <label className="text-xs font-bold">
            Slug
            <input
              value={slug}
              onChange={(event) => {
                setSlugLocked(true);
                setSlug(event.target.value);
              }}
              className={field}
            />
          </label>
          <label className="text-xs font-bold">
            Category
            <input value={category} onChange={(event) => setCategory(event.target.value)} className={field} />
          </label>
          <label className="text-xs font-bold">
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Recipe['difficulty'])}
              className={field}
            >
              <option value="Quick">Quick</option>
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
            </select>
          </label>
          <label className="text-xs font-bold">
            Servings
            <input value={servings} onChange={(event) => setServings(event.target.value)} className={field} />
          </label>
          <label className="text-xs font-bold">
            Prep time
            <input value={prepTime} onChange={(event) => setPrepTime(event.target.value)} className={field} />
          </label>
          <label className="text-xs font-bold">
            Cook time
            <input value={cookTime} onChange={(event) => setCookTime(event.target.value)} className={field} />
          </label>
          <label className="text-xs font-bold sm:col-span-2">
            Total time
            <input value={totalTime} onChange={(event) => setTotalTime(event.target.value)} className={field} />
          </label>
        </div>

        <label className="block text-xs font-bold">
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={field} />
        </label>

        <div className="space-y-2">
          <div className="text-xs font-bold">Photo</div>
          {imageUrl && <img src={imageUrl} alt="" className="h-28 w-full rounded-xl object-cover" />}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>

        <label className="block text-xs font-bold">
          Primary mix
          <select required value={productId} onChange={(event) => setProductId(event.target.value)} className={field}>
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="rounded-2xl border border-[#EADFCB] bg-white p-3">
          <legend className="px-1 text-xs font-bold">Extra mixes</legend>
          <div className="grid max-h-48 gap-1.5 overflow-y-auto sm:grid-cols-2">
            {products
              .filter((product) => product.id !== productId)
              .map((product) => (
                <label key={product.id} className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={extraProductIds.includes(product.id)}
                    onChange={() =>
                      setExtraProductIds((current) =>
                        current.includes(product.id)
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id],
                      )
                    }
                  />
                  {product.name}
                </label>
              ))}
          </div>
        </fieldset>

        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Ingredients</div>
          {ingredients.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-3 rounded-2xl border border-[#EADFCB] bg-white p-3">
              <input
                value={group.sectionTitle ?? ''}
                placeholder="Section title"
                onChange={(event) =>
                  setIngredients((current) =>
                    current.map((item, index) =>
                      index === groupIndex ? { ...item, sectionTitle: event.target.value } : item,
                    ),
                  )
                }
                className={`${field} mb-2`}
              />
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-1 flex gap-2">
                  <input
                    value={item}
                    onChange={(event) =>
                      setIngredients((current) =>
                        current.map((groupItem, index) =>
                          index === groupIndex
                            ? {
                                ...groupItem,
                                items: groupItem.items.map((line, lineIndex) =>
                                  lineIndex === itemIndex ? event.target.value : line,
                                ),
                              }
                            : groupItem,
                        ),
                      )
                    }
                    className={field}
                    placeholder="Ingredient"
                  />
                  <button
                    type="button"
                    className="text-xs text-[#C90018]"
                    onClick={() =>
                      setIngredients((current) =>
                        current.map((groupItem, index) =>
                          index === groupIndex
                            ? { ...groupItem, items: groupItem.items.filter((_, lineIndex) => lineIndex !== itemIndex) }
                            : groupItem,
                        ),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  className="text-xs font-bold text-[#C90018]"
                  onClick={() =>
                    setIngredients((current) =>
                      current.map((groupItem, index) =>
                        index === groupIndex ? { ...groupItem, items: [...groupItem.items, ''] } : groupItem,
                      ),
                    )
                  }
                >
                  + Item
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-gray-500"
                  onClick={() => setIngredients((current) => current.filter((_, index) => index !== groupIndex))}
                >
                  Remove group
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-xs font-bold text-[#C90018]" onClick={() => setIngredients((current) => [...current, emptyGroup()])}>
            + Ingredient group
          </button>
        </div>

        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Method</div>
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} className="mb-3 rounded-2xl border border-[#EADFCB] bg-white p-3">
              <p className="text-[11px] font-bold uppercase text-gray-400">Step {stepIndex + 1}</p>
              <textarea
                value={step.instruction}
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item, index) => (index === stepIndex ? { ...item, instruction: event.target.value } : item)),
                  )
                }
                rows={2}
                className={field}
              />
              <input
                value={step.tip ?? ''}
                placeholder="Optional tip"
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item, index) => (index === stepIndex ? { ...item, tip: event.target.value } : item)),
                  )
                }
                className={field}
              />
              <button
                type="button"
                className="mt-2 text-xs text-[#C90018]"
                onClick={() => setSteps((current) => current.filter((_, index) => index !== stepIndex))}
              >
                Remove step
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs font-bold text-[#C90018]"
            onClick={() => setSteps((current) => [...current, emptyStep(current.length + 1)])}
          >
            + Step
          </button>
        </div>

        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Notes</div>
          {chefTips.map((tip, tipIndex) => (
            <div key={tipIndex} className="mb-1 flex gap-2">
              <input
                value={tip}
                onChange={(event) =>
                  setChefTips((current) => current.map((item, index) => (index === tipIndex ? event.target.value : item)))
                }
                className={field}
              />
              <button type="button" className="text-xs text-[#C90018]" onClick={() => setChefTips((current) => current.filter((_, index) => index !== tipIndex))}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="mt-1 text-xs font-bold text-[#C90018]" onClick={() => setChefTips((current) => [...current, ''])}>
            + Note
          </button>
        </div>

        <label className="block text-xs font-bold">
          Serve with
          <input value={pairing} onChange={(event) => setPairing(event.target.value)} className={field} />
        </label>

        <label className="flex items-center gap-2 text-xs font-bold">
          <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
          Published
        </label>

        <button type="submit" disabled={saving} className="btn-vibrant-cta rounded-2xl px-6 py-3 text-xs font-black uppercase">
          {saving ? 'Saving…' : 'Save recipe'}
        </button>
        {status && <p className="text-xs text-[#C90018]">{status}</p>}
      </div>

      <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-400">Preview</p>
        <div className="overflow-hidden rounded-2xl border border-[#EADFCB] bg-white">
          <Suspense fallback={<p className="p-6 text-sm text-gray-500">Loading preview…</p>}>
            <StoreProvider products={products} categories={[]}>
              <CartProvider>
                <RecipeDetailPage recipe={preview} related={[]} />
              </CartProvider>
            </StoreProvider>
          </Suspense>
        </div>
      </div>
    </form>
  );
}
