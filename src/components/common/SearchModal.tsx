'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductPackshot } from '../../data/brandAssets';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, navigateTo, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const normalized = searchTerm.trim().toLowerCase();

  const matchedProducts = normalized
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.gujaratiName.toLowerCase().includes(normalized) ||
          p.tagline.toLowerCase().includes(normalized) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(normalized)) ||
          p.categoryName.toLowerCase().includes(normalized)
      )
    : [];

  const handleProductSelect = (productId: string) => {
    closeSearch();
    navigateTo('product-detail', { productId });
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={closeSearch}
    >
      <div
        id="search-modal-card"
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#EADFCB] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center space-x-3 bg-[#FCFAF5]">
          <Search className="w-5 h-5 text-[#C90018] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search instant mixes or ingredients..."
            className="flex-1 text-base sm:text-lg font-medium text-gray-900 bg-transparent placeholder-gray-400 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 text-xs font-bold bg-white border border-gray-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!normalized ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C400]" />
                  <span>Popular Heritage Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {products.slice(0, 9).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSearchTerm(product.name)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FFF8EC] text-[#6F3E24] hover:bg-[#C90018] hover:text-white border border-[#F4C400]/40 transition-all cursor-pointer"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Product Highlights
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {products.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProductSelect(p.id)}
                      className="p-2 rounded-xl border border-gray-100 hover:border-[#C90018] bg-white hover:bg-[#FFF8EC]/30 text-left transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <div className="w-8 h-10 shrink-0">
                        <ProductPackshot productId={p.id} src={p.imageUrl} className="w-full h-full" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-[#C90018] font-semibold">₹{p.defaultPrice}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matched Products */}
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Products ({matchedProducts.length})</span>
                  {matchedProducts.length > 0 && (
                    <button
                      onClick={() => {
                        closeSearch();
                        navigateTo('shop', { search: searchTerm });
                      }}
                      className="text-xs font-bold text-[#C90018] hover:underline cursor-pointer"
                    >
                      View in Shop →
                    </button>
                  )}
                </div>

                {matchedProducts.length === 0 ? (
                  <p className="text-xs text-gray-500 py-2">
                    No products matching "{searchTerm}". Try searching for Bhajiya, Locho, or Gota.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {matchedProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className="p-3 rounded-2xl border border-gray-100 hover:border-[#C90018] hover:bg-[#FFF8EC]/40 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-12 shrink-0">
                            <ProductPackshot productId={product.id} src={product.imageUrl} className="w-full h-full" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#C90018] truncate">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-gujarati">
                              {product.gujaratiName}
                            </div>
                            <div className="text-[10px] text-[#6F3E24] font-medium truncate">
                              {product.makesText}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <div className="text-xs font-black text-[#C90018]">
                            ₹{product.defaultPrice}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {product.defaultWeight}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
