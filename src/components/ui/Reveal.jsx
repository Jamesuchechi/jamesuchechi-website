'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children in a reveal container.
 * When the element enters the viewport, plays a staggered fade-up.
 *
 * Props:
 *   delay    - extra delay in ms (default 0)
 *   y        - start offset in px (default 24)
 *   duration - ms (default 700)
 *   threshold - 0–1 (default 0.15)
 *   as       - HTML element (default 'div')
 */
export function Reveal({
  children,
  delay    = 0,
  y        = 28,
  duration = 700,
  threshold = 0.15,
  as: Tag  = 'div',
  style    = {},
  ...rest
}) {
  const ref     = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits text into words and reveals each with a stagger.
 */
export function WordReveal({ text, className = '', stagger = 60, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ display: 'inline', ...style }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display:    'inline-block',
            opacity:    vis ? 1 : 0,
            transform:  vis ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms,
                         transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms`,
            marginRight: '0.25em',
            willChange: 'opacity, transform',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}