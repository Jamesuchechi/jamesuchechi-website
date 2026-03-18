'use client';
import { useState, useEffect } from 'react';
import { useParams }           from 'next/navigation';
import { BookmarkForm }        from '@/components/ui/BookmarkForm';

export default function EditBookmarkPage() {
  const { id }       = useParams();
  const [bookmark, setBookmark] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/bookmarks/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setBookmark(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)   return <div style={{ padding: 'var(--space-10)' }}><p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p></div>;
  if (notFound)  return <div style={{ padding: 'var(--space-10)' }}><p style={{ color: '#ef4444' }}>Bookmark not found.</p></div>;

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p className="caption">Bookmarks → Edit</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Edit Bookmark
        </h1>
      </div>
      <BookmarkForm initial={bookmark} />
    </div>
  );
}
