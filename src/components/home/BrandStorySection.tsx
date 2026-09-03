'use client';

import React from 'react';
import { ArrowRight, History, Heart, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AmratNarsihLogo, Since1956Badge } from '../../data/brandAssets';

export const BrandStorySection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section
      id="brand-story-section"
      className="py-16 sm:py-24 bg-white border-b border-[#EADFCB] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#C90018]">
            Verified Company Story
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight leading-tight">
            A Legacy of Taste. <br />
            <span className="text-[#C90018]">A Tradition That Lives On.</span>
          </h2>
          <p className="font-gujarati text-lg font-bold text-[#6F3E24]">
            વારસો સ્વાદનો • પરંપરા જે પેઢી દર પેઢી જીવંત રહે છે
          </p>
        </div>

        {/* 4 Story Modules: Origin, Family, Company, Today */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Module 1: Origin */}
          <div className="bg-[#FCFAF5] rounded-3xl p-8 border border-[#EADFCB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white rounded-full border border-[#EADFCB] text-[10px] font-black uppercase tracking-wider text-[#C90018]">
                  01 • The Purpose &amp; Culture
                </span>
                <Heart className="w-5 h-5 text-[#C90018]" />
              </div>
              <h3 className="font-display font-black text-2xl text-gray-900 leading-snug">
                More Than Just a Meal
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                For generations, Gujarati food has been more than just a meal — it has been a celebration of family, tradition and togetherness.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Amrat Narsih carries this legacy forward with a simple purpose: to bring the authentic taste of Gujarat into modern homes, without taking away the traditions that make it special.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EADFCB]/60 text-xs font-bold text-[#6F3E24]">
              Authentic Gujarati Taste • Zero Compromise on Tradition
            </div>
          </div>

          {/* Module 2: Family */}
          <div className="bg-[#FCFAF5] rounded-3xl p-8 border border-[#EADFCB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white rounded-full border border-[#EADFCB] text-[10px] font-black uppercase tracking-wider text-[#F4C400]/90 text-[#6F3E24]">
                  02 • 1956 Humble Beginning
                </span>
                <History className="w-5 h-5 text-[#F4C400]" />
              </div>
              <h3 className="font-display font-black text-2xl text-gray-900 leading-snug">
                From a Small Shop in Surat
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The journey began in 1956, when Late Amrutlal Narsihdas Modi started a small shop in Surat. 
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                What began as a humble venture gradually grew with the efforts of his son, Late Mukeshchandra Amrutlal Modi, who joined the business and helped take it forward.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EADFCB]/60 text-xs font-bold text-[#6F3E24]">
              Surat Heritage • Generational Dedication
            </div>
          </div>

          {/* Module 3: Company */}
          <div className="bg-[#FCFAF5] rounded-3xl p-8 border border-[#EADFCB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white rounded-full border border-[#EADFCB] text-[10px] font-black uppercase tracking-wider text-green-700">
                  03 • 1992 Corporate Milestone
                </span>
                <Building2 className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="font-display font-black text-2xl text-gray-900 leading-snug">
                Modi Foods Pvt. Ltd.
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                In 1992, Modi Foods Pvt. Ltd. was incorporated, giving the growing business a formal foundation for its next chapter of hygienic manufacturing and wider distribution.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This foundation established stringent standards for spice blending, stone milling, and airtight packaging while staying true to home-cooked culinary principles.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EADFCB]/60 text-xs font-bold text-[#6F3E24]">
              Modi Foods Pvt. Ltd. • Quality &amp; Trust
            </div>
          </div>

          {/* Module 4: Today */}
          <div className="bg-[#FCFAF5] rounded-3xl p-8 border border-[#EADFCB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white rounded-full border border-[#EADFCB] text-[10px] font-black uppercase tracking-wider text-[#C90018]">
                  04 • Carrying The Name Forward
                </span>
                <UserCheck className="w-5 h-5 text-[#C90018]" />
              </div>
              <h3 className="font-display font-black text-2xl text-gray-900 leading-snug">
                The Heritage in Modern Homes
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Today, Amit Mukeshchandra Modi leads the business, carrying forward the values and food heritage built across generations.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The name Amrat Narsih itself is inspired by the legacy of Late Amrutlal Narsihdas Modi, keeping the family story at the heart of the brand.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EADFCB]/60 text-xs font-bold text-[#6F3E24]">
              Inspired by Late Amrutlal Narsihdas Modi
            </div>
          </div>

        </div>

        {/* Story Footer Banner */}
        <div className="mt-12 p-8 bg-[#FFF8EC] rounded-3xl border border-[#F4C400]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <AmratNarsihLogo className="h-12 w-auto shrink-0" />
            <div>
              <h4 className="font-display font-black text-lg text-gray-900">
                1956 Heritage Presented Through Modern Excellence
              </h4>
              <p className="text-xs text-gray-600">
                Crafted with care by Modi Foods Pvt. Ltd., Surat, Gujarat.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('about')}
            className="btn-vibrant-cta text-white px-6 py-3 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
          >
            Read Our Full Story →
          </button>
        </div>

      </div>
    </section>
  );
};
