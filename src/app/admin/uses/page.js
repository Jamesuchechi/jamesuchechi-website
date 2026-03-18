'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';

const CAT_LABELS = { hardware: 'Hardware', terminal: 'Terminal', stack: 'Stack', apps: 'Apps', reading: 'Reading' };

export default function AdminUsesPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/uses')
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/uses/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Manage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Uses
          </h1>
        </div>
        <Link href="/admin/uses/new" className="btn-primary">+ New Item</Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-4)' }}>No uses items yet.</p>
          <Link href="/admin/uses/new" className="amber-link">Add your first item →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 60px 80px',
            gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)',
            background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
          }}>
            {['Name', 'Category', 'Order', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>
                {h}
              </span>
            ))}
          </div>

          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 60px 80px',
                gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)',
                alignItems: 'center',
                borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{item.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                  {item.description}
                </p>
              </div>
              <span className="tag">{CAT_LABELS[item.category] || item.category}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>{item.order}</span>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Link href={`/admin/uses/${item.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>Edit</Link>
                <button onClick={() => del(item.id, item.name)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
