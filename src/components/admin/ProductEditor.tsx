'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product, ProductPackSize } from '@/types';

const emptyPack = (): ProductPackSize => ({
  weight: '200g',
  price: 65,
  sku: '',
  isDefault: true,
  stock: 50,
});

export function ProductEditor({ initial }: { initial?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [gujaratiName, setGujaratiName] = useState(initial?.gujaratiName ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'instant-mixes');
  const [tagline, setTagline] = useState(initial?.tagline ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isBestseller, setIsBestseller] = useState(initial?.isBestseller ?? false);
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
      slug,
      category,
      tagline,
      description,
      culinaryStory: initial?.culinaryStory || description,
      imageUrl,
      inStock,
      isBestseller,
      packSizes: packs,
      heroColor: initial?.heroColor || '#C90018',
      accentColor: initial?.accentColor || '#F4C400',
      makesText: initial?.makesText || '',
      badges: initial?.badges || [],
      ingredients: initial?.ingredients || [],
      verifiedNutrition: initial?.verifiedNutrition || [],
      preparationSteps: initial?.preparationSteps || [],
      cookingTimeMinutes: initial?.cookingTimeMinutes || 15,
      difficulty: initial?.difficulty || 'Easy',
      servingSuggestion: initial?.servingSuggestion || '',
      pairingChutney: initial?.pairingChutney || '',
      allergens: initial?.allergens || [],
      shelfLife: initial?.shelfLife || '9 Months',
      moodTags: initial?.moodTags || [],
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
        <label className="text-xs font-bold">Name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white" /></label>
        <label className="text-xs font-bold">Gujarati name<input value={gujaratiName} onChange={(e) => setGujaratiName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white" /></label>
        <label className="text-xs font-bold">Slug<input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white" /></label>
        <label className="text-xs font-bold">Category
          <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <label className="text-xs font-bold block">Tagline<input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white" /></label>
      <label className="text-xs font-bold block">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB] bg-white" /></label>
      <div className="space-y-2">
        <div className="text-xs font-bold">Packshot</div>
        {imageUrl && <img src={imageUrl} alt="" className="h-28 object-contain" />}
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
      </div>
      <div className="flex gap-4 text-xs font-bold">
        <label className="flex items-center gap-2"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} /> Bestseller</label>
      </div>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pack sizes & inventory</div>
        {packs.map((pack, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
            <input value={pack.weight} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, weight: e.target.value } : p))} placeholder="Weight" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            <input type="number" value={pack.price} onChange={(e) => setPacks((prev) => prev.map((p, idx) => idx === i ? { ...p, price: Number(e.target.value) } : p))} placeholder="Price" className="px-2 py-2 rounded-xl border border-[#EADFCB] text-xs" />
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
