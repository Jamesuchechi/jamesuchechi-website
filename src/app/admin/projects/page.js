'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';

const CATEGORY_LABELS = { web: 'Web', data: 'Data', oss: 'OSS', other: 'Other' };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/projects?published=&category=all')
      // admin needs all, inc unpublished — use a direct prisma call via admin route
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Manage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Projects
          </h1>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">+ New Project</Link>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : projects.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-4)' }}>No projects yet.</p>
          <Link href="/admin/projects/new" className="amber-link">Add your first project →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px 80px',
            gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)',
            background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
          }}>
            {['Title', 'Category', 'Featured', 'Published', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>
                {h}
              </span>
            ))}
          </div>

          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px 80px',
                gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)',
                alignItems: 'center',
                borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{p.title}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>{p.slug}</p>
              </div>
              <span className="tag">{CATEGORY_LABELS[p.category] || p.category}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: p.featured ? 'var(--amber)' : 'var(--ink-30)' }}>
                {p.featured ? 'Yes' : 'No'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: p.published ? '#22c55e' : 'var(--ink-30)' }}>
                {p.published ? 'Live' : 'Draft'}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Link href={`/admin/projects/${p.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>
                  Edit
                </Link>
                <button onClick={() => del(p.id, p.title)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
