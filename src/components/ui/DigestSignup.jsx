'use client';
import { useState } from 'react';

/**
 * DigestSignup — minimal email capture, no third-party service.
 * Stored in your DB, you send manually or via cron.
 *
 * Props:
 *   variant — 'inline' (default) | 'card'
 */
export function DigestSignup({ variant = 'inline' }) {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/digest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setStatus('success');
      setMessage('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  if (variant === 'card') {
    return (
      <div style={{
        padding:      'var(--space-8)',
        background:   'var(--surface-1)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        borderLeft:   '2px solid var(--amber)',
        position:     'relative',
        overflow:      'hidden',
      }}>
        {/* Ambient glow */}
        <div aria-hidden style={{
          position:   'absolute', top: '-40px', right: '-40px',
          width:      '160px', height: '160px', borderRadius: '50%',
          background: 'radial-gradient(circle, var(--amber-subtle), transparent 70%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 'var(--space-3)' }}>
            ✦ Digest
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: '400', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 'var(--space-2)' }}>
            Stay in the loop
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
            Occasional emails when I publish something worth reading. No cadence, no marketing. Just writing.
          </p>
          <SignupForm email={email} setEmail={setEmail} status={status} message={message} onSubmit={handleSubmit} />
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
        Get notified when I publish. No spam, unsubscribe anytime.
      </p>
      <SignupForm email={email} setEmail={setEmail} status={status} message={message} onSubmit={handleSubmit} />
    </div>
  );
}

function SignupForm({ email, setEmail, status, message, onSubmit }) {
  if (status === 'success') {
    return (
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         'var(--space-3)',
        padding:     'var(--space-3) var(--space-4)',
        background:  'rgba(34,197,94,0.08)',
        border:      '1px solid rgba(34,197,94,0.2)',
        borderRadius:'var(--radius-full)',
      }}>
        <span style={{ fontSize: '16px' }}>✓</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#22c55e', letterSpacing: '0.06em' }}>
          You&apos;re in. Talk soon.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{
          flex:         '1 1 200px',
          padding:      '10px 16px',
          background:   'var(--surface-2)',
          border:       `1px solid ${status === 'error' ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-full)',
          fontSize:     'var(--text-sm)',
          color:        'var(--ink)',
          outline:      'none',
          fontFamily:   'var(--font-body)',
          transition:   'border-color var(--duration-fast)',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary"
        style={{ opacity: status === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
      </button>
      {status === 'error' && message && (
        <p style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', paddingLeft: 'var(--space-2)' }}>
          {message}
        </p>
      )}
    </form>
  );
}