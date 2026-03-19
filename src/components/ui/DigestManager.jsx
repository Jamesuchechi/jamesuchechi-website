'use client';
import { useState } from 'react';

export function DigestManager({ emails = [] }) {
  const [copied, setCopied] = useState(false);

  function copyEmails() {
    navigator.clipboard.writeText(emails.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <button
        onClick={copyEmails}
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '11px',
          letterSpacing: '0.06em',
          padding:       '6px 14px',
          borderRadius:  'var(--radius-full)',
          border:        '1px solid var(--border)',
          background:    copied ? 'rgba(34,197,94,0.1)' : 'var(--surface-2)',
          color:         copied ? '#22c55e' : 'var(--ink-50)',
          cursor:        'pointer',
          transition:    'all var(--duration-fast)',
        }}
      >
        {copied ? '✓ Copied!' : 'Copy emails'}
      </button>

      <a
        href={`mailto:?bcc=${emails.join(',')}`}
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '11px',
          letterSpacing: '0.06em',
          padding:       '6px 14px',
          borderRadius:  'var(--radius-full)',
          border:        '1px solid var(--border)',
          background:    'var(--surface-2)',
          color:         'var(--amber)',
          textDecoration:'none',
          display:       'inline-flex',
          alignItems:    'center',
        }}
      >
        Open in mail ↗
      </a>
    </div>
  );
}