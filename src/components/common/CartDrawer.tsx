'use client';

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ShoppingBag, 
  Gift, 
  Check, 
  Flame, 
  Award,
  Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { ProductPackshot } from '../../data/brandAssets';
import type { Product } from '../../types';
import { comboQuantityFromLines } from '../../lib/combo-pricing';
import confetti from 'canvas-confetti';

const FREE_GIFT_THRESHOLD = 750;

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    shipping,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addItem,
    updateComboQuantity,
    removeCombo,
  } = useCart();

  const { navigateTo, showToast, products } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponError('');
      setCouponInput('');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast('Coupon Applied!', res.message, 'success');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigateTo('checkout');
  };

  const handleQuickAddProduct = (prod: Product) => {
    addItem({
      productId: prod.id,
      name: prod.name,
      gujaratiName: prod.gujaratiName,
      weight: prod.defaultWeight,
      price: prod.defaultPrice,
      quantity: 1,
      heroColor: prod.heroColor,
      makesText: prod.makesText,
    });
    setJustAddedId(prod.id);
    setTimeout(() => setJustAddedId(null), 1400);
    showToast('Pantry Restocked!', `Added ${prod.name} (₹${prod.defaultPrice})`, 'success');
  };

  // Smart Contextual Pairing Engine
  const getSmartRecommendations = () => {
    const itemIds = items.map((i) => i.productId);
    const recommendations: Product[] = [];

    // Check specific pairing affinities
    if (itemIds.includes('khaman-dhokla') && !itemIds.includes('surti-locho')) {
      const p = products.find((x) => x.id === 'surti-locho');
      if (p) recommendations.push(p);
    }
    if (itemIds.includes('surti-locho') && !itemIds.includes('nylon-khaman')) {
      const p = products.find((x) => x.id === 'nylon-khaman');
      if (p) recommendations.push(p);
    }
    if (itemIds.some((id) => id.includes('gota') || id.includes('bhajiya')) && !itemIds.includes('dakor-gota')) {
      const p = products.find((x) => x.id === 'dakor-gota');
      if (p) recommendations.push(p);
    }
    if (!itemIds.includes('farali-atta') && itemIds.length > 0) {
      const p = products.find((x) => x.id === 'farali-atta');
      if (p && recommendations.length < 3) recommendations.push(p);
    }

    // Fill remaining slots with un-added products
    const unadded = products.filter(
      (p) => !itemIds.includes(p.id) && !recommendations.some((r) => r.id === p.id)
    );

    return [...recommendations, ...unadded].slice(0, 4);
  };

  const smartRecommendations = getSmartRecommendations();

  // Progress towards Free Gift
  const freeGiftProgress = Math.min(Math.round((subtotal / FREE_GIFT_THRESHOLD) * 100), 100);
  const amountToGift = Math.max(0, FREE_GIFT_THRESHOLD - subtotal);

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      onClick={closeCart}
    >
      <div
        id="cart-drawer-panel"
        className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#FCFAF5] shadow-2xl flex flex-col border-l border-[#EADFCB] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-[#EADFCB] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF8EC] text-[#C90018] flex items-center justify-center border border-[#F4C400]/40">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-[#191919] leading-tight">
                  Your Gujarati Pantry
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">
                  {items.reduce((s, i) => s + i.quantity, 0)} items selected
                </p>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={closeCart}
              className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close Basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tiered Progress Tracker (Free Shipping & Heritage Gift) */}
          <div className="px-6 py-3.5 bg-[#FFF8EC] border-b border-[#F4C400]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#6F3E24]">
              <div className="flex items-center space-x-1.5">
                {subtotal >= FREE_GIFT_THRESHOLD ? (
                  <span className="text-[#2E7D32] flex items-center space-x-1">
                    <Gift className="w-4 h-4 text-[#C90018]" />
                    <span>Free Express Shipping + Heritage Seasoning Gift Unlocked!</span>
                  </span>
                ) : subtotal >= freeShippingThreshold ? (
                  <span className="text-[#2E7D32] flex items-center space-x-1">
                    <Truck className="w-4 h-4 text-[#2E7D32]" />
                    <span>Free Shipping Unlocked! Add <strong>₹{amountToGift}</strong> for Free Spice Gift</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <Truck className="w-4 h-4 text-[#C90018]" />
                    <span>
                      Add <strong className="text-[#C90018]">₹{freeShippingThreshold - subtotal}</strong> more for <strong>FREE Shipping</strong>
                    </span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-extrabold text-[#C90018]">
                {subtotal >= FREE_GIFT_THRESHOLD ? '100%' : `${Math.max(freeShippingProgress, freeGiftProgress)}%`}
              </span>
            </div>

            {/* Dual Milestone Track */}
            <div className="relative w-full bg-[#EADFCB] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F4C400] via-[#E31B23] to-[#C90018] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((subtotal / FREE_GIFT_THRESHOLD) * 100, 100)}%` }}
              />
            </div>

            {/* Milestone Markers */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold pt-0.5">
              <span className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${subtotal >= freeShippingThreshold ? 'bg-[#2E7D32]' : 'bg-gray-400'}`} />
                <span>₹500 Free Shipping</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${subtotal >= FREE_GIFT_THRESHOLD ? 'bg-[#C90018]' : 'bg-gray-400'}`} />
                <span>₹750 Free Spice Pack</span>
              </span>
            </div>
          </div>

          {/* Items List or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#FFF8EC] rounded-2xl flex items-center justify-center mx-auto text-[#C90018] border border-[#F4C400]/40 shadow-xs">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-lg text-gray-900">
                    Your Pantry Basket is Empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Stock up on authentic stone-ground Khaman, Locho, and festive Gujarati flour blends.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={() => {
                    closeCart();
                    navigateTo('shop');
                  }}
                  className="bg-[#C90018] hover:bg-[#A50014] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Explore All 11 Instant Mixes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const comboGroups = new Map<string, typeof items>();
                  const singles: typeof items = [];
                  for (const item of items) {
                    if (item.comboId) {
                      const group = comboGroups.get(item.comboId) ?? [];
                      group.push(item);
                      comboGroups.set(item.comboId, group);
                    } else {
                      singles.push(item);
                    }
                  }

                  return (
                    <>
                      {[...comboGroups.entries()].map(([comboId, group]) => {
                        const comboQty = comboQuantityFromLines(group);
                        const comboTotal = group.reduce((sum, item) => sum + item.price * item.quantity, 0);
                        const comboName = group[0]?.comboName ?? 'Combo';
                        return (
                          <div
                            key={comboId}
                            className="rounded-2xl border border-[#D4B896] bg-[#FFF3E0] p-3 shadow-xs"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="rounded bg-[#C62828] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                Combo
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCombo(comboId)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                aria-label="Remove combo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="flex h-16 items-end justify-center">
                              {group.slice(0, 3).map((item, index) => (
                                <div
                                  key={item.id}
                                  className="h-16 w-12"
                                  style={{ marginLeft: index === 0 ? 0 : -10, zIndex: index + 1 }}
                                >
                                  <ProductPackshot
                                    productId={item.productId}
                                    src={products.find((product) => product.id === item.productId)?.imageUrl}
                                    className="h-full w-full"
                                  />
                                </div>
                              ))}
                            </div>
                            <h4 className="font-display mt-2 text-sm font-bold text-[#3E2723]">{comboName}</h4>
                            <ul className="mt-1 space-y-0.5">
                              {group.map((item) => (
                                <li key={item.id} className="flex justify-between text-[11px] text-[#6F3E24]">
                                  <span className="truncate pr-2">
                                    {item.name} · {item.weight}
                                  </span>
                                  <span>×{item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 flex items-center justify-between border-t border-[#EADFCB] pt-2">
                              <span className="text-sm font-extrabold text-[#191919]">₹{comboTotal}</span>
                              <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateComboQuantity(comboId, -1)}
                                  className="p-1 text-gray-600"
                                  aria-label="Decrease combo quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2.5 text-xs font-bold">{comboQty}</span>
                                <button
                                  type="button"
                                  onClick={() => updateComboQuantity(comboId, 1)}
                                  className="p-1 text-gray-600"
                                  aria-label="Increase combo quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {singles.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-[#EADFCB] shadow-xs flex items-center space-x-3 group"
                  >
                    {/* Packshot thumbnail */}
                    <div className="w-14 h-18 shrink-0 rounded-lg overflow-hidden bg-[#FCFAF5] flex items-center justify-center p-1 border border-gray-100">
                      <ProductPackshot
                        productId={item.productId}
                        src={products.find((product) => product.id === item.productId)?.imageUrl}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate font-display">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold bg-[#FFF8EC] text-[#6F3E24] px-2 py-0.5 rounded-md border border-[#F4C400]/30">
                          {item.weight}
                        </span>
                        <span className="text-xs font-extrabold text-[#191919]">
                          ₹{item.price * item.quantity}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          (₹{item.price} each)
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-[#FCFAF5]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-gray-200 rounded-l-lg text-gray-600 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-gray-200 rounded-r-lg text-gray-600 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            )}

            {/* 1-Click "Smart Gujarati Pantry Restock" Bar */}
            {smartRecommendations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#EADFCB] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5 font-display">
                    <Zap className="w-3.5 h-3.5 text-[#C90018] fill-current" />
                    <span>Smart Gujarati Pantry Restock</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6F3E24] bg-[#FFF8EC] px-2 py-0.5 rounded-full border border-[#F4C400]/40">
                    Pairs Perfectly
                  </span>
                </div>

                <div className="space-y-2">
                  {smartRecommendations.map((prod) => {
                    const isAdded = justAddedId === prod.id;
                    return (
                      <div
                        key={prod.id}
                        className="p-2.5 bg-white hover:bg-[#FFF8EC]/60 rounded-xl border border-[#EADFCB] flex items-center justify-between gap-3 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-9 h-11 shrink-0 bg-[#FCFAF5] rounded-md p-0.5 border border-gray-100 flex items-center justify-center">
                            <ProductPackshot productId={prod.id} src={prod.imageUrl} className="w-full h-full" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-gray-900 truncate font-display">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-[#6F3E24] font-semibold flex items-center space-x-1.5">
                              <span>{prod.defaultWeight}</span>
                              <span>•</span>
                              <span className="font-extrabold text-[#C90018]">₹{prod.defaultPrice}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickAddProduct(prod)}
                          disabled={isAdded}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-xs flex items-center space-x-1 ${
                            isAdded
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-[#C90018] hover:bg-[#A50014] text-white active:scale-95'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add ₹{prod.defaultPrice}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EADFCB] space-y-3.5">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-xl text-xs">
                    <div className="flex items-center space-x-1.5 text-green-800 font-medium">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span>
                        <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountPercentage}% OFF applied)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. GUJARAT10)"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl uppercase tracking-wider focus:outline-hidden focus:border-[#C90018] bg-[#FCFAF5]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#191919] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                <div className="flex justify-between">
                  <span>Pantry Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Heritage Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-700 font-bold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {subtotal >= FREE_GIFT_THRESHOLD && (
                  <div className="flex justify-between text-[#C90018] font-bold">
                    <span>Surprise Gujarati Masala Gift</span>
                    <span>FREE (₹90 value)</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2 font-display">
                  <span>Grand Total</span>
                  <span className="text-base text-[#C90018]">₹{total}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                id="drawer-proceed-checkout-btn"
                onClick={handleCheckoutClick}
                className="w-full btn-vibrant-cta text-white py-3.5 rounded-2xl font-display font-bold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-3 text-[10px] text-gray-400 pt-1">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" />
                  100% Stone-Ground Purity
                </span>
                <span>•</span>
                <span>UPI, Cards &amp; COD</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
