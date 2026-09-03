'use client';

import React from 'react';
import { ArrowRight, Sparkles, MapPin, History, Users } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Since1956Badge } from '../../data/brandAssets';

export const HeritageIntro: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section
      id="heritage-intro-section"
      className="py-16 sm:py-24 bg-[#FCFAF5] border-b border-[#EADFCB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Statement */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#EADFCB] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#C90018]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#6F3E24]">
              SURAT, GUJARAT, INDIA
            </span>
          </div>

          {/* Oversized Typography */}
          <div className="relative select-none">
            <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-[#191919] tracking-tighter leading-none">
              Since <span className="text-[#C90018]">1956.</span>
            </h2>
            <div className="font-gujarati text-lg sm:text-2xl font-black text-[#6F3E24] mt-2">
              સાત દાયકાની અસ્સલ ગુજરાતી સ્વાદ પરંપરા
            </div>
          </div>

          {/* Exact Supporting Text */}
          <p className="text-lg sm:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            A family legacy from Surat, carried forward through generations.
          </p>

          {/* 1956 -> Today Progression Graphic */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="text-xs font-extrabold text-[#C90018] uppercase tracking-wider">
                1956 • The Beginning
              </div>
              <h3 className="font-display font-black text-lg text-gray-900">
                Late Amrutlal Narsihdas Modi
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Begins the journey with a small shop in Surat, driven by a deep passion for authentic Gujarati taste.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="text-xs font-extrabold text-[#F4C400] uppercase tracking-wider">
                1992 • Formal Foundation
              </div>
              <h3 className="font-display font-black text-lg text-gray-900">
                Modi Foods Pvt. Ltd.
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Incorporated to give the growing family business a formal foundation for its next chapter of expansion.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="text-xs font-extrabold text-green-700 uppercase tracking-wider">
                Today • For Modern Homes
              </div>
              <h3 className="font-display font-black text-lg text-gray-900">
                Amit Mukeshchandra Modi
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Leads the business, carrying forward the values and food heritage built across generations for today's consumers.
              </p>
            </div>

          </div>

          <div className="pt-6">
            <button
              onClick={() => navigateTo('journey')}
              className="inline-flex items-center space-x-2 text-xs font-extrabold text-[#C90018] hover:text-[#9E0012] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Explore The Full Verified Journey (1956–Today)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
