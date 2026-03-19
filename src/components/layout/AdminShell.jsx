'use client';
import { useEffect, useState }       from 'react';
import { useRouter }       from 'next/navigation';
import Link                from 'next/link';
import { usePathname }     from 'next/navigation';

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: '◈' },
  { href: '/admin/projects',  label: 'Projects',  icon: '⬡' },
  { href: '/admin/gallery',   label: 'Gallery',   icon: '◫' },
  { href: '/admin/timeline',  label: 'Timeline',  icon: '⏲' },
  { href: '/admin/bookmarks', label: 'Bookmarks', icon: '🔖' },
  { href: '/admin/guestbook', label: 'Guestbook', icon: '✍' },
  { href: '/admin/now',       label: 'Now',       icon: '◎' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/uses',      label: 'Uses',      icon: '⊞' },
  { href: '/',                label: '← Site',    icon: '' },
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
    router.refresh();
  }

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-0)' }}>
      {/* Mobile Header */}
      <header className="admin-mobile-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '56px',
        background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
        zIndex: 50, display: 'none', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--space-5)'
      }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
          color: 'var(--ink)'
        }}>
          JU<span style={{ color: 'var(--amber)' }}>.</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.1em', marginLeft: '4px' }}>ADMIN</span>
        </p>
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{ fontSize: '20px', color: 'var(--ink-50)', padding: '4px' }}
        >
          ☰
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="admin-sidebar-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)', zIndex: 90, display: 'none'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width:         '220px',
          flexShrink:    0,
          background:    'var(--surface-1)',
          borderRight:   '1px solid var(--border)',
          display:       'flex',
          flexDirection: 'column',
          padding:       'var(--space-6) 0',
          position:      'sticky',
          top:           0,
          height:        '100vh',
          overflowY:     'auto',
          zIndex:        100
        }}
      >
        <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--ink-30)',
            }}>
              Admin
            </p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
              color: 'var(--ink)', marginTop: '2px',
            }}>
              JU<span style={{ color: 'var(--amber)' }}>.</span>
            </p>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            style={{ display: 'none', fontSize: '20px', color: 'var(--ink-30)' }}
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 var(--space-3)' }}>
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         'var(--space-3)',
                padding:     'var(--space-2) var(--space-3)',
                borderRadius:'var(--radius-md)',
                fontSize:    'var(--text-sm)',
                fontFamily:  'var(--font-body)',
                fontWeight:  isActive(href) ? '500' : '400',
                color:       isActive(href) ? 'var(--ink)' : 'var(--ink-50)',
                background:  isActive(href) ? 'var(--surface-2)' : 'transparent',
                textDecoration: 'none',
                transition:  'all var(--duration-fast)',
              }}
            >
              {icon && <span style={{ fontSize: '14px', opacity: 0.6 }}>{icon}</span>}
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            style={{
              width:       '100%',
              textAlign:   'left',
              fontFamily:  'var(--font-mono)',
              fontSize:    '11px',
              letterSpacing: '0.06em',
              color:       'var(--ink-30)',
              cursor:      'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main" style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-header { display: flex !important; }
          .admin-main { padding-top: 56px; }
          .admin-sidebar-overlay { display: block !important; }
          .admin-sidebar-close { display: block !important; }
          
          .admin-sidebar {
            position: fixed !important;
            left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform var(--duration-base) var(--ease-out);
            box-shadow: var(--shadow-xl);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
