'use client';
import { useState }          from 'react';
import { GalleryGrid }       from '@/components/ui/GalleryGrid';
import { GalleryLightbox }   from '@/components/ui/GalleryLightbox';

export function AlbumDetailClient({ media }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const isOpen = lightboxIndex >= 0;

  if (!media?.length) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-30)', letterSpacing: '-0.02em', marginBottom: 'var(--space-4)' }}>
          No photos yet.
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
          Upload images from the admin panel.
        </p>
      </div>
    );
  }

  return (
    <>
      <GalleryGrid
        media={media}
        onOpen={setLightboxIndex}
      />

      {isOpen && (
        <GalleryLightbox
          media={media}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onPrev={() => setLightboxIndex(i => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex(i => Math.min(media.length - 1, i + 1))}
        />
      )}
    </>
  );
}
