'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { HeritageTimeline } from '../home/HeritageTimeline';
import { ChevronRight } from 'lucide-react';

export const JourneyPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div id="journey-page" className="bg-[#FCFAF5] min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#C90018] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <button
            onClick={() => navigateTo('about')}
            className="hover:text-[#C90018] transition-colors cursor-pointer"
          >
            About
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">1956–Today Heritage Journey</span>
        </nav>
      </div>

      {/* Main Interactive Timeline Section */}
      <HeritageTimeline />
    </div>
  );
};
