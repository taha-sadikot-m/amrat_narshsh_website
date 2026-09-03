'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import {
  History,
  Sparkles,
  MapPin,
  CheckCircle2,
  Award,
  Users,
  Building2,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Flame,
  Clock,
  Wheat,
  Scale,
  HeartHandshake,
  BookOpen
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Since1956Badge, VegBadge, AmratNarsihLogo } from '../../data/brandAssets';

interface MilestoneData {
  id: string;
  year: string;
  periodLabel: string;
  chapterNumber: string;
  leader: string;
  location: string;
  themeColor: string;
  accentBg: string;
  accentBorder: string;
  headline: string;
  narrative: string[];
  heritagePrinciple: string;
  statNumber: string;
  statLabel: string;
  highlights: string[];
  archivalInsight: {
    title: string;
    detail: string;
  };
  artifactSvgType: 'mill' | 'grain' | 'factory' | 'modern';
}

const MILESTONES: MilestoneData[] = [
  {
    id: 'era-1956',
    year: '1956',
    periodLabel: 'THE SURAT GENESIS',
    chapterNumber: 'CHAPTER 01',
    leader: 'Late Amrutlal Narsihdas Modi',
    location: 'Salabatpura, Surat, Gujarat',
    themeColor: '#C90018',
    accentBg: '#FFF5F5',
    accentBorder: '#FECDCD',
    headline: 'The Humble Stone-Milled Beginning in Surat',
    narrative: [
      'The journey of Amrat Narsih began in 1956 in the historic culinary city of Surat. Driven by an uncompromising belief that pure food brings families together, Late Amrutlal Narsihdas Modi opened a small spice and flour milling workshop.',
      'Using traditional heavy stone chakki mills, he insisted that no artificial coloring, chemical bleaching, or fillers would ever enter the formulation—establishing the gold standard of authentic Gujarati taste.'
    ],
    heritagePrinciple: '“Only stone-ground grains preserve the natural fragrance and wholesome vitality of Baa’s kitchen.”',
    statNumber: '1956',
    statLabel: 'Original Year of Foundation',
    highlights: [
      'Slow stone-milled lentil flours',
      'Hand-selected Gujarat whole spices',
      'Zero synthetic additives or colors'
    ],
    archivalInsight: {
      title: 'The Slow Stone-Milling Philosophy',
      detail: 'Unlike fast industrial steel rollers that heat up grains and burn delicate volatile essential oils, slow stone-grinding keeps the flour cool, preserving natural nutty lentil aromas.'
    },
    artifactSvgType: 'mill'
  },
  {
    id: 'era-1970s',
    year: '1970s',
    periodLabel: 'CRAFT REFINEMENT',
    chapterNumber: 'CHAPTER 02',
    leader: 'Late Mukeshchandra Amrutlal Modi',
    location: 'Expansion Across Gujarat Kitchens',
    themeColor: '#D97706',
    accentBg: '#FFFBEB',
    accentBorder: '#FDE68A',
    headline: 'Mastering the Secret Spice Balance & Grain Mesh',
    narrative: [
      'Joining his father’s side, Late Mukeshchandra Amrutlal Modi brought rigorous artisanal discipline to the family craft, standardizing exact grain coarseness and spice blending ratios.',
      'He perfected the proprietary coarse grind for authentic Dalwada and Handwa, guaranteeing the legendary crisp exterior and spongy melt-in-mouth core that home cooks struggled to reproduce consistently.'
    ],
    heritagePrinciple: '“Consistency is our devotion. Every household deserves the exact crispness of authentic Surat street food.”',
    statNumber: '100%',
    statLabel: 'Authentic Traditional Spice Ratios',
    highlights: [
      'Standardized coarse lentil mesh for Dalwada',
      'Balanced hing, black pepper & ajwain ratios',
      'Expansion across thousands of Surat families'
    ],
    archivalInsight: {
      title: 'The Dalwada Grain Texture Breakthrough',
      detail: 'Traditional Moong Dalwadas require a precise ratio of split green moong to yellow moong with coarse granule sizing, allowing water absorption without becoming gummy.'
    },
    artifactSvgType: 'grain'
  },
  {
    id: 'era-1992',
    year: '1992',
    periodLabel: 'MODERN COMPLIANCE',
    chapterNumber: 'CHAPTER 03',
    leader: 'Modi Foods Incorporation',
    location: 'Surat Central Manufacturing Facility',
    themeColor: '#15803D',
    accentBg: '#F0FDF4',
    accentBorder: '#BBF7D0',
    headline: 'Pioneering Hygienic Processing & Freshness Packaging',
    narrative: [
      'In 1992, the business was formally incorporated, laying down advanced hygienic production facilities in Gujarat with automated stainless steel blending systems and strict quality controls.',
      'This pivotal era introduced moisture-barrier packaging, locking in the essential oils and aroma of fresh spices without relying on chemical preservatives.'
    ],
    heritagePrinciple: '“Modern hygiene combined with ancient culinary wisdom creates timeless purity.”',
    statNumber: '0%',
    statLabel: 'Artificial Preservatives or Chemicals',
    highlights: [
      'Food-grade stainless steel blending lines',
      'Advanced moisture-barrier seal technology',
      'Comprehensive lab purity verification'
    ],
    archivalInsight: {
      title: 'Aroma-Lock Packaging Innovation',
      detail: 'By introducing multi-layer barrier foil pouches, the freshness of whole-crushed roasted spices was preserved for months purely through airtight sealed freshness.'
    },
    artifactSvgType: 'factory'
  },
  {
    id: 'era-today',
    year: 'TODAY',
    periodLabel: 'PAN-INDIA HERITAGE',
    chapterNumber: 'CHAPTER 04',
    leader: 'Amit Mukeshchandra Modi',
    location: 'Pan-India & Global Kitchens',
    themeColor: '#6F3E24',
    accentBg: '#FAF5EE',
    accentBorder: '#E7D7C1',
    headline: 'Carrying the 1956 Legacy into Modern Households',
    narrative: [
      'Today, Amit Mukeshchandra Modi guides Amrat Narsih, honoring the original 1956 vision while empowering busy modern households with effortless 15-minute traditional cooking.',
      'With a lineup of 11 authentic instant mixes—from Surti Locho and Dakor Gota to Gujarati Handwa and Dalwada—the authentic taste of Baa’s kitchen is now just minutes away.'
    ],
    heritagePrinciple: '“Amrat Narsih stands as a living bridge between 1956 heritage traditions and the tempo of modern life.”',
    statNumber: '11',
    statLabel: 'Signature Gujarati Heritage Mixes',
    highlights: [
      'Ready in under 15 minutes',
      'Exact generational Baa-approved formulations',
      'Delivered fresh from Gujarat to all India'
    ],
    archivalInsight: {
      title: 'The Name: Amrat Narsih',
      detail: 'The brand name honors the founding patriarch Late Amrutlal Narsihdas Modi, carrying forward 70 years of unbroken trust and pride.'
    },
    artifactSvgType: 'modern'
  }
];

