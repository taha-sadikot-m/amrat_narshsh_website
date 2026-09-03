'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Flame,
  ChevronRight,
  Minus,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types';
import { ProductPackshot, VegBadge, Since1956Badge } from '../../data/brandAssets';
import { EditorialProductCard } from '../home/EditorialProductCard';
import { useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';

export const ProductDetailPage: React.FC<{
  product: Product;
  relatedProducts: Product[];
}> = ({ product, relatedProducts }) => {
  const { navigateTo, showToast } = useStore();
  const { addItem, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const reduceMotion = Boolean(useReducedMotion());

  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedWeight(product.defaultWeight);
      setQuantity(1);
      setPincodeStatus(null);
    }
  }, [product]);

  const currentPack =
    product.packSizes.find((p) => p.weight === selectedWeight) || product.packSizes[0];

  const isFav = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      gujaratiName: product.gujaratiName,
      weight: currentPack.weight,
      price: currentPack.price,
      quantity,
      heroColor: product.heroColor,
      makesText: product.makesText,
    });
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });
    showToast('Added to Basket', `${quantity}x ${product.name} (${currentPack.weight}) added!`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigateTo('checkout');
  };

  const handleRelatedQuickAdd = (related: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    addItem({
      productId: related.id,
      name: related.name,
      gujaratiName: related.gujaratiName,
      weight: related.defaultWeight,
      price: related.defaultPrice,
      quantity: 1,
      heroColor: related.heroColor,
      makesText: related.makesText,
    });
    if (!reduceMotion) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
    showToast('Added to Basket', `${related.name} (${related.defaultWeight}) added!`, 'success');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus('Available for Express Delivery: Arrives in 2-3 Business Days');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian pincode.');
    }
  };

  // Related products
  return (
    <div id="product-detail-page" className="py-8 sm:py-12 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-black cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <button onClick={() => navigateTo('products')} className="hover:text-black cursor-pointer">
            Products
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <button
            onClick={() => navigateTo('products', { category: product.category })}
            className="hover:text-black cursor-pointer"
          >
            {product.categoryName}
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900 truncate">{product.name}</span>
        </nav>

        {/* Product Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-sm mb-10">
          
          {/* Left Column: Visual Gallery & Packshot (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Stage Canvas */}
            <div
              className="relative rounded-3xl p-8 flex flex-col items-center justify-center border border-[#EADFCB] overflow-hidden"
              style={{
                backgroundColor: '#FFF8EC',
                minHeight: '440px',
              }}
            >
              {/* Subtle radial aura */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${product.heroColor} 0%, transparent 70%)`,
                }}
              />

              {/* Top Right Badges */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <VegBadge size={18} />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full shadow-xs transition-colors cursor-pointer ${
                    isFav ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Active Visual Render */}
              <div className="w-56 sm:w-64 drop-shadow-2xl transition-all duration-300">
                <ProductPackshot productId={product.id} src={product.imageUrl} />
              </div>

              {/* Bottom Heritage Seal */}
              <div className="mt-4 flex items-center space-x-2 text-xs font-bold text-[#6F3E24] z-10">
                <Since1956Badge className="w-8 h-8" />
                <span>Amrat Narsih • Surat Heritage Since 1956</span>
              </div>
            </div>

            {/* Packaging Guarantee Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-[#6F3E24]">
              <div className="p-2 bg-[#FFF8EC] rounded-xl border border-[#F4C400]/40">
                Triple-Layer Sealed
              </div>
              <div className="p-2 bg-[#FFF8EC] rounded-xl border border-[#F4C400]/40">
                No Artificial Colors
              </div>
              <div className="p-2 bg-[#FFF8EC] rounded-xl border border-[#F4C400]/40">
                Shelf Life: {product.shelfLife.split(' ')[0]} {product.shelfLife.split(' ')[1]}
              </div>
            </div>

          </div>

          {/* Right Column: Title, Weights, Price, Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            <div>
              {/* Category & Badge */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
                  {product.categoryName}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-sm">
                  100% Pure Vegetarian
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-[#6F3E24] font-bold">
                  Surat Heritage
                </span>
              </div>

              {/* Product Titles */}
              <h1 className="text-2xl sm:text-4xl font-display font-black text-gray-900 mt-1">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {product.hindiName && (
                  <span className="text-sm font-semibold text-gray-600">
                    {product.hindiName}
                  </span>
                )}
              </div>

              {/* Rating & Review counter */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center bg-[#FFF8EC] border border-[#F4C400]/60 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-[#F4C400] text-[#F4C400] mr-1.5" />
                  <span className="text-xs font-black text-gray-900">
                    {product.rating} / 5
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Based on <strong>{product.reviewCount}</strong> verified family reviews
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3 p-4 bg-[#FCFAF5] rounded-2xl border border-[#EADFCB]">
              <span className="text-3xl font-black text-[#C90018]">
                ₹{currentPack.price}
              </span>
              {currentPack.compareAtPrice && (
                <span className="text-base text-gray-400 line-through">
                  ₹{currentPack.compareAtPrice}
                </span>
              )}
              <span className="text-xs text-gray-500">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Yield Callout */}
            <div className="p-3 bg-[#FFF8EC] rounded-2xl border border-[#F4C400]/50 flex items-center space-x-2.5 text-xs font-bold text-[#6F3E24]">
              <Flame className="w-4 h-4 text-[#C90018] shrink-0" />
              <span>Yield: {currentPack.makesCount || product.makesText}</span>
            </div>

            {/* Pack Size Selector */}
            <div>
              <div className="text-xs font-bold text-gray-800 mb-2">
                Choose Pack Weight:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.packSizes.map((pack) => (
                  <button
                    key={pack.weight}
                    onClick={() => setSelectedWeight(pack.weight)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                      selectedWeight === pack.weight
                        ? 'bg-[#C90018] text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    <span>{pack.weight}</span>
                    <span>—</span>
                    <span>₹{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-gray-800">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-l-xl text-gray-600 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-black text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 rounded-r-xl text-gray-600 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Primary Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="btn-vibrant-cta text-white py-4 rounded-2xl font-display font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket — ₹{currentPack.price * quantity}</span>
                </button>

                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-display font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Buy Now (Instant Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pincode Estimator */}
            <div className="p-4 bg-[#FCFAF5] rounded-2xl border border-[#EADFCB] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                <Truck className="w-4 h-4 text-[#C90018]" />
                <span>Check Delivery Availability:</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 395003)"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#C90018]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <div
                  className={`text-xs font-medium ${
                    pincodeStatus.includes('Available') ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  {pincodeStatus}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Frequently Bought Together / Related Mixes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-black text-xl sm:text-2xl text-gray-900">
              Complete Your Gujarati Pantry
            </h3>
            <button
              onClick={() => navigateTo('products')}
              className="text-xs font-bold text-[#C90018] hover:underline cursor-pointer"
            >
              View All Mixes →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((rel, index) => (
              <EditorialProductCard
                key={rel.id}
                product={rel}
                onQuickAdd={handleRelatedQuickAdd}
                index={index}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
