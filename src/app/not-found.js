import Link from 'next/link';

export const metadata = { title: '404 — Page not found' };

export default function NotFound() {
  return (
    <div style={{
      minHeight:      '80vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        'var(--space-12)',
      textAlign:      'center',
    }}>
      <p style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '11px',
        color:         'var(--amber)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom:  'var(--space-4)',
      }}>
        404
      </p>

      <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>
        Nothing here
      </h1>

      <p style={{
        color:        'var(--ink-50)',
        fontSize:     'var(--text-base)',
        maxWidth:     '360px',
        lineHeight:   1.7,
        marginBottom: 'var(--space-10)',
      }}>
        This page doesn't exist, or it moved somewhere else.
      </p>

      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}
