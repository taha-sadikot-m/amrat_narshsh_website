'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { VegBadge, Since1956Badge } from '../../data/brandAssets';
import { ProductGridSkeleton } from '../common/ProductSkeleton';
import { EditorialProductCard } from '../home/EditorialProductCard';
import { ProductListView } from './ProductListView';
import { ProductCategory, MoodTag, SortOptionId, Product } from '../../types';
import { useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';

type PriceTier = 'all' | 'under-100' | '100-140' | 'above-140';

export const ShopPage: React.FC<{ products?: Product[] }> = ({ products = [] }) => {
  const {
    activeCategoryFilter,
    setActiveCategoryFilter,
    activeMoodFilter,
    setActiveMoodFilter,
    searchQuery,
    setSearchQuery,
    showToast,
    categories,
  } = useStore();

  const { addItem } = useCart();
  const reduceMotion = Boolean(useReducedMotion());

  // Local view and filter states
  const [sortBy, setSortBy] = useState<SortOptionId>('popularity');
  const [priceTier, setPriceTier] = useState<PriceTier>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Smooth loading simulation on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [activeCategoryFilter, activeMoodFilter, priceTier, sortBy, searchQuery]);

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category filter
      if (activeCategoryFilter !== 'all' && product.category !== activeCategoryFilter) {
        return false;
      }

      // 2. Price Tier filter
      if (priceTier === 'under-100' && product.defaultPrice >= 100) return false;
      if (priceTier === '100-140' && (product.defaultPrice < 100 || product.defaultPrice > 140)) return false;
      if (priceTier === 'above-140' && product.defaultPrice <= 140) return false;

      // 3. Mood tag filter
      if (activeMoodFilter !== 'all' && !product.moodTags.includes(activeMoodFilter)) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesGujarati = product.gujaratiName.toLowerCase().includes(q);
        const matchesHindi = product.hindiName?.toLowerCase().includes(q) ?? false;
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesIngredients = product.ingredients.some((i) => i.toLowerCase().includes(q));
        const matchesBadges = product.badges.some((b) => b.toLowerCase().includes(q));
        if (!matchesName && !matchesGujarati && !matchesHindi && !matchesTagline && !matchesIngredients && !matchesBadges) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'popularity') {
        const scoreA = (a.isBestseller ? 1000 : 0) + a.reviewCount * a.rating;
        const scoreB = (b.isBestseller ? 1000 : 0) + b.reviewCount * b.rating;
        return scoreB - scoreA;
      }
      if (sortBy === 'price-low') return a.defaultPrice - b.defaultPrice;
      if (sortBy === 'price-high') return b.defaultPrice - a.defaultPrice;
      if (sortBy === 'rating') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      }
      if (sortBy === 'cooking-time') return a.cookingTimeMinutes - b.cookingTimeMinutes;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [activeCategoryFilter, activeMoodFilter, priceTier, searchQuery, sortBy, products]);

  // Counts for Category Badges
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      'instant-mixes': products.filter((p) => p.category === 'instant-mixes').length,
      'traditional-favourites': products.filter((p) => p.category === 'traditional-favourites').length,
      'sweet-moments': products.filter((p) => p.category === 'sweet-moments').length,
    };
  }, []);

  // Check if any filter is actively applied
  const isAnyFilterActive =
    activeCategoryFilter !== 'all' ||
    priceTier !== 'all' ||
    activeMoodFilter !== 'all' ||
    searchQuery.trim().length > 0 ||
    sortBy !== 'popularity';

  const handleResetAllFilters = () => {
    setActiveCategoryFilter('all');
    setPriceTier('all');
    setActiveMoodFilter('all');
    setSearchQuery('');
    setSortBy('popularity');
    showToast('Filters Reset', 'Showing all 11 authentic Gujarati mixes.', 'info');
  };

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
    if (!reduceMotion) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
    showToast('Added to Basket', `${product.name} (${product.defaultWeight}) added!`, 'success');
  };

  return (
    <div id="shop-catalog-page" className="py-8 sm:py-12 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#EADFCB] shadow-2xs">
            <Since1956Badge className="w-4 h-4 text-[#C90018]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#6F3E24]">
              Heritage Pantry Catalog • Since 1956
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight">
            Authentic Gujarati Pantry &amp; Mixes
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            11 time-tested instant mixes and traditional flours made with pure stone-ground pulses, authentic Gujarati spices, and zero chemical preservatives.
          </p>
        </div>

        {/* Master Control Filter Panel */}
        <div
          id="shop-filters-panel"
          className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EADFCB] shadow-xs space-y-5"
        >
          
          {/* Row 1: Search, Sort Dropdown & Layout View Toggle */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipe name, pulse (dal), or Gujarati ingredient..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-2xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#C90018] focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  id="shop-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-black font-bold p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort Dropdown & View Mode Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
              
              {/* Sort by Dropdown */}
              <div className="flex items-center space-x-2 bg-[#FCFAF5] px-3 py-1.5 rounded-2xl border border-[#EADFCB]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#C90018] shrink-0" />
                <label htmlFor="shop-sort-select" className="text-[11px] font-bold text-gray-600 shrink-0">
                  Sort:
                </label>
                <select
                  id="shop-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOptionId)}
                  className="bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="popularity">Popularity &amp; Bestsellers</option>
                  <option value="price-low">Price: Low to High (₹)</option>
                  <option value="price-high">Price: High to Low (₹)</option>
                  <option value="rating">Highest Rated (★ 4.9+)</option>
                  <option value="cooking-time">Fastest Prep Time (8–15 mins)</option>
                  <option value="name-asc">Alphabetical (A to Z)</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-[#FCFAF5] p-1 rounded-2xl border border-[#EADFCB]">
                <button
                  id="view-mode-grid"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#C90018] shadow-xs'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  id="view-mode-list"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#C90018] shadow-xs'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Row 2: Category Filter Tabs */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 shrink-0">
                Categories:
              </span>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* All Categories */}
                <button
                  id="category-filter-all"
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#C90018] text-white shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-700 hover:bg-[#FFF8EC] border border-[#EADFCB]'
                  }`}
                >
                  <span>All Recipes</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategoryFilter === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {categoryCounts.all}
                  </span>
                </button>

                {/* Instant Mixes */}
                <button
                  id="category-filter-instant-mixes"
                  onClick={() => setActiveCategoryFilter('instant-mixes')}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeCategoryFilter === 'instant-mixes'
                      ? 'bg-[#C90018] text-white shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-700 hover:bg-[#FFF8EC] border border-[#EADFCB]'
                  }`}
                >
                  <span>Instant Mixes</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategoryFilter === 'instant-mixes'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {categoryCounts['instant-mixes']}
                  </span>
                </button>

                {/* Traditional Favourites */}
                <button
                  id="category-filter-traditional-favourites"
                  onClick={() => setActiveCategoryFilter('traditional-favourites')}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeCategoryFilter === 'traditional-favourites'
                      ? 'bg-[#C90018] text-white shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-700 hover:bg-[#FFF8EC] border border-[#EADFCB]'
                  }`}
                >
                  <span>Traditional Favourites</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategoryFilter === 'traditional-favourites'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {categoryCounts['traditional-favourites']}
                  </span>
                </button>

                {/* Sweet Moments */}
                <button
                  id="category-filter-sweet-moments"
                  onClick={() => setActiveCategoryFilter('sweet-moments')}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeCategoryFilter === 'sweet-moments'
                      ? 'bg-[#C90018] text-white shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-700 hover:bg-[#FFF8EC] border border-[#EADFCB]'
                  }`}
                >
                  <span>Sweet Moments</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategoryFilter === 'sweet-moments'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200/70 text-gray-600'
                    }`}
                  >
                    {categoryCounts['sweet-moments']}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Quick Price Filters & Fast Cravings */}
          <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Price Tiers */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mr-1">
                Price:
              </span>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-100', label: 'Under ₹100' },
                { id: '100-140', label: '₹100 – ₹140' },
                { id: 'above-140', label: '₹140+' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  id={`price-tier-${tier.id}`}
                  onClick={() => setPriceTier(tier.id as PriceTier)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    priceTier === tier.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Mood / Occasion shortcut */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-400 mr-1">Craving:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'crispy', label: 'Crispy' },
                { id: 'savoury', label: 'Savoury' },
                { id: 'breakfast', label: 'Breakfast' },
                { id: 'evening-snack', label: 'Tea Nasto' },
              ].map((tag) => (
                <button
                  key={tag.id}
                  id={`mood-filter-${tag.id}`}
                  onClick={() => setActiveMoodFilter(tag.id as any)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                    activeMoodFilter === tag.id
                      ? 'bg-[#C90018] text-white'
                      : 'bg-[#FCFAF5] text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Active Filters Ribbon (Shows only when filter is applied) */}
          {isAnyFilterActive && (
            <div
              id="active-filters-ribbon"
              className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap bg-[#FCFAF5] p-3 rounded-2xl border"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold text-gray-500 flex items-center space-x-1">
                  <Filter className="w-3 h-3 text-[#C90018]" />
                  <span>Active Filters:</span>
                </span>

                {/* Category Pill */}
                {activeCategoryFilter !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs">
                    <span>Category: {categories.find((c) => c.id === activeCategoryFilter)?.name}</span>
                    <button
                      onClick={() => setActiveCategoryFilter('all')}
                      className="hover:text-[#C90018] cursor-pointer"
                      aria-label="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Price Tier Pill */}
                {priceTier !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs">
                    <span>Price: {priceTier === 'under-100' ? '< ₹100' : priceTier === '100-140' ? '₹100–₹140' : '> ₹140'}</span>
                    <button
                      onClick={() => setPriceTier('all')}
                      className="hover:text-[#C90018] cursor-pointer"
                      aria-label="Remove price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Mood Tag Pill */}
                {activeMoodFilter !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs">
                    <span>Craving: {activeMoodFilter}</span>
                    <button
                      onClick={() => setActiveMoodFilter('all')}
                      className="hover:text-[#C90018] cursor-pointer"
                      aria-label="Remove craving filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Search Query Pill */}
                {searchQuery && (
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs">
                    <span>Query: "{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-[#C90018] cursor-pointer"
                      aria-label="Remove search filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Reset All Filters Button */}
              <button
                id="reset-all-filters-btn"
                onClick={handleResetAllFilters}
                className="text-xs font-extrabold text-[#C90018] hover:text-red-700 flex items-center space-x-1 cursor-pointer underline decoration-dotted"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-gray-600 px-2">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> of{' '}
              <strong className="text-gray-900 font-bold">{products.length}</strong> authentic mixes
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <VegBadge size={14} />
            <span className="font-bold text-gray-800 hidden sm:inline">
              100% Vegetarian Certified
            </span>
          </div>
        </div>

        {/* Product Catalog Display: Grid or List or Skeleton */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          /* Empty Search & Filter State */
          <div
            id="shop-empty-state"
            className="bg-white rounded-3xl p-12 text-center border border-[#EADFCB] space-y-4 max-w-xl mx-auto shadow-xs"
          >
            <div className="w-16 h-16 bg-[#FFF8EC] rounded-full flex items-center justify-center mx-auto text-[#C90018] border border-[#F4C400]/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-gray-900">
              No Recipes Found
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We couldn't find any Amrat Narsih instant mixes matching your combination of dietary needs and category filters. Try resetting the filters or searching for another ingredient.
            </p>
            <div className="pt-2">
              <button
                id="empty-state-reset-btn"
                onClick={handleResetAllFilters}
                className="btn-vibrant-cta text-white px-6 py-2.5 rounded-full text-xs font-black cursor-pointer shadow-md inline-flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters &amp; Show Catalog</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Mode */
          <div
            id="shop-product-grid"
            className="grid grid-cols-2 gap-3 animate-in fade-in duration-300 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* Detailed List View Mode */
          <ProductListView products={filteredProducts} />
        )}

      </div>
    </div>
  );
};
