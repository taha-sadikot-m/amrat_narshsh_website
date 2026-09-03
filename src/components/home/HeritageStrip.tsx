'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeritageStrip: React.FC = () => {
  const { navigateTo } = useStore();

  const QUICK_ITEMS = [
    { label: 'Bhajiya Mix' },
    { label: 'Dalwada Mix' },
    { label: 'Gota Mix' },
    { label: 'Surti Locho' },
    { label: 'Handwa Mix' },
  ];

  return (
    <section
      id="heritage-strip-section"
      className="bg-[#F4C400] text-[#191919] py-4 border-y border-[#E0B000] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Badge & Tagline */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center md:text-left">
          <div className="px-3 py-1 bg-[#191919] text-white text-[10px] font-black tracking-widest uppercase rounded-sm shadow-xs">
            SINCE 1956
          </div>
          <div>
            <span className="font-display font-black text-sm uppercase tracking-wide text-[#191919] mr-2">
              GENERATIONS OF FLAVOUR. ONE TRUSTED NAME.
            </span>
          </div>
        </div>

        {/* Center/Right Quick Product Pills & CTA */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigateTo('shop')}
              className="px-3 py-1 bg-white/90 hover:bg-white text-[#191919] text-xs font-bold rounded-full shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C90018]" />
              <span>{item.label}</span>
            </button>
          ))}

          <button
            id="heritage-strip-story-btn"
            onClick={() => navigateTo('our-story')}
            className="bg-[#191919] hover:bg-[#333333] text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ml-1"
          >
            <span>Explore 1956 Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

