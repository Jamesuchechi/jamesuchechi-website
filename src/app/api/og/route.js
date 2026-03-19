// src/app/api/og/route.js
// Dynamic Open Graph image generator
// Usage: /api/og?title=My+Post&type=WRITING&description=A+short+desc&date=Mar+2026

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const title       = searchParams.get('title')       || 'James Uchechi';
  const type        = searchParams.get('type')        || 'NOTE';
  const description = searchParams.get('description') || 'Software engineer, data scientist, builder.';
  const date        = searchParams.get('date')        || '';
  const readingTime = searchParams.get('readingTime') || '';

  // Type → accent color
  const TYPE_COLORS = {
    WRITING:  '#c9922a',
    ESSAY:    '#c9922a',
    TUTORIAL: '#60a5fa',
    TIL:      '#34d399',
    GARDEN:   '#7fc47a',
    PROJECT:  '#c9922a',
    GALLERY:  '#c9a44a',
    NOTE:     '#c9922a',
  };
  const accentColor = TYPE_COLORS[type.toUpperCase()] || '#c9922a';

  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          background:      '#0e0d0b',
          padding:         '64px 72px',
          fontFamily:      'Georgia, serif',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        {/* Radial amber glow — top left */}
        <div style={{
          position:     'absolute',
          top:          '-140px',
          left:         '-100px',
          width:        '600px',
          height:       '600px',
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${accentColor}18 0%, transparent 65%)`,
        }} />

        {/* Bottom-right subtle glow */}
        <div style={{
          position:     'absolute',
          bottom:       '-80px',
          right:        '-60px',
          width:        '400px',
          height:       '400px',
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${accentColor}0A 0%, transparent 70%)`,
        }} />

        {/* Grain texture overlay (SVG filter inline) */}
        <div style={{
          position:   'absolute',
          inset:      0,
          opacity:    0.025,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }} />

        {/* Type badge */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '12px',
          marginBottom:  '40px',
        }}>
          <div style={{
            fontSize:      '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         accentColor,
            border:        `1px solid ${accentColor}50`,
            borderRadius:  '999px',
            padding:       '5px 16px',
            fontFamily:    'monospace',
          }}>
            {type.toUpperCase()}
          </div>
          {date && (
            <span style={{
              fontFamily:    'monospace',
              fontSize:      '11px',
              letterSpacing: '0.1em',
              color:         'rgba(240,237,230,0.25)',
            }}>
              {date}
            </span>
          )}
          {readingTime && (
            <span style={{
              fontFamily:    'monospace',
              fontSize:      '11px',
              letterSpacing: '0.1em',
              color:         'rgba(240,237,230,0.25)',
            }}>
              · {readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontSize:      title.length > 50 ? '48px' : '62px',
          fontWeight:    '300',
          color:         '#f0ede6',
          lineHeight:    1.05,
          letterSpacing: '-0.02em',
          maxWidth:      '900px',
          flex:          1,
          display:       'flex',
          alignItems:    'flex-start',
        }}>
          {title}
        </div>

        {/* Description */}
        {description && (
          <div style={{
            fontSize:     '20px',
            color:        'rgba(240,237,230,0.42)',
            lineHeight:   1.5,
            maxWidth:     '760px',
            marginBottom: '48px',
            fontFamily:   '-apple-system, sans-serif',
          }}>
            {description.length > 120 ? description.slice(0, 120) + '…' : description}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          borderTop:      '1px solid rgba(240,237,230,0.08)',
          paddingTop:     '24px',
        }}>
          {/* Wordmark */}
          <div style={{
            display:       'flex',
            alignItems:    'baseline',
            fontSize:      '20px',
            fontWeight:    '400',
            color:         '#f0ede6',
            letterSpacing: '-0.01em',
            gap:           '1px',
          }}>
            <span>James Uchechi</span>
            <span style={{ color: accentColor }}>.</span>
          </div>

          {/* Domain */}
          <div style={{
            fontFamily:    'monospace',
            fontSize:      '13px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'rgba(240,237,230,0.25)',
          }}>
            jamesuchechi.com
          </div>
        </div>

        {/* Amber bottom line */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          width:      '40%',
          height:     '2px',
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }} />
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  );
}