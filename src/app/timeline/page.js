import { prisma } from '@/lib/prisma';
import Link        from 'next/link';

export const metadata = {
  title:       'Journey',
  description: 'A timeline of milestones — career moves, projects shipped, places lived, things learned.',
};

const CATEGORY_STYLES = {
  career:    { color: '#60a5fa', label: 'Career'    },
  life:      { color: '#f472b6', label: 'Life'      },
  travel:    { color: '#34d399', label: 'Travel'    },
  education: { color: '#a78bfa', label: 'Education' },
  project:   { color: 'var(--amber)', label: 'Project' },
};

async function getTimeline() {
  try {
    return await prisma.timelineEntry.findMany({
      where:   { published: true },
      orderBy: { date: 'desc' },
    });
  } catch {
    return [];
  }
}

function groupByYear(entries) {
  return entries.reduce((acc, entry) => {
    const year = new Date(entry.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {});
}

function TimelineItem({ entry }) {
  const style     = CATEGORY_STYLES[entry.category] || { color: 'var(--ink-30)', label: entry.category };
  const dateStr   = new Date(entry.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <div className="timeline-item">
      {/* Left: date */}
      <div className="timeline-item__date">
        <time style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--ink-30)', whiteSpace: 'nowrap' }}>
          {dateStr}
        </time>
      </div>

      {/* Dot on rail */}
      <div className="timeline-item__dot" style={{ borderColor: style.color }}>
        {entry.icon && (
          <span style={{ fontSize: '14px', position: 'absolute', left: '-22px', top: '-4px' }}>{entry.icon}</span>
        )}
      </div>

      {/* Right: content */}
      <div className="timeline-item__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: style.color,
            padding: '2px 8px', borderRadius: 'var(--radius-full)',
            background: `${style.color}18`,
            border: `1px solid ${style.color}30`,
          }}>
            {style.label}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          fontWeight: '500', color: 'var(--ink)', marginBottom: 'var(--space-2)',
        }}>
          {entry.title}
        </h3>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.7, marginBottom: entry.linkUrl ? 'var(--space-4)' : 0 }}>
          {entry.description}
        </p>

        {entry.linkUrl && (
          <Link href={entry.linkUrl} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            {entry.linkLabel || 'Learn more'} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function TimelinePage() {
  const entries = await getTimeline();
  const grouped = groupByYear(entries);
  const years   = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Journey</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>Timeline</h1>
        <p style={{ color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
          Milestones, moves, and moments that shaped the path.
        </p>
      </div>

      {entries.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-20)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-30)', letterSpacing: '-0.02em', marginBottom: 'var(--space-4)' }}>
            Nothing here yet.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
            Add milestones from <a href="/admin/timeline/new" style={{ color: 'var(--amber)' }}>the admin →</a>
          </p>
        </div>
      ) : (
        <div className="timeline-rail">
          {years.map(year => (
            <div key={year}>
              {/* Year marker */}
              <div className="timeline-year">
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
                  fontWeight: '300', color: 'var(--ink-30)', letterSpacing: '-0.03em',
                }}>
                  {year}
                </span>
              </div>
              {grouped[year].map(entry => (
                <TimelineItem key={entry.id} entry={entry} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
