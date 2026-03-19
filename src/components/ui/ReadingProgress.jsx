'use client';
import { useEffect, useState, useRef } from 'react';

/**
 * ReadingProgress — mounts a fixed progress bar that tracks scroll
 * progress through the article content specifically.
 *
 * Usage: drop inside any article/page component.
 * It auto-detects the article element or falls back to the full page.
 */
export function ReadingProgress({ color = 'var(--amber)', height = 2 }) {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const article =
        document.querySelector('article') ||
        document.querySelector('.prose')  ||
        document.documentElement;

      const rect   = article.getBoundingClientRect();
      const start  = article === document.documentElement ? 0 : Math.max(0, -rect.top + 80);
      const total  = article === document.documentElement
        ? document.documentElement.scrollHeight - window.innerHeight
        : article.offsetHeight - window.innerHeight + 80;

      const pct    = Math.min(1, Math.max(0, start / Math.max(1, total)));
      setProgress(pct);
      setVisible(pct > 0.01 && pct < 0.999);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // initial
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Top bar */}
      <div
        aria-hidden
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        style={{
          position:    'fixed',
          top:         0,
          left:        0,
          height:      `${height}px`,
          width:       `${progress * 100}%`,
          background:  `linear-gradient(to right, ${color}, var(--amber-light))`,
          zIndex:      1001,
          pointerEvents: 'none',
          boxShadow:   `0 0 8px var(--amber-glow)`,
          transition:  'width 80ms linear',
          opacity:     visible ? 1 : 0,
          willChange:  'width',
        }}
      />

      {/* Floating percentage bubble — appears in bottom-right after 10% */}
      {progress > 0.1 && progress < 0.98 && (
        <div
          aria-hidden
          style={{
            position:     'fixed',
            bottom:       'var(--space-6)',
            right:        'var(--space-6)',
            zIndex:       200,
            fontFamily:   'var(--font-mono)',
            fontSize:     '10px',
            letterSpacing:'0.1em',
            color:        color,
            background:   'var(--surface-1)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding:      '4px 10px',
            opacity:      visible ? 1 : 0,
            transition:   'opacity 300ms',
            backdropFilter: 'blur(8px)',
            boxShadow:    'var(--shadow-sm)',
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      )}
    </>
  );
}