'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { AmratNarsihLogo, Since1956Badge, ProductPackshot } from '../../data/brandAssets';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// Representative product shown per category in the Products dropdown
const CATEGORY_PREVIEW_PRODUCT: Record<string, string> = {
  'instant-mixes': 'bhajiya',
  'traditional-favourites': 'gobapuri',
  'sweet-moments': 'gulab-jamun',
};

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo, openSearch, categories, products } = useStore();
  const { itemCount, subtotal, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: any, params?: any) => {
    navigateTo(page, params);
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  };

  const isProductsActive = currentPage === 'products' || currentPage === 'shop' || currentPage === 'product-detail';
  const isAboutActive = currentPage === 'about' || currentPage === 'our-story';
  const isJourneyActive = currentPage === 'journey';

  return (
    <header
      id="main-navigation-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-[#EADFCB]'
          : 'bg-[#FCFAF5]/95 backdrop-blur-sm py-3.5 border-b border-[#EADFCB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mt-0.5">
        
        {/* Left Mobile Menu Toggle Button */}
        <div className="flex items-center lg:hidden">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-[#191919] hover:bg-[#FFF8EC] focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            id="mobile-search-trigger-btn"
            onClick={openSearch}
            className="p-2 ml-1 rounded-full text-[#191919] hover:bg-[#FFF8EC]"
            aria-label="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Center/Left Brand Logo & Identity */}
        <div className="flex items-center">
          <button
            id="brand-logo-home-link"
            onClick={() => handleNavClick('home')}
            className="flex items-center group cursor-pointer focus:outline-hidden text-left"
            aria-label="Amrat Narsih Homepage"
          >
            <AmratNarsihLogo
              className="h-10 sm:h-12 w-auto group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>
        </div>

        {/* Desktop Navigation Links as per specification: Home, About, Products, Our Journey, Contact */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-[#C90018] bg-[#FFF8EC]'
                : 'text-[#191919] hover:text-[#C90018] hover:bg-[#FFF8EC]/70'
            }`}
          >
            Home
          </button>

          <button
            id="nav-link-about"
            onClick={() => handleNavClick('about')}
            className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
              isAboutActive
                ? 'text-[#C90018] bg-[#FFF8EC]'
                : 'text-[#191919] hover:text-[#C90018] hover:bg-[#FFF8EC]/70'
            }`}
          >
            About
          </button>

          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <button
              id="nav-link-products"
              onClick={() => handleNavClick('products')}
              className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full flex items-center space-x-1 transition-colors cursor-pointer ${
                isProductsActive
                  ? 'text-[#C90018] bg-[#FFF8EC]'
                  : 'text-[#191919] hover:text-[#C90018] hover:bg-[#FFF8EC]/70'
              }`}
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isProductsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-3xl shadow-2xl border border-[#EADFCB] p-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-2 border-b border-gray-100 mb-2 flex items-center justify-between">
                  <div className="text-[10px] font-extrabold text-[#C90018] uppercase tracking-widest">
                    Authentic Categories
                  </div>
                  <AmratNarsihLogo className="h-5 w-auto" />
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`nav-category-${cat.id}`}
                    onClick={() => handleNavClick('products', { category: cat.id })}
                    className="w-full text-left p-2.5 rounded-2xl hover:bg-[#FCFAF5] transition-colors flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#FCFAF5] border border-[#EADFCB] p-1 shrink-0 overflow-hidden">
                      <ProductPackshot
                        productId={CATEGORY_PREVIEW_PRODUCT[cat.id] || 'bhajiya'}
                        src={products.find((product) => product.id === CATEGORY_PREVIEW_PRODUCT[cat.id])?.imageUrl}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#C90018]">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-gujarati">
                        {cat.gujaratiName}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button
                    id="nav-all-products-link"
                    onClick={() => handleNavClick('products', { category: 'all' })}
                    className="w-full py-2.5 text-center text-xs font-extrabold text-[#C90018] bg-[#FCFAF5] hover:bg-[#FFF8EC] rounded-2xl transition-colors cursor-pointer"
                  >
                    Explore Entire Product Catalog (11 Mixes) →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            id="nav-link-journey"
            onClick={() => handleNavClick('journey')}
            className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
              isJourneyActive
                ? 'text-[#C90018] bg-[#FFF8EC]'
                : 'text-[#191919] hover:text-[#C90018] hover:bg-[#FFF8EC]/70'
            }`}
          >
            Our Journey
          </button>

          <button
            id="nav-link-contact"
            onClick={() => handleNavClick('contact')}
            className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
              currentPage === 'contact'
                ? 'text-[#C90018] bg-[#FFF8EC]'
                : 'text-[#191919] hover:text-[#C90018] hover:bg-[#FFF8EC]/70'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Actions: Search, Wishlist, Cart & Primary CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          <button
            id="desktop-search-btn"
            onClick={openSearch}
            className="hidden xl:flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white border border-[#EADFCB] text-gray-600 hover:text-[#C90018] hover:border-[#C90018] transition-all text-xs font-medium cursor-pointer shadow-2xs"
            aria-label="Search Amrat Narsih Instant Mixes"
          >
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-400">Search Mixes...</span>
          </button>

          <button
            id="wishlist-header-btn"
            onClick={() => handleNavClick('products')}
            className="relative p-2.5 rounded-full text-gray-700 hover:text-[#C90018] hover:bg-[#FFF8EC] transition-colors cursor-pointer"
            aria-label={`Wishlist items (${wishlistCount})`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F4C400] text-[#191919] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            id="cart-drawer-trigger-btn"
            onClick={openCart}
            className="p-2.5 rounded-full text-gray-700 hover:text-[#C90018] hover:bg-[#FFF8EC] transition-colors relative cursor-pointer"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#C90018] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
              {itemCount}
            </span>
          </button>

          {/* Primary CTA: "Shop Now" */}
          <button
            id="nav-shop-now-btn"
            onClick={() => handleNavClick('products')}
            className="hidden sm:inline-flex btn-vibrant-cta text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md hover:shadow-lg flex items-center space-x-1.5"
          >
            <span>Shop Now</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EADFCB] bg-[#FCFAF5] px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-[#191919] hover:bg-[#FFF8EC] flex items-center justify-between"
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-[#191919] hover:bg-[#FFF8EC] flex items-center justify-between"
            >
              <span>About Our Heritage</span>
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-[#C90018] bg-[#FFF8EC] flex items-center justify-between"
            >
              <span>Products (All 11 Mixes)</span>
              <span className="bg-[#C90018] text-white text-[10px] px-2 py-0.5 rounded-full">
                Heritage
              </span>
            </button>

            <button
              onClick={() => handleNavClick('journey')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-[#191919] hover:bg-[#FFF8EC] flex items-center justify-between"
            >
              <span>Our Journey (1956–Today)</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-[#191919] hover:bg-[#FFF8EC] flex items-center justify-between"
            >
              <span>Contact &amp; Partnerships</span>
            </button>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#EADFCB] flex items-center space-x-3 text-xs text-[#6F3E24]">
            <MapPin className="w-4 h-4 text-[#C90018] shrink-0" />
            <div>
              <span className="font-bold text-gray-900">Amrat Narsih</span>
              <div className="text-[11px] text-gray-500">Surat, Gujarat • Established 1956</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
