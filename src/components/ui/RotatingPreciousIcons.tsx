'use client';

import React from 'react';

interface RotatingIconProps {
  metal?: 'gold' | 'silver';
  size?: number;
  className?: string;
  isActive?: boolean;
}

/**
 * High-end 3D Rotating Coin (Pièce de monnaie précieuse)
 * Features an embossed relief, milled rim and smooth 3D luxury turntable spin.
 */
export function RotatingCoin({ metal = 'gold', size = 22, className = '', isActive = false }: RotatingIconProps) {
  const isGold = metal === 'gold';

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
        isActive ? 'scale-110' : 'group-hover:scale-105'
      } ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '600px',
      }}
      aria-hidden="true"
    >
      <span
        className="w-full h-full inline-block animate-precious-spin"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        >
          <defs>
            {/* Gold Gradients */}
            <radialGradient id="coinGoldFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="25%" stopColor="#F5B027" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
            <linearGradient id="coinGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF7B2" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Silver Gradients */}
            <radialGradient id="coinSilverFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <linearGradient id="coinSilverRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>

          {/* Outer Milled Rim */}
          <circle
            cx="16"
            cy="16"
            r="15"
            fill={isGold ? 'url(#coinGoldRim)' : 'url(#coinSilverRim)'}
            stroke={isGold ? '#78350F' : '#334155'}
            strokeWidth="0.8"
          />

          {/* Milled notches / serration ring */}
          <circle
            cx="16"
            cy="16"
            r="13.8"
            fill="none"
            stroke={isGold ? '#FEF08A' : '#F8FAFC'}
            strokeWidth="0.6"
            strokeDasharray="1.2 1.4"
            opacity="0.85"
          />

          {/* Inner Coin Core Face */}
          <circle
            cx="16"
            cy="16"
            r="12.2"
            fill={isGold ? 'url(#coinGoldFace)' : 'url(#coinSilverFace)'}
            stroke={isGold ? '#B45309' : '#64748B'}
            strokeWidth="0.5"
          />

          {/* Inner Decorative Ring */}
          <circle
            cx="16"
            cy="16"
            r="10"
            fill="none"
            stroke={isGold ? '#FDE68A' : '#FFFFFF'}
            strokeWidth="0.6"
            opacity="0.7"
          />

          {/* Embossed Monarch / Classical Temple Crown Emblem */}
          <path
            d="M10 20.5H22M10 20.5V19L11.5 18M22 20.5V19L20.5 18M11 18H21M12 18V13.5M16 18V13.5M20 18V13.5M9.5 13.5H22.5L16 9.5L9.5 13.5Z"
            stroke={isGold ? '#78350F' : '#1E293B'}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <path
            d="M10 20.5H22M10 20.5V19L11.5 18M22 20.5V19L20.5 18M11 18H21M12 18V13.5M16 18V13.5M20 18V13.5M9.5 13.5H22.5L16 9.5L9.5 13.5Z"
            stroke={isGold ? '#FEF08A' : '#FFFFFF'}
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Polished light reflection crescent */}
          <path
            d="M7 11C8.5 7.5 12 5 16 5C17.5 5 19 5.4 20.2 6.1"
            stroke={isGold ? '#FFFFFF' : '#FFFFFF'}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </span>
    </span>
  );
}

/**
 * High-end 3D Rotating Bullion Ingot (Lingot précieux d'or ou d'argent)
 * Features genuine beveled trapezoid bullion geometry, assay stamp 999.9, and smooth 3D turntable spin.
 */
export function RotatingIngot({ metal = 'gold', size = 22, className = '', isActive = false }: RotatingIconProps) {
  const isGold = metal === 'gold';

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
        isActive ? 'scale-110' : 'group-hover:scale-105'
      } ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '600px',
      }}
      aria-hidden="true"
    >
      <span
        className="w-full h-full inline-block animate-precious-spin"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        >
          <defs>
            {/* Gold Bullion Gradients */}
            <linearGradient id="ingotGoldTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF7B2" />
              <stop offset="35%" stopColor="#F5B027" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="ingotGoldFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="ingotGoldSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Silver Bullion Gradients */}
            <linearGradient id="ingotSilverTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="ingotSilverFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="ingotSilverSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Front Trapezoid Face of Bullion */}
          <polygon
            points="5,22 27,22 25,26 7,26"
            fill={isGold ? 'url(#ingotGoldFront)' : 'url(#ingotSilverFront)'}
            stroke={isGold ? '#78350F' : '#1E293B'}
            strokeWidth="0.6"
          />

          {/* Right Beveled Edge of Bullion */}
          <polygon
            points="27,22 25,26 27.5,14 29,12"
            fill={isGold ? 'url(#ingotGoldSide)' : 'url(#ingotSilverSide)'}
            stroke={isGold ? '#78350F' : '#1E293B'}
            strokeWidth="0.5"
            opacity="0.9"
          />

          {/* Top Main Face of Bullion (Trapezoidal Ingot Plate) */}
          <polygon
            points="6,12 26,12 27,22 5,22"
            fill={isGold ? 'url(#ingotGoldTop)' : 'url(#ingotSilverTop)'}
            stroke={isGold ? '#FEF08A' : '#FFFFFF'}
            strokeWidth="0.8"
          />

          {/* Top Left Bevel Light Edge */}
          <polygon
            points="4,14 6,12 5,22 3,24"
            fill={isGold ? '#FDE68A' : '#FFFFFF'}
            opacity="0.4"
          />

          {/* Top Ingot Refined Stamp: "999.9" & Hallmarks */}
          <rect
            x="9"
            y="14"
            width="14"
            height="6"
            rx="1"
            fill="none"
            stroke={isGold ? '#92400E' : '#475569'}
            strokeWidth="0.5"
            strokeDasharray="1.2 0.8"
            opacity="0.6"
          />
          <text
            x="16"
            y="18.5"
            textAnchor="middle"
            fontSize="3.8"
            fontWeight="bold"
            fontFamily="monospace"
            fill={isGold ? '#78350F' : '#1E293B'}
            opacity="0.95"
            letterSpacing="0.4"
          >
            999.9
          </text>

          {/* Brilliant Light Specular Reflection across Ingot */}
          <line
            x1="7"
            y1="13"
            x2="25"
            y2="13"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </span>
    </span>
  );
}
