import { notFound }         from 'next/navigation';
import { prisma }            from '@/lib/prisma';
import { AlbumDetailClient } from '@/components/ui/AlbumDetailClient';
import Link                  from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const album = await prisma.galleryAlbum.findUnique({ where: { slug, published: true } });
    if (!album) return { title: 'Not Found' };
    return {
      title:       album.title,
      description: album.description || `${album.title} — Gallery`,
    };
  } catch {
    return { title: 'Gallery' };
  }
}

async function getAlbum(slug) {
  try {
    return await prisma.galleryAlbum.findUnique({
      where:   { slug, published: true },
      include: {
        media:  { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { media: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function AlbumPage({ params }) {
  const { slug } = await params;
  const album    = await getAlbum(slug);

  if (!album) notFound();

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Back + header */}
      <div style={{ marginBottom: 'var(--space-12)' }}>
        <Link href="/gallery" className="amber-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          ← All albums
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>
              {album.emoji ? `${album.emoji} ` : ''}Memory hub
            </p>
            <h1 className="display-2" style={{ marginBottom: 0 }}>{album.title}</h1>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
            {album._count.media} {album._count.media === 1 ? 'item' : 'items'}
          </p>
        </div>
        {album.description && (
          <p style={{ marginTop: 'var(--space-6)', color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7, maxWidth: '560px' }}>
            {album.description}
          </p>
        )}
      </div>

      {/* Client component wraps the masonry grid + lightbox */}
      <AlbumDetailClient media={album.media} />
    </div>
  );
}
