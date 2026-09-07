'use client';

import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

export const ComboQuickView: React.FC = () => {
  const { quickViewCombo, setQuickViewCombo, showToast } = useStore();
  const { addCombo } = useCart();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && quickViewCombo) setQuickViewCombo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewCombo, setQuickViewCombo]);

  if (!quickViewCombo) return null;

  const addToCart = () => {
    addCombo(quickViewCombo);
    showToast('Combo added!', `${quickViewCombo.name} is in your basket.`, 'success');
    setQuickViewCombo(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-6"
      onClick={() => setQuickViewCombo(null)}
    >
      <div
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-[#EADFCB] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setQuickViewCombo(null)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#3E2723] shadow"
          aria-label="Close combo"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-[#FFF3E0] px-6 pb-5 pt-8">
          {quickViewCombo.discount > 0 && (
            <span className="rounded bg-[#C62828] px-2 py-0.5 text-[0.65rem] font-bold text-white">
              {quickViewCombo.discount}% OFF
            </span>
          )}
          <div className="mt-4 flex h-[110px] items-end justify-center">
            {quickViewCombo.items.slice(0, 3).map((item, index) => (
              <img
                key={item.productId}
                src={item.imageUrl}
                alt=""
                className="h-[100px] w-[80px] object-contain drop-shadow-[0_8px_16px_rgba(62,39,35,0.2)]"
                style={{ marginLeft: index === 0 ? 0 : -22, zIndex: index + 1 }}
              />
            ))}
          </div>
          <h2 className="font-display mt-4 text-center text-2xl font-bold text-[#3E2723]">
            {quickViewCombo.name}
          </h2>
          <p className="mt-1 text-center text-sm text-[#8D6E63]">{quickViewCombo.tagline}</p>
        </div>

        <div className="space-y-2 px-6 py-4">
          {quickViewCombo.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-[#F0E4D0] bg-[#FFFBF5] p-2.5">
              <div className="flex h-14 w-12 items-center justify-center rounded-lg bg-white">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="max-h-12 max-w-10 object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#3E2723]">{item.name}</p>
                <p className="text-[0.72rem] text-[#8D6E63]">
                  {item.weight}
                  {item.quantity > 1 ? ` · ×${item.quantity}` : ''}
                </p>
              </div>
              <span className="text-sm font-bold text-[#3E2723]">₹{item.price}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F0E4D0] px-6 py-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-[#8D6E63]">Combo price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#3E2723]">₹{quickViewCombo.price}</span>
              {quickViewCombo.compareAtPrice > quickViewCombo.price && (
                <span className="text-sm text-[#8D6E63] line-through">₹{quickViewCombo.compareAtPrice}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={addToCart}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#D46A1E] text-sm font-bold text-white hover:bg-[#A84F10]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};
