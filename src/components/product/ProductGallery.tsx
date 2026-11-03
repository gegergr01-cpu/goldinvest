'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  title: string;
  discountLabel?: string | null;
  compareAtPrice?: number | null;
  price?: number;
  activeVariationImage?: string | null;
};

export default function ProductGallery({ images, title, discountLabel, compareAtPrice, price, activeVariationImage }: ProductGalleryProps) {
  const hasImages = images && images.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Quand une variation avec sa propre image est sélectionnée, réinitialiser
  useEffect(() => {
    if (activeVariationImage) {
      setSelectedIndex(0);
    }
  }, [activeVariationImage]);

  // L'image principale
  const mainImage = activeVariationImage || (hasImages ? images[selectedIndex] : null);

  return (
    <div className="w-full lg:w-1/2 flex flex-col-reverse sm:flex-row gap-4 lg:self-start lg:sticky lg:top-8">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-3 sm:w-20 overflow-x-auto sm:overflow-visible py-1 sm:py-0 shrink-0">
        <button 
          type="button"
          onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
          disabled={!hasImages || selectedIndex === 0}
          className="hidden sm:flex w-full py-1.5 border border-[#E8E4DA] rounded-lg text-[#0E2036] hover:bg-[#FAF5EB] hover:text-[#C8732A] justify-center disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          aria-label="Image précédente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        
        {hasImages ? (
          images.slice(0, 6).map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedIndex(idx)}
                className={`border-2 rounded-xl overflow-hidden cursor-pointer h-18 w-18 sm:h-20 sm:w-20 shrink-0 transition-all duration-200 bg-white p-1 flex items-center justify-center ${
                  isSelected 
                    ? 'border-[#C8732A] ring-2 ring-[#C8732A]/20 shadow-sm scale-102' 
                    : 'border-[#E8E4DA] hover:border-[#C8732A]/50 opacity-80 hover:opacity-100'
                }`}
              >
                <Image 
                  width={200} 
                  height={200} 
                  src={img} 
                  alt={`${title} - vue ${idx + 1}`} 
                  className="w-full h-full object-contain" 
                />
              </div>
            );
          })
        ) : (
          <div className="border border-[#E8E4DA] rounded-xl h-20 w-20 bg-gray-50 flex items-center justify-center text-2xl">
            🪙
          </div>
        )}
        
        <button 
          type="button"
          onClick={() => setSelectedIndex(Math.min((images?.length || 1) - 1, selectedIndex + 1))}
          disabled={!hasImages || selectedIndex >= Math.min(5, images.length - 1)}
          className="hidden sm:flex w-full py-1.5 border border-[#E8E4DA] rounded-lg text-[#0E2036] hover:bg-[#FAF5EB] hover:text-[#C8732A] justify-center mt-auto disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          aria-label="Image suivante"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 border border-[#E8E4DA] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center bg-white min-h-[380px] sm:min-h-[460px] p-6 shadow-sm group">
        {/* Discount Badge */}
        {discountLabel && compareAtPrice && price && compareAtPrice > price && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-[#C8732A] to-[#B8641C] text-white text-[11px] font-serif font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider uppercase z-10">
            {discountLabel}
          </span>
        )}

        {/* Certificate / LBMA Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E8A63D]/30 text-[10.5px] font-semibold text-[#8C6D23] shadow-2xs z-10 select-none">
          <svg className="w-3.5 h-3.5 text-[#C8732A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
          </svg>
          Certifié LBMA
        </div>

        {/* Image */}
        <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center">
          {mainImage ? (
            <Image 
              width={800} 
              height={800} 
              src={mainImage} 
              alt={title} 
              priority
              className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
          ) : (
            <div className="text-8xl text-gray-300 select-none">🪙</div>
          )}
        </div>

        {/* Packaging Reassurance Bar */}
        <div className="mt-4 pt-3 border-t border-[#F2EFE8] w-full flex items-center justify-center gap-2 text-[11.5px] text-[#6E685F] select-none">
          <svg className="w-3.5 h-3.5 text-[#C8732A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Scellé sous blister sécurisé avec numéro de série individuel</span>
        </div>
      </div>
    </div>
  );
}
