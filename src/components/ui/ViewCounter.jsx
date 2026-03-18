'use client';
import { useState, useEffect } from 'react';

/**
 * ViewCounter
 * Increments the view count for a slug on mount, displays total.
 * Silent if the API fails.
 */
export function ViewCounter({ slug, section = 'writing' }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!slug) return;

    // Increment
    fetch('/api/views', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ slug, section }),
    })
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});
  }, [slug, section]);

  if (count === null) return null;

  return (
    <span style={{
      fontFamily:    'var(--font-mono)',
      fontSize:      '11px',
      color:         'var(--ink-30)',
      letterSpacing: '0.06em',
    }}>
      {count.toLocaleString()} {count === 1 ? 'view' : 'views'}
    </span>
  );
}
