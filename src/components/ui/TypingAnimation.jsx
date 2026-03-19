'use client';
import { useState, useEffect, useRef } from 'react';

const ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Builder',
  'API Architect',
  'Problem Solver',
];

/**
 * TypingAnimation — cycles through ROLES with a typewriter effect.
 * Respects prefers-reduced-motion.
 */
export function TypingAnimation({ roles = ROLES, speed = 70, pause = 2200, deleteSpeed = 40 }) {
  const [displayed, setDisplayed] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase,     setPhase]     = useState('typing'); // 'typing' | 'pausing' | 'deleting'
  const [showCursor, setShowCursor] = useState(true);
  const rafRef = useRef(null);

  // Respect reduced motion
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(roles[0]);
      return;
    }

    const current = roles[roleIndex % roles.length];

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, speed + Math.random() * 30); // slight jitter for realism
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('pausing'), pause);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), 200);
      return () => clearTimeout(t);
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => {
          setDisplayed(d => d.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setRoleIndex(i => (i + 1) % roles.length);
        setPhase('typing');
      }
    }
  }, [displayed, phase, roleIndex, roles, speed, pause, deleteSpeed, prefersReduced]);

  // Cursor blink
  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(t);
  }, [prefersReduced]);

  return (
    <span style={{
      fontFamily:    'var(--font-mono)',
      fontSize:      'clamp(13px, 1.5vw, 15px)',
      letterSpacing: '0.06em',
      color:         'var(--ink-50)',
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '1px',
    }}>
      <span>{displayed}</span>
      <span style={{
        display:      'inline-block',
        width:        '2px',
        height:       '1em',
        background:   'var(--amber)',
        marginLeft:   '1px',
        borderRadius: '1px',
        opacity:      showCursor ? 1 : 0,
        transition:   'opacity 80ms',
      }} />
    </span>
  );
}