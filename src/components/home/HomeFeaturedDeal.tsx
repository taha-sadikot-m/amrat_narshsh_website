'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Timer } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { defaultPack, discountPercent } from '../../lib/home-catalog';
import type { PublicCombo } from '../../types';
import { ComboStrip } from './ComboStrip';

const FEATURED_ID = 'bhajiya';
const STORAGE_KEY = 'amrat_deal_ends_at';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export const HomeFeaturedDeal: React.FC = () => {
  const { products, showToast } = useStore();
  const { addItem } = useCart();
  const [remaining, setRemaining] = useState(24 * 60 * 60 * 1000);
  const [combos, setCombos] = useState<PublicCombo[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const endsAt = stored ? Number(stored) : Date.now() + 24 * 60 * 60 * 1000;
    if (!stored) sessionStorage.setItem(STORAGE_KEY, String(endsAt));
    const tick = () => setRemaining(Math.max(0, endsAt - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/combos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.combos)) setCombos(data.combos);
      })
      .catch(() => undefined);
  }, []);

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const featured = products.find((item) => item.id === FEATURED_ID) ?? products[0];
  const pack = featured ? defaultPack(featured) : undefined;

  if (!featured || !pack) return null;

  const price = pack.price;
  const compare = pack.compareAtPrice;
  const discount = discountPercent(price, compare);

  const addFeatured = () => {
    addItem({
      productId: featured.id,
      name: featured.name,
      gujaratiName: featured.gujaratiName,
      weight: pack.weight,
      price,
      quantity: 1,
      heroColor: featured.heroColor,
      makesText: featured.makesText,
    });
    showToast('Added to Cart!', `${featured.name} is in your basket.`, 'success');
  };

  return (
    <section className="bg-[#3E2723] py-10 lg:py-12">
      <div
        className={`mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-6 ${
          combos.length > 0 ? 'lg:grid-cols-[32fr_68fr]' : ''
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 lg:sticky lg:top-24 lg:self-start">
          <p className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#F5A623]">
            <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
            Limited Time Offer
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[
              [pad(hours), 'HRS'],
              [pad(minutes), 'MIN'],
              [pad(seconds), 'SEC'],
            ].map(([value, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="text-[1.4rem] text-white">:</span>}
                <div className="rounded-lg bg-white/10 px-3.5 py-2.5 text-center">
                  <div className="text-[1.8rem] font-extrabold leading-none text-white">{value}</div>
                  <div className="mt-1 text-[0.6rem] text-[#8D6E63]">{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          {featured.imageUrl && (
            <img
              src={featured.imageUrl}
              alt=""
              loading="lazy"
              className="mx-auto mt-6 max-h-[180px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            />
          )}
          <h3 className="font-display mt-3 text-[1.3rem] font-bold text-white">
            {featured.name} — {pack.weight}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[1.5rem] font-bold text-white">₹{price}</span>
            {compare && <span className="text-white/50 line-through">₹{compare}</span>}
            {discount > 0 && (
              <span className="rounded bg-[#C62828] px-2 py-0.5 text-xs font-bold text-white">{discount}% OFF</span>
            )}
          </div>
          <button
            type="button"
            onClick={addFeatured}
            className="mt-4 h-11 w-full rounded-lg bg-[#D46A1E] font-bold text-white hover:bg-[#A84F10]"
          >
            ADD TO CART
          </button>
        </div>

        {combos.length > 0 && (
          <div className="flex w-full flex-col gap-4">
            {combos.slice(0, 3).map((combo, index) => (
              <ComboStrip key={combo.id} combo={combo} index={index} />
            ))}
            {combos.length > 3 && (
              <Link
                href="/combos"
                className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-[#F5A623] hover:text-white"
              >
                View all {combos.length} combos
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
