'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';
import { TAB_PRODUCT_IDS } from '../../lib/home-catalog';
import { HomeProductCard } from './HomeProductCard';

const TABS = [
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'arrivals', label: 'New Arrivals' },
  { id: 'festival', label: 'Festival Specials' },
] as const;

export const HomeProductTabs: React.FC = () => {
  const { products } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('bestsellers');
  const ids = TAB_PRODUCT_IDS[tab];
  const shown = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <section className="bg-[#FFF3E0] py-10 lg:py-[60px]">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#D46A1E]">Our Products</p>
          <h2 className="font-display mt-2 text-[2rem] font-bold text-[#3E2723]">Crafted Since 1956</h2>
          <p className="mt-2 text-[0.9rem] text-[#8D6E63]">
            Authentic stone-milled Gujarati mixes, ready in minutes
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-3xl border-[1.5px] border-[#D46A1E] px-[22px] py-2 text-[0.85rem] font-semibold transition-colors duration-200 ${
                tab === item.id
                  ? 'bg-[#D46A1E] text-white shadow-[0_4px_12px_rgba(212,106,30,0.3)]'
                  : 'bg-transparent text-[#D46A1E]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {shown.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#D46A1E] px-8 py-3 text-[0.9rem] font-bold text-[#D46A1E] transition-colors duration-200 hover:bg-[#D46A1E] hover:text-white"
          >
            SEE ALL 11 PRODUCTS
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
