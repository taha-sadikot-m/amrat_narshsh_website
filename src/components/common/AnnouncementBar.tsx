'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';

type Offer = { id: string; text: string; ctaLabel: string | null; href: string };

export const AnnouncementBar: React.FC = () => {
  const { navigateTo } = useStore();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetch('/api/offers')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.offers)) setOffers(d.offers);
      })
      .catch(() => undefined);
  }, []);

  const loop = [...offers, ...offers];

  if (offers.length === 0) return null;

  return (
    <aside
      id="top-announcement-bar"
      aria-label="Promotions and Announcements"
      className="bg-[#C90018] text-white py-2 select-none relative z-40 overflow-hidden border-b border-[#A50014]"
    >
      <div className="announcement-marquee flex w-max items-center">
        {loop.map((offer, i) => (
          <button
            key={`${offer.id}-${i}`}
            type="button"
            onClick={() => {
              if (offer.href?.startsWith('/')) router.push(offer.href);
              else navigateTo('shop');
            }}
            className="flex items-center gap-2 px-8 text-[11px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap"
          >
            <span className="text-[#F4C400]">•</span>
            <span>{offer.text}</span>
            {offer.ctaLabel && (
              <span className="inline-flex items-center text-[#F4C400] font-black">
                {offer.ctaLabel}
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};
