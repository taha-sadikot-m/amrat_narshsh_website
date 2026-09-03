'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Coupon } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  GUJARAT10: {
    code: 'GUJARAT10',
    discountPercentage: 10,
    minOrderValue: 200,
    description: '10% OFF on all Gujarati Instant Mixes',
  },
  HERITAGE1956: {
    code: 'HERITAGE1956',
    discountPercentage: 15,
    minOrderValue: 499,
    description: '15% OFF on celebration orders above ₹499',
  },
  TASTEOFHOME: {
    code: 'TASTEOFHOME',
    discountPercentage: 20,
    minOrderValue: 799,
    description: '20% OFF on family pantry orders above ₹799',
  },
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'amrat_narsih_cart_v1';
const COUPON_STORAGE_KEY = 'amrat_narsih_coupon_v1';
const FREE_SHIPPING_THRESHOLD = 499;

const DEMO_CART: CartItem[] = [
  {
    id: 'bhajiya-500g',
    productId: 'bhajiya',
    name: 'Bhajiya Instant Mix',
    gujaratiName: 'ભજીયા ઇન્સ્ટન્ટ મિક્સ',
    weight: '500g',
    price: 120,
    quantity: 2,
    heroColor: '#C90018',
    makesText: 'Crispy & Golden Platter',
  },
  {
    id: 'dalwada-200g',
    productId: 'dalwada',
    name: 'Dalwada Instant Mix',
    gujaratiName: 'દાલવડા ઇન્સ્ટન્ટ મિક્સ',
    weight: '200g',
    price: 65,
    quantity: 1,
    heroColor: '#7C4A27',
    makesText: 'Makes 21 WADA',
  },
  {
    id: 'surti-locho-200g',
    productId: 'surti-locho',
    name: 'Surti Locho Instant Mix',
    gujaratiName: 'સુરતી લોચો ઇન્સ્ટન્ટ મિક્સ',
    weight: '200g',
    price: 65,
    quantity: 1,
    heroColor: '#F57C00',
    makesText: 'Pioneer Taste of Surat',
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      setItems(saved ? JSON.parse(saved) : DEMO_CART);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      setAppliedCoupon(savedCoupon ? JSON.parse(savedCoupon) : null);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota fallback
    }
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon, ready]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const compositeId = `${item.productId}-${item.weight}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === compositeId);
      if (existing) {
        return prev.map((i) =>
          i.id === compositeId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: compositeId }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[code];
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try GUJARAT10 or HERITAGE1956.' };
    }
    const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (currentSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Add items worth ₹${coupon.minOrderValue - currentSubtotal} more to use ${code}.`,
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon applied! ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100)
    : 0;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + shipping);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
