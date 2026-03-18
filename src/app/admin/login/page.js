'use client';
import { useState }    from 'react';
import { useRouter }   from 'next/navigation';

export default function AdminLoginPage() {
  const router         = useRouter();
  const [pw,    setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg || 'Invalid password');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: 'min(360px, 96vw)' }}>
      <div style={{ marginBottom: 'var(--space-10)', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
          color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>
          JU<span style={{ color: 'var(--amber)' }}>.</span>
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', marginTop: 'var(--space-2)', letterSpacing: '0.09em' }}>
          ADMIN ACCESS
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-50)', marginBottom: 'var(--space-2)',
          }}>
            Password
          </label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            autoFocus
            style={{
              width:        '100%',
              padding:      'var(--space-3) var(--space-4)',
              border:       `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              background:   'var(--surface-1)',
              color:        'var(--ink)',
              fontSize:     'var(--text-base)',
              outline:      'none',
              transition:   'border-color var(--duration-fast)',
            }}
          />
          {error && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', marginTop: 'var(--space-2)' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !pw}
          className="btn-primary"
          style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </form>
    </div>
  );
}
