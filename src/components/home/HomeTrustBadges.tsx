'use client';

import React from 'react';
import { Leaf, RotateCcw, Truck, Wheat, type LucideIcon } from 'lucide-react';

const BADGES: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Truck, title: 'Free Delivery', sub: 'On all orders above ₹499 across India' },
  { icon: Leaf, title: '100% Vegetarian', sub: 'Pure, clean, no artificial additives' },
  { icon: Wheat, title: 'Stone-Milled', sub: 'Traditional cold-press grinding — since 1956' },
  { icon: RotateCcw, title: 'Easy Returns', sub: 'Hassle-free 7-day return policy' },
];

export const HomeTrustBadges: React.FC = () => {
  return (
    <section className="border-y border-[#F0E4D0] bg-white py-10">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
        {BADGES.map((badge, index) => (
          <div
            key={badge.title}
            className={`flex flex-col items-center gap-2.5 px-4 py-6 text-center ${
              index < BADGES.length - 1 ? 'lg:border-r lg:border-[#F0E4D0]' : ''
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0]">
              <badge.icon className="h-6 w-6 text-[#D46A1E]" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="text-[0.95rem] font-bold text-[#3E2723]">{badge.title}</h3>
            <p className="text-[0.78rem] leading-relaxed text-[#8D6E63]">{badge.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
