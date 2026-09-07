'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { AmratNarsihLogo } from '../../data/brandAssets';
import { useStore } from '../../context/StoreContext';

const PRODUCT_LINKS = [
  { id: 'bhajiya', label: 'Bhajiya Mix' },
  { id: 'dalwada', label: 'Dalwada Mix' },
  { id: 'gota', label: 'Gota Mix' },
  { id: 'handwa', label: 'Handwa Mix' },
  { id: 'gulab-jamun', label: 'Gulab Jamun Mix' },
  { id: 'khichu', label: 'Khichu Mix' },
];

export const Footer: React.FC = () => {
  const { products, navigateTo } = useStore();

  return (
    <footer id="main-footer" className="mb-[60px] border-t-[3px] border-[#D46A1E] bg-[#3E2723] text-white md:mb-0">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <AmratNarsihLogo className="h-12 w-[180px] [filter:brightness(0)_invert(1)]" />
          <p className="mt-4 text-[0.85rem] leading-relaxed text-white/70">
            A Legacy of Taste.
            <br />
            A Tradition That Lives On.
          </p>
          <p className="font-gujarati mt-2 text-[0.8rem] text-[#B8860B]">સ્વાદની પરંપરા</p>
          <div className="mt-4 flex gap-2">
            {['Facebook', 'Instagram', 'WhatsApp'].map((name) => (
              <a
                key={name}
                href={name === 'WhatsApp' ? 'https://wa.me/919825131883' : '#'}
                target={name === 'WhatsApp' ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition-colors duration-200 hover:bg-[#D46A1E]"
              >
                {name[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[0.9rem] font-bold">Our Products</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/65">
            {PRODUCT_LINKS.map((item) => {
              const product = products.find((p) => p.id === item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigateTo('product-detail', { productId: item.id })}
                    className="transition-colors duration-200 hover:text-[#D46A1E]"
                  >
                    {product?.name ?? item.label}
                  </button>
                </li>
              );
            })}
            <li>
              <Link href="/shop" className="font-semibold text-[#D46A1E] hover:underline">
                View All 11 Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.9rem] font-bold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/65">
            <li><Link href="/our-story" className="hover:text-[#D46A1E]">About Us</Link></li>
            <li><Link href="/journey" className="hover:text-[#D46A1E]">Our Journey Since 1956</Link></li>
            <li><Link href="/shop" className="hover:text-[#D46A1E]">Recipes</Link></li>
            <li><Link href="/combos" className="hover:text-[#D46A1E]">Combos</Link></li>
            <li><Link href="/contact" className="hover:text-[#D46A1E]">Contact Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#D46A1E]">Partner Enquiries</Link></li>
            <li><Link href="/track-order" className="hover:text-[#D46A1E]">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.9rem] font-bold">Visit Our Store</h4>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D46A1E]" />Salabatpura, Surat, Gujarat 395003</p>
            <p className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#D46A1E]" /><a href="tel:+919825131883">+91 98251 31883</a></p>
            <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D46A1E]" />Mon–Sat: 9am–8pm</p>
            <a
              href="https://maps.app.goo.gl/tenQVorx1d1EG8KQA"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#D46A1E]"
            >
              Get Directions
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-5 text-center lg:flex-row lg:text-left">
          <p className="text-[0.75rem] text-white/50">© 2026 Amrat Narsih. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 text-[0.75rem] text-white/50">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <span>·</span>
            <Link href="/shipping" className="hover:text-white">Shipping</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-white">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
