'use client';
import { useEffect, useCallback } from 'react';

export function GalleryLightbox({ media, currentIndex, onClose, onPrev, onNext }) {
  const item = media[currentIndex];

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {/* Counter */}
      <div className="lightbox__counter" onClick={e => e.stopPropagation()}>
        {currentIndex + 1} / {media.length}
      </div>

      {/* Close */}
      <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={e => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous"
        >
          ←
        </button>
      )}

      {/* Media */}
      <div className="lightbox__media" onClick={e => e.stopPropagation()}>
        {item.type === 'video' ? (
          <video
            key={item.id}
            src={item.url}
            poster={item.thumbnailUrl || undefined}
            controls
            autoPlay
            style={{ maxWidth: '90vw', maxHeight: '82vh', borderRadius: 'var(--radius-md)' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.url}
            alt={item.caption || ''}
            style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
          />
        )}
      </div>

      {/* Caption + location */}
      {(item.caption || item.location) && (
        <div className="lightbox__caption" onClick={e => e.stopPropagation()}>
          {item.caption && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
              {item.caption}
            </p>
          )}
          {item.location && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em',
              color: 'var(--amber)', display: 'inline-block', marginTop: '6px',
            }}>
              📍 {item.location}
            </span>
          )}
        </div>
      )}

      {/* Next */}
      {currentIndex < media.length - 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={e => { e.stopPropagation(); onNext(); }}
          aria-label="Next"
        >
          →
        </button>
      )}
    </div>
  );
}
