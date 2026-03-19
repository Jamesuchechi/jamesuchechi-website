'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts up from 0 to `end` when it enters the viewport.
 */
function Counter({ end, suffix = '', prefix = '', duration = 1800, label, sublabel }) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    // Ease-out cubic
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    let raf;
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(ease(progress) * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily:    'var(--font-display)',
        fontSize:      'clamp(40px, 6vw, 72px)',
        fontWeight:    '300',
        letterSpacing: '-0.02em',
        color:         'var(--ink)',
        lineHeight:    1,
        marginBottom:  'var(--space-2)',
        display:       'flex',
        alignItems:    'baseline',
        justifyContent:'center',
        gap:           '2px',
      }}>
        {prefix && (
          <span style={{ fontSize: '0.5em', color: 'var(--amber)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', alignSelf: 'center' }}>
            {prefix}
          </span>
        )}
        <span style={{
          background: `linear-gradient(135deg, var(--ink) 0%, var(--amber) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {count.toLocaleString()}
        </span>
        {suffix && (
          <span style={{ fontSize: '0.45em', color: 'var(--amber)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', alignSelf: 'flex-end', paddingBottom: '6px' }}>
            {suffix}
          </span>
        )}
      </div>

      <p style={{
        fontFamily:    'var(--font-body)',
        fontSize:      'var(--text-base)',
        fontWeight:    '500',
        color:         'var(--ink)',
        marginBottom:  'var(--space-1)',
      }}>
        {label}
      </p>

      {sublabel && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--text-xs)',
          color:      'var(--ink-30)',
          letterSpacing: '0.06em',
        }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

/**
 * StatsSection — drop anywhere on the homepage or about page.
 *
 * Props:
 *   stats — array of { value, label, sublabel, suffix, prefix }
 *   title — section title
 */
export function StatsSection({ stats, title = 'By the numbers' }) {
  return (
    <section style={{
      padding:    'var(--space-24) var(--space-6)',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position:   'absolute',
        top:        '-80px',
        left:       '50%',
        transform:  'translateX(-50%)',
        width:      '600px',
        height:     '400px',
        background: 'radial-gradient(ellipse, var(--amber-subtle) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter:     'blur(60px)',
      }} />

      <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
          <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Stats</p>
          <h2 className="heading-1">{title}</h2>
        </div>

        {/* Stats grid */}
        <div style={{
          display:    'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap:        'var(--space-8)',
          alignItems: 'start',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {/* Vertical divider between items */}
              {i > 0 && (
                <div aria-hidden style={{
                  position:   'absolute',
                  left:       `calc(-1 * var(--space-4))`,
                  top:        '10%',
                  height:     '80%',
                  width:      '1px',
                  background: 'linear-gradient(to bottom, transparent, var(--border), transparent)',
                }} />
              )}
              <Counter
                end={stat.value}
                label={stat.label}
                sublabel={stat.sublabel}
                suffix={stat.suffix}
                prefix={stat.prefix}
                duration={1600 + i * 200}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/**
 * Inline mini version — horizontal pill strip, great for article headers
 */
export function MiniStats({ items }) {
  return (
    <div style={{
      display:    'flex',
      flexWrap:   'wrap',
      gap:        'var(--space-2)',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display:      'flex',
          alignItems:   'center',
          gap:          'var(--space-2)',
          padding:      '4px 12px',
          background:   'var(--surface-1)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
        }}>
          {item.icon && (
            <span style={{ fontSize: '11px', color: 'var(--amber)' }}>{item.icon}</span>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-50)', letterSpacing: '0.04em' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}