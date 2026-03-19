'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ui/ThemeProvider';

const NAV_LINKS = [
  { href: '/writing',   label: 'Writing'  },
  { href: '/projects',  label: 'Projects' },
  { href: '/gallery',   label: 'Gallery'  },
  { href: '/timeline',  label: 'Journey'  },
  { href: '/garden',    label: 'Garden'   },
  { href: '/uses',      label: 'Uses'     },
];

const SECTION_ICONS = {
  writing: '✦',
  garden:  '🌱',
  page:    '→',
};

function ScrollBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (pct <= 0) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0,
      height: '1px',
      width: `${pct * 100}%`,
      background: 'linear-gradient(to right, var(--amber), var(--amber-light))',
      transition: 'width 60ms linear',
      boxShadow: '0 0 6px var(--amber-glow)',
    }} />
  );
}

export function SiteNav() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { theme, toggle, mounted } = useTheme();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cmdOpen,     setCmdOpen]     = useState(false);
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching,   setSearching]   = useState(false);

  const inputRef    = useRef(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    setCmdOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
      if (e.key === 'Escape') { setCmdOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    if (cmdOpen) {
      setQuery(''); setResults([]); setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdOpen]);

  useEffect(() => {
    if (query.toLowerCase().trim() === 'james') {
      window.dispatchEvent(new CustomEvent('jamesOS:open'));
    }
  }, [query]);

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

  const handleQueryChange = (e) => { const q = e.target.value; setQuery(q); runSearch(q); };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { router.push(results[activeIndex].href); setCmdOpen(false); }
  };

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

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
        background:     scrolled
          ? 'color-mix(in srgb, var(--surface-glass) 92%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom:   scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition:     'all var(--duration-base) var(--ease-out)',
        overflow:       'hidden',
      }}>
        {/* Wordmark */}
        <Link href="/" style={{
          fontFamily:    'var(--font-display)',
          fontSize:      '22px',
          fontWeight:    '400',
          letterSpacing: '-0.02em',
          color:         'var(--ink)',
          lineHeight:    1,
          textDecoration: 'none',
          transition:    'opacity var(--duration-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
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
                fontSize:      '11px',
                letterSpacing: '0.07em',
                color:         isActive(href) ? 'var(--ink)' : 'var(--ink-40)',
                textDecoration: 'none',
                transition:    'color var(--duration-fast)',
                position:      'relative',
                textTransform: 'lowercase',
                padding:       '4px 0',
              }}
            >
              {label}
              {/* Active underline */}
              <span style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '1px',
                background: 'var(--amber)',
                transform: isActive(href) ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform var(--duration-base) var(--ease-out)',
                boxShadow: '0 0 4px var(--amber-glow)',
              }} />
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setCmdOpen(true)}
            className="cmd-trigger"
            aria-label="Open search (⌘K)"
          >
            <span style={{ fontSize: '12px' }}>⌕</span>
            <span>⌘K</span>
          </button>

          {mounted && (
            <button
              onClick={toggle}
              className="theme-btn"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '◑' : '○'}
            </button>
          )}

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

        {/* Scroll progress bar */}
        <ScrollBar />
      </header>

      {/* ── MOBILE MENU ─────────────────────────────────── */}
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

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map(({ href, label }, i) => (
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
                  display:       'flex',
                  alignItems:    'center',
                  gap:           'var(--space-3)',
                  animation:     `fade-up 400ms var(--ease-out) ${i * 50}ms both`,
                  transition:    'color var(--duration-fast)',
                }}
              >
                {isActive(href) && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
                )}
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-12)', animation: 'fade-up 400ms var(--ease-out) 350ms both' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
              okparajamesuchechi@gmail.com
            </p>
          </div>
        </div>
      )}

      {/* ── COMMAND PALETTE ─────────────────────────────── */}
      {cmdOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setCmdOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
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
            boxShadow: 'var(--shadow-xl)',
            animation: 'scale-in 200ms var(--ease-out)',
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
              {results.length > 0 ? (
                <>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ink-30)', padding: 'var(--space-2) var(--space-4)',
                    marginBottom: 'var(--space-1)',
                  }}>Results</p>
                  {results.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCmdOpen(false)}
                      className="cmd-item"
                      style={{ background: i === activeIndex ? 'var(--surface-1)' : 'transparent' }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)', width: '16px', flexShrink: 0, textAlign: 'center' }}>
                        {SECTION_ICONS[item.section] || '→'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.3 }}>{item.title}</p>
                        {item.description && (
                          <p style={{ fontSize: '12px', color: 'var(--ink-30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                        {item.section}
                      </span>
                    </Link>
                  ))}
                </>
              ) : query.length >= 2 && !searching ? (
                <p style={{ padding: 'var(--space-6)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : !query && (
                <>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ink-30)', padding: 'var(--space-2) var(--space-4)', marginBottom: 'var(--space-1)',
                  }}>Quick links</p>
                  {[...NAV_LINKS, { href: '/r', label: 'Resume' }].map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setCmdOpen(false)} className="cmd-item">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: '14px' }}>{label}</span>
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', margin: 'var(--space-2) var(--space-2) 0', padding: 'var(--space-3) var(--space-2) var(--space-1)' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', letterSpacing: '0.08em' }}>
                      Tip: type &ldquo;james&rdquo; for a surprise ✦
                    </p>
                  </div>
                </>
              )}
              {query.toLowerCase().trim() === 'james' && (
                <div style={{ padding: 'var(--space-4)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em' }}>
                  ✦ Launching James Ecosystem…
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-3) var(--space-5)', display: 'flex', gap: 'var(--space-5)' }}>
              {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1px 5px', background: 'var(--surface-1)' }}>{key}</kbd>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>{label}</span>
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
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        /* Remove ink-40 which wasn't in original vars */
        [style*="var(--ink-40)"] { color: rgba(13,13,11,0.4); }
        [data-theme="dark"] [style*="var(--ink-40)"] { color: rgba(240,237,230,0.4); }
      `}</style>
    </>
  );
}