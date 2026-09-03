'use client';

import React from 'react';

interface ProductSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'carousel';
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E8DCC9] bg-[#FFFDFC] p-3 shadow-[0_8px_30px_rgba(70,45,20,0.05)] sm:p-4"
      aria-hidden="true"
    >
      <div className="flex min-h-7 items-start justify-between">
        <div className="h-5 w-16 rounded-full shimmer-element" />
        <div className="h-8 w-8 rounded-full shimmer-element" />
      </div>

      <div className="relative -mx-1 mt-1 h-[165px] overflow-hidden sm:h-[210px] lg:h-[225px] xl:h-[250px]">
        <div className="absolute bottom-3 left-[10%] h-[86%] w-[53%] rounded-xl shimmer-element" />
        <div className="absolute -bottom-1 -right-[12%] h-[60%] w-[40%] rounded-full shimmer-element opacity-70" />
      </div>

      <div className="mt-auto space-y-2 pt-2">
        <div className="h-5 w-4/5 rounded-md shimmer-element" />
        <div className="h-3 w-12 rounded-md shimmer-element" />
        <div className="flex items-center justify-between border-t border-[#EADFCB]/70 pt-3">
          <div className="h-6 w-14 rounded-md shimmer-element" />
          <div className="h-9 w-16 rounded-full shimmer-element sm:h-10 sm:w-20" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      id="product-grid-skeleton"
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
      role="status"
      aria-label="Loading products..."
    >
      {items.map((key) => (
        <ProductCardSkeleton key={key} />
      ))}
      <span className="sr-only">Loading products...</span>
    </div>
  );
};

export const ProductCarouselSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      id="product-carousel-skeleton"
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
      role="status"
      aria-label="Loading carousel products..."
    >
      {items.map((key) => (
        <ProductCardSkeleton key={key} />
      ))}
      <span className="sr-only">Loading featured products...</span>
    </div>
  );
};

export default ProductGridSkeleton;
