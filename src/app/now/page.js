import { formatDate } from '@/lib/dates';
import nowData        from '@/content/now/now.json';

export const metadata = {
  title:       'Now',
  description: "What I'm currently working on, learning, and reading.",
};

export default function NowPage() {
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
          What I'm up to
        </h1>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '12px',
          color:         'var(--ink-30)',
          letterSpacing: '0.06em',
        }}>
          Last updated {formatDate(nowData.updatedAt)} ·{' '}
          <span style={{ color: 'var(--amber)' }}>{nowData.location}</span>
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
          {' '}— a snapshot of what I'm currently focused on.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>

        {/* Building */}
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
            {nowData.building.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{
                    width:      '6px',
                    height:     '6px',
                    borderRadius: '50%',
                    background:  item.status === 'active' ? '#22c55e' : 'var(--ink-30)',
                    flexShrink:  0,
                  }} />
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: 'var(--ink)' }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{
                  fontSize:   'var(--text-sm)',
                  color:      'var(--ink-50)',
                  lineHeight: 1.7,
                  paddingLeft: 'var(--space-5)',
                }}>
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:       'inline-block',
                      marginTop:     'var(--space-2)',
                      marginLeft:    'var(--space-5)',
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '11px',
                      color:         'var(--amber)',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                    }}
                  >
                    View project ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Learning */}
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
            {nowData.learning.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-80)', lineHeight: 1.7 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Reading */}
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
            {nowData.reading.map((book, i) => (
              <div key={i}>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: '500', color: 'var(--ink)', marginBottom: '4px' }}>
                  {book.title}
                </p>
                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '11px',
                  color:         'var(--ink-30)',
                  letterSpacing: '0.04em',
                  marginBottom:  'var(--space-2)',
                }}>
                  {book.author}
                </p>
                {book.note && (
                  <p style={{
                    fontSize:   'var(--text-sm)',
                    color:      'var(--ink-50)',
                    fontStyle:  'italic',
                    lineHeight: 1.6,
                    paddingLeft: 'var(--space-4)',
                    borderLeft: '2px solid var(--amber)',
                  }}>
                    {book.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Listening / misc */}
        {nowData.listening && (
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
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.7 }}>
              {nowData.listening}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
