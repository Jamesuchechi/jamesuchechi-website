import { formatDate } from '@/lib/dates';
import { prisma }    from '@/lib/prisma';

export const metadata = {
  title:       'Now',
  description: "What I'm currently working on, learning, and reading.",
};

export default async function NowPage() {
  let entries = [];
  try {
    entries = await prisma.nowEntry.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.error('Now page DB fetch error:', err);
  }

  const building = entries.filter(e => e.section === 'building');
  const learning = entries.filter(e => e.section === 'learning');
  const reading  = entries.filter(e => e.section === 'reading');
  const listening = entries.filter(e => e.section === 'listening');
  
  // Use the most recent updatedAt from any entry
  const lastUpdated = entries.length > 0 
    ? new Date(Math.max(...entries.map(e => e.updatedAt.getTime())))
    : new Date();

  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>
          Now
        </p>
        <h1
          className="display-2"
          style={{ marginBottom: 'var(--space-6)' }}
        >
          What I&apos;m up to
        </h1>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '12px',
          color:         'var(--ink-30)',
          letterSpacing: '0.06em',
        }}>
          Last updated {formatDate(lastUpdated)} ·{' '}
          <span style={{ color: 'var(--amber)' }}>Abuja, Nigeria</span>
        </p>
        <p style={{
          marginTop:   'var(--space-4)',
          color:       'var(--ink-50)',
          fontSize:    'var(--text-sm)',
          lineHeight:  1.7,
        }}>
          This is a{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--amber)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            now page
          </a>
          {' '}— a snapshot of what I&apos;m currently focused on.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>

        {/* Building */}
        {building.length > 0 && (
          <section>
            <h2 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'var(--text-xl)',
              fontWeight:    '400',
              marginBottom:  'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom:  '1px solid var(--border)',
              color:         'var(--ink)',
            }}>
              Building
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {building.map((item) => (
                <div key={item.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <span style={{
                      width:      '6px',
                      height:     '6px',
                      borderRadius: '50%',
                      background:  '#22c55e',
                      flexShrink:  0,
                    }} />
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: 'var(--ink)' }}>
                      {item.content}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Learning */}
        {learning.length > 0 && (
          <section>
            <h2 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'var(--text-xl)',
              fontWeight:    '400',
              marginBottom:  'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom:  '1px solid var(--border)',
              color:         'var(--ink)',
            }}>
              Learning
            </h2>
            <ul style={{
              listStyle: 'none',
              display:   'flex',
              flexDirection: 'column',
              gap:       'var(--space-3)',
            }}>
              {learning.map((item) => (
                <li key={item.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-80)', lineHeight: 1.7 }}>
                    {item.content}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reading */}
        {reading.length > 0 && (
          <section>
            <h2 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'var(--text-xl)',
              fontWeight:    '400',
              marginBottom:  'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom:  '1px solid var(--border)',
              color:         'var(--ink)',
            }}>
              Reading
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {reading.map((item) => (
                <div key={item.id}>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: 'var(--ink)', marginBottom: '4px' }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Listening / misc */}
        {listening.length > 0 && (
          <section>
            <h2 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'var(--text-xl)',
              fontWeight:    '400',
              marginBottom:  'var(--space-4)',
              paddingBottom: 'var(--space-4)',
              borderBottom:  '1px solid var(--border)',
              color:         'var(--ink)',
            }}>
              Listening
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {listening.map((item) => (
                <p key={item.id} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.7 }}>
                  {item.content}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