// Stylized visual vignette for each era
const EraArtifactIllustration: React.FC<{ type: MilestoneData['artifactSvgType']; color: string }> = ({
  type,
  color
}) => {
  switch (type) {
    case 'mill':
      return (
        <div className="w-full h-44 sm:h-52 bg-gradient-to-b from-[#FAF5EE] to-[#F3EAD9] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#E8DCBE]">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C90018_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#C90018] shadow-sm flex items-center justify-center text-[#C90018]">
              <Scale className="w-8 h-8" />
            </div>
            <div className="font-display font-black text-sm text-[#191919]">
              Stone-Milled Ghani Heritage
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-200">
              <History className="w-3 h-3 text-[#C90018]" />
              <span>1956 Salabatpura Workshop</span>
            </div>
          </div>
        </div>
      );

    case 'grain':
      return (
        <div className="w-full h-44 sm:h-52 bg-gradient-to-b from-[#FFFDF2] to-[#FBF2D5] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#F2DE9C]">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#D97706] shadow-sm flex items-center justify-center text-[#D97706]">
              <Wheat className="w-8 h-8" />
            </div>
            <div className="font-display font-black text-sm text-[#191919]">
              Standardized Coarse Granulation
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-200">
              <ChefHat className="w-3 h-3 text-[#D97706]" />
              <span>Perfect Moisture & Crisp Balance</span>
            </div>
          </div>
        </div>
      );

    case 'factory':
      return (
        <div className="w-full h-44 sm:h-52 bg-gradient-to-b from-[#F2FBF4] to-[#DCF5E3] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#BBECC8]">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#15803D] shadow-sm flex items-center justify-center text-[#15803D]">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="font-display font-black text-sm text-[#191919]">
              Stainless Steel Hygienic Blending
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-200">
              <ShieldCheck className="w-3 h-3 text-[#15803D]" />
              <span>ISO Grade Hygiene & Lab Purity</span>
            </div>
          </div>
        </div>
      );

    case 'modern':
      return (
        <div className="w-full h-44 sm:h-52 bg-gradient-to-b from-[#FAF4ED] to-[#EFE1CE] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#DFCCAE]">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#6F3E24_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#6F3E24] shadow-sm flex items-center justify-center text-[#6F3E24]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="font-display font-black text-sm text-[#191919]">
              15-Minute Modern Gujarati Kitchen
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-200">
              <Clock className="w-3 h-3 text-[#6F3E24]" />
              <span>7 Decades of Generational Trust</span>
            </div>
          </div>
        </div>
      );
  }
};

