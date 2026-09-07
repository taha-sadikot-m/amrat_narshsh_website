'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DISH_IMAGES } from '../../data/dishImages';

const BANNERS = [
  {
    href: '/shop?category=instant-mixes',
    image: DISH_IMAGES.bhajiya,
    label: 'Monsoon Cravings',
    heading: 'Chai Time\nGoes Golden',
    price: '₹65',
  },
  {
    href: '/shop?category=sweet-moments',
    image: DISH_IMAGES['gulab-jamun'],
    label: 'Festival Sweets',
    heading: 'Celebrations\nMade Sweeter',
    price: '₹85',
  },
  {
    href: '/shop?mood=breakfast',
    image: DISH_IMAGES.breakfast,
    label: 'Morning Rituals',
    heading: 'Start Every Day\nThe Gujarati Way',
    price: '₹65',
  },
  {
    href: '/shop?category=traditional-favourites',
    image: DISH_IMAGES.khichu,
    label: 'Vrat & Farali',
    heading: 'Pure. Clean.\nFasting-Friendly.',
    price: '₹70',
  },
];

export const HomeOccasionBanners: React.FC = () => {
  return (
    <section className="bg-[#FFFBF5] py-10 lg:py-[60px]">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="text-center text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#D46A1E]">
          Shop by Occasion
        </p>
        <h2 className="font-display mt-2 text-center text-[1.8rem] font-bold text-[#3E2723]">
          Every Craving, Every Moment
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {BANNERS.map((banner) => (
            <Link
              key={banner.label}
              href={banner.href}
              className="group relative h-[180px] overflow-hidden rounded-[14px] lg:h-[220px]"
            >
              <img
                src={banner.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(20,10,0,0.6) 0%, rgba(20,10,0,0.15) 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#F5A623]">{banner.label}</p>
                <h3 className="font-display mt-1 whitespace-pre-line text-[1.35rem] font-bold leading-tight text-white">
                  {banner.heading}
                </h3>
                <p className="mt-1.5 text-[0.82rem] text-white">Starting at {banner.price}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-white/60 bg-white/15 px-4 py-1.5 text-[0.78rem] font-semibold text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#3E2723]">
                  SHOP NOW
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
