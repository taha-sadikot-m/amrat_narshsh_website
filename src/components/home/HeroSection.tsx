'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type HeroSlide = {
  id: string;
  productId: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
};

type HeroCarousel = {
  autoplayIntervalMs: number;
  slides: HeroSlide[];
};

export const HeroSection: React.FC = () => {
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
        setHeroCarousel(data.hero || { autoplayIntervalMs: 4500, slides: [] });
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
      tabIndex={0}
      aria-label={currentSlide?.altText || 'Hero banners'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#FCFAF5] min-h-[560px] lg:min-h-[660px] border-b border-[#EADFCB] outline-none"
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
        </>
      )}

      {heroError && (
        <p className="absolute left-4 top-4 z-10 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#C90018] border border-[#EADFCB]">
          Hero banners could not be loaded from the database.
        </p>
      )}
    </section>
  );
};
