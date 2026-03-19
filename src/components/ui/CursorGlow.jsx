'use client';
import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const ringPos  = useRef({ x: -100, y: -100 });
  const rafRef   = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    // Hide on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e) => {
      const el = e.target;
      if (
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button')
      ) {
        hovering.current = true;
      }
    };

    const onLeave = () => { hovering.current = false; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    const lerp = (a, b, t) => a + (b - a) * t;

    function animate() {
      const { x, y } = posRef.current;
      ringPos.current.x = lerp(ringPos.current.x, x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, y, 0.12);

      // Dot — snaps fast
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;

      // Ring — lags behind
      const scale = hovering.current ? 2.2 : 1;
      ring.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px) scale(${scale})`;
      ring.style.opacity = hovering.current ? '0.6' : '1';

      rafRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--amber)',
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid var(--amber)',
          pointerEvents: 'none',
          zIndex: 99997,
          opacity: 0.8,
          willChange: 'transform',
          transition: 'opacity 200ms, scale 200ms',
        }}
      />
    </>
  );
}