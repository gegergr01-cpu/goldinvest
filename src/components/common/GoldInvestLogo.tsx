'use client';

import React from 'react';
import Link from 'next/link';

interface GoldInvestLogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds (footer), 'dark' for light backgrounds (header)
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GoldInvestLogo({ variant = 'dark', className = '', size = 'md' }: GoldInvestLogoProps) {
  const isLight = variant === 'light';
  
  // Sizing configuration
  const scale = size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-110' : 'scale-100';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Stylized Gold Pyramid / Bullion Bars Icon */}
      <div className="relative flex-shrink-0 w-10 h-10 md:w-11 md:h-11">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e098" />
              <stop offset="30%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#aa7c11" />
              <stop offset="100%" stopColor="#e5c158" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fae5a2" />
              <stop offset="50%" stopColor="#c59a3f" />
              <stop offset="100%" stopColor="#8c6414" />
            </linearGradient>
            <linearGradient id="goldGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#deb841" />
              <stop offset="50%" stopColor="#fbf0b9" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
          
          {/* Left angled gold bar */}
          <path 
            d="M 12 76 L 46 22 L 56 22 L 22 76 Z" 
            fill="url(#goldGrad1)" 
          />
          {/* Right angled gold bar */}
          <path 
            d="M 88 76 L 54 22 L 44 22 L 78 76 Z" 
            fill="url(#goldGrad2)" 
          />
          {/* Inner peak / chevron bar forming the distinctive double peak */}
          <path 
            d="M 28 76 L 50 40 L 72 76 L 62 76 L 50 56 L 38 76 Z" 
            fill="url(#goldGrad3)" 
          />
          {/* Bottom horizon accent */}
          <line x1="20" y1="80" x2="80" y2="80" stroke="url(#goldGrad1)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <span className={`font-serif text-lg md:text-xl font-bold tracking-wider leading-tight ${isLight ? 'text-white' : 'text-gray-900'} group-hover:text-[#c59a3f] transition-colors`}>
          GOLD INVEST
        </span>
        <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.28em] text-[#c59a3f] uppercase -mt-0.5">
          OR & ARGENT
        </span>
      </div>
    </Link>
  );
}

