'use client';

import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { PublicCombo } from '../../types';

const FAN = [
  'w-[65px] -rotate-12 -translate-x-[18px] opacity-85 z-[1] group-hover:-translate-x-6',
  'w-[70px] z-[2]',
  'w-[65px] rotate-12 translate-x-[18px] opacity-85 z-[1] group-hover:translate-x-6',
];

export function ComboStrip({ combo }: { combo: PublicCombo; index?: number }) {
  const { setQuickViewCombo } = useStore();

  const savings = combo.compareAtPrice - combo.price;
  const packets = combo.items.slice(0, 3);

  return (
    <article
      onClick={() => setQuickViewCombo(combo)}
      className="group relative flex h-auto min-h-[140px] cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-[#F0E4D0] bg-[#FFFBF5] transition-all duration-[250ms] hover:translate-x-1 hover:border-[#D46A1E] hover:shadow-[0_8px_28px_rgba(212,106,30,0.18)] sm:h-[140px]"
    >
      <div className="relative flex w-[110px] min-w-[110px] items-center justify-center bg-[#FFF3E0] p-3 sm:w-[150px] sm:min-w-[150px]">
        {packets.map((item, packetIndex) => (
          <img
            key={item.productId}
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className={`absolute h-auto object-contain drop-shadow-[0_6px_12px_rgba(62,39,35,0.18)] transition-transform duration-300 ${FAN[packetIndex]}`}
          />
        ))}
        <span className="absolute bottom-2 left-1/2 z-[3] -translate-x-1/2 rounded-xl bg-[#3E2723] px-2.5 py-[3px] text-[0.65rem] font-bold text-white">
          {combo.items.length} Products
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-4 pl-3.5 pr-[18px]">
        <div className="flex items-center justify-between gap-2">
          {combo.discount > 0 ? (
            <span className="rounded bg-[#C62828] px-[9px] py-[3px] text-[0.68rem] font-extrabold uppercase text-white">
              {combo.discount}% OFF
            </span>
          ) : (
            <span />
          )}
          {savings > 0 && (
            <span className="rounded bg-[#E8F5E9] px-[9px] py-[3px] text-[0.68rem] font-bold text-[#2E7D32]">
              Save ₹{savings}
            </span>
          )}
        </div>

        <div className="mt-1.5 min-w-0">
          <h3 className="font-display truncate text-base font-bold leading-tight text-[#3E2723]">{combo.name}</h3>
          <p className="mt-[3px] truncate text-[0.75rem] leading-[1.4] text-[#8D6E63]">{combo.tagline}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.1rem] font-extrabold text-[#3E2723]">₹{combo.price}</span>
            {combo.compareAtPrice > combo.price && (
              <span className="text-[0.8rem] text-[#8D6E63] line-through">₹{combo.compareAtPrice}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setQuickViewCombo(combo)}
            className="flex shrink-0 items-center gap-[5px] whitespace-nowrap rounded-lg bg-[#D46A1E] px-4 py-2 text-[0.78rem] font-bold text-white transition-all duration-200 hover:scale-[1.04] hover:bg-[#A84F10]"
          >
            ADD COMBO
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
