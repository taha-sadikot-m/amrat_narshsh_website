'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Sparkles, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AmratNarsihLogo, VegBadge, Since1956Badge } from '../../data/brandAssets';

export const FinalCTA: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section
      id="final-call-to-action-section"
      className="py-20 sm:py-28 bg-[#FCFAF5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#C90018] rounded-3xl p-8 sm:p-14 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl"
        >

          {/* Ambient Floating Background Rings */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#F4C400]/20 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">

            {/* Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/15 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-xs"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-[#F4C400]"
              />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                AMRAT NARSIH • EST. 1956
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight"
            >
              Bring the Taste of Gujarat Home.
            </motion.h2>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              Discover traditional favourites made for the way we enjoy food today.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.button
                id="final-cta-explore-products"
                onClick={() => navigateTo('products')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-white hover:bg-[#FFF8EC] text-[#C90018] px-8 py-4 rounded-full font-display font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl cursor-pointer group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                id="final-cta-get-in-touch"
                onClick={() => navigateTo('contact')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Get in Touch</span>
                <Mail className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 font-semibold"
            >
              <span>✓ 100% Pure Vegetarian</span>
              <span>•</span>
              <span>✓ Pan-India Delivery</span>
              <span>•</span>
              <span>✓ Verified 1956 Formulations</span>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </section>
  );
};
