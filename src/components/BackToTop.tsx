'use client';

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-36 lg:bottom-22 right-4 sm:right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#0E2036] to-[#142842] hover:from-[#1B365D] hover:to-[#0E2036] text-[#E8A63D] hover:text-white border border-[#E8A63D]/40 hover:border-[#E8A63D] shadow-[0_4px_16px_rgba(14,32,54,0.4)] hover:shadow-[0_6px_20px_rgba(232,166,61,0.3)] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group select-none backdrop-blur-md"
          aria-label="Retour en haut"
          title="Retour en haut"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}
