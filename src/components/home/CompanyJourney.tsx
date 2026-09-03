'use client';

import React from 'react';
import { History, ArrowRight, CheckCircle2, Award, Calendar, Sparkles, Building2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Since1956Badge } from '../../data/brandAssets';

export const CompanyJourney: React.FC = () => {
  const { navigateTo } = useStore();

  const MILESTONES = [
    {
      year: '1956',
      badge: 'FOUNDING CHAPTER',
      title: 'Late Amrutlal Narsihdas Modi',
      subtitle: 'The Humble Beginning in Surat',
      description: 'Late Amrutlal Narsihdas Modi begins the journey with a small shop in Surat, driven by a passion to deliver authentic Gujarati taste to families.',
      accent: '#C90018',
    },
    {
      year: 'NEXT GENERATION',
      badge: 'FAMILY EXPANSION',
      title: 'Late Mukeshchandra Amrutlal Modi',
      subtitle: 'Strengthening the Family Craft',
      description: 'Late Mukeshchandra Amrutlal Modi joins the business and helps expand the family venture, refining milling techniques and standardizing traditional recipes.',
      accent: '#F4C400',
    },
    {
      year: '1992',
      badge: 'CORPORATE FOUNDATION',
      title: 'Modi Foods Pvt. Ltd. Incorporated',
      subtitle: 'A New Chapter of Growth',
      description: 'Modi Foods Pvt. Ltd. was incorporated, giving the growing business a formal foundation for modern manufacturing, quality compliance, and wider reach.',
      accent: '#2E7D32',
    },
    {
      year: 'TODAY',
      badge: 'MODERN LEADERSHIP',
      title: 'Amit Mukeshchandra Modi',
      subtitle: 'The Next Generation of Heritage',
      description: 'Amit Mukeshchandra Modi leads the business, building on the family\'s legacy while taking Amrat Narsih towards a new generation of modern consumers across India.',
      accent: '#6F3E24',
    },
  ];

  return (
    <section
      id="company-journey-section"
      className="py-16 sm:py-24 bg-white border-b border-[#EADFCB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[#FCFAF5] px-4 py-1 rounded-full border border-[#EADFCB]">
            <History className="w-3.5 h-3.5 text-[#C90018]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#6F3E24]">
              GENERATIONS OF DEDICATION
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight">
            Our Journey Across Generations
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            From a single shop in 1956 Surat to one of Gujarat's most respected food heritages.
          </p>
        </div>

        {/* 4-Step Interactive Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {MILESTONES.map((item, idx) => (
            <div
              key={item.year}
              className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border border-[#EADFCB] shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group"
            >
              <div className="space-y-4">
                {/* Year Marker */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-display font-black text-xl tracking-tight px-3 py-1 rounded-xl text-white shadow-xs"
                    style={{ backgroundColor: item.accent }}
                  >
                    {item.year}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Step 0{idx + 1}
                  </span>
                </div>

                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#6F3E24]">
                  {item.badge}
                </div>

                <h3 className="font-display font-black text-lg text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <div className="text-xs font-bold text-gray-500">
                  {item.subtitle}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#EADFCB]/60 flex items-center text-[10px] font-bold text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-700 mr-1.5" />
                <span>Verified Historical Fact</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('journey')}
            className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#C90018] hover:text-[#9E0012] cursor-pointer"
          >
            <span>Read The Complete Verified Heritage Timeline Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
