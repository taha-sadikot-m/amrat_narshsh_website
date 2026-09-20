'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { StoreProvider } from '../context/StoreContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { AuthProvider } from '../context/AuthContext';
import { AnnouncementBar } from './common/AnnouncementBar';
import { ScrollProgressBar } from './common/ScrollProgressBar';
import { Navbar } from './common/Navbar';
import { Footer } from './common/Footer';
import { CartDrawer } from './common/CartDrawer';
import { QuickViewModal } from './common/QuickViewModal';
import { ComboQuickView } from './common/ComboQuickView';
import { SearchModal } from './common/SearchModal';
import { ToastContainer } from './common/ToastContainer';
import { MobileBottomNav } from './common/MobileBottomNav';
import type { Category, Product, HomeMerchConfig, HeroCarouselPublic } from '../types';

type CatalogProps = {
  products: Product[];
  categories: Category[];
  homeMerch?: HomeMerchConfig;
  hero?: HeroCarouselPublic | null;
};

function Shell({ children, products, categories, homeMerch, hero }: { children: React.ReactNode } & CatalogProps) {
  return (
    <StoreProvider products={products} categories={categories} homeMerch={homeMerch} hero={hero}>
      <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#3E2723] font-sans antialiased selection:bg-[#D46A1E] selection:text-white overflow-x-clip">
            <ScrollProgressBar />
            <AnnouncementBar />
            <Navbar />
            <div className="flex-1 flex flex-col w-full relative">{children}</div>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
            <ComboQuickView />
            <SearchModal />
            <ToastContainer />
            <MobileBottomNav />
          </div>
        </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export function AppProviders({
  children,
  products,
  categories,
  homeMerch,
  hero,
}: { children: React.ReactNode } & CatalogProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }
  return (
    <Suspense fallback={null}>
      <Shell products={products} categories={categories} homeMerch={homeMerch} hero={hero}>{children}</Shell>
    </Suspense>
  );
}
