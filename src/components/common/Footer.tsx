'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { AmratNarsihLogo } from '../../data/brandAssets';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';

export const Footer: React.FC = () => {
  const { navigateTo, showToast, products } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
    showToast('Subscribed!', 'Welcome to the Amrat Narsih family newsletter.', 'success');
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#191919] text-[#FFF8EC] pt-16 pb-20 border-t border-[#333333] relative overflow-hidden"
    >
      {/* Decorative Brand Color Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C90018] via-[#F4C400] to-[#C90018]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4 pb-12 border-b border-gray-800">
          
          {/* Column 1 & 2: Brand Profile & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-center">
              <AmratNarsihLogo className="h-14 w-auto" />
            </div>

            {/* Core Brand Idea */}
            <div className="text-sm font-black text-white">
              A Legacy of Taste. A Tradition That Lives On.
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              A heritage Gujarati food brand combining authentic traditional flavours with modern convenience. 
              Preserving the culinary legacy of Surat since 1956.
            </p>

            <div className="pt-2 text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C90018]" />
                <span>Amrat Narsih • Surat, Gujarat, India</span>
              </div>
            </div>
          </div>

          {/* Column 3: Products Catalog */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {products.slice(0, 7).map((prod) => (
                <li key={prod.id}>
                  <button
                    onClick={() => navigateTo('product-detail', { productId: prod.id })}
                    className="hover:text-[#F4C400] transition-colors text-left flex items-center w-full cursor-pointer"
                  >
                    <span>{prod.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="text-[#F4C400] font-bold hover:underline text-[11px] pt-1 cursor-pointer"
                >
                  Explore All 11 Products →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Amrat Narsih
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('journey')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Journey (1956–Today)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Partner / Trade Enquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('order-tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter & Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Heritage Updates
            </h4>
            <p className="text-xs text-gray-400">
              Receive seasonal festive announcements, new instant mix releases, and heritage updates from Amrat Narsih.
            </p>

            {subscribed ? (
              <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-yellow-300 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>Thank you for joining our community!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-[#C90018]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C90018] hover:bg-[#E31B23] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-4 mt-2 border-t border-gray-800 space-y-3">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C90018] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div>
                    <span className="font-bold text-white text-xs block">Flagship Store &amp; Counter</span>
                    <span className="text-[11px] text-gray-400 leading-relaxed">
                      3/2273, Ground Floor, Balabhai Ni Sheri, Salabatpura, Surat – 395003, Gujarat
                    </span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/tenQVorx1d1EG8KQA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#F4C400] text-[11px] font-bold hover:underline whitespace-nowrap"
                  >
                    <span>Get Directions</span>
                    <span className="text-gray-500 font-normal">· 4.2★ (80+)</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C90018] shrink-0" />
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <a href="tel:+919825131883" className="text-white font-semibold hover:text-[#F4C400] transition-colors">
                    +91 98251 31883
                  </a>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">9 AM – 9 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} Amrat Narsih. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('shipping')}
              className="hover:text-gray-300 transition-colors"
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('returns')}
              className="hover:text-gray-300 transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
