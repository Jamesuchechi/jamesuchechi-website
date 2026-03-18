'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';
import { formatDistanceToNow }               from 'date-fns';

export default function AdminBookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [q,         setQ]         = useState('');

  const load = useCallback(() => {
    setLoading(true);
    // Admin sees all (published + draft) — use a simple GET that returns all
    fetch('/api/bookmarks/admin-list')
      .then(r => r.json())
      .then(d => setBookmarks(Array.isArray(d) ? d : []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = q
    ? bookmarks.filter(b =>
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
      )
    : bookmarks;

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Manage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Bookmarks
          </h1>
        </div>
        <Link href="/admin/bookmarks/new" className="btn-primary">+ Add Bookmark</Link>
      </div>

      {/* Search */}
      <input
        value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search by title or tag…"
        style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 'var(--text-sm)', outline: 'none', marginBottom: 'var(--space-6)' }}
      />

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-4)' }}>{q ? 'No matches.' : 'No bookmarks yet.'}</p>
          {!q && <Link href="/admin/bookmarks/new" className="amber-link">Add your first bookmark →</Link>}
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
            {['Title', 'Tags', 'Added', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((b, i) => (
            <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '350px' }}>{b.title}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '350px' }}>{b.url}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                {b.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                {b.tags.length > 2 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>+{b.tags.length - 2}</span>}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
                {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Link href={`/admin/bookmarks/${b.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>Edit</Link>
                <button onClick={() => del(b.id, b.title)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
