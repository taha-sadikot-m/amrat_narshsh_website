'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

type DishPanel = {
  productId: string;
  label: string;
  foodImage: string;
  fallback: string;
  subtext: (price: number) => string;
  titleClass: string;
  area: string;
  packClass: string;
};

const DISH_PANELS: DishPanel[] = [
  {
    productId: 'bhajiya',
    label: 'Bhajiya',
    foodImage: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200&q=85',
    fallback: 'linear-gradient(135deg, #7B3200 0%, #C85A00 100%)',
    subtext: (price) => `Crispy. Golden. Ready in 10 min. · ₹${price}`,
    titleClass: 'text-[1.4rem] md:text-[1.7rem] lg:text-[2rem]',
    area: 'md:col-span-2 lg:col-auto lg:col-start-1 lg:row-start-1',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[110px] lg:w-[100px]',
  },
  {
    productId: 'handwa',
    label: 'Handwa',
    foodImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=85',
    fallback: 'linear-gradient(135deg, #3D4700 0%, #7A8A00 100%)',
    subtext: (price) => `Baked fluffy. Gujarati comfort. · ₹${price}`,
    titleClass: 'text-[1.4rem]',
    area: 'lg:col-start-2 lg:row-start-1',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[90px] lg:w-[80px]',
  },
  {
    productId: 'gulab-jamun',
    label: 'Gulab Jamun',
    foodImage: 'https://images.unsplash.com/photo-1601303516534-7e37a31c97a2?w=800&q=85',
    fallback: 'linear-gradient(135deg, #5C0030 0%, #A0004A 100%)',
    subtext: (price) => `Melt-in-mouth. Festival-ready. · ₹${price}`,
    titleClass: 'text-[1.4rem] lg:text-[1.2rem]',
    area: 'lg:col-start-3 lg:row-start-1',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[90px] lg:w-[80px]',
  },
  {
    productId: 'dalwada',
    label: 'Dalwada',
    foodImage: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=85',
    fallback: 'linear-gradient(135deg, #3B1A00 0%, #6B3200 100%)',
    subtext: (price) => `Crisp outside. Soft inside. · ₹${price}`,
    titleClass: 'text-[1.4rem]',
    area: 'lg:col-start-1 lg:row-start-2',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[90px] lg:w-[80px]',
  },
  {
    productId: 'khichu',
    label: 'Khichu',
    foodImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=85',
    fallback: 'linear-gradient(135deg, #5A3A00 0%, #C8890A 100%)',
    subtext: (price) => `Silky. Warming. Monsoon magic. · ₹${price}`,
    titleClass: 'text-[1.4rem] lg:text-[1.3rem]',
    area: 'lg:col-start-2 lg:row-start-2',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[90px] lg:w-[80px]',
  },
  {
    productId: 'gota',
    label: 'Gota',
    foodImage: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=85',
    fallback: 'linear-gradient(135deg, #D46A1E 0%, #8B3A00 100%)',
    subtext: (price) => `Fluffy. Herby. Gujarati soul. · ₹${price}`,
    titleClass: 'text-[1.4rem] lg:text-[1.3rem]',
    area: 'lg:col-start-3 lg:row-start-2',
    packClass: 'hidden md:block md:h-[72px] md:w-[65px] lg:h-[90px] lg:w-[80px]',
  },
];

function packPrice(product: Product): number {
  const pack = product.packSizes?.find((size) => size.isDefault) ?? product.packSizes?.[0];
  return pack?.price ?? product.defaultPrice;
}

