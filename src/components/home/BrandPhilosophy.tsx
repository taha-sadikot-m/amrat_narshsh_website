'use client';

import React from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AmratNarsihLogo, Since1956Badge } from '../../data/brandAssets';

export const BrandPhilosophy: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section
      id="brand-philosophy-section"
      className="py-20 sm:py-28 bg-[#191919] text-white relative overflow-hidden text-center"
    >
      {/* Decorative Warm Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C90018]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#F4C400]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#F4C400]">
            OUR CORE PHILOSOPHY
          </span>
        </div>

        {/* 3 Core Sentences with Bold Architectural Typography */}
        <div className="space-y-4 sm:space-y-6">
          <div className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white/95">
            Preserve the taste.
          </div>
          <div className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#F4C400]">
            Simplify the preparation.
          </div>
          <div className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#C90018]">
            Carry the tradition forward.
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          A commitment made by Late Amrutlal Narsihdas Modi in 1956 that continues to guide every batch produced by Modi Foods Pvt. Ltd. today.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('about')}
            className="bg-white hover:bg-[#FFF8EC] text-[#191919] px-7 py-3.5 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            Learn About Our Heritage
          </button>
          <button
            onClick={() => navigateTo('products')}
            className="btn-vibrant-cta text-white px-7 py-3.5 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            Explore Authentic Mixes
          </button>
        </div>

      </div>
    </section>
  );
};
