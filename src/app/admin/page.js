'use client';
import { useState, useEffect } from 'react';
import Link                     from 'next/link';

function StatCard({ label, value, href }) {
  return (
    <div style={{
      background:   'var(--surface-1)',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding:      'var(--space-6)',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--ink-30)', marginBottom: 'var(--space-3)',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
        fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em',
      }}>
        {value ?? '—'}
      </p>
      {href && (
        <Link href={href} style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--amber)', display: 'inline-block', marginTop: 'var(--space-4)',
        }}>
          Manage →
        </Link>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 'var(--space-10)', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption">Overview</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
          fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 'var(--space-2)',
        }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-10)',
      }}>
        <StatCard label="Projects"       value={loading ? '…' : stats?.projects}      href="/admin/projects" />
        <StatCard label="Uses Items"     value={loading ? '…' : stats?.usesItems}     href="/admin/uses" />
        <StatCard label="Unread Messages" value={loading ? '…' : stats?.unreadContacts} />
        <StatCard label="Total Views"    value={loading ? '…' : stats?.totalViews?.toLocaleString()} />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Quick actions</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <Link href="/admin/projects/new" className="btn-primary">+ New Project</Link>
          <Link href="/admin/uses/new"     className="btn-ghost">+ New Uses Item</Link>
          <Link href="/"                   className="btn-ghost" target="_blank">View Site ↗</Link>
        </div>
      </div>
    </div>
  );
}
