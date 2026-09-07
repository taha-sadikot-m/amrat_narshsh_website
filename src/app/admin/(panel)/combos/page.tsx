'use client';

import { useEffect, useState } from 'react';

type ProductOption = { id: string; name: string; defaultPrice: number };
type ComboRow = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  active: boolean;
  sortOrder: number;
  items: { productId: string; product: { name: string } }[];
};

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<ComboRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const load = async () => {
    const [comboRes, productRes] = await Promise.all([
      fetch('/api/admin/combos'),
      fetch('/api/admin/products'),
    ]);
    const comboData = await comboRes.json();
    const productData = await productRes.json();
    setCombos(comboData.combos || []);
    setProducts(productData.products || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleProduct = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await fetch('/api/admin/combos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tagline, price, productIds: selected, active: true }),
    });
    if (res.ok) {
      setName('');
      setTagline('');
      setPrice(0);
      setSelected([]);
      setStatus('');
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(data.error || 'Could not create combo.');
    }
  };

  const toggle = async (combo: ComboRow) => {
    await fetch('/api/admin/combos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: combo.id, active: !combo.active }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this combo?')) return;
    await fetch(`/api/admin/combos?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-3xl">Combos</h1>
        <p className="text-sm text-gray-600 mt-1">Active combos appear beside the homepage timer.</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Combo name"
          className="w-full px-3 py-2 rounded-xl border border-[#EADFCB]"
        />
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Tagline"
          className="w-full px-3 py-2 rounded-xl border border-[#EADFCB]"
        />
        <input
          type="number"
          min={1}
          required
          value={price || ''}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Bundle price"
          className="w-full px-3 py-2 rounded-xl border border-[#EADFCB]"
        />
        <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto border border-[#EADFCB] rounded-xl p-3">
          {products.map((product) => (
            <label key={product.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
              />
              <span>
                {product.name} · ₹{product.defaultPrice}
              </span>
            </label>
          ))}
        </div>
        {status && <p className="text-xs font-bold text-[#C90018]">{status}</p>}
        <button type="submit" className="btn-vibrant-cta px-5 py-2.5 rounded-full text-xs font-black uppercase">
          Add combo
        </button>
      </form>

      <ul className="space-y-2">
        {combos.map((combo) => (
          <li
            key={combo.id}
            className="bg-white rounded-2xl border border-[#EADFCB] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
          >
            <div>
              <div className="font-semibold text-sm">{combo.name}</div>
              <div className="text-[11px] text-gray-500">
                ₹{combo.price} · {combo.items.map((item) => item.product.name).join(', ')} ·{' '}
                {combo.active ? 'Live' : 'Paused'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggle(combo)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FCFAF5]"
              >
                {combo.active ? 'Pause' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => remove(combo.id)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-[#C90018]"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
