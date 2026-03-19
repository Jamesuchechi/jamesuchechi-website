import Link from 'next/link';
import { DigestSignup } from '@/components/ui/DigestSignup';

const NAV_GROUPS = [
  {
    label: 'Pages',
    links: [
      { label: 'Writing',   href: '/writing'   },
      { label: 'Projects',  href: '/projects'  },
      { label: 'Garden',    href: '/garden'    },
      { label: 'Gallery',   href: '/gallery'   },
      { label: 'Timeline',  href: '/timeline'  },
      { label: 'Now',       href: '/now'       },
      { label: 'Uses',      href: '/uses'      },
      { label: 'Bookmarks', href: '/bookmarks' },
    ],
  },
  {
    label: 'Meta',
    links: [
      { label: 'Colophon',   href: '/colophon'   },
      { label: 'Changelog',  href: '/changelog'  },
      { label: 'Guestbook',  href: '/guestbook'  },
      { label: 'Resume',     href: '/r'          },
      { label: 'RSS Feed',   href: '/feed.xml'   },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'GitHub',  href: 'https://github.com/jamesuchechi',    external: true },
      { label: 'Twitter', href: 'https://x.com/Jamesuchechi6',        external: true },
      { label: 'Email',   href: 'mailto:okparajamesuchechi@gmail.com', external: true },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop:  '1px solid var(--border)',
      padding:    'var(--space-16) var(--space-6) var(--space-10)',
      marginTop:  'var(--space-24)',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Subtle bg glow */}
      <div aria-hidden style={{
        position:   'absolute',
        bottom:     '-80px',
        left:       '10%',
        width:      '400px',
        height:     '300px',
        background: 'radial-gradient(ellipse, var(--amber-subtle), transparent 70%)',
        pointerEvents: 'none',
        filter:     'blur(60px)',
      }} />

      <div style={{
        maxWidth: 'var(--max-w-wide)',
        margin:   '0 auto',
        position: 'relative',
        zIndex:   1,
      }}>
        {/* Top grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap:                 'var(--space-12)',
          marginBottom:        'var(--space-12)',
        }}>
          {/* Brand + digest */}
          <div>
            <Link href="/" style={{
              fontFamily:    'var(--font-display)',
              fontSize:      '28px',
              fontWeight:    '300',
              letterSpacing: '-0.02em',
              color:         'var(--ink)',
              display:       'block',
              marginBottom:  'var(--space-3)',
              textDecoration:'none',
            }}>
              James Uchechi<span style={{ color: 'var(--amber)' }}>.</span>
            </Link>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '11px',
              color:      'var(--ink-30)',
              lineHeight: 1.6,
              maxWidth:   '220px',
              marginBottom: 'var(--space-6)',
              letterSpacing: '0.04em',
            }}>
              Software engineer & data scientist.<br />
              Building things that matter.
            </p>

            {/* Inline digest */}
            <DigestSignup variant="inline" />
          </div>

          {/* Nav groups */}
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>
                {group.label}
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {group.links.map(({ label, href, external }) => (
                  external ? (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-link"
                    >
                      {label}
                      <span style={{ fontSize: '9px', opacity: 0.4 }}>↗</span>
                    </a>
                  ) : (
                    <Link key={href} href={href} className="mono-link">
                      {label}
                    </Link>
                  )
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: 'var(--space-6)' }} />

        {/* Bottom row */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            'var(--space-4)',
        }}>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px',
            color:         'var(--ink-30)',
            letterSpacing: '0.06em',
          }}>
            © {year} James Uchechi
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              color:         'var(--ink-30)',
              letterSpacing: '0.06em',
            }}>
              Built with Next.js · Deployed on Vercel
            </span>
            <Link
              href="/colophon"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                color:         'var(--amber)',
                letterSpacing: '0.08em',
                textDecoration:'none',
                opacity:       0.7,
                transition:    'opacity var(--duration-fast)',
              }}
            >
              Colophon →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 520px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}