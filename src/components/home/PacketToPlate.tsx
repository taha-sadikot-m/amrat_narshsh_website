'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Clock3,
  Flame,
  Heart,
  Timer,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';

type IllustrationKind = 'mix' | 'rest' | 'cook' | 'serve';

type ProcessStep = {
  number: string;
  title: string;
  gujarati: string;
  description: string;
  timing: string;
  Icon: LucideIcon;
  TimingIcon: LucideIcon;
  illustration: IllustrationKind;
};

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Open & Whisk',
    gujarati: 'પાણી સાથે મિક્સ કરો',
    description:
      'Empty the packet into a bowl and add the exact measured water. No complicated ratios or extra spices required.',
    timing: '2 Mins',
    Icon: Utensils,
    TimingIcon: Timer,
    illustration: 'mix',
  },
  {
    number: '02',
    title: 'Rest & Hydrate',
    gujarati: 'પલાળી રાખો',
    description:
      'Let the coarse-ground lentils and stone-milled flours absorb moisture for 5–10 minutes for signature fluffiness.',
    timing: '5–10 Mins',
    Icon: Clock3,
    TimingIcon: Clock3,
    illustration: 'rest',
  },
  {
    number: '03',
    title: 'Golden Fry or Steam',
    gujarati: 'ગરમા ગરમ તળો / બાફો',
    description:
      'Deep fry to a crispy amber crunch or steam in a thali until pillowy soft and feather-light.',
    timing: 'Cook',
    Icon: Flame,
    TimingIcon: Flame,
    illustration: 'cook',
  },
  {
    number: '04',
    title: 'Pure Gujarati Joy',
    gujarati: 'પરિવાર સાથે માણો',
    description:
      'Serve piping hot with sweet Gujarati kadhi, fried salted chillies, or cold-pressed peanut oil with chai.',
    timing: 'Enjoy!',
    Icon: Heart,
    TimingIcon: Heart,
    illustration: 'serve',
  },
];

const CTA_PRODUCT_IDS = ['bhajiya', 'farali-atta', 'gulab-jamun', 'surti-locho'];

function StepIllustration({ kind }: { kind: IllustrationKind }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (kind === 'mix') {
    return (
      <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
        <path d="M38 58h92c-3 27-20 43-46 43S42 85 38 58Z" {...commonProps} />
        <path d="M47 66c24 9 50 9 74 0M83 57 119 16M108 17l12-3-3 12" {...commonProps} />
        <path d="M26 92c14 7 27 10 39 9M134 85c9-3 16-8 21-15" {...commonProps} />
      </svg>
    );
  }

  if (kind === 'rest') {
    return (
      <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
        <path d="M40 61h92c-4 26-21 40-46 40S44 87 40 61Z" {...commonProps} />
        <path d="M48 69c25 8 50 8 75 0M58 54c11-8 45-9 58 0" {...commonProps} />
        <path d="M68 46c-4-6 3-10 0-16M88 44c-4-6 3-10 0-16M108 46c-4-6 3-10 0-16" {...commonProps} />
      </svg>
    );
  }

  if (kind === 'cook') {
    return (
      <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
        <path d="M38 55h98l-8 43H47l-9-43ZM31 54h112M54 46h66" {...commonProps} />
        <path d="M72 42c-8-11 8-14 1-26M92 42c-8-11 8-14 1-26M112 42c-8-11 8-14 1-26" {...commonProps} />
        <path d="M48 100h79M135 65h15c7 0 7 15-2 18h-16" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
      <ellipse cx="88" cy="77" rx="55" ry="24" {...commonProps} />
      <ellipse cx="88" cy="72" rx="43" ry="15" {...commonProps} />
      <path d="M57 70c8-12 19-17 31-17s24 5 32 17M38 92h101" {...commonProps} />
      <path d="M139 42c9-12 22-4 15 7-4 6-15 12-15 12s-11-6-14-12c-6-11 7-19 14-7Z" {...commonProps} />
    </svg>
  );
}

function TimingPill({ step }: { step: ProcessStep }) {
  const TimingIcon = step.TimingIcon;

  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#D9A441]/55 bg-[#FFFDF9]/90 px-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6F3E24] transition-[border-color,background-color] duration-300 group-hover:border-[#C90018]/35 group-hover:bg-white">
      <TimingIcon className="h-3.5 w-3.5 text-[#C90018]" strokeWidth={1.8} />
      {step.timing}
    </span>
  );
}

