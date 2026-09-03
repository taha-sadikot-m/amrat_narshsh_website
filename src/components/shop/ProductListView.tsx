'use client';

import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductPackshot, VegBadge } from '../../data/brandAssets';
import confetti from 'canvas-confetti';

interface ProductListViewProps {
  products: Product[];
}

export const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  const { setQuickViewProduct, showToast } = useStore();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      gujaratiName: product.gujaratiName,
      weight: product.defaultWeight,
      price: product.defaultPrice,
      quantity: 1,
      heroColor: product.heroColor,
      makesText: product.makesText,
    });
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
    });
    showToast('Added to Basket', `${product.name} (${product.defaultWeight}) added!`, 'success');
  };

  return (
    <div id="shop-product-list-view" className="space-y-4">
      {products.map((product) => {
        const isFav = isInWishlist(product.id);

        return (
          <div
            key={product.id}
            id={`product-list-item-${product.id}`}
            onClick={() => setQuickViewProduct(product)}
            className="group bg-white rounded-3xl p-4 sm:p-6 border border-[#EADFCB] shadow-2xs hover:shadow-lg hover:border-[#C90018]/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer"
          >
            {/* Left: Packshot & Visual Identity */}
            <div className="flex items-center space-x-4 sm:space-x-6 w-full md:w-auto">
              <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[#FCFAF5] rounded-2xl p-2 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <ProductPackshot productId={product.id} src={product.imageUrl} />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                {/* Badges & rating — muted on mobile, hidden until hover on desktop */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  <VegBadge size={14} />
                  <span className="bg-[#FFF8EC] text-[#6F3E24] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#F4C400]/40">
                    {product.categoryName}
                  </span>
                  {product.isBestseller && (
                    <span className="bg-[#C90018] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Bestseller
                    </span>
                  )}
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                    <span className="text-gray-900">{product.rating}</span>
                    <span className="text-gray-400 text-[10px] ml-0.5">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 className="font-display font-black text-lg sm:text-xl text-gray-900 group-hover:text-[#C90018] transition-colors leading-tight">
                  {product.name}
                </h3>

                <div className="text-xs text-gray-500 font-bold">
                  {product.defaultWeight} pack • {product.cookingTimeMinutes} mins prep
                </div>
              </div>
            </div>

            {/* Right: Pricing, Wishlist & Add Button */}
            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0 gap-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer opacity-60 lg:opacity-0 lg:group-hover:opacity-100 ${
                    isFav ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 bg-[#FCFAF5] hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                </button>

                <div className="flex items-baseline space-x-1.5 text-right">
                  <span className="text-lg sm:text-xl font-black text-gray-900">
                    ₹{product.defaultPrice}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{product.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                  className="px-3.5 py-2.5 bg-[#FCFAF5] hover:bg-[#FFF8EC] text-gray-700 hover:text-[#C90018] rounded-2xl text-xs font-bold border border-[#EADFCB] transition-colors cursor-pointer inline-flex items-center space-x-1.5 opacity-60 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C90018]" />
                  <span>Quick View</span>
                </button>

                <button
                  id={`list-add-btn-${product.id}`}
                  onClick={(e) => handleQuickAdd(product, e)}
                  className="btn-vibrant-cta text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
