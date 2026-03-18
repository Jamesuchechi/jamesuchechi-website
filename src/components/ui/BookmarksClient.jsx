'use client';
import { useState, useTransition } from 'react';
import { formatDistanceToNow }     from 'date-fns';

export function BookmarksClient({ bookmarks, allTags }) {
  const [activeTag, setActiveTag]  = useState('all');
  const [, startTransition]        = useTransition();

  const filtered = activeTag === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.tags.includes(activeTag));

  return (
    <>
      {/* Tag filter */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
          {['all', ...allTags].map(tag => (
            <button
              key={tag}
              onClick={() => startTransition(() => setActiveTag(tag))}
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding:       '5px 14px',
                borderRadius:  'var(--radius-full)',
                border:        '1px solid',
                borderColor:   activeTag === tag ? 'var(--amber)' : 'var(--border)',
                background:    activeTag === tag ? 'var(--amber-subtle)' : 'var(--surface-1)',
                color:         activeTag === tag ? 'var(--amber)' : 'var(--ink-50)',
                cursor:        'pointer',
                transition:    'all var(--duration-fast)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)', padding: 'var(--space-12) 0' }}>
          No bookmarks for this tag.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {filtered.map(b => (
            <BookmarkCard key={b.id} bookmark={b} />
          ))}
        </div>
      )}
    </>
  );
}

function BookmarkCard({ bookmark: b }) {
  return (
    <div className="bookmark-card">
      {/* Title & link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
        <a
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: '500', fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'underline', textDecorationColor: 'var(--border)', textUnderlineOffset: '3px', transition: 'color var(--duration-fast)', lineHeight: 1.3 }}
        >
          {b.title} ↗
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
          {b.via && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
              via {b.via}
            </span>
          )}
          <time style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', letterSpacing: '0.04em' }}>
            {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
          </time>
        </div>
      </div>

      {/* Description */}
      {b.description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: b.note ? 'var(--space-3)' : 'var(--space-4)' }}>
          {b.description}
        </p>
      )}

      {/* Personal note */}
      {b.note && (
        <blockquote style={{
          margin:          '0 0 var(--space-4)',
          padding:         'var(--space-3) var(--space-4)',
          borderLeft:      '2px solid var(--amber)',
          background:      'var(--amber-subtle)',
          borderRadius:    '0 var(--radius-md) var(--radius-md) 0',
          fontSize:        'var(--text-sm)',
          color:           'var(--ink-70)',
          lineHeight:      1.6,
          fontStyle:       'italic',
        }}>
          {b.note}
        </blockquote>
      )}

      {/* Tags */}
      {b.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {b.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
