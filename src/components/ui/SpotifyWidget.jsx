'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SpotifyWidget() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = () =>
      fetch('/api/spotify')
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));

    fetch_();
    // Poll every 60s
    const id = setInterval(fetch_, 60_000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <SpotifySkeleton />;
  if (!data || !data.configured || (!data.title)) return null;

  return (
    <a
      href={data.songUrl || 'https://open.spotify.com'}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            'var(--space-3)',
        padding:        'var(--space-3) var(--space-4)',
        borderRadius:   'var(--radius-lg)',
        border:         '1px solid var(--border)',
        background:     'var(--surface-1)',
        textDecoration: 'none',
        color:          'inherit',
        transition:     'border-color var(--duration-fast)',
        maxWidth:       '320px',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Album art */}
      {data.albumArt ? (
        <div style={{
          width:        '36px',
          height:       '36px',
          borderRadius: 'var(--radius-sm)',
          overflow:     'hidden',
          flexShrink:   0,
          position:     'relative',
        }}>
          <Image
            src={data.albumArt}
            alt={data.album || 'Album art'}
            fill
            sizes="36px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{
          width:          '36px',
          height:         '36px',
          borderRadius:   'var(--radius-sm)',
          background:     '#1DB954',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '16px',
          flexShrink:     0,
        }}>
          ♫
        </div>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        {/* Status indicator */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           'var(--space-2)',
          marginBottom:  '2px',
        }}>
          {data.isPlaying && (
            <span style={{
              display:      'flex',
              gap:          '2px',
              alignItems:   'flex-end',
              height:       '10px',
            }}>
              {[1,2,3].map(i => (
                <span
                  key={i}
                  style={{
                    width:      '2px',
                    background: '#1DB954',
                    borderRadius: '1px',
                    animation:  `eq-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                    height:     `${4 + i * 2}px`,
                  }}
                />
              ))}
            </span>
          )}
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         data.isPlaying ? '#1DB954' : 'var(--ink-30)',
          }}>
            {data.isPlaying ? 'Now playing' : 'Last played'}
          </span>
        </div>

        <p style={{
          fontSize:     'var(--text-sm)',
          fontWeight:   '500',
          color:        'var(--ink)',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   1.3,
        }}>
          {data.title}
        </p>
        <p style={{
          fontFamily:   'var(--font-mono)',
          fontSize:     '11px',
          color:        'var(--ink-30)',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          marginTop:    '1px',
        }}>
          {data.artist}
        </p>
      </div>

      {/* Spotify mark */}
      <svg
        viewBox="0 0 24 24"
        style={{ width: '14px', height: '14px', flexShrink: 0, fill: '#1DB954' }}
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </a>
  );
}

function SpotifySkeleton() {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          'var(--space-3)',
      padding:      'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      border:       '1px solid var(--border)',
      background:   'var(--surface-1)',
      maxWidth:     '320px',
      opacity:      0.5,
    }}>
      <div style={{
        width: '36px', height: '36px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-2)',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '10px', width: '80px', background: 'var(--surface-2)', borderRadius: '4px', marginBottom: '6px' }} />
        <div style={{ height: '12px', width: '140px', background: 'var(--surface-2)', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
