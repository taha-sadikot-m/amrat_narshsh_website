'use client';

import React, { useState } from 'react';
import { ArrowRight, Star, ShoppingBag, Check, Flame, Sparkles, Clock, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { ProductPackshot, VegBadge } from '../../data/brandAssets';
import confetti from 'canvas-confetti';

export const FeaturedProductSpotlight: React.FC = () => {
  const { navigateTo, setQuickViewProduct, showToast, products } = useStore();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<'bhajiya' | 'surti-locho' | 'dalwada'>('surti-locho');

  const product = products.find((p) => p.id === activeTab) || products[0];

  if (!product) return null;

  const handleSpotlightAddToCart = () => {
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
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });
    showToast('Added to Basket', `${product.name} added!`, 'success');
  };

  return (
    <section
      id="spotlight-feature-section"
      className="py-16 bg-[#FFF8EC] border-b border-[#EADFCB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C90018] mb-1">
              Signature Craftsmanship
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#191919]">
              Product Spotlight
            </h2>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-[#EADFCB] shadow-xs">
            {[
              { id: 'surti-locho', label: 'Surti Locho' },
              { id: 'bhajiya', label: 'Bhajiya Mix' },
              { id: 'dalwada', label: 'Dalwada Mix' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C90018] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Packshot with background aura */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-6 bg-[#FCFAF5] rounded-3xl border border-[#EADFCB]">
            <div className="w-48 sm:w-60 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
              <ProductPackshot productId={product.id} src={product.imageUrl} />
            </div>

            <div className="mt-4 flex items-center space-x-2 text-xs font-bold text-[#6F3E24]">
              <VegBadge size={16} />
              <span>{product.makesText}</span>
            </div>
          </div>

          {/* Right: Detailed Story, Nutrition & Quick Buy */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
                  {product.categoryName}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {product.culinaryStory}
            </p>

            {/* Key Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-[#FFF8EC] text-[#6F3E24] border border-[#F4C400]/40 px-3 py-1 rounded-xl text-xs font-semibold"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* Pairing Tip Box */}
            <div className="p-4 bg-[#FFF8EC] rounded-2xl border border-[#F4C400]/50 space-y-1">
              <div className="text-xs font-bold text-[#C90018] uppercase tracking-wide flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef's Recommended Pairing:</span>
              </div>
              <p className="text-xs font-medium text-gray-800">
                {product.servingSuggestion}
              </p>
            </div>

            {/* Price and Add CTA */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-gray-900">
                  ₹{product.defaultPrice}{' '}
                  <span className="text-xs text-gray-400 font-normal">
                    ({product.defaultWeight})
                  </span>
                </div>
                <div className="text-[11px] text-green-700 font-bold">
                  In Stock • Fresh Batch
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => navigateTo('product-detail', { productId: product.id })}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Full Details
                </button>

                <button
                  id={`spotlight-buy-${product.id}`}
                  onClick={handleSpotlightAddToCart}
                  className="flex-1 sm:flex-none btn-vibrant-cta text-white px-6 py-3 rounded-2xl font-display font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket — ₹{product.defaultPrice}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
