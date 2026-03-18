import { prisma }     from '@/lib/prisma';
import { AlbumCard } from '@/components/ui/AlbumCard';
import Link           from 'next/link';

export const metadata = {
  title:       'Gallery',
  description: 'A visual memory hub — photos and videos from life, travel, and projects.',
};

async function getAlbums() {
  try {
    return await prisma.galleryAlbum.findMany({
      where:   { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { media: true } },
        media: {
          orderBy: { order: 'asc' },
          take:    1,
          select:  { url: true, thumbnailUrl: true, type: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Memory hub</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <h1 className="display-2" style={{ marginBottom: 0 }}>Gallery</h1>
          <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em' }}>
            {albums.length} {albums.length === 1 ? 'album' : 'albums'}
          </p>
        </div>
        <p style={{
          marginTop:  'var(--space-6)',
          color:      'var(--ink-50)',
          fontSize:   'var(--text-base)',
          lineHeight: 1.7,
          maxWidth:   '520px',
        }}>
          A visual journal — moments, adventures, and memories captured in images and video.
        </p>
      </div>

      {albums.length === 0 ? (
        <div style={{
          border:       '1px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding:      'var(--space-24)',
          textAlign:    'center',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-30)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
            No albums yet.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
            Create your first album from{' '}
            <Link href="/admin/gallery/new" style={{ color: 'var(--amber)' }}>the admin →</Link>
          </p>
        </div>
      ) : (
        <div className="albums-grid">
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
