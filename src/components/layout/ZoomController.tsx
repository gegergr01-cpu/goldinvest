'use client';

import { useEffect } from 'react';

/**
 * ZoomController - Applique un niveau d'affichage par défaut à 90% sur écran large (>= 768px).
 * Laisse le zoom natif du navigateur (Ctrl + / Ctrl - / pinch) s'appliquer librement au-delà de 100% ou en-deçà de 90%.
 */
export default function ZoomController() {
  useEffect(() => {
    const applyDefaultZoom = () => {
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (window.innerWidth >= 768) {
          root.style.zoom = '0.9';
        } else {
          root.style.zoom = '1';
        }
      }
    };

    applyDefaultZoom();
    window.addEventListener('resize', applyDefaultZoom);
    return () => window.removeEventListener('resize', applyDefaultZoom);
  }, []);

  return null;
}
