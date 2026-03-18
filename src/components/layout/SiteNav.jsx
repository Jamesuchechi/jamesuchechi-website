'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ui/ThemeProvider';

const NAV_LINKS = [
  { href: '/writing', label: 'Writing' },
  { href: '/now',     label: 'Now'     },
  { href: '/garden',  label: 'Garden'  },
  { href: '/uses',    label: 'Uses'    },
];

const SECTION_ICONS = {
  writing: '✦',
  garden:  '🌱',
  page:    '→',
};

export function SiteNav() {
  const pathname          = usePathname();
  const router            = useRouter();
  const { theme, toggle, mounted } = useTheme();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cmdOpen,     setCmdOpen]     = useState(false);
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching,   setSearching]   = useState(false);
  const inputRef   = useRef(null);
  const searchTimer = useRef(null);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close on route change
  useEffect(() => {
    setCmdOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (cmdOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdOpen]);

  // JamesOS easter egg
  useEffect(() => {
    if (query.toLowerCase().trim() === 'james') {
      window.dispatchEvent(new CustomEvent('jamesOS:open'));
    }
  }, [query]);

  // Debounced search
  const runSearch = useCallback((q) => {
    clearTimeout(searchTimer.current);
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
        setActiveIndex(-1);
      } catch { setResults([]); }
      finally  { setSearching(false); }
    }, 200);
  }, []);

  const handleQueryChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    runSearch(q);
  };

  // Arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      router.push(results[activeIndex].href);
      setCmdOpen(false);
    }
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header style={{
        position:       'fixed',
        top:            0, left: 0, right: 0,
        zIndex:         100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 var(--space-6)',
        height:         '56px',
        background:     scrolled ? 'color-mix(in srgb, var(--surface-0) 88%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom:   scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition:     'all var(--duration-base) var(--ease-out)',
      }}>
        {/* Wordmark */}
        <Link href="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '20px',
          fontWeight: '400', letterSpacing: '-0.02em',
          color: 'var(--ink)', lineHeight: 1, textDecoration: 'none',
        }}>
          JU<span style={{ color: 'var(--amber)' }}>.</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }} className="nav-desktop">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '12px',
                letterSpacing: '0.06em',
                color:         isActive(href) ? 'var(--ink)' : 'var(--ink-50)',
                textDecoration: 'none',
                transition:    'color var(--duration-fast)',
                position:      'relative',
                textTransform: 'lowercase',
              }}
            >
              {isActive(href) && (
                <span style={{
                  position: 'absolute', bottom: '-2px',
                  left: 0, right: 0, height: '1px',
                  background: 'var(--amber)',
                }} />
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* ⌘K trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="cmd-trigger"
            aria-label="Open search (⌘K)"
          >
            <span style={{ fontSize: '12px' }}>⌕</span>
            <span>⌘K</span>
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggle}
              className="theme-btn"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '◑' : '○'}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            className="nav-hamburger"
            style={{
              width: '32px', height: '32px',
              display: 'none', alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-50)', fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'var(--surface-0)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-12)',
          animation: 'fade-in 200ms var(--ease-out)',
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute', top: 'var(--space-5)', right: 'var(--space-6)',
              color: 'var(--ink-50)', fontSize: '24px', cursor: 'pointer',
            }}
          >✕</button>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      'clamp(32px, 7vw, 52px)',
                  fontWeight:    '300',
                  letterSpacing: '-0.02em',
                  lineHeight:    1.1,
                  color:         isActive(href) ? 'var(--ink)' : 'var(--ink-30)',
                  textDecoration: 'none',
                }}
              >{label}</Link>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-12)' }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)',
            }}>
              okparajamesuchechi@gmail.com
            </p>
          </div>
        </div>
      )}

      {/* ── COMMAND PALETTE ────────────────────────────────── */}
      {cmdOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setCmdOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 'clamp(60px, 15vh, 160px)',
            animation: 'fade-in 150ms ease',
          }}
        >
          <div style={{
            width: 'min(580px, 92vw)',
            background: 'var(--surface-0)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}>
            {/* Input row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--ink-30)', fontSize: '16px', flexShrink: 0 }}>
                {searching ? '…' : '⌕'}
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Search writing, notes, pages…"
                style={{
                  flex: 1, background: 'none', border: 'none',
                  outline: 'none', fontSize: '15px', color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--ink-30)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '2px 6px', flexShrink: 0,
              }}>ESC</span>
            </div>

            {/* Results */}
            <div style={{ padding: 'var(--space-2)', maxHeight: '360px', overflowY: 'auto' }}>
              {/* Search results */}
              {results.length > 0 ? (
                <>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ink-30)', padding: 'var(--space-2) var(--space-4)',
                    marginBottom: 'var(--space-1)',
                  }}>
                    Results
                  </p>
                  {results.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCmdOpen(false)}
                      className="cmd-item"
                      style={{
                        background: i === activeIndex ? 'var(--surface-1)' : 'transparent',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        color: 'var(--ink-30)', width: '16px', flexShrink: 0,
                        textAlign: 'center',
                      }}>
                        {SECTION_ICONS[item.section] || '→'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.3 }}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p style={{
                            fontSize: '12px', color: 'var(--ink-30)',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', marginTop: '2px',
                          }}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: 'var(--ink-30)', letterSpacing: '0.06em',
                        textTransform: 'uppercase', flexShrink: 0,
                      }}>
                        {item.section}
                      </span>
                    </Link>
                  ))}
                </>
              ) : query.length >= 2 && !searching ? (
                <p style={{
                  padding: 'var(--space-6)', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  color: 'var(--ink-30)',
                }}>
                  No results for "{query}"
                </p>
              ) : !query && (
                /* Default quick links when no query */
                <>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ink-30)', padding: 'var(--space-2) var(--space-4)',
                    marginBottom: 'var(--space-1)',
                  }}>Quick links</p>
                  {[...NAV_LINKS, { href: '/r', label: 'Resume' }].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setCmdOpen(false)}
                      className="cmd-item"
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        color: 'var(--ink-30)', flexShrink: 0,
                      }}>→</span>
                      <span style={{ fontSize: '14px' }}>{label}</span>
                    </Link>
                  ))}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    margin: 'var(--space-2) var(--space-2) 0',
                    padding: 'var(--space-3) var(--space-2) var(--space-1)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px',
                      color: 'var(--ink-30)', letterSpacing: '0.08em',
                    }}>
                      Tip: type "james" for a surprise ✦
                    </p>
                  </div>
                </>
              )}

              {/* JamesOS easter egg */}
              {query.toLowerCase().trim() === 'james' && (
                <div style={{
                  padding: 'var(--space-4)', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--amber)', letterSpacing: '0.1em',
                }}>
                  ✦ Launching James Ecosystem…
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: 'var(--space-3) var(--space-5)',
              display: 'flex', gap: 'var(--space-5)',
            }}>
              {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <kbd style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    color: 'var(--ink-50)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '1px 5px',
                    background: 'var(--surface-1)',
                  }}>{key}</kbd>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none !important; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
