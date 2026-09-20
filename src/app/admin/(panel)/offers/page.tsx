'use client';

import { useEffect, useState } from 'react';

type Offer = {
  id: string;
  text: string;
  ctaLabel: string | null;
  href: string | null;
  active: boolean;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
};

function toLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [text, setText] = useState('');
  const [cta, setCta] = useState('Shop Now');
  const [href, setHref] = useState('/shop');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
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
      body: JSON.stringify({
        text,
        ctaLabel: cta,
        href,
        active: true,
        startsAt: startsAt || null,
        endsAt: endsAt || null,
      }),
    });
    if (res.ok) {
      setText('');
      setStartsAt('');
      setEndsAt('');
      setStatus('Offer saved.');
      await load();
    } else setStatus('Could not create offer.');
  };

  const saveOffer = async (offer: Offer, patch: Partial<Offer>) => {
    await fetch('/api/admin/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: offer.id, ...patch }),
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
        <p className="text-sm text-gray-600 mt-1">Active offers in the date window scroll in the top bar.</p>
      </div>
      <form onSubmit={(event) => void add(event)} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
        <input value={text} onChange={(e) => setText(e.target.value)} required placeholder="Offer text" className="w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm" />
        <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA label" className="w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm" />
        <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="Link href" className="w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm" />
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold">Starts<input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB]" /></label>
          <label className="text-xs font-bold">Ends<input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-[#EADFCB]" /></label>
        </div>
        <button type="submit" className="btn-vibrant-cta px-5 py-2.5 rounded-full text-xs font-black uppercase">Add offer</button>
        {status && <p className="text-xs font-semibold">{status}</p>}
      </form>
      <ul className="space-y-3">
        {offers.map((offer) => (
          <li key={offer.id} className="bg-white rounded-2xl border border-[#EADFCB] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-semibold text-sm">{offer.text}</div>
                <div className="text-[11px] text-gray-500">{offer.ctaLabel} · {offer.href} · {offer.active ? 'Live' : 'Paused'}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => void saveOffer(offer, { active: !offer.active })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FCFAF5]">{offer.active ? 'Pause' : 'Activate'}</button>
                <button type="button" onClick={() => void remove(offer.id)} className="px-3 py-1.5 rounded-full text-xs font-bold text-[#C90018]">Delete</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              <input defaultValue={offer.href ?? '/shop'} onBlur={(e) => void saveOffer(offer, { href: e.target.value })} className="px-3 py-2 rounded-xl border border-[#EADFCB] text-xs" />
              <input type="datetime-local" defaultValue={toLocal(offer.startsAt)} onBlur={(e) => void saveOffer(offer, { startsAt: e.target.value || null })} className="px-3 py-2 rounded-xl border border-[#EADFCB] text-xs" />
              <input type="datetime-local" defaultValue={toLocal(offer.endsAt)} onBlur={(e) => void saveOffer(offer, { endsAt: e.target.value || null })} className="px-3 py-2 rounded-xl border border-[#EADFCB] text-xs" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
