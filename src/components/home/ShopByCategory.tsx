'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CakeSlice, CookingPot, Wheat } from 'lucide-react';
import type { Category, Product, ProductCategory } from '../../types';
import { useStore } from '../../context/StoreContext';

type CategoryVisual = {
  /** Text tone kept readable on cream; the shape uses the database category colour. */
  textAccent: string;
  softAccent: string;
  packageId: string;
  foodImage: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const CATEGORY_VISUALS: Record<ProductCategory, CategoryVisual> = {
  'instant-mixes': {
    textAccent: '#C90018',
    softAccent: '#FDECEC',
    packageId: 'bhajiya',
    foodImage: '/images/gujarati/bhajiya-food.webp',
    Icon: CookingPot,
  },
  'traditional-favourites': {
    textAccent: '#A87700',
    softAccent: '#FFF6D6',
    packageId: 'farali-atta',
    foodImage: '/images/gujarati/farali-food.webp',
    Icon: Wheat,
  },
  'sweet-moments': {
    textAccent: '#880E4F',
    softAccent: '#FCEAF3',
    packageId: 'gulab-jamun',
    foodImage: '/images/gujarati/gulab-jamun-food.webp',
    Icon: CakeSlice,
  },
};

function CategoryHeader({
  productCount,
  onViewAll,
}: {
  productCount: number;
  onViewAll: () => void;
}) {
  return (
    <header className="relative z-10">
      <div className="grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h2 className="font-display text-4xl font-black tracking-tight text-[#191919] sm:text-5xl lg:text-6xl">
            Explore by <span className="text-[#C90018]">Category</span>
          </h2>
          <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-[#5C5852] sm:text-base">
            From everyday favourites to festive delights, discover our range of authentic Gujarati
            specialities.
          </p>
        </div>

        <button
          id="view-all-categories-btn"
          type="button"
          onClick={onViewAll}
          className="group mx-auto flex h-11 min-w-[184px] items-center justify-center gap-4 rounded-full border border-[#C90018]/70 bg-white px-5 text-xs font-black uppercase tracking-wider text-[#C90018] transition-colors duration-300 hover:bg-[#C90018] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C90018] md:mx-0 md:mb-2 md:h-12 md:min-w-[210px]"
        >
          View All {productCount} Products
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </header>
  );
}

function CategoryCard({
  category,
  packageProduct,
  onOpen,
  index,
}: {
  category: Category;
  packageProduct?: Product;
  onOpen: () => void;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const visual = CATEGORY_VISUALS[category.id];
  const Icon = visual.Icon;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Explore ${category.name}`}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-[168px] w-full cursor-pointer overflow-hidden rounded-3xl border border-[#EADFCB] bg-white text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 md:h-[560px] md:flex-col lg:h-[600px]"
    >
      <div
        className="absolute -bottom-12 -left-24 h-40 w-36 rotate-6 rounded-[48%] md:bottom-10 md:left-[-24%] md:h-60 md:w-[78%] md:rotate-[-12deg]"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -left-24 h-40 w-36 rotate-6 rounded-[48%] opacity-15 md:bottom-10 md:left-[-24%] md:h-60 md:w-[78%] md:rotate-[-12deg]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.85) 1px, transparent 1px)',
          backgroundSize: '13px 13px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col py-4 pl-14 pr-[36%] md:w-full md:flex-none md:px-7 md:pb-0 md:pt-7 md:pr-7">
        <span
          className="absolute left-4 top-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:static md:h-11 md:w-11"
          style={{ backgroundColor: visual.softAccent, color: visual.textAccent }}
        >
          <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.7} />
        </span>

        <h3 className="font-display mt-1 max-w-[150px] text-lg font-black leading-tight tracking-tight text-[#191919] min-[375px]:text-xl md:mt-4 md:max-w-none md:text-3xl">
          {category.name}
        </h3>
        <p className="mt-3 hidden max-w-[300px] text-sm leading-relaxed text-[#5C5852] md:block">
          {category.description}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-1 right-8 z-10 h-[150px] w-[34%] md:bottom-[62px] md:left-0 md:right-0 md:h-[260px] md:w-full">
        {packageProduct?.imageUrl && (
          <img
            src={packageProduct.imageUrl}
            alt={`${packageProduct.name} package`}
            className="absolute bottom-2 right-0 z-20 h-[128px] w-auto max-w-full object-contain drop-shadow-[0_10px_12px_rgba(45,24,10,.18)] transition-transform duration-300 group-hover:scale-[1.025] md:bottom-0 md:left-[12%] md:right-auto md:h-[225px] md:w-[42%]"
          />
        )}
        <img
          src={visual.foodImage}
          alt=""
          aria-hidden="true"
          className="absolute bottom-[-8px] right-[-3%] hidden h-[190px] w-[62%] object-contain object-bottom drop-shadow-[0_10px_10px_rgba(45,24,10,.13)] transition-transform duration-300 group-hover:scale-[1.02] md:block"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 hidden h-[62px] items-center justify-between border-t border-[#EADFCB] bg-white px-7 md:flex">
        <span
          className="text-xs font-black uppercase tracking-wider"
          style={{ color: visual.textAccent }}
        >
          Explore {category.name}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border bg-white transition-colors duration-300"
          style={{ borderColor: `${visual.textAccent}66`, color: visual.textAccent }}
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>

      <span
        className="absolute bottom-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border bg-white md:hidden"
        style={{ borderColor: `${visual.textAccent}55`, color: visual.textAccent }}
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  );
}

export const ShopByCategory: React.FC = () => {
  const { navigateTo, products, categories } = useStore();
  const shownCategories = categories.filter((category) => CATEGORY_VISUALS[category.id]).slice(0, 3);

  return (
    <section
      id="shop-by-category-section"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-b border-[#EADFCB] bg-[#FCFAF5] py-16 sm:py-20 lg:py-24"
    >
      <img
        src="/images/gujarati/category-decorations.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-0 z-0 hidden w-[390px] select-none object-contain sm:block lg:-right-10 lg:w-[560px]"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 h-40 w-32 overflow-hidden sm:hidden"
        aria-hidden="true"
      >
        <img
          src="/images/gujarati/category-decorations.webp"
          alt=""
          className="absolute -top-1 right-12 w-[260px] max-w-none select-none"
        />
      </div>
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 hidden h-56 w-56 rounded-full border border-[#EADFCB] lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <CategoryHeader
          productCount={products.length}
          onViewAll={() => navigateTo('shop', { category: 'all' })}
        />

        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
          {shownCategories.map((category, index) => {
            const categoryProducts = products.filter((product) => product.category === category.id);
            const visual = CATEGORY_VISUALS[category.id];
            const packageProduct =
              categoryProducts.find((product) => product.id === visual.packageId) ??
              categoryProducts[0];

            return (
              <div
                key={category.id}
                className={
                  index === 2
                    ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-12px)] xl:col-span-1 xl:mx-0 xl:w-auto'
                    : ''
                }
              >
                <CategoryCard
                  category={category}
                  packageProduct={packageProduct}
                  onOpen={() => navigateTo('shop', { category: category.id })}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
