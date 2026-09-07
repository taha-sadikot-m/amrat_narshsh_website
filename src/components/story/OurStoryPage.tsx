'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { AmratNarsihLogo } from '../../data/brandAssets';

// Sticky offset: 70px navbar row + 42px category strip.
const HEADER = 112;

const ERAS = [
  {
    year: '1956',
    accent: '#C62828',
    leader: 'Late Amrutlal Narsihdas Modi',
    place: 'Salabatpura, Surat',
    productId: 'bhajiya',
    paragraphs: [
      'Amrutlal Narsihdas Modi opened a small shop in Surat in 1956, selling flours and mixes to the households around it.',
      'The recipes were the ones Gujarati kitchens already used. Bhajiya, gota, dalwada — packed so they could be made at home without the grinding.',
    ],
  },
  {
    year: '1992',
    accent: '#D46A1E',
    leader: 'Late Mukeshchandra Amrutlal Modi',
    place: 'Modi Foods Pvt. Ltd., Surat',
    productId: 'handwa',
    paragraphs: [
      'His son, Mukeshchandra Amrutlal Modi, joined the shop and took the work past the counter it started on.',
      'In 1992 the business was incorporated as Modi Foods Pvt. Ltd. That is still the company behind the packets.',
    ],
  },
  {
    year: 'Today',
    accent: '#2E7D32',
    leader: 'Amit Mukeshchandra Modi',
    place: 'Surat, Gujarat',
    productId: 'gulab-jamun',
    paragraphs: [
      'Amit Mukeshchandra Modi runs the company now — the third generation of the family in the business.',
      'The shelf has grown to mixes and flours for everyday plates, festival tables and fasting days, made to the same Surat recipes.',
    ],
  },
];

const CRAFT_NOTES = [
  { title: 'Vegetarian', body: 'Every mix is vegetarian. Nothing else runs through the same line.' },
  { title: 'No added colours', body: 'The colour is turmeric, chilli and lentil. Nothing is dyed.' },
  { title: 'Sealed packs', body: 'Packed to stay dry, so the spice still smells like spice when you open it.' },
  { title: 'Surat recipes', body: 'The blends follow the family recipes the shop opened with.' },
];

const CLUSTER_IDS = ['bhajiya', 'dalwada', 'khichu', 'gota'];

