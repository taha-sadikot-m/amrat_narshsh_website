'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';

type EditorialProductCardProps = {
  product: Product;
  onQuickAdd: (product: Product, event: React.MouseEvent) => void;
  index?: number;
};

const EXACT_FOOD_IMAGES: Record<string, string> = {
  bhajiya: '/images/gujarati/bhajiya-food.webp',
  dalwada: '/images/gujarati/dalwada-food.webp',
  'farali-atta': '/images/gujarati/farali-food.webp',
  gobapuri: '/images/gujarati/gobapuri-food.webp',
  'gulab-jamun': '/images/gujarati/gulab-jamun-food.webp',
};

const CATEGORY_FOOD_IMAGES: Record<Product['category'], string> = {
  'instant-mixes': '/images/gujarati/bhajiya-food.webp',
  'traditional-favourites': '/images/gujarati/farali-food.webp',
  'sweet-moments': '/images/gujarati/gulab-jamun-food.webp',
};

function getStatusLabel(product: Product) {
  if (product.isNew) return 'New';
  if (product.id === 'bhajiya' && product.isBestseller) return 'Bestseller';
  if (product.isFeatured) return 'Popular';
  if (product.isBestseller) return 'Bestseller';
  return null;
}

export function EditorialProductCard({
  product,
  onQuickAdd,
  index = 0,
}: EditorialProductCardProps) {
  const { setQuickViewProduct } = useStore();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const reduceMotion = Boolean(useReducedMotion());
  const isFavourite = isInWishlist(product.id);
  const statusLabel = getStatusLabel(product);
  const foodImage = EXACT_FOOD_IMAGES[product.id] ?? CATEGORY_FOOD_IMAGES[product.category];

  const openQuickView = () => setQuickViewProduct(product);

  return (
    <motion.article
      id={`editorial-product-card-${product.id}`}
      onClick={openQuickView}
      initial={reduceMotion ? false : { y: 20 }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#E8DCC9] bg-[#FFFDFC] p-3 shadow-[0_8px_30px_rgba(70,45,20,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-[#D9A441]/65 hover:shadow-[0_13px_34px_rgba(70,45,20,0.1)] sm:p-4"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openQuickView();
        }}
        className="absolute inset-0 z-10 rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#C90018]"
        aria-label={`Quick view ${product.name}`}
      />

      <div className="relative z-30 flex min-h-7 items-start justify-between gap-2">
        <div>
          {statusLabel && (
            <span className="inline-flex rounded-full bg-[#FFF0B8] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#7D5410] sm:text-[9px]">
              {statusLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C90018] ${
            isFavourite
              ? 'bg-[#C90018]/8 text-[#C90018]'
              : 'text-[#383838] hover:bg-[#FFF8EC] hover:text-[#C90018]'
          }`}
          aria-label={isFavourite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isFavourite}
        >
          <Heart className={`h-[18px] w-[18px] ${isFavourite ? 'fill-current' : ''}`} strokeWidth={1.7} />
        </button>
      </div>

      <div className="relative -mx-1 mt-1 h-[165px] overflow-hidden sm:h-[210px] lg:h-[225px] xl:h-[250px]">
        <div
          className="absolute bottom-3 left-[8%] h-[86%] w-[53%] transition-transform duration-300 group-hover:scale-[1.035] sm:left-[10%] sm:h-[88%]"
          aria-hidden={!product.imageUrl}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={`${product.name} packet`}
              className="relative z-20 h-full w-full object-contain drop-shadow-[0_12px_12px_rgba(62,32,17,0.18)]"
              loading="lazy"
            />
          )}
        </div>
        <img
          src={foodImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 -right-[16%] z-10 h-[60%] w-[75%] object-contain object-bottom drop-shadow-[0_10px_10px_rgba(62,32,17,0.12)] transition-transform duration-300 group-hover:scale-[1.025] sm:-right-[12%] sm:h-[64%]"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute bottom-2 left-2 right-2 h-8 rounded-[50%] bg-[#E7D2B5]/20 blur-xl"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-20 mt-auto">
        <h3 className="line-clamp-2 min-h-[38px] font-display text-sm font-black leading-[1.3] text-[#191919] transition-colors group-hover:text-[#C90018] sm:min-h-0 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 text-[10px] font-semibold text-[#77716A] sm:text-[11px]">
          {product.defaultWeight}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EADFCB]/70 pt-3">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <span className="text-base font-black text-[#191919] sm:text-lg">₹{product.defaultPrice}</span>
            {product.compareAtPrice && (
              <span className="text-[9px] text-[#8B8580] line-through sm:text-[10px]">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>
          <button
            id={`editorial-add-btn-${product.id}`}
            type="button"
            onClick={(event) => onQuickAdd(product, event)}
            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#C90018] px-2.5 text-[10px] font-extrabold text-white shadow-[0_5px_14px_rgba(201,0,24,0.22)] transition-[background-color,box-shadow] hover:bg-[#A50013] hover:shadow-[0_7px_18px_rgba(201,0,24,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C90018] sm:h-10 sm:px-3.5 sm:text-xs"
            aria-label={`Add ${product.name} to basket`}
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
