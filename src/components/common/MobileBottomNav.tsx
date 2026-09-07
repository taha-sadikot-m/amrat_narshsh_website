'use client';

import React from 'react';
import { Home, ShoppingBag, Heart, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigateTo } = useStore();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
      active ? 'text-[#D46A1E]' : 'text-[#8D6E63]'
    }`;

  return (
    <nav
      id="mobile-bottom-navigation-bar"
      className="fixed inset-x-0 bottom-0 z-[999] flex h-[60px] items-center justify-around border-t border-[#F0E4D0] bg-white shadow-[0_-4px_16px_rgba(62,39,35,0.1)] md:hidden"
    >
      <button type="button" onClick={() => navigateTo('home')} className={itemClass(currentPage === 'home')}>
        <Home className="h-5 w-5" />
        Home
      </button>
      <button
        type="button"
        onClick={() => navigateTo('shop')}
        className={itemClass(currentPage === 'shop' || currentPage === 'products' || currentPage === 'product-detail')}
      >
        <Store className="h-5 w-5" />
        Shop
      </button>
      <button type="button" onClick={() => navigateTo('shop')} className={`relative ${itemClass(false)}`}>
        <Heart className="h-5 w-5" />
        Wishlist
        {wishlistCount > 0 && (
          <span className="absolute right-1 top-0 rounded-full bg-[#C62828] px-1 text-[9px] text-white">{wishlistCount}</span>
        )}
      </button>
      <button type="button" onClick={openCart} className={`relative ${itemClass(false)}`}>
        <ShoppingBag className="h-5 w-5" />
        Cart
        {itemCount > 0 && (
          <span className="absolute right-2 top-0 rounded-full bg-[#C62828] px-1 text-[9px] text-white">{itemCount}</span>
        )}
      </button>
    </nav>
  );
};
