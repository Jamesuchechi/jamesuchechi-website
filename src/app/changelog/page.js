import { prisma }    from '@/lib/prisma';
import { formatDate } from '@/lib/dates';
import Link           from 'next/link';

export const metadata = {
  title:       'Changelog',
  description: 'A public log of what I\'ve shipped, learned, and changed.',
};

// Hardcoded initial entries — add new ones at the top
// Or migrate to DB later via a Changelog model
const CHANGELOG = [
  {
    date:    '2026-03-19',
    version: 'v2.0',
    type:    'major',
    title:   'Full redesign + feature wave',
    items: [
      'New animated canvas background with reactive dot grid',
      'Custom amber cursor with spring-lerp ring',
      '3D tilt cards on posts and projects',
      'Reading progress bar on article pages',
      'Animated stats counters (numbers count up on scroll)',
      'Page transition system with route loading bar',
      '/projects/[slug] full case study pages',
      'Marquee tech strip on homepage',
      'Colophon, Changelog, and Reactions added',
      'Post reactions (💡 🔖 🤔) with DB persistence',
      'Email digest signup',
      'Related posts by tag at end of articles',
      'Writing heatmap calendar',
      'Hero typing animation',
      '/uses items now expandable',
      'Ambient sound toggle',
    ],
  },
  {
    date:    '2026-03-18',
    version: 'v1.5',
    type:    'minor',
    title:   'Admin & content management',
    items: [
      'Full admin panel with authentication',
      'Projects, gallery, bookmarks, timeline CRUD',
      'Guestbook with approval queue',
      'Analytics dashboard with section breakdown',
      'Now page inline editor',
    ],
  },
  {
    date:    '2026-01-20',
    version: 'v1.0',
    type:    'major',
    title:   'Initial launch',
    items: [
      'Site goes live',
      'Writing with MDX, reading time, view counts',
      'Digital garden with seedling/budding/evergreen stages',
      'Spotify now-playing widget',
      'Command palette with full-text search',
      'Dark/light mode with system preference detection',
      'Prisma + Supabase data layer',
      'Gallery with Cloudinary uploads',
    ],
  },
];

const TYPE_STYLES = {
  major: { color: 'var(--amber)',  label: 'Major'  },
  minor: { color: '#60a5fa',      label: 'Minor'   },
  fix:   { color: '#34d399',      label: 'Fix'     },
  note:  { color: 'var(--ink-30)', label: 'Note'  },
};

export default function ChangelogPage() {
  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>History</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>Changelog</h1>
        <p style={{ color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7, maxWidth: '480px' }}>
          A public log of what I&apos;ve shipped, learned, and changed on this site.
          Like a commit history, but readable.
        </p>
      </div>

      {/* Entries */}
      <div style={{
        position:    'relative',
        paddingLeft: 'var(--space-8)',
        borderLeft:  '1px solid var(--border)',
      }}>
        {CHANGELOG.map((entry, i) => {
          const typeStyle = TYPE_STYLES[entry.type] || TYPE_STYLES.note;
          return (
            <div
              key={entry.version}
              style={{
                marginBottom: 'var(--space-16)',
                position:     'relative',
                animation:    `fade-up 500ms var(--ease-out) ${i * 100}ms both`,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position:     'absolute',
                left:         'calc(-1 * var(--space-8) - 4.5px)',
                top:          '6px',
                width:        '9px',
                height:       '9px',
                borderRadius: '50%',
                background:   typeStyle.color,
                border:       '2px solid var(--surface-0)',
                boxShadow:    `0 0 0 2px ${typeStyle.color}40`,
              }} />

              {/* Date + version */}
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         'var(--space-3)',
                marginBottom: 'var(--space-3)',
                flexWrap:    'wrap',
              }}>
                <time style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '11px',
                  color:         'var(--ink-30)',
                  letterSpacing: '0.06em',
                }}>
                  {formatDate(entry.date, { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
                <span style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         typeStyle.color,
                  background:    `${typeStyle.color}15`,
                  border:        `1px solid ${typeStyle.color}30`,
                  borderRadius:  'var(--radius-full)',
                  padding:       '2px 8px',
                }}>
                  {entry.version}
                </span>
                <span style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:         'var(--ink-30)',
                }}>
                  {typeStyle.label}
                </span>
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily:    'var(--font-display)',
                fontSize:      'var(--text-xl)',
                fontWeight:    '400',
                color:         'var(--ink)',
                letterSpacing: '-0.01em',
                marginBottom:  'var(--space-5)',
              }}>
                {entry.title}
              </h2>

              {/* Items */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {entry.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <span style={{
                      color:      typeStyle.color,
                      flexShrink: 0,
                      marginTop:  '5px',
                      fontSize:   '8px',
                    }}>
                      ●
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-70)', lineHeight: 1.7 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Origin dot */}
        <div style={{
          position:     'absolute',
          left:         'calc(-1 * var(--space-8) - 4.5px)',
          bottom:       0,
          width:        '9px',
          height:       '9px',
          borderRadius: '50%',
          background:   'var(--border)',
          border:       '2px solid var(--surface-0)',
        }} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'var(--space-16)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
          To be continued.
        </p>
      </div>
    </div>
  );
}