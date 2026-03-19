'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ju:reading-list';

/* ── Hook ──────────────────────────────────────────────────── */
export function useReadingList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setList(stored);
    } catch {}
  }, []);

  const save = useCallback((next) => {
    setList(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const add = useCallback((item) => {
    setList(prev => {
      if (prev.find(p => p.slug === item.slug)) return prev;
      const next = [item, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((slug) => {
    setList(prev => {
      const next = prev.filter(p => p.slug !== slug);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const has = useCallback((slug) => list.some(p => p.slug === slug), [list]);

  return { list, add, remove, has };
}

/* ── Bookmark Button (on each post card/page) ──────────────── */
export function BookmarkButton({ post }) {
  const { add, remove, has } = useReadingList();
  const [saved,    setSaved]   = useState(false);
  const [popping,  setPopping] = useState(false);
  const [mounted,  setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(has(post.slug));
  }, [has, post.slug]);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      remove(post.slug);
      setSaved(false);
    } else {
      add({ slug: post.slug, title: post.title, description: post.description, date: post.date, readingTime: post.readingTime, type: post.type, tags: post.tags });
      setSaved(true);
      setPopping(true);
      setTimeout(() => setPopping(false), 600);
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={saved ? 'Remove from reading list' : 'Save to reading list'}
      aria-label={saved ? 'Remove from reading list' : 'Save to reading list'}
      style={{
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        width:        '28px',
        height:       '28px',
        borderRadius: 'var(--radius-full)',
        border:       '1px solid',
        borderColor:  saved ? 'rgba(201,146,42,0.4)' : 'var(--border)',
        background:   saved ? 'var(--amber-subtle)' : 'var(--surface-1)',
        cursor:       'pointer',
        transition:   'all 200ms var(--ease-out)',
        transform:    popping ? 'scale(1.25)' : 'scale(1)',
        flexShrink:   0,
      }}
    >
      <span style={{
        fontSize:   '13px',
        lineHeight: 1,
        filter:     saved ? 'none' : 'grayscale(1) opacity(0.5)',
        transition: 'filter 200ms',
      }}>
        🔖
      </span>
    </button>
  );
}

/* ── Floating Reading List Panel ───────────────────────────── */
export function ReadingListPanel() {
  const { list, remove } = useReadingList();
  const [open,   setOpen]   = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Reading list"
        style={{
          position:     'fixed',
          bottom:       'var(--space-6)',
          left:         'var(--space-6)',
          zIndex:       500,
          display:      'flex',
          alignItems:   'center',
          gap:          'var(--space-2)',
          padding:      '8px 14px',
          borderRadius: 'var(--radius-full)',
          border:       '1px solid var(--border)',
          background:   'var(--surface-glass)',
          backdropFilter: 'blur(16px)',
          cursor:       'pointer',
          transition:   'all var(--duration-fast)',
          boxShadow:    'var(--shadow-md)',
          fontFamily:   'var(--font-mono)',
          fontSize:     '11px',
          color:        list.length > 0 ? 'var(--amber)' : 'var(--ink-30)',
          letterSpacing:'0.06em',
        }}
      >
        <span style={{ fontSize: '14px' }}>🔖</span>
        {list.length > 0 && (
          <span style={{
            minWidth: '16px', height: '16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--amber)',
            color: 'var(--paper)',
            fontSize: '9px', fontWeight: '600',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px',
          }}>
            {list.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 498,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(2px)',
              animation: 'fade-in 150ms ease',
            }}
          />

          <div style={{
            position:     'fixed',
            bottom:       'calc(var(--space-6) + 48px)',
            left:         'var(--space-6)',
            zIndex:       499,
            width:        'min(380px, calc(100vw - 48px))',
            background:   'var(--surface-0)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow:    'var(--shadow-xl)',
            animation:    'scale-in 200ms var(--ease-out)',
            transformOrigin: 'bottom left',
            overflow:     'hidden',
          }}>
            {/* Header */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              justifyContent:'space-between',
              padding:      'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span>🔖</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', letterSpacing: '0.06em' }}>
                  Reading List
                </span>
                {list.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>
                    ({list.length})
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ color: 'var(--ink-30)', fontSize: '16px', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {list.length === 0 ? (
                <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', marginBottom: 'var(--space-3)' }}>🔖</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
                    No saved posts yet.
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', marginTop: 'var(--space-2)' }}>
                    Click 🔖 on any post to save it.
                  </p>
                </div>
              ) : (
                <div style={{ padding: 'var(--space-2)' }}>
                  {list.map((item, i) => (
                    <div
                      key={item.slug}
                      style={{
                        display:      'flex',
                        alignItems:   'flex-start',
                        gap:          'var(--space-3)',
                        padding:      'var(--space-3) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        transition:   'background var(--duration-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Link
                        href={`/writing/${item.slug}`}
                        onClick={() => setOpen(false)}
                        style={{ flex: 1, textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                      >
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                          {item.readingTime && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>
                              {item.readingTime} min
                            </span>
                          )}
                          {item.type && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)', letterSpacing: '0.06em' }}>
                              {item.type}
                            </span>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={() => remove(item.slug)}
                        title="Remove"
                        style={{ color: 'var(--ink-30)', fontSize: '12px', cursor: 'pointer', flexShrink: 0, padding: '2px', lineHeight: 1, transition: 'color var(--duration-fast)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-30)'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}