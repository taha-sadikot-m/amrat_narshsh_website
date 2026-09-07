'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CIRCLES = [
  { label: 'Instant Mixes', href: '/shop?category=instant-mixes', productId: 'bhajiya', food: '/images/gujarati/bhajiya-food.webp' },
  { label: 'Sweet Moments', href: '/shop?category=sweet-moments', productId: 'gulab-jamun', food: '/images/gujarati/gulab-jamun-food.webp' },
  { label: 'Farali / Vrat', href: '/shop?category=traditional-favourites', productId: 'farali-atta', food: '/images/gujarati/farali-food.webp' },
  { label: 'Morning Snacks', href: '/shop?mood=breakfast', productId: 'khichu' },
  { label: 'Festival Special', href: '/shop?mood=festive', productId: 'gota' },
  { label: 'All Products', href: '/shop', productId: 'handwa' },
];

export const HomeCategoryCircles: React.FC = () => {
  const { products } = useStore();

  return (
    <section className="bg-white py-8 lg:py-8">
      <div className="mx-auto flex max-w-[1280px] gap-4 overflow-x-auto px-6 pb-2 lg:justify-between lg:overflow-visible">
        {CIRCLES.map((circle) => {
          const product = products.find((item) => item.id === circle.productId);
          const src = circle.food ?? product?.imageUrl;
          return (
            <Link
              key={circle.label}
              href={circle.href}
              className="group flex min-w-[110px] flex-col items-center gap-2.5"
            >
              <span className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-[2.5px] border-[#F0E4D0] bg-[#FFF3E0] transition-all duration-[250ms] group-hover:-translate-y-1 group-hover:border-[#D46A1E] group-hover:bg-[#FFF0D6] group-hover:shadow-[0_8px_20px_rgba(212,106,30,0.2)]">
                {src && (
                  <img src={src} alt="" loading="lazy" className="h-20 w-20 object-contain" />
                )}
              </span>
              <span className="text-center text-[0.82rem] font-semibold text-[#3E2723]">{circle.label}</span>
              <span className="inline-flex items-center gap-1 text-[0.7rem] text-[#D46A1E]">
                See More
                <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