function DishTile({
  panel,
  product,
  reduceMotion,
}: {
  panel: DishPanel;
  product: Product;
  reduceMotion: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const price = packPrice(product);

  return (
    <Link
      id={`recipe-entry-${product.id}`}
      href={`/product/${product.slug}`}
      aria-label={`Shop ${panel.label}, ${product.name}, ₹${price}`}
      className={`group relative block h-[200px] cursor-pointer overflow-hidden outline-none md:h-[220px] lg:h-full ${panel.area} ${
        panel.productId === 'bhajiya' ? 'md:h-[260px] lg:h-full' : ''
      }`}
    >
      <div className="absolute inset-0" style={{ background: panel.fallback }} aria-hidden="true" />

      {!imageFailed && (
        <img
          src={panel.foodImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            reduceMotion ? '' : 'group-hover:scale-[1.08] group-focus-visible:scale-[1.08]'
          }`}
        />
      )}

      <div
        className="absolute inset-0 transition-opacity duration-[350ms] ease-out"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 5, 0, 0.88) 0%, rgba(10, 5, 0, 0.35) 45%, rgba(10, 5, 0, 0) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 5, 0, 0.92) 0%, rgba(10, 5, 0, 0.4) 45%, rgba(10, 5, 0, 0) 100%)',
        }}
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_0_transparent] transition-[box-shadow] duration-[350ms] ease-out group-hover:shadow-[inset_0_0_0_2px_rgba(212,106,30,0.7)] group-focus-visible:shadow-[inset_0_0_0_2px_rgba(212,106,30,0.7)]"
        aria-hidden="true"
      />

      <div className="absolute bottom-5 left-[22px] z-[2] max-w-[70%] pr-2">
        <span className="mb-2 inline-flex translate-y-2 items-center rounded-[20px] bg-white/95 px-3 py-[5px] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#D46A1E] opacity-0 transition-all duration-300 delay-100 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
          Shop now →
        </span>
        <h3
          className={`font-editorial mb-1.5 font-bold leading-[1.1] text-white transition-transform duration-[350ms] ease-out group-hover:-translate-y-[3px] group-focus-visible:-translate-y-[3px] motion-reduce:transform-none ${panel.titleClass}`}
        >
          {panel.label}
        </h3>
        <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#F5A623] max-md:hidden">
          {panel.subtext(price)}
        </p>
        <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#F5A623] md:hidden">
          ₹{price}
        </p>
      </div>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute bottom-4 right-4 z-[3] object-contain opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-[opacity,transform] duration-[350ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:-translate-y-[3px] group-focus-visible:scale-[1.06] group-focus-visible:opacity-100 group-focus-visible:-translate-y-[3px] motion-reduce:transform-none ${panel.packClass}`}
        />
      )}
    </Link>
  );
}

export const RecipeEntryPoint: React.FC = () => {
  const { products } = useStore();
  const reduceMotion = Boolean(useReducedMotion());

  const tiles = DISH_PANELS.map((panel) => ({
    panel,
    product: products.find((item) => item.id === panel.productId),
  })).filter((tile): tile is { panel: DishPanel; product: Product } => Boolean(tile.product));

  if (!tiles.length) return null;

  return (
    <section
      id="recipe-entry-point-section"
      className="relative w-full border-b border-[#EADFCB] bg-[#FFF3E0] pb-20 md:pb-0"
    >
      <header className="px-5 pb-8 pt-10 sm:px-8 lg:px-[60px] lg:pb-9 lg:pt-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#D46A1E]">
          Pick your craving
        </p>
        <h2 className="font-editorial mt-3 max-w-3xl text-[2rem] font-bold leading-[1.15] text-[#3E2723] lg:text-[2.6rem]">
          What do you want to make today?
        </h2>
      </header>

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 grid-rows-none gap-[3px] md:grid-cols-2 md:gap-1 lg:grid-cols-[55fr_25fr_20fr] lg:grid-rows-[340px_280px] lg:gap-1">
        {tiles.map(({ panel, product }) => (
          <DishTile key={panel.productId} panel={panel} product={product} reduceMotion={reduceMotion} />
        ))}
      </div>

      <div className="px-5 py-8 text-center">
        <p className="text-[0.9rem] text-[#8D6E63]">Explore all 11 authentic Gujarati mixes</p>
        <Link
          href="/shop"
          className="mt-2 inline-block text-[0.95rem] font-bold uppercase tracking-[0.08em] text-[#D46A1E] transition-colors hover:text-[#A84F10] hover:underline"
        >
          View all products →
        </Link>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <Link
          href="/shop"
          className="pointer-events-auto flex h-12 w-full items-center justify-center rounded-full bg-[#D46A1E] text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_rgba(212,106,30,0.35)]"
        >
          Shop all →
        </Link>
      </div>
    </section>
  );
};
