'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PageView, Product, MoodTag, ProductCategory, DietaryFilterId, Category, PublicCombo } from '../types';
import { hrefForPage, pageFromPathname, type NavigateParams } from '../lib/routes';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  currentPage: PageView;
  navigateTo: (page: PageView, params?: NavigateParams) => void;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  activeCategoryFilter: ProductCategory | 'all';
  setActiveCategoryFilter: (cat: ProductCategory | 'all') => void;
  activeMoodFilter: MoodTag | 'all';
  setActiveMoodFilter: (mood: MoodTag | 'all') => void;
  activeDietaryFilter: DietaryFilterId;
  setActiveDietaryFilter: (dietary: DietaryFilterId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  quickViewCombo: PublicCombo | null;
  setQuickViewCombo: (combo: PublicCombo | null) => void;
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  currentParams: { orderId?: string; productId?: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
  products: Product[];
  categories: Category[];
}> = ({ children, products, categories }) => {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewCombo, setQuickViewCombo] = useState<PublicCombo | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const currentPage = pageFromPathname(pathname);
  const productSlug = pathname.startsWith('/product/') ? pathname.split('/')[2] : null;
  const selectedProduct =
    products.find((p) => p.slug === productSlug || p.id === productSlug) ?? null;
  const selectedProductId = selectedProduct?.id ?? null;

  const activeCategoryFilter = (searchParams.get('category') as ProductCategory | null) ?? 'all';
  const activeMoodFilter = (searchParams.get('mood') as MoodTag | 'all' | null) ?? 'all';
  const activeDietaryFilter = (searchParams.get('dietary') as DietaryFilterId | null) ?? 'all';
  const searchQuery = searchParams.get('q') ?? '';

  const trackingOrderId = pathname.startsWith('/track-order/')
    ? decodeURIComponent(pathname.split('/')[2] || '')
    : null;

  const pushShopParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === 'all') params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `/shop?${qs}` : '/shop');
    },
    [router, searchParams]
  );

  const navigateTo = useCallback(
    (page: PageView, params?: NavigateParams) => {
      router.push(hrefForPage(page, params, products));
    },
    [products, router]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 2500);
    },
    [removeToast]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        currentPage,
        navigateTo,
        selectedProductId,
        selectedProduct,
        activeCategoryFilter,
        setActiveCategoryFilter: (cat) => pushShopParams({ category: cat }),
        activeMoodFilter,
        setActiveMoodFilter: (mood) => pushShopParams({ mood }),
        activeDietaryFilter,
        setActiveDietaryFilter: (dietary) => pushShopParams({ dietary }),
        searchQuery,
        setSearchQuery: (query) => pushShopParams({ q: query || null }),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        quickViewProduct,
        setQuickViewProduct,
        quickViewCombo,
        setQuickViewCombo,
        toasts,
        showToast,
        removeToast,
        trackingOrderId,
        setTrackingOrderId: (id) => {
          if (id) router.push(`/track-order/${encodeURIComponent(id)}`);
          else router.push('/track-order');
        },
        currentParams: {
          orderId: trackingOrderId ?? undefined,
          productId: selectedProductId ?? undefined,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
