import Link from 'next/link';

export function AlbumCard({ album }) {
  const coverUrl    = album.coverUrl || album.media?.[0]?.thumbnailUrl || album.media?.[0]?.url;
  const mediaCount  = album._count?.media ?? album.media?.length ?? 0;

  return (
    <Link href={`/gallery/${album.slug}`} className="album-card">
      {/* Cover */}
      <div className="album-card__cover">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }} className="album-card__img" />
        ) : (
          <div className="album-card__placeholder">
            <span style={{ fontSize: '40px' }}>{album.emoji || '🖼️'}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="album-card__overlay">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
            View album →
          </span>
        </div>

        {/* Emoji badge */}
        {album.emoji && (
          <div style={{
            position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)',
            fontSize: '18px', lineHeight: 1,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)', padding: '4px 8px',
          }}>
            {album.emoji}
          </div>
        )}

        {/* Count badge */}
        <div style={{
          position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-full)',
          padding: '3px 10px',
        }}>
          {mediaCount}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--space-5)' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
          fontWeight: '400', color: 'var(--ink)', letterSpacing: '-0.01em',
          marginBottom: 'var(--space-2)',
        }}>
          {album.title}
        </h3>
        {album.description && (
          <p style={{
            fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {album.description}
          </p>
        )}
      </div>
    </Link>
  );
}
