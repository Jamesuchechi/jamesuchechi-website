'use client';
import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement;
      const val = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setPct(Math.min(1, Math.max(0, val)));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        height:        '2px',
        width:         `${pct * 100}%`,
        background:    'linear-gradient(to right, var(--amber), var(--amber-light))',
        zIndex:        1000,
        pointerEvents: 'none',
        transformOrigin: 'left',
        transition:    'width 60ms linear',
        boxShadow:     '0 0 8px var(--amber)',
      }}
    />
  );
}