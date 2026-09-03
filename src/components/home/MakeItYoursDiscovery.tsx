'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Flame, Clock, Heart, Coffee, Sun } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductPackshot } from '../../data/brandAssets';
import { MoodTag } from '../../types';

const MOODS: { id: MoodTag; label: string; icon: any; desc: string }[] = [
  { id: 'crispy', label: 'Crispy & Golden', icon: Flame, desc: 'Crunchy monsoon snacks and evening fritters' },
  { id: 'breakfast', label: 'Morning Warmth', icon: Sun, desc: 'Soft steamed Idla, Locho, and hearty Handwa' },
  { id: 'evening-snack', label: 'Tea-Time Treats', icon: Coffee, desc: 'Dalwada, Gobapuri, and Dakor na Gota' },
  { id: 'sweet', label: 'Sweet Celebrations', icon: Heart, desc: 'Royally soft, saffron-soaked Gulab Jamuns' },
  { id: 'fast-easy', label: 'Instant in 10 Mins', icon: Clock, desc: 'Zero hassle, instant comfort food like Khichu' },
  { id: 'gluten-free', label: 'Fasting / Farali', icon: Sparkles, desc: '100% Farali pure grounded flours for Vrat' },
];

export const MakeItYoursDiscovery: React.FC = () => {
  const { navigateTo, products } = useStore();
  const [activeMood, setActiveMood] = useState<MoodTag>('crispy');

  const matchingProducts = products.filter((p) => p.moodTags.includes(activeMood));

  return (
    <section
      id="mood-discovery-section"
      className="py-20 sm:py-28 bg-[#FCFAF5] border-b border-[#EADFCB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#C90018] mb-1">
            Personalized Food Matcher
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#191919]">
            What Are You in the Mood For?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Select your culinary craving and discover the perfect Amrat Narsih traditional mix for your table.
          </p>
        </motion.div>

        {/* Mood Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {MOODS.map((mood, index) => {
            const Icon = mood.icon;
            const isSelected = activeMood === mood.id;

            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveMood(mood.id)}
                className={`p-4 rounded-2xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-[#C90018] text-white border-[#C90018] shadow-md'
                    : 'bg-white text-gray-800 border-[#EADFCB] hover:border-[#C90018] hover:bg-[#FFF8EC]'
                }`}
              >
                <motion.div
                  animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#FFF8EC] text-[#C90018]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="text-xs font-extrabold">{mood.label}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Matching Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMood}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matchingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                onClick={() => navigateTo('product-detail', { productId: product.id })}
                className="bg-white rounded-3xl p-5 border border-[#EADFCB] shadow-xs hover:shadow-lg hover:border-[#C90018] transition-[box-shadow,border-color] flex items-center space-x-4 cursor-pointer group"
              >
                <div className="w-20 h-26 shrink-0 group-hover:scale-105 transition-transform">
                  <ProductPackshot productId={product.id} src={product.imageUrl} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-[#C90018]">
                    {product.categoryName}
                  </span>
                  <h4 className="font-display font-bold text-sm text-gray-900 group-hover:text-[#C90018] truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs font-extrabold text-gray-900 mt-2">
                    ₹{product.defaultPrice}{' '}
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({product.defaultWeight})
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C90018] group-hover:translate-x-1 transition-all shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
