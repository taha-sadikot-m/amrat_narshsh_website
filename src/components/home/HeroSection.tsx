'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { VegBadge } from '../../data/brandAssets';

type HeroSlide = {
  id: string;
  productId: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
};

type HeroCarousel = {
  overlayOpacity: number;
  autoplayIntervalMs: number;
  slides: HeroSlide[];
};

export const HeroSection: React.FC = () => {
  const { navigateTo } = useStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [heroCarousel, setHeroCarousel] = useState<HeroCarousel | null>(null);

  const slides = heroCarousel?.slides ?? [];
  const slideCount = slides.length;
  const currentSlide = slides[activeIndex] ?? slides[0] ?? null;

  useEffect(() => {
    fetch('/api/hero')
      .then((response) => {
        if (!response.ok) throw new Error('hero-unavailable');
        return response.json();
      })
      .then((data) => {
        setHeroError(false);
        setHeroCarousel(data.hero || { overlayOpacity: 28, autoplayIntervalMs: 4500, slides: [] });
      })
      .catch(() => {
        setHeroError(true);
        setHeroCarousel(null);
      });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(media.matches);
    const syncVisibility = () => setPageHidden(document.hidden);
    syncMotion();
    syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [slideCount]);

  useEffect(() => {
    if (isPaused || pageHidden || reduceMotion || slideCount <= 1) return;
    const interval = heroCarousel?.autoplayIntervalMs ?? 4500;
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, pageHidden, reduceMotion, slideCount, heroCarousel?.autoplayIntervalMs]);

  return (
    <section
      id="hero-story-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#FCFAF5] min-h-[560px] lg:min-h-[660px] flex flex-col justify-center pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#EADFCB]"
    >
      {currentSlide && (
        <>
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentSlide.id}-desktop`}
              src={currentSlide.desktopImageUrl}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7 }}
              className="absolute inset-0 hidden md:block h-full w-full object-cover"
              aria-hidden="true"
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentSlide.id}-mobile`}
              src={currentSlide.mobileImageUrl}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7 }}
              className="absolute inset-0 md:hidden h-full w-full object-cover"
              aria-hidden="true"
            />
          </AnimatePresence>
          <div
            className="absolute inset-0 bg-[#FCFAF5] pointer-events-none"
            style={{ opacity: (heroCarousel?.overlayOpacity ?? 28) / 100 }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {heroError && (
          <p className="mb-6 inline-block rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#C90018] border border-[#EADFCB]">
            Hero banners could not be loaded from the database.
          </p>
        )}

        <div className="space-y-6 text-center lg:text-left lg:max-w-[46%]">
          {/* Main Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#191919] tracking-tight leading-[1.08]"
          >
            The Taste of Gujarat, <br />
            <span className="text-[#C90018]">Made for Today.</span>
          </motion.h1>

          {/* Supporting Copy — single subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            Authentic Gujarati flavours rooted in tradition, made easier for modern homes.
          </motion.p>

          {/* Action Button: single primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2"
          >
            <button
              id="hero-explore-products-btn"
              onClick={() => navigateTo('products')}
              className="w-full sm:w-auto btn-vibrant-cta text-white px-8 py-4 rounded-full font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:shadow-xl transition-all group"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Trust Micro-Strip: max 2 icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 border-t border-[#EADFCB]/60 flex items-center justify-center lg:justify-start space-x-6 text-xs text-gray-600"
          >
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-[#C90018]" />
              <span className="font-bold text-gray-900">Since 1956</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <VegBadge size={16} />
              <span className="font-bold text-gray-900">100% Vegetarian</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