function DesktopStepCard({
  step,
  index,
  reduceMotion,
}: {
  step: ProcessStep;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = step.Icon;

  return (
    <motion.li
      initial={reduceMotion ? false : { y: 28 }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[26px] border border-[#EADFCB] bg-white/80 p-6 shadow-[0_10px_40px_rgba(93,61,28,0.055)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[#D9A441]/70 hover:shadow-[0_18px_45px_rgba(93,61,28,0.11)] xl:min-h-[455px] xl:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-[42px] font-black leading-none tracking-tight text-[#E4A8AD] transition-colors duration-300 group-hover:text-[#C90018]/60">
          {step.number}
        </span>
        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#EADFCB] bg-[#FFF8EC] text-[#C90018] transition-[background-color,color,transform] duration-300 group-hover:rotate-2 group-hover:bg-[#C90018] group-hover:text-white">
          <Icon className="h-7 w-7" strokeWidth={1.55} />
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <h3 className="font-display text-[24px] font-black leading-[1.15] tracking-tight text-[#191919]">
          {step.title}
        </h3>
        <p className="font-gujarati mt-2 text-sm font-bold text-[#8B3D2E]">{step.gujarati}</p>
        <p className="mt-4 text-sm leading-6 text-[#5C5852]">{step.description}</p>
      </div>

      <div className="relative z-10 mt-auto pt-7">
        <TimingPill step={step} />
      </div>

      <div className="pointer-events-none absolute -bottom-5 -right-5 h-32 w-40 text-[#D9A441]/15 transition-colors duration-300 group-hover:text-[#D9A441]/25 xl:h-36 xl:w-44">
        <StepIllustration kind={step.illustration} />
      </div>
    </motion.li>
  );
}

function MobileTimeline({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <ol className="relative mt-12 md:hidden">
      <div
        className="absolute bottom-12 left-[25px] top-7 w-px bg-gradient-to-b from-[#D9A441] via-[#E5C989] to-[#C90018]/35"
        aria-hidden="true"
      />
      {STEPS.map((step, index) => {
        const Icon = step.Icon;

        return (
          <motion.li
            key={step.number}
            initial={reduceMotion ? false : { x: -16 }}
            whileInView={reduceMotion ? undefined : { x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-4 pb-9 last:pb-0"
          >
            <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#D9A441]/55 bg-[#FAF5EC] shadow-[0_0_0_6px_#FAF5EC]">
              <span className="font-display text-base font-black tracking-tight text-[#C90018]">
                {step.number}
              </span>
            </div>

            <article className="relative min-w-0 border-b border-[#EADFCB] pb-9 pr-1 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-[21px] font-black leading-tight tracking-tight text-[#191919]">
                    {step.title}
                  </h3>
                  <p className="font-gujarati mt-1.5 text-sm font-bold text-[#8B3D2E]">
                    {step.gujarati}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#C90018] shadow-[0_6px_18px_rgba(93,61,28,0.08)]">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                </span>
              </div>
              <p className="mt-3 text-sm leading-[1.65] text-[#5C5852]">{step.description}</p>
              <div className="mt-4">
                <TimingPill step={step} />
              </div>
              <div className="pointer-events-none absolute -bottom-1 right-0 h-20 w-28 text-[#D9A441]/10">
                <StepIllustration kind={step.illustration} />
              </div>
            </article>
          </motion.li>
        );
      })}
    </ol>
  );
}

function PacketCluster({ products }: { products: Product[] }) {
  return (
    <div className="relative h-[132px] w-[240px] sm:h-[150px] sm:w-[290px]" aria-label="Selection of Amrat Narsih product packets">
      {products.map((product, index) => {
        const positions = [
          'left-2 bottom-1 -rotate-6',
          'left-[29%] bottom-3 -rotate-2',
          'left-[54%] bottom-2 rotate-3',
          'right-0 bottom-0 rotate-6',
        ];

        return (
          <img
            key={product.id}
            src={product.imageUrl}
            alt={`${product.name} packet`}
            className={`absolute h-[112px] w-[74px] object-contain drop-shadow-[0_12px_10px_rgba(72,31,15,0.18)] sm:h-[136px] sm:w-[88px] ${positions[index] ?? positions[3]}`}
            loading="lazy"
          />
        );
      })}
    </div>
  );
}

export const PacketToPlate: React.FC = () => {
  const { navigateTo, products } = useStore();
  const reduceMotion = Boolean(useReducedMotion());
  const preferredProducts = CTA_PRODUCT_IDS.map((id) => products.find((product) => product.id === id)).filter(
    (product): product is Product => Boolean(product)
  );
  const ctaProducts = preferredProducts.length >= 3 ? preferredProducts : products.slice(0, 4);
  const productCount = products.length;

  return (
    <section
      id="packet-to-plate-section"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-b border-[#EADFCB] bg-[#FAF5EC] py-20 sm:py-24 lg:py-28"
    >
      <img
        src="/images/gujarati/category-decorations.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-24 hidden w-[460px] select-none opacity-[0.18] md:block lg:-right-20 lg:w-[540px]"
      />
      <div className="pointer-events-none absolute left-5 top-24 hidden h-2 w-2 rounded-full bg-[#D9A441]/45 sm:block" aria-hidden="true" />
      <div className="pointer-events-none absolute left-12 top-36 hidden h-1.5 w-1.5 rounded-full bg-[#6F3E24]/35 sm:block" aria-hidden="true" />
      <div className="pointer-events-none absolute left-20 top-20 hidden h-1 w-1 rounded-full bg-[#C90018]/30 sm:block" aria-hidden="true" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.header
          initial={reduceMotion ? false : { y: 20 }}
          whileInView={reduceMotion ? undefined : { y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-[38px] font-black leading-[1.02] tracking-tight text-[#191919] min-[390px]:text-[42px] sm:text-5xl lg:text-6xl">
            From Our Packet
            <span className="mt-1 block text-[#C90018]">to Your Plate</span>
          </h2>
          <p className="font-gujarati mt-5 text-sm font-bold leading-relaxed text-[#8B3D2E] sm:text-base">
            પેકેટથી થાળી સુધી — સરળ, સ્વાદિષ્ટ અને પરંપરાગત
          </p>
          <p className="mx-auto mt-5 max-w-[700px] text-sm leading-7 text-[#5C5852] sm:text-base">
            No messy grinding, no guesswork with spices. Just authentic heritage taste made fresh
            at home in 4 simple steps.
          </p>
        </motion.header>

        <div className="relative mt-16 hidden pt-7 md:block">
          <div className="absolute left-[12.5%] right-[12.5%] top-3 hidden h-px border-t border-dashed border-[#D9A441]/65 lg:block" aria-hidden="true" />
          {[12.5, 37.5, 62.5, 87.5].map((position) => (
            <span
              key={position}
              className="absolute top-[7px] hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#FAF5EC] bg-[#D9A441] shadow-[0_0_0_1px_rgba(217,164,65,.45)] lg:block"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
          ))}
          {[25, 50, 75].map((position) => (
            <span
              key={position}
              className="absolute top-[-3px] hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-[#EADFCB] bg-[#FAF5EC] text-[#C90018] lg:flex"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          ))}
          <ol className="grid grid-cols-2 gap-5 lg:grid-cols-4 xl:gap-6">
            {STEPS.map((step, index) => (
              <DesktopStepCard
                key={step.number}
                step={step}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </ol>
        </div>

        <MobileTimeline reduceMotion={reduceMotion} />

        <motion.button
          id="packet-to-plate-cta"
          type="button"
          onClick={() => navigateTo('products')}
          initial={reduceMotion ? false : { y: 18 }}
          whileInView={reduceMotion ? undefined : { y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mt-14 grid w-full cursor-pointer items-center overflow-hidden rounded-[28px] border border-[#D9A441]/45 bg-white/85 px-5 py-6 text-left shadow-[0_12px_42px_rgba(93,61,28,0.08)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#C90018]/35 hover:shadow-[0_18px_48px_rgba(93,61,28,0.13)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C90018] sm:grid-cols-[300px_minmax(0,1fr)_56px] sm:px-8 sm:py-5 lg:mx-auto lg:max-w-6xl"
          aria-label={`Explore all ${productCount} authentic Gujarati mixes`}
        >
          <div className="mx-auto -mb-2 -mt-3 sm:mx-0 sm:-my-5">
            <PacketCluster products={ctaProducts} />
          </div>
          <div className="relative z-10 mt-4 text-center sm:mt-0 sm:px-6 sm:text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8B3D2E]">
              Discover the complete collection
            </p>
            <p className="font-display mt-2 text-[25px] font-black leading-[1.12] tracking-tight text-[#191919] sm:text-3xl">
              Explore all <span className="text-[#C90018]">{productCount}</span> stone-milled
              <span className="block">authentic Gujarati mixes</span>
            </p>
          </div>
          <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#C90018] text-white shadow-[0_7px_18px_rgba(201,0,24,.25)] transition-transform duration-300 group-hover:translate-x-1 sm:static sm:h-14 sm:w-14">
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        </motion.button>
      </div>
    </section>
  );
};
