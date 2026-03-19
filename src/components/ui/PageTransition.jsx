'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PageTransition — wraps page content in a smooth enter/exit animation.
 *
 * Uses CSS transitions instead of Framer Motion to avoid the overhead
 * of adding a heavy dep. Works by key-ing on the pathname.
 *
 * Drop in layout.js: <PageTransition>{children}</PageTransition>
 *
 * Animation: fade-up on enter, instant on exit (feels snappy not heavy).
 */
export function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [phase,        setPhase]       = useState('visible'); // 'visible' | 'leaving' | 'entering'
  const [content,      setContent]     = useState(children);

  useEffect(() => {
    if (pathname === displayPath) {
      // Same route — just update content (e.g. query param change)
      setContent(children);
      return;
    }

    // 1. Fade out current
    setPhase('leaving');

    const leaveTimer = setTimeout(() => {
      // 2. Swap content
      setContent(children);
      setDisplayPath(pathname);
      setPhase('entering');

      // 3. Fade in new
      const enterTimer = setTimeout(() => {
        setPhase('visible');
      }, 20); // tiny tick to trigger transition

      return () => clearTimeout(enterTimer);
    }, 200); // match leave duration

    return () => clearTimeout(leaveTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Also update content when children changes but path is the same
  useEffect(() => {
    if (pathname === displayPath && phase === 'visible') {
      setContent(children);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const styles = {
    visible: {
      opacity:   1,
      transform: 'translateY(0)',
      transition: 'opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)',
    },
    leaving: {
      opacity:   0,
      transform: 'translateY(-8px)',
      transition: 'opacity 200ms ease, transform 200ms ease',
    },
    entering: {
      opacity:   0,
      transform: 'translateY(16px)',
      transition: 'none',
    },
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, ...styles[phase] }}>
      {content}
    </div>
  );
}

/**
 * RouteLoadingBar — thin amber line that fires on every navigation.
 * Works independently of PageTransition.
 */
export function RouteLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [width,   setWidth]   = useState(0);

  useEffect(() => {
    // New navigation detected
    setLoading(true);
    setWidth(0);

    // Fast fill to ~80%
    const t1 = setTimeout(() => setWidth(80), 10);
    // Then complete
    const t2 = setTimeout(() => setWidth(100), 300);
    // Then hide
    const t3 = setTimeout(() => { setLoading(false); setWidth(0); }, 650);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  if (!loading && width === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position:    'fixed',
        top:         0,
        left:        0,
        height:      '2px',
        width:       `${width}%`,
        background:  'linear-gradient(to right, var(--amber), var(--amber-light))',
        zIndex:      9999,
        pointerEvents: 'none',
        transition:  width === 0 ? 'none' : width === 100 ? 'width 250ms ease' : 'width 400ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow:   '0 0 10px var(--amber-glow), 0 0 20px rgba(201,146,42,0.2)',
        opacity:     loading ? 1 : 0,
      }}
    />
  );
}