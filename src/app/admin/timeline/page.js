'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';
import { format }                            from 'date-fns';

export default function AdminTimelinePage() {
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/timeline/admin-list')
      .then(r => r.json())
      .then(d => setEntries(Array.isArray(d) ? d : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id, title) {
    if (!confirm(`Delete milestone "${title}"?`)) return;
    await fetch(`/api/timeline/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Manage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Timeline
          </h1>
        </div>
        <Link href="/admin/timeline/new" className="btn-primary">+ Add Milestone</Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : entries.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-4)' }}>No milestones yet.</p>
          <Link href="/admin/timeline/new" className="amber-link">Add your first milestone →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
            {['Icon', 'Date', 'Milestone', 'Category', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>{h}</span>
            ))}
          </div>
          {entries.map((e, i) => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', alignItems: 'center', borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '18px', textAlign: 'center' }}>{e.icon || '—'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>
                {format(new Date(e.date), 'MMM yyyy')}
              </span>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{e.title}</p>
                <p style={{ fontSize: '11px', color: 'var(--ink-30)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--ink-30)',
                background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 'var(--radius-sm)'
              }}>
                {e.category}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Link href={`/admin/timeline/${e.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>Edit</Link>
                <button onClick={() => del(e.id, e.title)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
