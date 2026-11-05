import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
}

export default function FlagIcon({ code, className = 'w-4 h-3' }: FlagIconProps) {
  const norm = (code || '').toLowerCase();

  switch (norm) {
    case 'fr':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="213.3" height="480" fill="#002654" />
          <rect x="213.3" width="213.4" height="480" fill="#ffffff" />
          <rect x="426.7" width="213.3" height="480" fill="#ce1126" />
        </svg>
      );
    case 'en':
    case 'gb':
    case 'uk':
      return (
        <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0 L60 30 M60 0 L0 30" stroke="#ffffff" strokeWidth="6" />
          <path d="M0 0 L25 12.5 M35 17.5 L60 30 M60 0 L35 12.5 M25 17.5 L0 30" stroke="#C8102E" strokeWidth="2" />
          <path d="M30 0 v30 M0 15 h60" stroke="#ffffff" strokeWidth="10" />
          <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case 'de':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#000000" />
          <rect y="160" width="640" height="160" fill="#dd0000" />
          <rect y="320" width="640" height="160" fill="#ffce00" />
        </svg>
      );
    case 'es':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="120" fill="#aa151b" />
          <rect y="120" width="640" height="240" fill="#f1bf00" />
          <rect y="360" width="640" height="120" fill="#aa151b" />
        </svg>
      );
    case 'it':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="213.3" height="480" fill="#009246" />
          <rect x="213.3" width="213.4" height="480" fill="#ffffff" />
          <rect x="426.7" width="213.3" height="480" fill="#ce2b37" />
        </svg>
      );
    case 'nl':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#ae1c28" />
          <rect y="160" width="640" height="160" fill="#ffffff" />
          <rect y="320" width="640" height="160" fill="#21468b" />
        </svg>
      );
    case 'pt':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="256" height="480" fill="#046a38" />
          <rect x="256" width="384" height="480" fill="#da291c" />
          <circle cx="256" cy="240" r="85" fill="#ffcd00" stroke="#000000" strokeWidth="3" />
          <path d="M236 205h40v45a20 20 0 01-40 0z" fill="#ffffff" stroke="#da291c" strokeWidth="4" />
          <path d="M242 215h28v30a14 14 0 01-28 0z" fill="#002b7f" />
        </svg>
      );
    case 'da':
    case 'dk':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#c60c30" />
          <rect x="180" width="60" height="480" fill="#ffffff" />
          <rect y="210" width="640" height="60" fill="#ffffff" />
        </svg>
      );
    case 'hu':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#ce2939" />
          <rect y="160" width="640" height="160" fill="#ffffff" />
          <rect y="320" width="640" height="160" fill="#477050" />
        </svg>
      );
    default:
      return null;
  }
}
