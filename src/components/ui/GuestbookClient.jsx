'use client';
import { useState }      from 'react';
import { formatDistanceToNow } from 'date-fns';

export function GuestbookClient({ initialEntries }) {
  const [entries,   setEntries]  = useState(initialEntries);
  const [name,      setName]     = useState('');
  const [message,   setMessage]  = useState('');
  const [email,     setEmail]    = useState('');
  const [status,    setStatus]   = useState('idle'); // idle | submitting | success | error
  const [errorMsg,  setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/guestbook', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, message, email }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMsg(error || 'Something went wrong.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName(''); setMessage(''); setEmail('');
    } catch {
      setErrorMsg('Network error — please try again.');
      setStatus('error');
    }
  }

  const inputStyle = {
    padding:      'var(--space-3) var(--space-4)',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background:   'var(--surface-1)',
    color:        'var(--ink)',
    fontSize:     'var(--text-sm)',
    outline:      'none',
    width:        '100%',
    transition:   'border-color var(--duration-fast)',
  };

  return (
    <>
      {/* Submission form */}
      <div style={{
        background:   'var(--surface-1)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding:      'var(--space-8)',
        marginBottom: 'var(--space-12)',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: 'var(--space-6)' }}>
          Leave a note
        </p>

        {status === 'success' ? (
          <div style={{ padding: 'var(--space-6)', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>🎉</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-50)' }}>
              Thank you! Your message is pending review and will appear here once approved.
            </p>
            <button onClick={() => setStatus('idle')} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', marginTop: 'var(--space-4)', cursor: 'pointer' }}>
              Leave another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  Name *
                </label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required maxLength={80} placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  Email (optional, never shown)
                </label>
                <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>
                  Message *
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: message.length > 450 ? '#ef4444' : 'var(--ink-30)' }}>
                  {message.length}/500
                </span>
              </div>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                maxLength={500}
                placeholder="Say hello…"
              />
            </div>

            {errorMsg && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444' }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting' || !name || !message}
              className="btn-primary"
              style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
            >
              {status === 'submitting' ? 'Sending…' : 'Sign the guestbook →'}
            </button>
          </form>
        )}
      </div>

      {/* Approved entries */}
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
            No messages yet — be the first!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {entries.map(entry => (
            <div key={entry.id} className="guestbook-entry">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-4)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                  {entry.name}
                </span>
                <time style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', flexShrink: 0 }}>
                  {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </time>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6 }}>
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
