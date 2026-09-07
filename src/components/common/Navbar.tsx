'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { AmratNarsihLogo } from '../../data/brandAssets';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const CATEGORY_PREVIEW_PRODUCT: Record<string, string> = {
  'instant-mixes': 'bhajiya',
  'traditional-favourites': 'gobapuri',
  'sweet-moments': 'gulab-jamun',
};

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo, categories, products, setSearchQuery } = useStore();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: Parameters<typeof navigateTo>[0], params?: Parameters<typeof navigateTo>[1]) => {
    navigateTo(page, params);
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery(query.trim());
    setIsMobileMenuOpen(false);
  };

  const stripLink = (active: boolean) =>
    `text-[0.82rem] transition-colors duration-200 ${active ? 'text-[#F5A623]' : 'text-white hover:text-[#F5A623]'}`;

  const isProductsActive = currentPage === 'products' || currentPage === 'shop' || currentPage === 'product-detail';
  const isAboutActive = currentPage === 'about' || currentPage === 'our-story';

  return (
    <header
      id="main-navigation-header"
      className={`sticky top-0 z-[1000] bg-white transition-[box-shadow] duration-200 ${
        isScrolled ? 'shadow-[0_2px_16px_rgba(62,39,35,0.10)]' : ''
      }`}
    >
      <div className="flex h-[70px] items-center justify-between border-b border-[#F0E4D0] px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-[#3E2723]"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <button
          id="brand-logo-home-link"
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-center lg:items-start"
          aria-label="Amrat Narsih homepage"
        >
          <AmratNarsihLogo className="h-10 w-auto sm:h-11" />
          <span className="hidden text-[0.65rem] text-[#8D6E63] sm:block">Est. 1956 · Surat, Gujarat</span>
        </button>

        <form
          onSubmit={submitSearch}
          className="hidden h-[42px] w-[480px] max-w-[42vw] overflow-hidden rounded-lg border-[1.5px] border-[#F0E4D0] bg-[#FFF3E0] focus-within:border-[#D46A1E] focus-within:shadow-[0_0_0_3px_rgba(212,106,30,0.12)] lg:flex"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for bhajiya mix, handwa, khakra..."
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-[#3E2723] outline-none placeholder:text-[#8D6E63]"
            aria-label="Search products"
          />
          <button
            type="submit"
            className="h-full bg-[#D46A1E] px-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#A84F10]"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('shop')}
            className="relative rounded-lg p-2 text-[#3E2723]"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C62828] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            id="cart-drawer-trigger-btn"
            type="button"
            onClick={openCart}
            className="relative rounded-lg p-2 text-[#3E2723]"
            aria-label={`Cart (${itemCount})`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C62828] px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          </button>
          <button
            id="nav-shop-now-btn"
            type="button"
            onClick={() => handleNavClick('shop')}
            className="hidden rounded-lg bg-[#D46A1E] px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#A84F10] sm:inline-flex"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      <nav className="hidden h-[42px] items-center justify-center gap-8 bg-[#3E2723] lg:flex">
        <button type="button" onClick={() => handleNavClick('home')} className={stripLink(currentPage === 'home')}>
          Home
        </button>
        <button type="button" onClick={() => handleNavClick('our-story')} className={stripLink(isAboutActive)}>
          About
        </button>
        <div
          className="relative"
          onMouseEnter={() => setIsProductsDropdownOpen(true)}
          onMouseLeave={() => setIsProductsDropdownOpen(false)}
        >
          <button
            type="button"
            onClick={() => handleNavClick('shop')}
            className={`${stripLink(isProductsActive)} inline-flex items-center gap-1`}
          >
            Products <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {isProductsDropdownOpen && (
            <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 rounded-xl border border-[#F0E4D0] bg-white p-2 shadow-[0_8px_28px_rgba(62,39,35,0.16)]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleNavClick('shop', { category: cat.id })}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#3E2723] hover:bg-[#FFF3E0]"
                >
                  <img
                    src={products.find((p) => p.id === CATEGORY_PREVIEW_PRODUCT[cat.id])?.imageUrl}
                    alt=""
                    className="h-9 w-9 object-contain"
                    loading="lazy"
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={() => handleNavClick('journey')} className={stripLink(currentPage === 'journey')}>
          Our Journey
        </button>
        <button type="button" onClick={() => handleNavClick('shop')} className={stripLink(false)}>
          Recipes
        </button>
        <button type="button" onClick={() => handleNavClick('contact')} className={stripLink(currentPage === 'contact')}>
          Contact
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-[#F0E4D0] bg-white px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex overflow-hidden rounded-lg border border-[#F0E4D0]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mixes..."
              className="h-10 min-w-0 flex-1 px-3 text-sm outline-none"
            />
            <button type="submit" className="bg-[#D46A1E] px-3 text-xs font-bold text-white">
              Search
            </button>
          </form>
          {[
            { label: 'Home', action: () => handleNavClick('home') },
            { label: 'About', action: () => handleNavClick('our-story') },
            { label: 'Products', action: () => handleNavClick('shop') },
            { label: 'Our Journey', action: () => handleNavClick('journey') },
            { label: 'Recipes', action: () => handleNavClick('shop') },
            { label: 'Contact', action: () => handleNavClick('contact') },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="block w-full rounded-lg px-3 py-3 text-left font-semibold text-[#3E2723] hover:bg-[#FFF3E0]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
