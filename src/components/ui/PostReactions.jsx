'use client';
import { useState, useEffect } from 'react';

const REACTIONS = [
  { type: 'learned',    emoji: '💡', label: 'Learned something' },
  { type: 'bookmarked', emoji: '🔖', label: 'Bookmarked'        },
  { type: 'thinking',   emoji: '🤔', label: 'Got me thinking'   },
];

export function PostReactions({ slug }) {
  const [counts,  setCounts]  = useState({ learned: 0, bookmarked: 0, thinking: 0 });
  const [reacted, setReacted] = useState({});
  const [loading, setLoading] = useState(true);
  const [popping, setPopping] = useState(null);

  useEffect(() => {
    // Load counts
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => setCounts(d))
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load reacted state from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(`reactions:${slug}`) || '{}');
      setReacted(stored);
    } catch {}
  }, [slug]);

  async function react(type) {
    if (reacted[type]) return; // Already reacted

    // Optimistic
    setCounts(c => ({ ...c, [type]: c[type] + 1 }));
    setReacted(r => ({ ...r, [type]: true }));
    setPopping(type);
    setTimeout(() => setPopping(null), 600);

    // Persist to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(`reactions:${slug}`) || '{}');
      localStorage.setItem(`reactions:${slug}`, JSON.stringify({ ...stored, [type]: true }));
    } catch {}

    // Persist to DB
    try {
      await fetch('/api/reactions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, type }),
      });
    } catch {}
  }

  return (
    <div style={{
      marginTop:    'var(--space-16)',
      paddingTop:   'var(--space-8)',
      borderTop:    '1px solid var(--border)',
    }}>
      <p style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '11px',
        color:         'var(--ink-30)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom:  'var(--space-5)',
      }}>
        Reactions
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {REACTIONS.map(({ type, emoji, label }) => {
          const done  = reacted[type];
          const isPop = popping === type;
          const count = counts[type];

          return (
            <button
              key={type}
              onClick={() => react(type)}
              disabled={done || loading}
              title={label}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          'var(--space-2)',
                padding:      '8px 16px',
                borderRadius: 'var(--radius-full)',
                border:       '1px solid',
                borderColor:  done ? 'rgba(201,146,42,0.4)' : 'var(--border)',
                background:   done ? 'var(--amber-subtle)' : 'var(--surface-1)',
                cursor:       done ? 'default' : 'pointer',
                transition:   'all 200ms var(--ease-out)',
                transform:    isPop ? 'scale(1.15)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(201,146,42,0.4)'; }}
              onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <span style={{
                fontSize:   '18px',
                lineHeight: 1,
                display:    'inline-block',
                transition: 'transform 200ms var(--ease-spring)',
                transform:  isPop ? 'scale(1.3) rotate(-10deg)' : 'scale(1)',
              }}>
                {emoji}
              </span>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '12px',
                color:         done ? 'var(--amber)' : 'var(--ink-50)',
                letterSpacing: '0.04em',
                minWidth:      '12px',
                transition:    'color 200ms',
              }}>
                {loading ? '·' : count || 0}
              </span>
            </button>
          );
        })}
      </div>

      <p style={{
        marginTop:  'var(--space-4)',
        fontFamily: 'var(--font-mono)',
        fontSize:   '10px',
        color:      'var(--ink-30)',
        letterSpacing: '0.06em',
      }}>
        {Object.values(reacted).some(Boolean)
          ? 'Thanks for reacting ✦'
          : 'Click to react — no login needed'}
      </p>

      <style>{`
        @keyframes pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35) rotate(-8deg); }
          70%  { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}