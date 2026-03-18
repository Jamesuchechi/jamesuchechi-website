import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size    = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { slug } = await params;
  
  // Derive a title from the slug since we can't safely use fs in this loader
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const type        = 'WRITING';

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
        {/* Amber glow */}
        <div style={{
          position:   'absolute',
          top:        '-100px',
          left:       '-100px',
          width:      '500px',
          height:     '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,146,42,0.15) 0%, transparent 65%)',
        }} />

        {/* Type label */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '8px',
          marginBottom:    '40px',
        }}>
          <div style={{
            fontSize:      '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#c9922a',
            border:        '1px solid rgba(201,146,42,0.3)',
            borderRadius:  '999px',
            padding:       '4px 14px',
          }}>
            {type}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize:      '58px',
          fontWeight:    '300',
          color:         '#f0ede6',
          lineHeight:    1.05,
          letterSpacing: '-0.02em',
          maxWidth:      '900px',
          marginBottom:  '28px',
          flex:          1,
        }}>
          {title}
        </div>

        {/* Footer */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          borderTop:      '1px solid rgba(240,237,230,0.1)',
          paddingTop:     '24px',
        }}>
          <div style={{
            display:       'flex',
            fontSize:      '18px',
            fontWeight:    '400',
            color:         '#f0ede6',
            letterSpacing: '-0.01em',
          }}>
            <span>James Uchechi</span><span style={{ color: '#c9922a' }}>.</span>
          </div>
          <div style={{
            fontSize:      '14px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'rgba(240,237,230,0.3)',
            fontFamily:    'monospace',
          }}>
            jamesuchechi.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
