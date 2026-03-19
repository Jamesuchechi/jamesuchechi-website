import { prisma }           from '@/lib/prisma';
import { format }           from 'date-fns';
import { DigestManager }   from '@/components/ui/DigestManager';

export const metadata = { title: 'Digest Subscribers · Admin' };

async function getSubscribers() {
  try {
    return await prisma.digestSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
  } catch { return []; }
}

export default async function AdminDigestPage() {
  const subscribers = await getSubscribers();
  const active   = subscribers.filter(s => s.active);
  const inactive = subscribers.filter(s => !s.active);

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption">Manage</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Digest Subscribers
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        {[
          { label: 'Total',    value: subscribers.length },
          { label: 'Active',   value: active.length,   color: '#22c55e' },
          { label: 'Inactive', value: inactive.length, color: 'var(--ink-30)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: 'var(--space-5)', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)', marginBottom: 'var(--space-2)' }}>{label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '300', color: color || 'var(--ink)', lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Export */}
      {active.length > 0 && (
        <div style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) var(--space-5)', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>
              Export active subscribers
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
              {active.map(s => s.email).join(', ').slice(0, 80)}{active.length > 3 ? '…' : ''}
            </p>
          </div>
          <DigestManager emails={active.map(s => s.email)} />
        </div>
      )}

      {/* Table */}
      {subscribers.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)' }}>No subscribers yet. The signup form is live on the site.</p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
            {['Email', 'Status', 'Joined'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>{h}</span>
            ))}
          </div>
          {subscribers.map((sub, i) => (
            <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', alignItems: 'center', borderBottom: i < subscribers.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: sub.active ? 'var(--ink)' : 'var(--ink-30)' }}>
                {sub.email}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: sub.active ? '#22c55e' : 'var(--ink-30)' }}>
                {sub.active ? 'Active' : 'Inactive'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
                {format(new Date(sub.subscribedAt), 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}