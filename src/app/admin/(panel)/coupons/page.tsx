'use client';

import { useEffect, useState } from 'react';

type Coupon = { code: string; discountPercentage: number; minOrderValue: number; description: string };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [percent, setPercent] = useState(10);
  const [min, setMin] = useState(0);
  const [description, setDescription] = useState('');

  const load = () => fetch('/api/admin/coupons').then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, discountPercentage: percent, minOrderValue: min, description }),
    });
    setCode('');
    await load();
  };

  const remove = async (c: string) => {
    if (!confirm(`Delete ${c}?`)) return;
    await fetch(`/api/admin/coupons?code=${c}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Coupons</h1>
      <form onSubmit={save} className="bg-white rounded-3xl border border-[#EADFCB] p-5 grid sm:grid-cols-2 gap-3">
        <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} placeholder="%" className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} placeholder="Min order" className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="px-3 py-2 rounded-xl border border-[#EADFCB]" />
        <button type="submit" className="btn-vibrant-cta px-4 py-2 rounded-full text-xs font-black uppercase sm:col-span-2">Save coupon</button>
      </form>
      <ul className="space-y-2">
        {coupons.map((c) => (
          <li key={c.code} className="bg-white rounded-2xl border border-[#EADFCB] p-4 flex justify-between">
            <div>
              <div className="font-bold">{c.code}</div>
              <div className="text-xs text-gray-500">{c.discountPercentage}% off · min ₹{c.minOrderValue} · {c.description}</div>
            </div>
            <button type="button" onClick={() => remove(c.code)} className="text-xs font-bold text-[#C90018]">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
