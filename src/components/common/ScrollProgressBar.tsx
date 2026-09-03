'use client';

import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useStore } from '../../context/StoreContext';

export const ScrollProgressBar: React.FC = () => {
  const { currentPage } = useStore();
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for a fluid, natural feel
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Soft opacity fade when near top so it remains completely non-intrusive
  const opacity = useTransform(scrollYProgress, [0, 0.015, 0.03], [0, 0.6, 1]);

  return (
    <motion.div
      id="homepage-scroll-progress-indicator"
      style={{
        opacity: currentPage === 'home' ? opacity : 0.85,
      }}
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none origin-left"
    >
      {/* Background track for subtle contrast against both light and dark headers */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-xs" />

      {/* Main animated progress indicator bar with Amrat Narsih brand heritage gradient */}
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#C90018] via-[#F4C400] to-[#C90018] shadow-[0_0_8px_rgba(201,0,24,0.45)]"
      />

      {/* Subtle trailing warmth spark / head glow */}
      <motion.div
        style={{
          left: useTransform(scaleX, (val) => `${Math.min(val * 100, 100)}%`),
        }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F4C400] shadow-[0_0_6px_#F4C400] pointer-events-none"
      />
    </motion.div>
  );
};
