'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ComboStrip } from '../home/ComboStrip';
import type { PublicCombo } from '../../types';

export const CombosPage: React.FC = () => {
  const [combos, setCombos] = useState<PublicCombo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/combos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.combos)) setCombos(data.combos);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main className="bg-[#FFFBF5] py-10 lg:py-16">
      <div className="mx-auto max-w-[720px] px-6">
        <p className="text-center text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#D46A1E]">
          Bundle & Save
        </p>
        <h1 className="font-display mt-2 text-center text-[2rem] font-bold text-[#3E2723]">Combo Offers</h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-[#8D6E63]">
          Curated mix boxes at a set bundle price. Open any combo to add it to your cart.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {combos.map((combo, index) => (
            <ComboStrip key={combo.id} combo={combo} index={index} />
          ))}
        </div>

        {loaded && combos.length === 0 && (
          <p className="mt-10 text-center text-sm text-[#8D6E63]">
            No combo offers are live right now.{' '}
            <Link href="/shop" className="font-bold text-[#D46A1E] hover:underline">
              Browse all mixes
            </Link>
          </p>
        )}
      </div>
    </main>
  );
};
