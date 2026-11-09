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
    case 'gbp':
      return (
        <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0 L60 30 M60 0 L0 30" stroke="#ffffff" strokeWidth="6" />
          <path d="M0 0 L25 12.5 M35 17.5 L60 30 M60 0 L35 12.5 M25 17.5 L0 30" stroke="#C8102E" strokeWidth="2" />
          <path d="M30 0 v30 M0 15 h60" stroke="#ffffff" strokeWidth="10" />
          <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case 'eu':
    case 'eur': {
      const starPoints = '0,-14 4.1,-4.3 13.3,-4.3 5.9,1.1 8.8,10.2 0,4.6 -8.8,10.2 -5.9,1.1 -13.3,-4.3 -4.1,-4.3';
      const starCenters: [number, number][] = [
        [320, 95],
        [393, 114],
        [446, 167],
        [465, 240],
        [446, 313],
        [393, 366],
        [320, 385],
        [247, 366],
        [194, 313],
        [175, 240],
        [194, 167],
        [247, 114],
      ];
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#003399" />
          {starCenters.map(([cx, cy], i) => (
            <polygon
              key={i}
              points={starPoints}
              transform={`translate(${cx}, ${cy})`}
              fill="#ffcc00"
            />
          ))}
        </svg>
      );
    }
    case 'ca':
    case 'cad':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="160" height="480" fill="#d80027" />
          <rect x="160" width="320" height="480" fill="#ffffff" />
          <rect x="480" width="160" height="480" fill="#d80027" />
          <path
            d="M320 85 l20 40 45-12 -10 40 55 10 -38 35 20 28 -48 3 10 40 -38 -20 -10 87 h-12 l-10 -87 -38 20 10 -40 -48 -3 20 -28 -38 -35 55 -10 -10 -40 45 12 z"
            fill="#d80027"
          />
        </svg>
      );
    case 'us':
    case 'usd': {
      const usStars = [
        ...[26, 78, 130, 182, 234].flatMap((y) => [22, 65, 108, 152, 195, 238].map((x) => ({ x, y }))),
        ...[52, 104, 156, 208].flatMap((y) => [43, 86, 130, 173, 216].map((x) => ({ x, y }))),
      ];
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#b22234" />
          <rect y="36.92" width="640" height="36.92" fill="#ffffff" />
          <rect y="110.77" width="640" height="36.92" fill="#ffffff" />
          <rect y="184.62" width="640" height="36.92" fill="#ffffff" />
          <rect y="258.46" width="640" height="36.92" fill="#ffffff" />
          <rect y="332.31" width="640" height="36.92" fill="#ffffff" />
          <rect y="406.15" width="640" height="36.92" fill="#ffffff" />
          <rect width="260" height="258.46" fill="#3c3b6e" />
          {usStars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r="6" fill="#ffffff" />
          ))}
        </svg>
      );
    }
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
    case 'dkk':
      return (
        <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#c60c30" />
          <rect x="180" width="60" height="480" fill="#ffffff" />
          <rect y="210" width="640" height="60" fill="#ffffff" />
        </svg>
      );
    case 'hu':
    case 'huf':
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


