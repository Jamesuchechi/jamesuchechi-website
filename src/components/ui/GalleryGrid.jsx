'use client';

export function GalleryGrid({ media, onOpen }) {
  if (!media?.length) return null;

  return (
    <div className="masonry-grid">
      {media.map((item, index) => (
        <div
          key={item.id}
          className="gallery-item"
          onClick={() => onOpen(index)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen(index); }}
          aria-label={item.caption || `View ${item.type} ${index + 1}`}
        >
          {item.type === 'video' ? (
            <VideoCard item={item} />
          ) : (
            <ImageCard item={item} />
          )}
        </div>
      ))}
    </div>
  );
}

function ImageCard({ item }) {
  return (
    <div className="gallery-item__inner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.caption || ''}
        loading="lazy"
        style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }}
      />
      <ImageOverlay item={item} />
    </div>
  );
}

function VideoCard({ item }) {
  function handleMouseEnter(e) {
    const video = e.currentTarget.querySelector('video');
    if (video) { video.muted = true; video.play().catch(() => {}); }
  }
  function handleMouseLeave(e) {
    const video = e.currentTarget.querySelector('video');
    if (video) { video.pause(); video.currentTime = 0; }
  }

  return (
    <div className="gallery-item__inner" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <video
        src={item.url}
        poster={item.thumbnailUrl || undefined}
        muted playsInline preload="none"
        style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }}
      />
      {/* Play icon overlay */}
      <div className="gallery-item__play">
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '18px', paddingLeft: '2px',
        }}>▶</div>
      </div>
      <ImageOverlay item={item} />
    </div>
  );
}

function ImageOverlay({ item }) {
  const hasInfo = item.caption || item.location;
  if (!hasInfo) return null;
  return (
    <div className="gallery-item__overlay">
      {item.caption && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#fff', lineHeight: 1.4, marginBottom: item.location ? 'var(--space-2)' : 0 }}>
          {item.caption}
        </p>
      )}
      {item.location && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--amber)',
          background: 'rgba(201,146,42,0.2)', borderRadius: 'var(--radius-full)',
          padding: '2px 8px', display: 'inline-block',
        }}>
          📍 {item.location}
        </span>
      )}
    </div>
  );
}
