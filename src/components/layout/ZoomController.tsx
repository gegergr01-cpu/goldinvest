'use client';

import { useEffect } from 'react';

export default function ZoomController() {
  useEffect(() => {
    // Supprimer tout zoom CSS forcé sur :root qui provoque un débordement horizontal
    const root = document.documentElement;
    root.style.removeProperty('zoom');
  }, []);

  return null;
}
