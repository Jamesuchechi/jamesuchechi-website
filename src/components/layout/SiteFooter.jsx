import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Writing', href: '/writing' },
  { label: 'Now',     href: '/now'     },
  { label: 'Garden',  href: '/garden'  },
  { label: 'Uses',    href: '/uses'    },
  { label: 'Resume',  href: '/r'       },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',  href: 'https://github.com/jamesuchechi'   },
  { label: 'Twitter', href: 'https://x.com/Jamesuchechi6'       },
  { label: 'Email',   href: 'mailto:okparajamesuchechi@gmail.com'},
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: 'var(--space-16) var(--space-6) var(--space-10)',
      marginTop: 'var(--space-24)',
    }}>
      <div style={{
        maxWidth: 'var(--max-w-wide)', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-12)',
      }}>
        <div>
          <Link href="/" style={{
            fontFamily: 'var(--font-display)', fontSize: '28px',
            fontWeight: '300', letterSpacing: '-0.02em',
            color: 'var(--ink)', display: 'block', marginBottom: 'var(--space-3)',
            textDecoration: 'none',
          }}>
            James Uchechi<span style={{ color: 'var(--amber)' }}>.</span>
          </Link>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--ink-30)', lineHeight: 1.6, maxWidth: '220px',
          }}>
            Software engineer & data scientist.<br />
            Building things that matter.
          </p>
        </div>

        <div>
          <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Pages</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="mono-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Connect</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={href} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mono-link"
              >
                {label}
                {href.startsWith('http') && (
                  <span style={{ fontSize: '9px', opacity: 0.5 }}>↗</span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div style={{
        maxWidth: 'var(--max-w-wide)', margin: 'var(--space-12) auto 0',
        paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 'var(--space-4)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--ink-30)', letterSpacing: '0.06em',
        }}>
          © {year} James Uchechi
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--ink-30)', letterSpacing: '0.06em',
        }}>
          Built with Next.js · Deployed on Vercel
        </span>
      </div>
    </footer>
  );
}
