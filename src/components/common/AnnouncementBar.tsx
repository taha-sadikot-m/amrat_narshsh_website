'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';
import { Award, Sparkles, Tag, Truck, type LucideIcon } from 'lucide-react';

type Offer = { id: string; text: string; ctaLabel: string | null; href: string; icon?: LucideIcon };

const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'free-delivery',
    text: 'FREE Delivery on Orders Above ₹499 — Pan India',
    ctaLabel: null,
    href: '/shop',
    icon: Truck,
  },
  {
    id: 'gujarat10',
    text: 'Use Code GUJARAT10 for 10% Off Your First Order',
    ctaLabel: null,
    href: '/shop',
    icon: Tag,
  },
  {
    id: 'since-1956',
    text: 'Since 1956 — Authentic Stone-Milled Gujarati Heritage',
    ctaLabel: null,
    href: '/our-story',
    icon: Award,
  },
];

export const AnnouncementBar: React.FC = () => {
  const { navigateTo } = useStore();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS);

  useEffect(() => {
    fetch('/api/offers')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.offers) && d.offers.length > 0) {
          setOffers([...DEFAULT_OFFERS, ...d.offers]);
        }
      })
      .catch(() => undefined);
  }, []);

  const loop = [...offers, ...offers];

  return (
    <aside
      id="top-announcement-bar"
      aria-label="Promotions and Announcements"
      className="relative z-[1000] h-10 overflow-hidden bg-[#C62828] text-white"
    >
      <div className="announcement-marquee flex h-full w-max items-center">
        {loop.map((offer, i) => {
          const Icon = offer.icon ?? Sparkles;
          return (
            <button
              key={`${offer.id}-${i}`}
              type="button"
              onClick={() => {
                if (offer.href?.startsWith('/')) router.push(offer.href);
                else navigateTo('shop');
              }}
              className="flex h-10 items-center gap-2 px-8 text-[0.8rem] font-medium whitespace-nowrap"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#F5A623]" aria-hidden="true" />
              <span>{offer.text}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
