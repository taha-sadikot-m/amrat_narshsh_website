'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const PILLARS = [
  {
    title: 'Heritage Since 1956',
    gujaratiTitle: '૧૯૫૬થી અવિરત સ્વાદની પરંપરા',
    description: 'Over 68 years of culinary trust rooted in Ahmedabad, Gujarat. Formulations passed down through generations without alteration.',
    icon: Award,
    color: '#C90018',
  },
  {
    title: '100% Pure Vegetarian & Clean',
    gujaratiTitle: 'શુદ્ધ અને સાત્વિક સામગ્રી',
    description: 'Stone-milled flours, unadulterated ground lentils, and genuine whole spices. Zero artificial colorings, zero fillers.',
    icon: ShieldCheck,
    color: '#2E7D32',
  },
  {
    title: 'Ready in 10–15 Minutes',
    gujaratiTitle: 'ઝટપટ સ્વાદિષ્ટ રસોઈ',
    description: 'Designed for modern busy lifestyles. Recreate authentic Gujarati street food and festive banquets with zero prep stress.',
    icon: Sparkles,
    color: '#F4C400',
  },
  {
    title: 'Milled to Perfection',
    gujaratiTitle: 'સ્વચ્છતા અને ઉત્તમ ગુણવત્તા',
    description: 'State-of-the-art hygienic processing and triple-layer nitrogen sealing keeps every spice fresh and aromatic.',
    icon: HeartHandshake,
    color: '#6F3E24',
  },
];

export const WhyAmratNarsih: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section
      id="why-amrat-narsih-section"
      className="py-20 sm:py-28 bg-[#FCFAF5] border-b border-[#EADFCB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header — single, consolidated framing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#C90018] mb-2">
            Since 1956
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#191919]">
            Why Generations Trust Us
          </h2>
          <p className="font-gujarati text-sm sm:text-base font-bold text-[#6F3E24] mt-2">
            ૧૯૫૬થી અવિરત સ્વાદની પરંપરા
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="text-center sm:text-left"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0 text-white shadow-xs"
                  style={{ backgroundColor: pillar.color }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>

                <h3 className="font-display font-bold text-lg text-gray-900 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Link to the full detailed heritage timeline — told once, in depth, in one place */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <button
            onClick={() => navigateTo('journey')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#C90018] hover:text-[#8A000F] transition-colors cursor-pointer group"
          >
            <span>Read our full story</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
