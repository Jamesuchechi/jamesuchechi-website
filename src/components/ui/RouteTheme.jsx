'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * RouteTheme — applies a subtle CSS variable override per route.
 * Makes /garden feel verdant, /gallery go dark, /writing stay neutral.
 *
 * Drop in layout.js inside ThemeProvider.
 */

const ROUTE_THEMES = {
  '/garden': {
    '--amber':        '#7fc47a',
    '--amber-light':  '#a8e0a3',
    '--amber-subtle': 'rgba(127, 196, 122, 0.10)',
    '--amber-glow':   'rgba(127, 196, 122, 0.22)',
  },
  '/gallery': {
    // Slightly cooler, more cinematic
    '--amber':        '#c9a44a',
    '--amber-light':  '#e8c46a',
    '--amber-subtle': 'rgba(201, 164, 74, 0.10)',
  },
  '/timeline': {
    '--amber':        '#a78bfa',
    '--amber-light':  '#c4b5fd',
    '--amber-subtle': 'rgba(167, 139, 250, 0.10)',
    '--amber-glow':   'rgba(167, 139, 250, 0.18)',
  },
};

export function RouteTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Find matching theme (check prefixes)
    const match = Object.keys(ROUTE_THEMES).find(key => pathname.startsWith(key));

    // Reset any previous overrides
    const allKeys = [...new Set(Object.values(ROUTE_THEMES).flatMap(Object.keys))];
    allKeys.forEach(k => root.style.removeProperty(k));

    if (match) {
      const vars = ROUTE_THEMES[match];
      // Apply with a short transition
      root.style.setProperty('transition', 'color 400ms, background 400ms');
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    }
  }, [pathname]);

  return null; // Pure side-effect component
}