'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Category,
  HowToPrepareStep,
  MoodTag,
  NutritionItem,
  Product,
  ProductPackSize,
} from '@/types';

const MOODS: MoodTag[] = [
  'crispy',
  'savoury',
  'sweet',
  'breakfast',
  'evening-snack',
  'fast-easy',
  'festive',
  'gluten-free',
  'traditional',
];

const inputClass = 'mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white text-sm font-medium';

const emptyPack = (): ProductPackSize => ({
  weight: '200g',
  price: 65,
  sku: '',
  isDefault: true,
  stock: 50,
});

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProductEditor({ initial }: { initial?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [gujaratiName, setGujaratiName] = useState(initial?.gujaratiName ?? '');
  const [hindiName, setHindiName] = useState(initial?.hindiName ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'instant-mixes');
  const [tagline, setTagline] = useState(initial?.tagline ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [culinaryStory, setCulinaryStory] = useState(initial?.culinaryStory ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [heroColor, setHeroColor] = useState(initial?.heroColor ?? '#C90018');
  const [accentColor, setAccentColor] = useState(initial?.accentColor ?? '#F4C400');
  const [badgeColor, setBadgeColor] = useState(initial?.badgeColor ?? '');
  const [makesText, setMakesText] = useState(initial?.makesText ?? '');
  const [badges, setBadges] = useState((initial?.badges ?? []).join(', '));
  const [ingredients, setIngredients] = useState((initial?.ingredients ?? []).join('\n'));
  const [allergens, setAllergens] = useState((initial?.allergens ?? []).join(', '));
  const [moodTags, setMoodTags] = useState<MoodTag[]>(initial?.moodTags ?? []);
  const [nutrition, setNutrition] = useState<NutritionItem[]>(
    initial?.verifiedNutrition?.length ? initial.verifiedNutrition : [{ name: '', amount: '', dailyValue: '' }],
  );
  const [steps, setSteps] = useState<HowToPrepareStep[]>(
    initial?.preparationSteps?.length
      ? initial.preparationSteps
      : [{ step: 1, title: '', description: '', duration: '' }],
  );
  const [cookingTimeMinutes, setCookingTimeMinutes] = useState(initial?.cookingTimeMinutes ?? 15);
  const [difficulty, setDifficulty] = useState<Product['difficulty']>(initial?.difficulty ?? 'Easy');
  const [servingSuggestion, setServingSuggestion] = useState(initial?.servingSuggestion ?? '');
  const [pairingChutney, setPairingChutney] = useState(initial?.pairingChutney ?? '');
  const [shelfLife, setShelfLife] = useState(initial?.shelfLife ?? '9 Months');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isBestseller, setIsBestseller] = useState(initial?.isBestseller ?? false);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [packs, setPacks] = useState<ProductPackSize[]>(initial?.packSizes?.length ? initial.packSizes : [emptyPack()]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const upload = async (file: File) => {
    const data = new FormData();
    data.set('file', file);
    data.set('folder', 'products');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
    const json = await res.json();
    if (res.ok) setImageUrl(json.url);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: initial?.id,
      name,
      gujaratiName,
      hindiName: hindiName.trim() || null,
      slug,
      category,
      tagline,
      description,
      culinaryStory,
      imageUrl,
      heroColor,
      accentColor,
      badgeColor: badgeColor.trim() || null,
      makesText,
      badges: splitList(badges),
      ingredients: ingredients
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      allergens: splitList(allergens),
      moodTags,
      verifiedNutrition: nutrition.filter((row) => row.name.trim() && row.amount.trim()),
      preparationSteps: steps
        .filter((row) => row.title.trim() || row.description.trim())
        .map((row, index) => ({ ...row, step: index + 1 })),
      cookingTimeMinutes,
      difficulty,
      servingSuggestion,
      pairingChutney,
      shelfLife,
      inStock,
      isBestseller,
      isFeatured,
      isNew,
      packSizes: packs,
      rating: initial?.rating ?? 5,
      reviewCount: initial?.reviewCount ?? 0,
    };
    const res = await fetch('/api/admin/products', {
      method: initial ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      const data = await res.json();
      setStatus(data.error || 'Save failed');
    }
  };

  return (
    <form onSubmit={save} className="space-y-5 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-xs font-bold">Name<input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Gujarati name<input value={gujaratiName} onChange={(e) => setGujaratiName(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Hindi name<input value={hindiName} onChange={(e) => setHindiName(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Slug<input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">Makes text<input value={makesText} onChange={(e) => setMakesText(e.target.value)} className={inputClass} /></label>
      </div>
      <label className="text-xs font-bold block">Tagline<input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} /></label>
      <label className="text-xs font-bold block">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} /></label>
      <label className="text-xs font-bold block">Culinary story<textarea value={culinaryStory} onChange={(e) => setCulinaryStory(e.target.value)} rows={3} className={inputClass} /></label>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="text-xs font-bold">Hero color<input value={heroColor} onChange={(e) => setHeroColor(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Accent color<input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className={inputClass} /></label>
        <label className="text-xs font-bold">Badge color<input value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} className={inputClass} /></label>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-bold">Packshot</div>
        {imageUrl && <img src={imageUrl} alt="" className="h-28 object-contain" />}
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
      </div>
      <div className="flex flex-wrap gap-4 text-xs font-bold">
        <label className="flex items-center gap-2"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} /> Bestseller</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} /> New</label>
      </div>
      <label className="text-xs font-bold block">Badges (comma separated)<input value={badges} onChange={(e) => setBadges(e.target.value)} className={inputClass} /></label>
      <label className="text-xs font-bold block">Ingredients (one per line)<textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={5} className={inputClass} /></label>
      <label className="text-xs font-bold block">Allergens (comma separated)<input value={allergens} onChange={(e) => setAllergens(e.target.value)} className={inputClass} /></label>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mood tags</div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <label key={mood} className="flex items-center gap-1.5 text-xs font-bold">
              <input
                type="checkbox"
                checked={moodTags.includes(mood)}
                onChange={(e) =>
                  setMoodTags((prev) => (e.target.checked ? [...prev, mood] : prev.filter((item) => item !== mood)))
                }
              />
              {mood}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nutrition</div>
        {nutrition.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input value={row.name} placeholder="Name" onChange={(e) => setNutrition((prev) => prev.map((item, idx) => idx === i ? { ...item, name: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input value={row.amount} placeholder="Amount" onChange={(e) => setNutrition((prev) => prev.map((item, idx) => idx === i ? { ...item, amount: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input value={row.dailyValue ?? ''} placeholder="DV %" onChange={(e) => setNutrition((prev) => prev.map((item, idx) => idx === i ? { ...item, dailyValue: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
          </div>
        ))}
        <button type="button" className="text-xs font-bold text-[#C90018]" onClick={() => setNutrition((prev) => [...prev, { name: '', amount: '', dailyValue: '' }])}>+ Nutrition row</button>
      </div>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Preparation steps</div>
        {steps.map((row, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-2 mb-2">
            <input value={row.title} placeholder="Title" onChange={(e) => setSteps((prev) => prev.map((item, idx) => idx === i ? { ...item, title: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input value={row.duration ?? ''} placeholder="Duration" onChange={(e) => setSteps((prev) => prev.map((item, idx) => idx === i ? { ...item, duration: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input value={row.description} placeholder="Description" onChange={(e) => setSteps((prev) => prev.map((item, idx) => idx === i ? { ...item, description: e.target.value } : item))} className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs sm:col-span-3" />
          </div>
        ))}
        <button type="button" className="text-xs font-bold text-[#C90018]" onClick={() => setSteps((prev) => [...prev, { step: prev.length + 1, title: '', description: '', duration: '' }])}>+ Step</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="text-xs font-bold">Cook minutes<input type="number" value={cookingTimeMinutes} onChange={(e) => setCookingTimeMinutes(Number(e.target.value))} className={inputClass} /></label>
        <label className="text-xs font-bold">Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Product['difficulty'])} className={inputClass}>
            <option>Easy</option>
            <option>Moderate</option>
            <option>Quick</option>
          </select>
        </label>
        <label className="text-xs font-bold">Shelf life<input value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} className={inputClass} /></label>
      </div>
      <label className="text-xs font-bold block">Serving suggestion<input value={servingSuggestion} onChange={(e) => setServingSuggestion(e.target.value)} className={inputClass} /></label>
      <label className="text-xs font-bold block">Pairing<input value={pairingChutney} onChange={(e) => setPairingChutney(e.target.value)} className={inputClass} /></label>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pack sizes & inventory</div>
        {packs.map((pack, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-2">
            <input value={pack.weight} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, weight: e.target.value } : p))} placeholder="Weight" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input type="number" value={pack.price} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, price: Number(e.target.value) } : p))} placeholder="Price" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input type="number" value={pack.compareAtPrice ?? ''} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, compareAtPrice: e.target.value === '' ? undefined : Number(e.target.value) } : p))} placeholder="Compare" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input value={pack.sku} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, sku: e.target.value } : p))} placeholder="SKU" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input type="number" value={pack.stock ?? 0} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, stock: Number(e.target.value) } : p))} placeholder="Stock" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <button type="button" className="text-xs text-[#C90018]" onClick={() => setPacks((prev) => prev.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-xs font-bold text-[#C90018]" onClick={() => setPacks((prev) => [...prev, { ...emptyPack(), isDefault: false }])}>+ Pack size</button>
      </div>
      <button type="submit" className="btn-vibrant-cta px-6 py-3 rounded-2xl text-xs font-black uppercase">Save product</button>
      {status && <p className="text-xs text-[#C90018]">{status}</p>}
    </form>
  );
}
