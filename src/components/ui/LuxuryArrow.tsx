import React from 'react';

interface LuxuryArrowProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * LuxuryArrow - Sleek curved aerodynamic solid arrow glyph matching user specification
 * (Curved concave left edge, softly rounded vertices, forward momentum).
 */
export function LuxuryArrow({ className = "w-3 h-3", ...props }: LuxuryArrowProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M 6.5 3.8 C 5.5 3.2 4.2 4.0 4.4 5.2 C 5.3 8.3 5.8 10.3 5.8 12.0 C 5.8 13.7 5.3 15.7 4.4 18.8 C 4.2 20.0 5.5 20.8 6.5 20.2 L 18.7 12.9 C 19.5 12.4 19.5 11.6 18.7 11.1 Z" />
    </svg>
  );
}

export default LuxuryArrow;