const MilestoneCard: React.FC<{
  milestone: MilestoneData;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}> = ({ milestone, index, isActive, onActivate }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: '-100px 0px -100px 0px', once: false });
  const [showInsight, setShowInsight] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      id={milestone.id}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-6 sm:pl-10 md:pl-16 group"
    >
      {/* Visual Connection Node on the Timeline Spine */}
      <div className="absolute left-[-11px] sm:left-[-13px] md:left-[-15px] top-6 sm:top-8 z-20">
        <motion.button
          onClick={onActivate}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-4 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
            isActive || isInView
              ? 'bg-white border-[#C90018] scale-110 shadow-[#C90018]/30'
              : 'bg-[#FCFAF5] border-[#D4C5A9] hover:border-[#C90018]'
          }`}
          aria-label={`Jump to ${milestone.year}`}
        >
          <div
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
              isActive || isInView ? 'bg-[#C90018]' : 'bg-[#D4C5A9]'
            }`}
          />
        </motion.button>
      </div>

      {/* Main Editorial Card Container */}
      <div
        className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 border transition-all duration-300 shadow-xs hover:shadow-xl relative overflow-hidden ${
          isActive
            ? 'border-[#C90018]/50 ring-2 ring-[#C90018]/10'
            : 'border-[#EADFCB] hover:border-[#C90018]/30'
        }`}
      >
        {/* Subtle Top Gradient Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: milestone.themeColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Historical Meta & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Year & Chapter Badge Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="font-display font-black text-lg sm:text-xl text-white px-3.5 py-1 rounded-xl shadow-xs"
                style={{ backgroundColor: milestone.themeColor }}
              >
                {milestone.year}
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-[#FCFAF5] rounded-full border border-[#EADFCB] text-[#6F3E24]">
                {milestone.periodLabel}
              </span>

              <span className="text-[10px] font-bold text-gray-400">
                {milestone.chapterNumber}
              </span>
            </div>

            {/* Leader & Location */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#6F3E24] flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C90018] shrink-0" />
                <span>{milestone.location}</span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-gray-900 leading-snug">
                {milestone.leader}
              </h3>
            </div>

            {/* Headline */}
            <div className="space-y-1.5 pt-1">
              <h4 className="font-display font-bold text-base sm:text-lg text-gray-800 leading-snug">
                {milestone.headline}
              </h4>
            </div>

            {/* Narrative Paragraphs */}
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              {milestone.narrative.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {/* Quoted Heritage Principle */}
            <div
              className="p-4 rounded-2xl border text-xs italic font-serif leading-relaxed text-[#6F3E24]"
              style={{
                backgroundColor: milestone.accentBg,
                borderColor: milestone.accentBorder
              }}
            >
              {milestone.heritagePrinciple}
            </div>

            {/* Key Bullet Highlights */}
            <div className="pt-2 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Key Craft Pillars
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {milestone.highlights.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-center space-x-2 text-xs font-medium text-gray-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Artifact & Interactive Archival Insights (5 cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between h-full">
            
            {/* Visual Vignette Box */}
            <EraArtifactIllustration
              type={milestone.artifactSvgType}
              color={milestone.themeColor}
            />

            {/* Metric Callout Card */}
            <div className="bg-[#FCFAF5] rounded-2xl p-4 border border-[#EADFCB] flex items-center justify-between">
              <div>
                <div
                  className="font-display font-black text-2xl tracking-tight"
                  style={{ color: milestone.themeColor }}
                >
                  {milestone.statNumber}
                </div>
                <div className="text-[11px] font-bold text-gray-600 mt-0.5">
                  {milestone.statLabel}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#EADFCB] flex items-center justify-center text-[#C90018] shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Interactive Archival Fact Dropdown */}
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#EADFCB] p-4 transition-all">
              <button
                onClick={() => setShowInsight(!showInsight)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-[#6F3E24] hover:text-[#C90018] transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-[#C90018]" />
                  <span>{milestone.archivalInsight.title}</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400">
                  {showInsight ? '−' : '+'}
                </span>
              </button>

              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed font-sans"
                >
                  {milestone.archivalInsight.detail}
                </motion.div>
              )}
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};

export const HeritageTimeline: React.FC = () => {
  const { navigateTo } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEraId, setActiveEraId] = useState<string>('era-1956');

  // Scroll Progress Hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 90%']
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  const scrollToEra = (id: string) => {
    setActiveEraId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="heritage-timeline-section"
      className="py-16 sm:py-24 bg-[#FCFAF5] border-b border-[#EADFCB] relative overflow-hidden"
    >
      {/* Decorative Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C90018 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Editorial Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#EADFCB] shadow-2xs">
            <History className="w-3.5 h-3.5 text-[#C90018]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#6F3E24]">
              1956 TO TODAY • 7 DECADES OF HERITAGE
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#191919] tracking-tight leading-tight">
            Our Journey Across <br />
            <span className="text-[#C90018]">Generations of Taste</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            From a humble stone-milling workshop in 1956 Surat to dinner tables across India.
            Explore the milestones, values, and generational dedication that crafted Amrat Narsih.
          </p>
        </div>

        {/* Interactive Era Scrubbing Selector Tabs */}
        <div className="sticky top-20 z-30 bg-[#FCFAF5]/90 backdrop-blur-md py-3 border-y border-[#EADFCB]/60 shadow-2xs">
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar px-2">
            {MILESTONES.map((item) => {
              const isSelected = activeEraId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToEra(item.id)}
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-[#C90018] text-white border-[#C90018] shadow-sm'
                      : 'bg-white text-gray-700 border-[#EADFCB] hover:border-[#C90018] hover:text-[#C90018]'
                  }`}
                >
                  <span className="font-display font-black">{item.year}</span>
                  <span className="text-[10px] opacity-80 hidden sm:inline">• {item.periodLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Timeline Spine & Milestone Cards */}
        <div className="relative ml-2 sm:ml-4 md:ml-6 space-y-12 sm:space-y-16">
          
          {/* Static Timeline Background Track */}
          <div className="absolute left-[0px] top-4 bottom-4 w-[2px] bg-[#EADFCB]" />

          {/* Animated Glowing Scroll Progress Spine */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[0px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#C90018] via-[#D97706] to-[#6F3E24] shadow-[0_0_8px_rgba(201,0,24,0.4)]"
          />

          {/* Milestone Cards */}
          {MILESTONES.map((milestone, idx) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={idx}
              isActive={activeEraId === milestone.id}
              onActivate={() => setActiveEraId(milestone.id)}
            />
          ))}

        </div>

        {/* Section Footer Callout */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFCB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#FCFAF5] px-3 py-1 rounded-full border border-[#EADFCB] text-xs font-bold text-[#6F3E24]">
              <VegBadge size={14} />
              <span>100% Pure Vegetarian Heritage</span>
            </div>
            <h3 className="font-display font-black text-2xl text-gray-900">
              Taste 70 Years of Tradition in Minutes
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg">
              Every pack of Surti Locho, Dalwada, and Handwa is crafted using the exact generational recipes honed since 1956.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('products')}
              className="btn-vibrant-cta text-white px-7 py-3.5 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              Explore 11 Heritage Mixes
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="bg-[#FCFAF5] hover:bg-gray-100 text-gray-800 border border-[#EADFCB] px-6 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Read Full Founder Story
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
