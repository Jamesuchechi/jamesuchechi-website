'use client';
import { useMemo } from 'react';

/**
 * WritingHeatmap — GitHub-style calendar showing when posts were published.
 *
 * Props:
 *   posts — array of { date: ISO string, title, slug }
 *   weeks — how many weeks to show (default 52)
 */
export function WritingHeatmap({ posts = [], weeks = 52 }) {
  const { grid, months, total } = useMemo(() => {
    // Build a set of publish dates → count
    const counts = {};
    posts.forEach(p => {
      const key = p.date.slice(0, 10); // YYYY-MM-DD
      counts[key] = (counts[key] || 0) + 1;
    });

    // Build grid: weeks columns, 7 rows (Sun–Sat)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rewind to start of week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7);

    const grid = [];
    const monthLabels = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        const key   = date.toISOString().slice(0, 10);
        const count = counts[key] || 0;
        const month = date.getMonth();

        col.push({
          date:    key,
          count,
          title:   posts.find(p => p.date.startsWith(key))?.title || null,
          future:  date > today,
          month,
        });

        // Track month label position
        if (d === 0 && month !== lastMonth) {
          monthLabels.push({ week: w, label: date.toLocaleString('default', { month: 'short' }) });
          lastMonth = month;
        }
      }
      grid.push(col);
    }

    const total = posts.length;
    return { grid, months: monthLabels, total };
  }, [posts, weeks]);

  const cellSize = 11;
  const gap      = 2;

  function getColor(count, future) {
    if (future) return 'transparent';
    if (count === 0) return 'var(--surface-2)';
    if (count === 1) return 'rgba(201,146,42,0.35)';
    if (count === 2) return 'rgba(201,146,42,0.60)';
    return 'var(--amber)';
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <p className="caption">Publishing activity</p>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
          {total} {total === 1 ? 'post' : 'posts'}
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Month labels */}
          <div style={{
            display:  'flex',
            position: 'relative',
            marginBottom: '4px',
            paddingLeft: '24px',
          }}>
            {grid.map((col, wi) => {
              const label = months.find(m => m.week === wi);
              return (
                <div
                  key={wi}
                  style={{
                    width:      `${cellSize + gap}px`,
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '9px',
                    color:      'var(--ink-30)',
                    letterSpacing: '0.04em',
                    overflow:   'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label ? label.label : ''}
                </div>
              );
            })}
          </div>

          {/* Day labels + grid */}
          <div style={{ display: 'flex', gap: '0' }}>
            {/* Day of week labels */}
            <div style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           `${gap}px`,
              marginRight:   '4px',
              paddingTop:    '1px',
            }}>
              {['', 'M', '', 'W', '', 'F', ''].map((label, i) => (
                <div key={i} style={{
                  height:     `${cellSize}px`,
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '9px',
                  color:      'var(--ink-30)',
                  lineHeight: `${cellSize}px`,
                  width:      '12px',
                  textAlign:  'right',
                  letterSpacing: '0.02em',
                }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div style={{ display: 'flex', gap: `${gap}px` }}>
              {grid.map((col, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
                  {col.map((cell, di) => (
                    <div
                      key={di}
                      title={cell.count > 0 ? `${cell.date}${cell.title ? ` — ${cell.title}` : ''}` : cell.date}
                      style={{
                        width:        `${cellSize}px`,
                        height:       `${cellSize}px`,
                        borderRadius: '2px',
                        background:   getColor(cell.count, cell.future),
                        border:       cell.future ? 'none' : `1px solid ${cell.count > 0 ? 'rgba(201,146,42,0.15)' : 'var(--border)'}`,
                        transition:   'transform 100ms, background 100ms',
                        cursor:       cell.count > 0 ? 'pointer' : 'default',
                        flexShrink:   0,
                      }}
                      onMouseEnter={e => { if (!cell.future) e.currentTarget.style.transform = 'scale(1.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display:     'flex',
            alignItems:  'center',
            gap:         'var(--space-2)',
            marginTop:   'var(--space-3)',
            paddingLeft: '24px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-30)' }}>Less</span>
            {[0, 1, 2, 3].map(level => (
              <div key={level} style={{
                width:        `${cellSize}px`,
                height:       `${cellSize}px`,
                borderRadius: '2px',
                background:   getColor(level, false),
                border:       '1px solid var(--border)',
              }} />
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-30)' }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}