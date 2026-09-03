'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Check,
  ShieldCheck,
  Heart,
  Minus,
  Plus,
  Sparkles,
  Clock,
  Flame,
  Leaf,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductPackshot, VegBadge, Since1956Badge } from '../../data/brandAssets';
import confetti from 'canvas-confetti';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, showToast } = useStore();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Sync state whenever quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedWeight(quickViewProduct.defaultWeight);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickViewProduct) {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const isFav = isInWishlist(quickViewProduct.id);

  const currentPack =
    quickViewProduct.packSizes.find((p) => p.weight === selectedWeight) ||
    quickViewProduct.packSizes[0];

  const totalPrice = currentPack.price * quantity;
  const originalTotalPrice = currentPack.compareAtPrice
    ? currentPack.compareAtPrice * quantity
    : null;

  const handleAddToCart = () => {
    addItem({
      productId: quickViewProduct.id,
      name: quickViewProduct.name,
      gujaratiName: quickViewProduct.gujaratiName,
      weight: currentPack.weight,
      price: currentPack.price,
      quantity,
      heroColor: quickViewProduct.heroColor,
      makesText: quickViewProduct.makesText,
    });
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.65 },
    });
    showToast(
      'Added to Basket',
      `${quantity}x ${quickViewProduct.name} (${currentPack.weight}) added!`,
      'success'
    );
    setQuickViewProduct(null);
  };

  // Find key nutrient facts
  const proteinItem = quickViewProduct.verifiedNutrition.find((n) =>
    n.name.toLowerCase().includes('protein')
  );
  const energyItem = quickViewProduct.verifiedNutrition.find((n) =>
    n.name.toLowerCase().includes('energy')
  );

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div
          id="quick-view-modal-backdrop"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={() => setQuickViewProduct(null)}
        >
          <motion.div
            id="quick-view-modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EADFCB] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-quickview-btn"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#C90018] shadow-md border border-[#EADFCB] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column: Visual Showcase & Brand Heritage (5 cols) */}
              <div
                className="md:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-between relative overflow-hidden bg-[#FFF8EC] border-b md:border-b-0 md:border-r border-[#EADFCB]"
              >
                {/* Background Ambient Radial Glow */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${quickViewProduct.heroColor || '#F4C400'} 0%, transparent 70%)`,
                  }}
                />

                {/* Top Badge on packshot */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className="bg-white/90 backdrop-blur-xs text-[#6F3E24] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#EADFCB] uppercase tracking-wider">
                    {quickViewProduct.categoryName}
                  </span>
                  {quickViewProduct.isBestseller && (
                    <span className="bg-[#C90018] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Packshot Image with subtle breathing elevation */}
                <div className="relative w-44 sm:w-52 my-4 drop-shadow-xl z-10 transform hover:scale-105 transition-transform duration-300">
                  <ProductPackshot productId={quickViewProduct.id} src={quickViewProduct.imageUrl} />
                </div>

                {/* Heritage & Quality Assurance Badge */}
                <div className="w-full pt-3 border-t border-[#EADFCB]/60 flex items-center justify-between text-xs text-[#6F3E24] z-10">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <VegBadge size={14} />
                    <span className="text-[11px]">100% Pure Veg</span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#C90018]" />
                    <span>{quickViewProduct.cookingTimeMinutes} Mins Ready</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Essential Details, Pack Sizes & Quick Buy (7 cols) */}
              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  
                  {/* Top Row: Ratings & Wishlist */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-[#FFF8EC] border border-[#F4C400]/60 px-2.5 py-0.5 rounded-lg text-xs font-black text-[#191919]">
                        <Star className="w-3.5 h-3.5 fill-[#F4C400] text-[#F4C400] mr-1" />
                        <span>{quickViewProduct.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        ({quickViewProduct.reviewCount} reviews)
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        isFav
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 bg-[#FCFAF5] hover:bg-white border border-[#EADFCB]'
                      }`}
                      aria-label="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Gujarati Typography */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 leading-tight">
                      {quickViewProduct.name}
                    </h2>
                    <p className="font-gujarati text-sm sm:text-base font-extrabold text-[#C90018] mt-0.5">
                      {quickViewProduct.gujaratiName}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {quickViewProduct.tagline}
                  </p>

                  {/* Price & Taxes Display */}
                  <div className="flex items-baseline space-x-2.5 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      ₹{currentPack.price}
                    </span>
                    {currentPack.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{currentPack.compareAtPrice}
                      </span>
                    )}
                    {currentPack.compareAtPrice && (
                      <span className="text-[10px] font-black text-[#C90018] bg-red-50 px-2 py-0.5 rounded-md uppercase">
                        Save ₹{currentPack.compareAtPrice - currentPack.price}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Taxes Included
                    </span>
                  </div>

                  {/* Quick Feature Pills (Yield + Nutrition) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#6F3E24] bg-[#FFF8EC] px-2.5 py-1 rounded-xl border border-[#F4C400]/40">
                      <Flame className="w-3 h-3 text-[#C90018]" />
                      <span>Makes: {quickViewProduct.makesText}</span>
                    </span>

                    {proteinItem && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>{proteinItem.amount} Protein</span>
                      </span>
                    )}
                  </div>

                  {/* Pack Size Selector */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>Select Pack Size:</span>
                      <span className="text-gray-500 font-normal text-[11px]">
                        Weight: {selectedWeight}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.packSizes.map((pack) => {
                        const isSelected = selectedWeight === pack.weight;
                        return (
                          <button
                            key={pack.weight}
                            onClick={() => setSelectedWeight(pack.weight)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-[#C90018] text-white shadow-xs scale-102'
                                : 'bg-[#FCFAF5] text-gray-800 hover:bg-[#FFF8EC] border border-[#EADFCB]'
                            }`}
                          >
                            <span>{pack.weight}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                              • ₹{pack.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center space-x-3 pt-1">
                    <span className="text-xs font-bold text-gray-800">Quantity:</span>
                    <div className="flex items-center border border-[#EADFCB] rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-[#FCFAF5] rounded-l-xl text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3.5 text-xs font-black text-gray-900 select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-[#FCFAF5] rounded-r-xl text-gray-600 hover:text-black transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom CTA: Add to Basket */}
                <div className="pt-3 border-t border-gray-100">
                  <button
                    id="quickview-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className="w-full btn-vibrant-cta text-white py-3.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Basket • ₹{totalPrice}
                    </span>
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
