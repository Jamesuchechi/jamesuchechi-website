'use client';
import { useState } from 'react';

/**
 * ExpandableUsesItem — click to reveal a mini case study.
 * Drop into the uses page in place of the simple row.
 */
export function ExpandableUsesItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="uses-row"
      style={{ cursor: 'pointer', alignItems: 'start' }}
      onClick={() => setOpen(v => !v)}
    >
      {/* Name column */}
      <div style={{ paddingTop: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontSize:        'var(--text-sm)',
                fontWeight:      '500',
                color:           'var(--ink)',
                textDecoration:  'underline',
                textDecorationColor: 'var(--border)',
                textUnderlineOffset: '3px',
                transition:      'color var(--duration-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}
            >
              {item.name}
            </a>
          ) : (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)' }}>
              {item.name}
            </span>
          )}

          {item.featured && (
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              letterSpacing: '0.1em',
              color:         'var(--amber)',
              border:        '1px solid rgba(201,146,42,0.3)',
              borderRadius:  'var(--radius-full)',
              padding:       '1px 6px',
            }}>
              fav
            </span>
          )}
        </div>
      </div>

      {/* Description + expanded content */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6, flex: 1 }}>
            {item.description}
          </p>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            color:         'var(--ink-30)',
            flexShrink:    0,
            marginTop:     '3px',
            transition:    'transform 200ms var(--ease-out)',
            transform:     open ? 'rotate(45deg)' : 'rotate(0deg)',
            display:       'inline-block',
          }}>
            +
          </span>
        </div>

        {/* Expanded panel */}
        <div style={{
          maxHeight:  open ? '400px' : '0',
          overflow:   'hidden',
          transition: 'max-height 400ms var(--ease-out)',
        }}>
          <div style={{
            marginTop:    'var(--space-4)',
            padding:      'var(--space-4) var(--space-5)',
            background:   'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            borderLeft:   '2px solid var(--amber)',
          }}>
            {/* Hardcoded case study notes — you can extend item model with these */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <CaseRow label="Why" value={item.why || 'No notes yet — still forming an opinion.'} />
              {item.alternatives && <CaseRow label="Alternatives tried" value={item.alternatives} />}
              {item.verdict && <CaseRow label="Verdict" value={item.verdict} accent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseRow({ label, value, accent = false }) {
  return (
    <div>
      <p style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color:         accent ? 'var(--amber)' : 'var(--ink-30)',
        marginBottom:  'var(--space-1)',
      }}>
        {label}
      </p>
      <p style={{
        fontSize:   'var(--text-sm)',
        color:      accent ? 'var(--ink)' : 'var(--ink-50)',
        lineHeight: 1.6,
        fontWeight: accent ? '500' : '400',
      }}>
        {value}
      </p>
    </div>
  );
}