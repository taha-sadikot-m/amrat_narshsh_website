'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useStore } from '../../context/StoreContext';

const ROUTE =
  'M600 70 C600 280 380 320 380 530 C380 790 830 780 830 1030 C830 1300 400 1280 400 1530 C400 1800 620 1820 620 2060';

const NODES = [
  [600, 70],
  [380, 530],
  [830, 1030],
  [400, 1530],
];

const MILESTONES = [
  {
    year: '1956',
    label: 'The first stop',
    title: 'A shop opens in Salabatpura',
    person: 'Late Amrutlal Narsihdas Modi',
    copy: 'A small shop in Surat begins selling the flours and mixes local kitchens already know.',
    accent: '#C62828',
    image: '/images/journey/shop-1956.webp',
    alt: 'A provisions shop front on a narrow street, sacks and tins stacked at the counter',
  },
  {
    year: 'Next',
    label: 'The second generation',
    title: 'The work moves beyond the counter',
    person: 'Late Mukeshchandra Amrutlal Modi',
    copy: 'His son joins the business and grows what began in that neighbourhood shop.',
    accent: '#B8860B',
    image: '/images/journey/milling-flour.webp',
    alt: 'Hands working lentil flour on a wooden surface beside bowls of whole spices',
  },
  {
    year: '1992',
    label: 'A company takes shape',
    title: 'Modi Foods Pvt. Ltd. is incorporated',
    person: 'Surat, Gujarat',
    copy: 'The family business receives its formal company name and foundation for the years ahead.',
    accent: '#D46A1E',
    image: '/images/journey/company-1992.webp',
    alt: 'A packing bench with brown paper, twine, a brass scale and stacked sealed pouches',
  },
  {
    year: 'Today',
    label: 'The third generation',
    title: 'Still made and led from Surat',
    person: 'Amit Mukeshchandra Modi',
    copy: 'The range now serves everyday plates, festival tables and fasting days across modern homes.',
    accent: '#2E7D32',
    image: null,
    alt: 'The current Amrat Narsih product range',
  },
];

function circleFrame(accent: string) {
  return {
    boxShadow: `0 0 0 4px #FFFBF5, 0 0 0 5px ${accent}59, 0 18px 38px rgba(62,39,35,0.13)`,
  };
}

function PacketWell({
  accent,
  products,
}: {
  accent: string;
  products: ReturnType<typeof useStore>['products'];
}) {
  const selected = ['bhajiya', 'gulab-jamun', 'farali-atta']
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const positions = ['-translate-x-[52px]', '', 'translate-x-[52px]'];

  return (
    <div
      className="relative flex h-[230px] w-[230px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFF3E0]"
      style={circleFrame(accent)}
      aria-label="The current Amrat Narsih product range"
    >
      {selected.map((product, index) => (
        <img
          key={product.id}
          src={product.imageUrl}
          alt={`${product.name} packet`}
          loading="lazy"
          className={`absolute h-[132px] w-auto object-contain drop-shadow-[0_10px_14px_rgba(62,39,35,0.18)] ${positions[index]}`}
        />
      ))}
    </div>
  );
}

