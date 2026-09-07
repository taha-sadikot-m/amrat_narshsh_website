'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product, ProductCategory } from '../../types';
import { HomeProductCard } from './HomeProductCard';

type FilterId = 'all' | ProductCategory;

const CURATED_PRODUCT_IDS = ['bhajiya', 'dalwada', 'farali-atta', 'gobapuri'];

// The still-life is a rectangular photo on cream, so its edges are feathered
// away to let it read as part of the section background.
const STILL_LIFE_FADE_MASK =
  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, #000 52%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)';

const STILL_LIFE_FADE: React.CSSProperties = {
  WebkitMaskImage: STILL_LIFE_FADE_MASK,
  maskImage: STILL_LIFE_FADE_MASK,
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
};

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'All Mixes' },
  { id: 'instant-mixes', label: 'Instant Mixes' },
  { id: 'traditional-favourites', label: 'Traditional Favourites' },
  { id: 'sweet-moments', label: 'Sweet Moments' },
];

function BotanicalCorner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 220 180"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="M8 176C55 135 58 74 112 22M31 153c-4-21 4-35 24-44M54 130c19 1 33-6 42-23M73 104c-2-18 5-31 22-40M94 76c17 0 30-7 39-21" />
      <path d="M54 109c-18-6-30 1-36 20 19 3 31-4 36-20ZM95 64c-15-8-28-3-36 14 17 5 29 1 36-14ZM96 108c16-8 30-5 40 11-16 7-30 3-40-11ZM133 54c15-9 29-7 41 8-16 8-29 5-41-8Z" />
      <path d="M120 28c7-13 18-18 32-13-6 14-17 18-32 13ZM24 153c-12-2-20 3-24 15 12 2 20-3 24-15Z" />
    </svg>
  );
}

export const BestsellersCarousel: React.FC = () => {
  const { navigateTo, products } = useStore();
  const reduceMotion = Boolean(useReducedMotion());
  const [selectedCategory, setSelectedCategory] = useState<FilterId>('all');

  const handleCategoryChange = (catId: FilterId) => {
    if (catId === selectedCategory) return;
    setSelectedCategory(catId);
  };

  const curatedProducts = CURATED_PRODUCT_IDS.map((id) =>
    products.find((product) => product.id === id)
  ).filter((product): product is Product => Boolean(product));

  const visibleProducts =
    selectedCategory === 'all'
      ? (curatedProducts.length ? curatedProducts : products.slice(0, 4))
      : products.filter((product) => product.category === selectedCategory).slice(0, 4);

  return (
    <section
      id="products-showcase-section"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-b border-[#EADFCB] bg-[#FAF5EC] py-20 sm:py-24 lg:py-28"
    >
      <BotanicalCorner className="pointer-events-none absolute -bottom-5 -left-5 h-52 w-60 text-[#7F9B54]/10 sm:h-72 sm:w-80" />
      <BotanicalCorner className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-56 -scale-x-100 text-[#C90018]/[0.055] sm:h-64 sm:w-72" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.header
          initial={reduceMotion ? false : { y: 18 }}
          whileInView={reduceMotion ? undefined : { y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid items-center gap-2 lg:min-h-[380px] lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)] xl:min-h-[430px]"
        >
          <div className="relative z-20 max-w-[610px]">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#A62C36] sm:text-xs">
              <Sparkles className="h-4 w-4 text-[#D8A21B]" />
              Authentic Gujarati Pantry
            </div>
            <h2 className="font-display mt-4 text-[38px] font-black leading-[1.02] tracking-tight text-[#151515] min-[390px]:text-[40px] sm:text-5xl lg:text-6xl">
              <span className="block">The Flavours</span>
              <span className="block">
                We <span className="text-[#C90018]">Grew Up</span> With
              </span>
            </h2>
            <div className="mt-4 h-px w-32 bg-gradient-to-r from-[#D8A21B]/70 to-transparent" aria-hidden="true" />
            <p className="mt-4 max-w-[510px] text-sm leading-6 text-[#5C5852] sm:text-base sm:leading-7">
              Traditional recipes. Honest ingredients. Stone-milled goodness.
              <span className="block">Made for the way Gujarati families love to eat.</span>
            </p>
          </div>

          <div className="relative -mx-4 mt-4 h-[190px] overflow-hidden sm:-mx-8 sm:h-[230px] lg:-mr-12 lg:ml-0 lg:mt-0 lg:h-full xl:-mr-16">
            <motion.img
              src="/images/gujarati/collection-still-life.webp"
              alt=""
              aria-hidden="true"
              initial={reduceMotion ? false : { scale: 0.98, x: 12 }}
              whileInView={reduceMotion ? undefined : { scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={STILL_LIFE_FADE}
              className="absolute inset-0 h-full w-full object-cover object-[72%_42%] mix-blend-multiply lg:object-[78%_45%]"
            />
          </div>
        </motion.header>

        <div
          className="-mx-4 mt-9 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mt-6 lg:-mx-0 lg:px-0"
          aria-label="Product category filters"
        >
          <div className="flex w-max min-w-full gap-2 md:justify-center">
            {FILTERS.map((filter) => {
              const label = filter.id === 'all' ? `All ${products.length} Mixes` : filter.label;
              const selected = selectedCategory === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => handleCategoryChange(filter.id)}
                  className={`h-10 shrink-0 rounded-full px-5 text-[10px] font-extrabold uppercase tracking-[0.09em] transition-[background-color,border-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C90018] sm:text-[11px] ${
                    selected
                      ? 'border border-[#C90018] bg-[#C90018] text-white shadow-[0_5px_14px_rgba(201,0,24,0.18)]'
                      : 'border border-[#E8DCC9] bg-[#FFFDFC]/90 text-[#34312E] hover:border-[#D9A441] hover:bg-white'
                  }`}
                  aria-pressed={selected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-8 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <button
            id="view-all-products-btn"
            type="button"
            onClick={() => navigateTo('products')}
            className="group inline-flex min-h-12 items-center gap-4 rounded-full border border-[#C90018]/65 bg-[#FFFDFC]/80 px-7 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#C90018] transition-[background-color,color,box-shadow] hover:bg-[#C90018] hover:text-white hover:shadow-[0_8px_22px_rgba(201,0,24,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C90018] sm:px-10 sm:text-xs"
          >
            Explore All {products.length} Authentic Gujarati Mixes
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
