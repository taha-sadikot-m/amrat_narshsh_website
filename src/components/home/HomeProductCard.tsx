'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { VegBadge } from '../../data/brandAssets';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { categoryLabel, defaultPack, discountPercent } from '../../lib/home-catalog';

export function HomeProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useStore();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const pack = defaultPack(product);
  const price = pack?.price ?? product.defaultPrice;
  const compare = pack?.compareAtPrice ?? product.compareAtPrice;
  const discount = discountPercent(price, compare);
  const social = {
    rating: product.rating.toFixed(1),
    purchased: `${product.reviewCount} reviews`,
  };
  const favourite = isInWishlist(product.id);

  const addToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      gujaratiName: product.gujaratiName,
      weight: pack?.weight ?? product.defaultWeight,
      price,
      quantity: 1,
      heroColor: product.heroColor,
      makesText: product.makesText,
    });
    showToast('Added to Cart!', `${product.name} is in your basket.`, 'success');
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#F0E4D0] bg-white shadow-[0_2px_12px_rgba(62,39,35,0.07)] transition-all duration-[250ms] ease-out hover:-translate-y-[5px] hover:border-[#D46A1E] hover:shadow-[0_12px_32px_rgba(62,39,35,0.15)]">
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />

      {discount > 0 && (
        <span className="absolute left-0 top-0 z-20 rounded-br-lg bg-[#C62828] px-2.5 py-1 text-[0.68rem] font-bold uppercase text-white">
          {discount}% OFF
        </span>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border bg-white/92 transition-colors duration-200 ${
          favourite ? 'border-[#C62828] text-[#C62828]' : 'border-[#F0E4D0] text-[#8D6E63] hover:border-[#C62828] hover:text-[#C62828]'
        }`}
        aria-label={favourite ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`h-4 w-4 ${favourite ? 'fill-current' : ''}`} />
      </button>

      <div className="flex h-[180px] items-center justify-center overflow-hidden bg-[#FFF9F2] p-4">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            className="max-h-[150px] max-w-[140px] object-contain drop-shadow-[0_4px_12px_rgba(62,39,35,0.12)] transition-transform duration-[350ms] group-hover:scale-[1.07]"
          />
        )}
      </div>

      <div className="p-3.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-[#3E2723]">
            <Star className="h-3.5 w-3.5 fill-[#B8860B] text-[#B8860B]" />
            {social.rating}
          </span>
          <span className="text-[0.72rem] text-[#8D6E63]">{social.purchased}</span>
        </div>
        <p className="mb-0.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[#8D6E63]">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mb-1 line-clamp-2 text-[0.95rem] font-bold leading-snug text-[#3E2723]">{product.name}</h3>
        {product.gujaratiName && (
          <p className="font-gujarati mb-2 text-[0.7rem] text-[#B8860B]">{product.gujaratiName}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[1.15rem] font-extrabold text-[#3E2723]">₹{price}</span>
          {compare && compare > price && (
            <span className="text-[0.82rem] text-[#8D6E63] line-through">₹{compare}</span>
          )}
          {discount > 0 && (
            <span className="rounded bg-[#E8F5E9] px-1.5 py-0.5 text-[0.68rem] font-bold text-[#2E7D32]">
              {discount}% OFF
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 rounded-[3px] border border-[#2E7D32] bg-[#E8F5E9] px-1.5 py-px text-[0.6rem] font-bold text-[#2E7D32]">
            VEG
            <VegBadge size={10} />
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className={`relative z-20 mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-[0.85rem] font-bold text-white transition-colors duration-200 ${
            added ? 'bg-[#2E7D32]' : 'bg-[#D46A1E] hover:bg-[#A84F10] hover:shadow-[0_4px_14px_rgba(212,106,30,0.4)]'
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              ADDED!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              ADD TO CART
            </>
          )}
        </button>
      </div>
    </article>
  );
}
