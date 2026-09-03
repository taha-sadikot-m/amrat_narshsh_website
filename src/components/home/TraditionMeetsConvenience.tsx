'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Sparkles, ArrowRight, Sun, Sunset, Users, Gift, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { VegBadge } from '../../data/brandAssets';

export const TraditionMeetsConvenience: React.FC = () => {
  const { navigateTo } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');

  const OCCASIONS = [
    { id: 'breakfast', label: 'Morning Breakfast', icon: Sun, items: 'Gota, Idli, Khaman', time: '10 mins' },
    { id: 'evening', label: 'Evening Snacks', icon: Sunset, items: 'Bhajiya, Dalwada, Khatavada', time: '12 mins' },
    { id: 'family', label: 'Family Gatherings', icon: Users, items: 'Surti Locho, Handwa, Khichu', time: '15 mins' },
    { id: 'festivals', label: 'Festivals & Treats', icon: Gift, items: 'Gulab Jamun, Farali, Gobapuri', time: '15 mins' },
  ];

  return (
    <section
      id="tradition-meets-convenience-section"
      className="py-16 sm:py-24 bg-[#FCFAF5] border-b border-[#EADFCB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with exact prompt copy */}
        <div className="text-center space-y-3 mb-14 max-w-3xl mx-auto">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#C90018]">
            The Modern FMCG Promise
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight">
            Tradition Meets Convenience.
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Authentic food should be easy to enjoy, without compromising on the taste and traditions we grew up with.
          </p>
        </div>

        {/* Dual Side-by-Side Comparison: Traditional Way vs Amrat Narsih Way */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Left: Traditional Tedious Preparation */}
          <div className="bg-white/70 rounded-3xl p-8 border border-gray-300 space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                The Old Laborious Method
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">
                Takes 4–8 Hours
              </span>
            </div>

            <h3 className="font-display font-bold text-xl text-gray-800">
              Hours of Soaking, Grinding &amp; Measuring
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Soaking whole lentils &amp; grains 4 to 6 hours in advance.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Stone grinding or heavy mixer prep to achieve coarse consistency.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Guessing spice proportions (ajwain, hing, black pepper, turmeric).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Inconsistent texture, heavy kitchen cleanup, and recipe fatigue.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 italic">
              Result: Traditional snacks made only once or twice a year during major festivals.
            </div>
          </div>

          {/* Right: Amrat Narsih Instant Heritage Mixes */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#C90018]/30 shadow-lg space-y-5 relative">
            <div className="absolute -top-3 right-8 bg-[#C90018] text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
              Amrat Narsih Way
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
                1956 Heritage In Ready Mixes
              </span>
              <span className="px-2.5 py-1 bg-[#FFF8EC] text-[#C90018] rounded-full text-[10px] font-black border border-[#F4C400]/40">
                Ready in 10–15 Mins
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-gray-900">
              Just Add Water &amp; Cook in 10 Minutes
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">Pre-ground from high-grade lentils and premium grains.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">Masterfully pre-blended spices according to 1956 family formulations.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">100% Pure Vegetarian, zero artificial colors, nitrogen sealed freshness.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">Consistent golden crunch and authentic Surat street-food aroma every time.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#6F3E24]">
              <span>Result: Enjoy authentic Gujarati delicacies any day of the week!</span>
              <Sparkles className="w-4 h-4 text-[#F4C400]" />
            </div>
          </div>

        </div>

        {/* Everyday Occasions Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-display font-black text-2xl text-gray-900">
              Perfect For Every Everyday Occasion
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              From morning chai companions to festive family celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OCCASIONS.map((occ) => {
              const Icon = occ.icon;
              return (
                <div
                  key={occ.id}
                  className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs flex flex-col justify-between hover:border-[#C90018] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF8EC] text-[#C90018] flex items-center justify-center border border-[#F4C400]/40">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-base text-gray-900">
                      {occ.label}
                    </h4>
                    <p className="text-xs text-gray-600">
                      <span className="font-bold text-gray-800">Favorites:</span> {occ.items}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>Prep Time: {occ.time}</span>
                    <button
                      onClick={() => navigateTo('products')}
                      className="text-[#C90018] hover:underline"
                    >
                      Shop Mixes →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