function Artifact({
  milestone,
  products,
}: {
  milestone: (typeof MILESTONES)[number];
  products: ReturnType<typeof useStore>['products'];
}) {
  if (!milestone.image) return <PacketWell accent={milestone.accent} products={products} />;

  return (
    <div
      className="h-[230px] w-[230px] shrink-0 overflow-hidden rounded-full"
      style={circleFrame(milestone.accent)}
    >
      <img
        src={milestone.image}
        alt={milestone.alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function MilestoneText({ milestone }: { milestone: (typeof MILESTONES)[number] }) {
  return (
    <div className="min-w-0 flex-1 lg:max-w-md">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: milestone.accent }} />
        <span className="font-display text-[2.6rem] font-bold leading-none text-[#3E2723]">
          {milestone.year}
        </span>
      </div>
      <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#8D6E63]">
        {milestone.label}
      </p>
      <h2 className="font-display mt-2 text-2xl font-bold leading-tight text-[#3E2723] sm:text-[1.75rem]">
        {milestone.title}
      </h2>
      <p className="mt-3 text-sm font-bold text-[#3E2723]">{milestone.person}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#8D6E63]">{milestone.copy}</p>
    </div>
  );
}

export const JourneyPage: React.FC = () => {
  const { products } = useStore();
  const reduceMotion = Boolean(useReducedMotion());
  const routeSection = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: routeSection,
    offset: ['start 70%', 'end 70%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <main id="journey-page" className="overflow-hidden bg-[#FFFBF5] text-[#3E2723]">
      <header
        className="relative border-b border-[#F0E4D0] px-6 py-20 sm:py-28"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,106,30,0.13) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F0E4D0] bg-[#FFFBF5]/90 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#D46A1E]">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Surat, Gujarat
          </div>
          <h1 className="font-display mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(3.4rem,10vw,8rem)] font-bold leading-[0.82] tracking-[-0.05em] text-[#3E2723]">
            1956
            <span className="h-px w-[clamp(2rem,5vw,4.5rem)] bg-[#D4B896]" aria-hidden="true" />
            Today
          </h1>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-[#8D6E63] sm:text-lg">
            Four stops in one Surat family business. Follow the route from a Salabatpura shop to the packets made today.
          </p>
        </div>
      </header>

      <section ref={routeSection} className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
        {/* Desktop illustrated route */}
        <div className="relative hidden h-[2150px] lg:block">
          <svg
            viewBox="0 0 1200 2150"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d={ROUTE}
              fill="none"
              stroke="#D4B896"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={ROUTE}
              fill="none"
              stroke="#D46A1E"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduceMotion ? 1 : progress }}
            />
            {NODES.map(([x, y], index) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="5"
                fill={index <= active ? MILESTONES[index].accent : '#D4B896'}
              />
            ))}
          </svg>

          {MILESTONES.map((milestone, index) => {
            const placements = [
              'left-[4%] top-[2%]',
              'right-[3%] top-[25%]',
              'left-[2%] top-[49%]',
              'right-[2%] top-[73%]',
            ];
            return (
              <motion.article
                key={milestone.year}
                onViewportEnter={() => setActive(index)}
                viewport={{ amount: 0.55, margin: '-112px 0px 0px 0px' }}
                initial={reduceMotion ? false : { y: 28, opacity: 0 }}
                whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute flex w-[46%] items-center gap-6 ${placements[index]} ${
                  index % 2 === 1 ? 'flex-row-reverse' : ''
                }`}
              >
                <MilestoneText milestone={milestone} />
                <Artifact milestone={milestone} products={products} />
              </motion.article>
            );
          })}
        </div>

        {/* Mobile route */}
        <div className="relative lg:hidden">
          <div className="absolute bottom-0 left-[11px] top-0 border-l border-[#D4B896]" aria-hidden="true" />
          <div className="space-y-20">
            {MILESTONES.map((milestone, index) => (
              <motion.article
                key={milestone.year}
                initial={reduceMotion ? false : { x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                whileInView={reduceMotion ? undefined : { x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.45 }}
                className="relative pl-10"
              >
                <span
                  className="absolute left-[5px] top-4 h-3 w-3 rounded-full ring-4 ring-[#FFFBF5]"
                  style={{ backgroundColor: milestone.accent }}
                />
                <MilestoneText milestone={milestone} />
                <div className="mt-8 flex justify-center">
                  <Artifact milestone={milestone} products={products} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#F0E4D0] bg-[#FFF3E0]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
          <div className="flex max-w-3xl items-start gap-5">
            <MapPin className="mt-1 h-8 w-8 shrink-0 text-[#D46A1E]" aria-hidden="true" />
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#8D6E63]">Next destination</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[#3E2723] sm:text-4xl">The journey continues in your kitchen.</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#D46A1E] px-5 text-sm font-bold text-white hover:bg-[#A84F10]">
                  Shop mixes <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/our-story" className="inline-flex h-11 items-center rounded-lg border border-[#D4B896] bg-[#FFFBF5] px-5 text-sm font-bold text-[#3E2723] hover:border-[#D46A1E]">
                  Meet the family
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
