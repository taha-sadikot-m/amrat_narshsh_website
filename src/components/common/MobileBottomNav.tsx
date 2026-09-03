'use client';

import React from 'react';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigateTo } = useStore();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div
      id="mobile-bottom-navigation-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF5]/95 backdrop-blur-md border-t border-[#EADFCB] py-2 px-6 flex items-center justify-around shadow-lg"
    >
      <button
        id="mobile-tab-home"
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
          currentPage === 'home' ? 'text-[#C90018]' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Home</span>
      </button>

      <button
        id="mobile-tab-shop"
        onClick={() => navigateTo('shop')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
          currentPage === 'shop' || currentPage === 'products' || currentPage === 'product-detail'
            ? 'text-[#C90018]'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Shop</span>
      </button>

      <button
        id="mobile-tab-wishlist"
        onClick={() => navigateTo('shop')}
        className="relative flex flex-col items-center justify-center p-1 rounded-xl text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-1 bg-[#F4C400] text-[#191919] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>

      <button
        id="mobile-tab-cart"
        onClick={openCart}
        className="relative flex flex-col items-center justify-center p-1 rounded-xl text-[#C90018] transition-colors cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#C90018] text-white text-[9px] font-black px-1 rounded-full">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5">Basket</span>
      </button>
    </div>
  );
};
