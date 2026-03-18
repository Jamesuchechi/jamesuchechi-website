'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';
import { formatDistanceToNow }               from 'date-fns';

export default function AdminGuestbookPage() {
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all'); // 'all' | 'pending' | 'approved'

  const load = useCallback(() => {
    setLoading(true);
    // Admin fetches all (including unapproved) by calling the DB directly via a dedicated admin list
    fetch('/api/guestbook/admin-list')
      .then(r => r.json())
      .then(d => setEntries(Array.isArray(d) ? d : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function approve(id, currently) {
    await fetch(`/api/guestbook/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ approved: !currently }),
    });
    load();
  }

  async function del(id) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => filter === 'approved' ? e.approved : !e.approved);

  const pendingCount = entries.filter(e => !e.approved).length;

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Manage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Guestbook
            {pendingCount > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', marginLeft: 'var(--space-3)', padding: '2px 8px', background: 'var(--amber-subtle)', borderRadius: 'var(--radius-full)' }}>
                {pendingCount} pending
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {['all', 'pending', 'approved'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '4px 12px', borderRadius: 'var(--radius-full)',
            border: '1px solid', cursor: 'pointer',
            borderColor: filter === f ? 'var(--amber)' : 'var(--border)',
            background:  filter === f ? 'var(--amber-subtle)' : 'transparent',
            color:       filter === f ? 'var(--amber)' : 'var(--ink-50)',
          }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--ink-50)', textAlign: 'center', padding: 'var(--space-10)' }}>No entries.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.map(entry => (
            <div key={entry.id} style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              borderLeft: entry.approved ? '3px solid #22c55e' : '3px solid var(--amber)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ fontWeight: '500', color: 'var(--ink)' }}>{entry.name}</span>
                  {entry.email && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', marginLeft: 'var(--space-3)' }}>
                      {entry.email}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <time style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </time>
                  <button onClick={() => approve(entry.id, entry.approved)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer',
                    color: entry.approved ? 'var(--ink-30)' : '#22c55e',
                    border: '1px solid', borderRadius: 'var(--radius-full)', padding: '2px 10px',
                    borderColor: entry.approved ? 'var(--border)' : 'rgba(34,197,94,0.3)',
                  }}>
                    {entry.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button onClick={() => del(entry.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6 }}>{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
