'use client';

import { useEffect, useState } from 'react';

type Offer = {
  id: string;
  text: string;
  ctaLabel: string | null;
  href: string | null;
  active: boolean;
  sortOrder: number;
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [text, setText] = useState('');
  const [cta, setCta] = useState('Shop Now');
  const [status, setStatus] = useState('');

  const load = () => fetch('/api/admin/offers').then((r) => r.json()).then((d) => setOffers(d.offers || []));

  useEffect(() => {
    void load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ctaLabel: cta, href: '/shop', active: true }),
    });
    if (res.ok) {
      setText('');
      setStatus('Offer live in the top marquee.');
      await load();
    } else setStatus('Could not create offer.');
  };

  const toggle = async (offer: Offer) => {
    await fetch('/api/admin/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: offer.id, active: !offer.active }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this offer?')) return;
    await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl">Offers</h1>
        <p className="text-sm text-gray-600 mt-1">Active offers scroll in the red bar at the top of the storefront.</p>
      </div>
      <form onSubmit={add} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
        <input value={text} onChange={(e) => setText(e.target.value)} required placeholder="e.g. FREE delivery above ₹499 — use GUJARAT10" className="w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm" />
        <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA label" className="w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm" />
        <button type="submit" className="btn-vibrant-cta px-5 py-2.5 rounded-full text-xs font-black uppercase">Add offer</button>
        {status && <p className="text-xs font-semibold">{status}</p>}
      </form>
      <ul className="space-y-3">
        {offers.map((offer) => (
          <li key={offer.id} className="bg-white rounded-2xl border border-[#EADFCB] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <div className="font-semibold text-sm">{offer.text}</div>
              <div className="text-[11px] text-gray-500">{offer.ctaLabel} · {offer.active ? 'Live' : 'Paused'}</div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => toggle(offer)} className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FCFAF5]">{offer.active ? 'Pause' : 'Activate'}</button>
              <button type="button" onClick={() => remove(offer.id)} className="px-3 py-1.5 rounded-full text-xs font-bold text-[#C90018]">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