export const OurStoryPage: React.FC = () => {
  const { products } = useStore();
  const reduceMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState(0);

  const imageFor = (productId: string) => products.find((product) => product.id === productId)?.imageUrl;
  const clusterProducts = CLUSTER_IDS.map((id) => products.find((product) => product.id === id)).filter(
    (product): product is NonNullable<typeof product> => Boolean(product)
  );
  const activeEra = ERAS[active];

  return (
    <main id="about-brand-page" className="bg-[#FFFBF5] text-[#3E2723]">
      {/* Hero */}
      <section className="relative isolate min-h-[440px] overflow-hidden border-b border-[#F0E4D0] lg:min-h-[560px]">
        <motion.img
          src="/images/gujarati/collection-still-life.webp"
          alt="Amrat Narsih mixes on a Surat kitchen counter"
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#FFFBF5] via-[#FFFBF5]/90 to-[#FFFBF5]/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[#FFFBF5]"
        />

        <div className="relative mx-auto flex min-h-[440px] max-w-[1280px] flex-col justify-center px-6 py-16 lg:min-h-[560px] lg:py-24">
          <div className="max-w-xl">
            <AmratNarsihLogo className="h-11 w-[170px]" />
            <p className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#D46A1E]">
              Est. 1956 · Salabatpura, Surat
            </p>
            <h1 className="font-display mt-3 text-[2.35rem] font-bold leading-[1.05] tracking-tight text-[#3E2723] sm:text-[3.25rem]">
              Three generations,
              <span className="block">one shop in Surat</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#6D584F]">
              Amrat Narsih mixes come out of a shop that opened in 1956. The family that opened it still runs the company.
            </p>
          </div>
        </div>
      </section>

      {/* Pinned era scroller */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] transition-colors duration-700"
          style={{ backgroundColor: activeEra.accent }}
        />

        <div className="relative mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
          {/* Sticky year */}
          <div
            className="hidden lg:flex lg:sticky lg:flex-col lg:justify-center"
            style={{ top: HEADER, height: `calc(100vh - ${HEADER}px)` }}
          >
            <div className="flex gap-6">
              <div className="relative w-[2px] shrink-0 self-stretch bg-[#F0E4D0]">
                <div
                  className="absolute left-0 top-0 w-[2px] transition-[height,background-color] duration-500"
                  style={{
                    height: `${((active + 1) / ERAS.length) * 100}%`,
                    backgroundColor: activeEra.accent,
                  }}
                />
                {ERAS.map((era, index) => (
                  <span
                    key={era.year}
                    className="absolute -left-[5px] h-3 w-3 rounded-full border-2 bg-[#FFFBF5] transition-colors duration-300"
                    style={{
                      top: `calc(${index} * (100% - 12px) / ${ERAS.length - 1})`,
                      borderColor: index <= active ? era.accent : '#D4B896',
                    }}
                  />
                ))}
              </div>

              <div className="min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={activeEra.year}
                    initial={reduceMotion ? false : { y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduceMotion ? undefined : { y: -28, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-[7.5rem] font-bold leading-[0.82] tracking-tight xl:text-[9rem]"
                    style={{ color: activeEra.accent }}
                  >
                    {activeEra.year}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-6 text-sm font-bold text-[#3E2723]">{activeEra.leader}</p>
                <p className="mt-1 text-[0.8rem] text-[#8D6E63]">{activeEra.place}</p>
              </div>
            </div>
          </div>

          {/* Scrolling panels */}
          <div>
            {ERAS.map((era, index) => {
              const packshot = imageFor(era.productId);

              return (
                <motion.article
                  key={era.year}
                  onViewportEnter={() => setActive(index)}
                  viewport={{ amount: 0.5, margin: `-${HEADER}px 0px 0px 0px` }}
                  className="flex flex-col justify-center border-b border-[#F0E4D0] py-14 last:border-b-0 lg:min-h-[calc(100vh-112px)] lg:border-b-0 lg:py-24"
                >
                  <div className="lg:hidden">
                    <p className="font-display text-[4rem] font-bold leading-none" style={{ color: era.accent }}>
                      {era.year}
                    </p>
                    <p className="mt-3 text-sm font-bold text-[#3E2723]">{era.leader}</p>
                    <p className="mt-1 text-[0.8rem] text-[#8D6E63]">{era.place}</p>
                  </div>

                  <motion.div
                    initial={reduceMotion ? false : { y: 24, opacity: 0 }}
                    whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start lg:mt-0"
                  >
                    {packshot && (
                      <img
                        src={packshot}
                        alt=""
                        loading="lazy"
                        className="h-[150px] w-[100px] shrink-0 -rotate-3 object-contain drop-shadow-[0_14px_18px_rgba(62,39,35,0.18)] sm:h-[190px] sm:w-[128px]"
                      />
                    )}
                    <div className="min-w-0 space-y-4">
                      {era.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="max-w-xl text-base leading-relaxed text-[#3E2723]/85">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Name origin */}
      <section className="border-y border-[#F0E4D0] bg-[#FFF3E0]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 sm:py-20">
          <p className="font-display max-w-4xl text-[1.5rem] font-bold leading-snug text-[#3E2723] sm:text-[2rem]">
            The name is the founder&rsquo;s. Amrutlal <span className="text-[#D46A1E]">Narsih</span>das Modi, shortened
            the way the family said it.
          </p>
        </div>
      </section>

      {/* How the mixes are made */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
        <h2 className="font-display text-[1.6rem] font-bold text-[#3E2723]">How the mixes are made</h2>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
          <div className="space-y-10">
            {CRAFT_NOTES.slice(0, 2).map((note) => (
              <div key={note.title} className="flex items-start gap-4 lg:flex-row-reverse lg:text-right">
                <span
                  className="mt-2 hidden h-px w-10 shrink-0 border-t border-dashed border-[#D4B896] lg:block"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#3E2723]">{note.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8D6E63]">{note.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mx-auto h-[150px] w-[250px] shrink-0 sm:h-[170px] sm:w-[300px]">
            {clusterProducts.map((product, index) => {
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
                  loading="lazy"
                  className={`absolute h-[124px] w-[80px] object-contain drop-shadow-[0_12px_10px_rgba(72,31,15,0.18)] sm:h-[144px] sm:w-[92px] ${
                    positions[index] ?? positions[3]
                  }`}
                />
              );
            })}
          </div>

          <div className="space-y-10">
            {CRAFT_NOTES.slice(2).map((note) => (
              <div key={note.title} className="flex items-start gap-4">
                <span
                  className="mt-2 hidden h-px w-10 shrink-0 border-t border-dashed border-[#D4B896] lg:block"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#3E2723]">{note.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8D6E63]">{note.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="border-t border-[#F0E4D0]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-3 px-6 py-12">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-[#D46A1E] px-5 text-sm font-bold text-white hover:bg-[#A84F10]"
          >
            Shop mixes
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <Link
            href="/journey"
            className="inline-flex h-11 items-center rounded-lg border border-[#F0E4D0] bg-white px-5 text-sm font-bold text-[#3E2723] hover:border-[#D46A1E]"
          >
            Since 1956
          </Link>
        </div>
      </section>
    </main>
  );
};
