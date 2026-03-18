'use client';
import { useState, useEffect, useCallback } from 'react';
import Link                                   from 'next/link';

export default function AdminGalleryPage() {
  const [albums,  setAlbums]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/gallery/albums')
      .then(r => r.json())
      .then(d => setAlbums(Array.isArray(d) ? d : []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id, title) {
    if (!confirm(`Delete album "${title}" and ALL its media? This cannot be undone.`)) return;
    await fetch(`/api/gallery/albums/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <p className="caption">Gallery</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Albums
          </h1>
        </div>
        <Link href="/admin/gallery/new" className="btn-primary">+ New Album</Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      ) : albums.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-4)' }}>No albums yet.</p>
          <Link href="/admin/gallery/new" className="amber-link">Create your first album →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
            {['Album', 'Items', 'Published', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>{h}</span>
            ))}
          </div>

          {albums.map((album, i) => (
            <div key={album.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', alignItems: 'center', borderBottom: i < albums.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {album.emoji && <span style={{ fontSize: '18px' }}>{album.emoji}</span>}
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{album.title}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>/{album.slug}</p>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>{album._count?.media ?? 0}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: album.published ? '#22c55e' : 'var(--ink-30)' }}>{album.published ? 'Live' : 'Draft'}</span>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Link href={`/admin/gallery/${album.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>Edit</Link>
                <button onClick={() => del(album.id, album.title)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', cursor: 'pointer' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
