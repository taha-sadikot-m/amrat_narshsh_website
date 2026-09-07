'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { defaultPack } from '../../lib/home-catalog';

const SLIDE_IDS = ['bhajiya', 'handwa', 'gota'] as const;
const SLIDE_IMAGES = [
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200',
  'https://images.unsplash.com/photo-1630383249896-424e482df921?w=1200',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200',
];

export const HomeHeroSplit: React.FC = () => {
  const { products, showToast } = useStore();
  const { addItem } = useCart();
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = SLIDE_IDS.map((id, i) => ({
    product: products.find((item) => item.id === id),
    image: SLIDE_IMAGES[i],
  })).filter((slide) => slide.product);
  const current = slides[index] ?? slides[0];
  const gobapuri = products.find((item) => item.id === 'gobapuri');
  const bhajiya = products.find((item) => item.id === 'bhajiya');

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  if (!current?.product) return null;
  const pack = defaultPack(current.product);

  const addCurrent = () => {
    addItem({
      productId: current.product!.id,
      name: current.product!.name,
      gujaratiName: current.product!.gujaratiName,
      weight: pack?.weight ?? current.product!.defaultWeight,
      price: pack?.price ?? current.product!.defaultPrice,
      quantity: 1,
      heroColor: current.product!.heroColor,
      makesText: current.product!.makesText,
    });
    showToast('Added to Cart!', `${current.product!.name} is in your basket.`, 'success');
  };

  return (
    <section className="bg-[#FFF3E0] px-4 py-4 lg:px-6">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-3 lg:h-[420px] lg:grid-cols-[65fr_35fr]">
        <div
          className="relative overflow-hidden rounded-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <img
            src={current.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(30,15,5,0.75) 0%, rgba(30,15,5,0.1) 100%)' }}
          />
          <div className="relative flex h-[300px] flex-col justify-center px-6 py-10 lg:h-full lg:px-11 lg:py-12">
            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#D46A1E]/90 px-3 py-1 text-[0.7rem] font-bold text-white">
              <Star className="h-3 w-3 shrink-0 fill-current" aria-hidden="true" />
              BESTSELLER
            </span>
            <h1 className="font-display text-[1.8rem] font-bold leading-tight text-white lg:text-[2.4rem]">
              The Taste of Gujarat,
              <br />
              Ready in 10 Minutes.
            </h1>
            <p className="mt-3 max-w-[360px] text-[0.95rem] text-white/85">
              Stone-milled {current.product.name} — crispy golden perfection every time.
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-[1.6rem] font-bold text-white">₹{pack?.price ?? current.product.defaultPrice}</span>
              {pack?.compareAtPrice && (
                <span className="pb-1 text-white/60 line-through">₹{pack.compareAtPrice}</span>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addCurrent}
                className="rounded-lg bg-[#D46A1E] px-6 py-3 text-sm font-bold text-white hover:bg-[#A84F10]"
              >
                ADD TO CART
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-white px-5 py-3 text-sm font-bold text-white"
              >
                VIEW ALL
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-[#D46A1E]' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex snap-x gap-3 overflow-x-auto lg:h-full lg:flex-col lg:overflow-visible">
          <Link
            href="/shop"
            className="relative min-h-[180px] min-w-[260px] flex-1 overflow-hidden rounded-xl p-5 lg:min-w-0"
            style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[#A5D6A7]">Festival Offer</p>
            <h2 className="font-display mt-1 max-w-[70%] text-[1.1rem] font-bold text-white">
              Free Gift on Orders Above ₹499
            </h2>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-[0.8rem] font-bold text-[#2E7D32]">
              Claim Now
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </span>
            {bhajiya?.imageUrl && (
              <img
                src={bhajiya.imageUrl}
                alt=""
                loading="lazy"
                className="absolute right-3 top-1/2 w-[90px] -translate-y-1/2 -rotate-6 object-contain"
              />
            )}
          </Link>
          <Link
            href={gobapuri ? `/product/${gobapuri.slug}` : '/shop'}
            className="relative min-h-[180px] min-w-[260px] flex-1 overflow-hidden rounded-xl p-5 lg:min-w-0"
            style={{ background: 'linear-gradient(135deg, #7B3A00 0%, #C85A00 100%)' }}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[#FFCC80]">New Arrival</p>
            <h2 className="font-display mt-1 max-w-[70%] text-[1.1rem] font-bold text-white">
              Gobapuri Mix — Now Available
            </h2>
            <p className="mt-2 text-sm font-bold text-white">
              ₹{gobapuri ? defaultPack(gobapuri)?.price ?? gobapuri.defaultPrice : 130}{' '}
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#FFCC80]">
                Shop Now
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </span>
            </p>
            {gobapuri?.imageUrl && (
              <img
                src={gobapuri.imageUrl}
                alt=""
                loading="lazy"
                className="absolute right-3 top-1/2 w-[90px] -translate-y-1/2 rotate-6 object-contain"
              />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};
