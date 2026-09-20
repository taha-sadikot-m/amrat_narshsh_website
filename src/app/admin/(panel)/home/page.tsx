'use client';

import { useEffect, useState } from 'react';
import type { HomeMerchConfig, Product } from '@/types';

const KEYS: { key: keyof HomeMerchConfig; label: string }[] = [
  { key: 'featuredIds', label: 'Featured / shop popularity' },
  { key: 'bestsellers', label: 'Home tab: Bestsellers' },
  { key: 'arrivals', label: 'Home tab: New arrivals' },
  { key: 'festival', label: 'Home tab: Festival' },
];

export default function AdminHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [merch, setMerch] = useState<HomeMerchConfig | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    void Promise.all([
      fetch('/api/admin/home').then((r) => r.json()),
      fetch('/api/admin/products').then((r) => r.json()),
    ]).then(([home, catalog]) => {
      setMerch(home.merch);
      setProducts(catalog.products || []);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merch) return;
    const res = await fetch('/api/admin/home', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merch),
    });
    setStatus(res.ok ? 'Homepage merchandising saved.' : 'Save failed.');
  };

  const add = (key: keyof HomeMerchConfig, id: string) => {
    if (!id || !merch) return;
    if (merch[key].includes(id)) return;
    setMerch({ ...merch, [key]: [...merch[key], id] });
  };

  if (!merch) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <form onSubmit={(event) => void save(event)} className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display font-black text-3xl">Home merchandising</h1>
        <p className="text-sm text-gray-600 mt-1">Product order on the homepage tabs and shop popularity sort. Hero images are still managed under Hero images.</p>
      </div>
      {KEYS.map((section) => (
        <div key={section.key} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
          <h2 className="font-display font-bold">{section.label}</h2>
          <ol className="space-y-2">
            {merch[section.key].map((id, index) => {
              const product = products.find((item) => item.id === id);
              return (
                <li key={`${section.key}-${id}`} className="flex items-center justify-between gap-2 text-sm">
                  <span>{index + 1}. {product?.name ?? id}</span>
                  <button
                    type="button"
                    className="text-xs font-bold text-[#C90018]"
                    onClick={() => setMerch({ ...merch, [section.key]: merch[section.key].filter((item) => item !== id) })}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ol>
          <select
            defaultValue=""
            onChange={(event) => {
              add(section.key, event.target.value);
              event.target.value = '';
            }}
            className="w-full rounded-xl border border-[#EADFCB] px-3 py-2 text-sm"
          >
            <option value="">Add product…</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
      ))}
      <button type="submit" className="btn-vibrant-cta px-6 py-3 rounded-2xl text-xs font-black uppercase">Save homepage</button>
      {status ? <p className="text-xs font-semibold">{status}</p> : null}
    </form>
  );
}
