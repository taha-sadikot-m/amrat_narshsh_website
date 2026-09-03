'use client';

import React from 'react';
import { Award, ShieldCheck, Sparkles, Heart, Clock, ArrowRight, CheckCircle2, MapPin, Building2, Users, History } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Since1956Badge, VegBadge, AmratNarsihLogo } from '../../data/brandAssets';

export const OurStoryPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div id="about-brand-page" className="py-10 sm:py-16 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#EADFCB] shadow-2xs">
            <MapPin className="w-4 h-4 text-[#C90018]" />
            <span className="text-xs font-black text-[#6F3E24] tracking-widest uppercase">
              ESTABLISHED 1956 • SURAT, GUJARAT
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight leading-tight">
            A Legacy of Taste. <br />
            <span className="text-[#C90018]">A Tradition That Lives On.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            For generations, Gujarati food has been more than just a meal — it has been a celebration of family, tradition and togetherness.
          </p>
        </div>

        {/* The Verified Company Story Detailed */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFCB] shadow-sm space-y-8">
          
          {/* Mobile: eyebrow, then logo, then a single-line heading, all centered */}
          <div className="flex sm:hidden flex-col items-center text-center gap-3 border-b border-gray-100 pb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
              Verified Heritage
            </span>
            <AmratNarsihLogo className="h-12 w-auto" />
            <h2 className="font-display font-black text-xl text-gray-900 whitespace-nowrap">
              The Amrat Narsih Story
            </h2>
          </div>

          {/* Desktop: eyebrow + heading on the left, logo on the right */}
          <div className="hidden sm:flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
                Verified Heritage
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1">
                The Amrat Narsih Story
              </h2>
            </div>
            <AmratNarsihLogo className="h-12 w-auto" />
          </div>

          <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              For generations, Gujarati food has been more than just a meal — it has been a celebration of family, tradition and togetherness. Amrat Narsih carries this legacy forward with a simple purpose: to bring the authentic taste of Gujarat into modern homes, without taking away the traditions that make it special.
            </p>

            <p>
              The journey began in <strong>1956</strong>, when <strong>Late Amrutlal Narsihdas Modi</strong> started a small shop in Surat. What began as a humble venture gradually grew with the efforts of his son, <strong>Late Mukeshchandra Amrutlal Modi</strong>, who joined the business and helped take it forward.
            </p>

            <p>
              In <strong>1992</strong>, <strong>Modi Foods Pvt. Ltd.</strong> was incorporated, giving the growing business a formal foundation for its next chapter.
            </p>

            <p>
              Today, <strong>Amit Mukeshchandra Modi</strong> leads the business, carrying forward the values and food heritage built across generations.
            </p>

            <p className="italic text-gray-800 bg-[#FCFAF5] p-4 rounded-2xl border border-[#EADFCB]">
              The name <strong>Amrat Narsih</strong> itself is inspired by the legacy of <strong>Late Amrutlal Narsihdas Modi</strong>, keeping the family story at the heart of the brand.
            </p>
          </div>

        </div>

        {/* 3 Core Philosophy Pillars */}
        <div className="bg-[#191919] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#F4C400]">
            Our Guiding Philosophy
          </div>

          <div className="space-y-2">
            <div className="font-display font-black text-2xl sm:text-4xl text-white">
              Preserve the taste.
            </div>
            <div className="font-display font-black text-2xl sm:text-4xl text-[#F4C400]">
              Simplify the preparation.
            </div>
            <div className="font-display font-black text-2xl sm:text-4xl text-[#C90018]">
              Carry the tradition forward.
            </div>
          </div>

        </div>

        {/* 4 Purity & Quality Creeds */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-display font-black text-2xl text-gray-900">
              The 4 Uncompromising Standards
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Quality commitments maintained across generations by Modi Foods Pvt. Ltd.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C90018] flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-display font-bold text-base text-gray-900">
                100% Pure Vegetarian
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Strictly vegetarian processing facilities using high-grade whole lentils and certified grains.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-display font-bold text-base text-gray-900">
                Zero Artificial Colors or Synthetics
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pure spices, natural turmeric, and stone-ground gram flour. No chemical enhancers or artificial fillers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-display font-bold text-base text-gray-900">
                Freshness &amp; Aroma Seal
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Multi-layer nitrogen sealed packaging locks in natural essential spice oils for authentic aroma.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-display font-bold text-base text-gray-900">
                Authentic Gujarati Formulations
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recipes unchanged since 1956 — ensuring Surti Locho, Gota, and Dalwadas taste truly traditional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="bg-[#C90018] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h3 className="font-display font-black text-2xl sm:text-3xl">
            Bring the Taste of Gujarat Home
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto">
            Discover traditional favourites made for the way we enjoy food today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('products')}
              className="bg-white hover:bg-[#FFF8EC] text-[#C90018] px-8 py-3.5 rounded-full font-display font-black text-xs uppercase tracking-wider shadow-lg transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore All 11 Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('journey')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Interactive 1956 Timeline</span>
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
