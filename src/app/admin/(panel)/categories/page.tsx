'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/types';

const empty = { id: '', name: '', gujaratiName: '', description: '', color: '#D46A1E', tagline: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('');

  const load = () => fetch('/api/admin/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []));
  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setStatus(res.ok ? 'Category created.' : data.error || 'Could not save.');
    if (res.ok) {
      setForm(empty);
      await load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete ${id}?`)) return;
    const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    setStatus(res.ok ? 'Deleted.' : data.error || 'Could not delete.');
    await load();
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="font-display font-black text-3xl">Categories</h1>
      <form onSubmit={(event) => void save(event)} className="bg-white rounded-3xl border border-[#EADFCB] p-5 grid sm:grid-cols-2 gap-3">
        <input placeholder="id slug (optional)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input placeholder="Gujarati name" value={form.gujaratiName} onChange={(e) => setForm({ ...form, gujaratiName: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB] sm:col-span-2" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB] sm:col-span-2" />
        <button type="submit" className="btn-vibrant-cta px-4 py-2 rounded-full text-xs font-black uppercase sm:col-span-2">Add category</button>
      </form>
      {status ? <p className="text-xs font-semibold">{status}</p> : null}
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="bg-white rounded-2xl border border-[#EADFCB] p-4 flex justify-between gap-3">
            <div>
              <div className="font-bold">{category.name}</div>
              <div className="text-xs text-gray-500">{category.id} · {category.gujaratiName}</div>
            </div>
            <button type="button" onClick={() => void remove(category.id)} className="text-xs font-bold text-[#C90018]">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
