'use client';

import React, { useId } from 'react';

// Official Amrat Narsih Logo (real brand artwork)
export const AmratNarsihLogo: React.FC<{
  className?: string;
  variant?: 'full' | 'compact' | 'monochrome' | 'white';
  showHeritageTag?: boolean;
}> = ({ className = 'h-12 w-auto', showHeritageTag = false }) => {
  const arcId = useId();

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <img
        src="/images/logo.webp"
        alt="Amrat Narsih"
        className="w-full h-full object-contain drop-shadow-sm"
        draggable={false}
      />
      {showHeritageTag && (
        // Gujarati tagline set on a shallow arc, echoing the curved seal on the packaging.
        // Absolutely positioned with fixed intrinsic dimensions so it can't distort the
        // logo's own auto-sizing (a % width here would create a circular layout loop).
        <svg
          viewBox="0 0 200 30"
          width={130}
          height={19}
          className="absolute left-1/2 top-full -translate-x-1/2 mt-0.5 max-w-none pointer-events-none"
          aria-hidden="true"
        >
          <path id={`heritage-arc-${arcId}`} d="M 6 7 Q 100 30 194 7" fill="none" />
          <text fill="#6F3E24" fontSize="12" fontWeight="700" className="font-gujarati">
            <textPath href={`#heritage-arc-${arcId}`} startOffset="50%" textAnchor="middle">
              મસાલાવાળા તૈયાર લોટના બેતાજ બાદશાહ
            </textPath>
          </text>
        </svg>
      )}
    </div>
  );
};

// Heritage Badge "SINCE 1956"
export const Since1956Badge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#C90018]">
      {/* Laurel Wreath */}
      <path
        d="M20,65 C14,50 16,30 32,20 C36,18 39,20 37,24 C26,32 23,48 29,60 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M80,65 C86,50 84,30 68,20 C64,18 61,20 63,24 C74,32 77,48 71,60 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="50" cy="50" r="32" fill="#FFF8EC" stroke="currentColor" strokeWidth="1.5" />
      <text x="50" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill="#C90018" letterSpacing="1">SINCE</text>
      <text x="50" y="58" textAnchor="middle" fontSize="15" fontWeight="900" fill="#C90018" letterSpacing="0.5">1956</text>
      <path d="M42,65 L50,61 L58,65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// Green 100% Vegetarian Dot Icon
export const VegBadge: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 16 }) => (
  <div
    className={`inline-flex items-center justify-center border border-[#2E7D32] bg-white p-[2px] rounded-[3px] shadow-xs ${className}`}
    style={{ width: size, height: size }}
    title="100% Vegetarian"
  >
    <div className="bg-[#2E7D32] rounded-full w-full h-full aspect-square" />
  </div>
);

// Product Package Photo Component — renders the real Amrat Narsih packet photography
export const ProductPackshot: React.FC<{
  productId: string;
  className?: string;
  isHovered?: boolean;
  src?: string;
}> = ({ productId, className = 'w-full h-auto', isHovered = false, src }) => {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none transition-transform duration-500 ease-out ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={`Amrat Narsih ${productId.replace(/-/g, ' ')} pack`}
          className={`w-full h-full object-contain drop-shadow-md transition-transform duration-500 ${
            isHovered ? 'scale-105' : ''
          }`}
          draggable={false}
          loading="lazy"
        />
      ) : (
        <span className="text-[10px] font-semibold text-gray-400">Image unavailable</span>
      )}
    </div>
  );
};
