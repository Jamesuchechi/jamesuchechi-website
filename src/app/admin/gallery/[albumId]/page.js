'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams }              from 'next/navigation';
import { AlbumForm }                         from '@/components/ui/AlbumForm';
import { MediaUploader }                     from '@/components/ui/MediaUploader';

export default function EditAlbumPage() {
  const { albumId }  = useParams();
  const router       = useRouter();
  const [album,    setAlbum]    = useState(null);
  const [media,    setMedia]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/gallery/albums/${albumId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setAlbum(d); setMedia(d.media || []); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [albumId]);

  useEffect(load, [load]);

  async function deleteAlbum() {
    if (!confirm(`Delete "${album?.title}" and ALL its media? Cannot be undone.`)) return;
    await fetch(`/api/gallery/albums/${albumId}`, { method: 'DELETE' });
    router.push('/admin/gallery');
    router.refresh();
  }

  async function deleteMedia(mediaId, caption) {
    if (!confirm(`Delete this ${caption ? `"${caption}"` : 'media item'}?`)) return;
    await fetch(`/api/gallery/media/${mediaId}`, { method: 'DELETE' });
    setMedia(prev => prev.filter(m => m.id !== mediaId));
  }

  async function updateCaption(mediaId, caption, location) {
    await fetch(`/api/gallery/media/${mediaId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ caption, location }),
    });
  }

  if (loading)   return <div style={{ padding: 'var(--space-10)' }}><p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p></div>;
  if (notFound)  return <div style={{ padding: 'var(--space-10)' }}><p style={{ color: '#ef4444' }}>Album not found.</p></div>;

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <p className="caption">Gallery → Edit</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            {album?.emoji ? `${album.emoji} ` : ''}{album?.title}
          </h1>
        </div>
        <button onClick={deleteAlbum} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-full)', padding: '6px 16px', cursor: 'pointer' }}>
          Delete album
        </button>
      </div>

      {/* Album edit form */}
      <div style={{ marginBottom: 'var(--space-12)', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-6)' }}>Album details</p>
        <AlbumForm initial={album} onSave={load} />
      </div>

      {/* Upload zone */}
      <div style={{ marginBottom: 'var(--space-12)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Upload media</p>
        <MediaUploader
          albumId={albumId}
          onUploaded={saved => setMedia(prev => [...prev, saved])}
        />
      </div>

      {/* Media grid */}
      {media.length > 0 && (
        <div>
          <p className="caption" style={{ marginBottom: 'var(--space-6)' }}>
            {media.length} {media.length === 1 ? 'item' : 'items'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {media.map(item => (
              <MediaTile key={item.id} item={item} onDelete={deleteMedia} onUpdate={updateCaption} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaTile({ item, onDelete, onUpdate }) {
  const [caption,  setCaption]  = useState(item.caption  || '');
  const [location, setLocation] = useState(item.location || '');
  const [saving,   setSaving]   = useState(false);

  async function save() {
    setSaving(true);
    await onUpdate(item.id, caption, location);
    setSaving(false);
  }

  const thumb = item.thumbnailUrl || item.url;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-1)' }}>
      {/* Preview */}
      <div style={{ height: '140px', overflow: 'hidden', position: 'relative', background: 'var(--surface-2)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {item.type === 'video' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', paddingLeft: '2px' }}>▶</span>
          </div>
        )}
      </div>
      {/* Inputs */}
      <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <input
          value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Caption…"
          style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '12px', outline: 'none', width: '100%' }}
          onBlur={save}
        />
        <input
          value={location} onChange={e => setLocation(e.target.value)}
          placeholder="Location…"
          style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '12px', outline: 'none', width: '100%' }}
          onBlur={save}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: saving ? 'var(--amber)' : 'var(--ink-30)' }}>
            {saving ? 'Saving…' : item.type}
          </span>
          <button onClick={() => onDelete(item.id, item.caption)} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#ef4444', cursor: 'pointer', letterSpacing: '0.04em' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
