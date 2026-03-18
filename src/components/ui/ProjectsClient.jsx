'use client';
import { useState, useTransition } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';

const CATEGORIES = [
  { key: 'all',   label: 'All'         },
  { key: 'web',   label: 'Web'         },
  { key: 'data',  label: 'Data / ML'   },
  { key: 'oss',   label: 'Open Source' },
  { key: 'other', label: 'Other'       },
];

export function ProjectsClient({ initialProjects }) {
  const [active,    setActive]    = useState('all');
  const [, startTransition]       = useTransition();

  const filtered = active === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.category === active);

  const featured = filtered.filter(p => p.featured);
  const rest     = filtered.filter(p => !p.featured);

  return (
    <>
      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 'var(--space-2)',
        flexWrap: 'wrap', marginBottom: 'var(--space-12)',
      }}>
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => startTransition(() => setActive(key))}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding:       '6px 16px',
              borderRadius:  'var(--radius-full)',
              border:        '1px solid',
              borderColor:   active === key ? 'var(--amber)' : 'var(--border)',
              background:    active === key ? 'var(--amber-subtle)' : 'var(--surface-1)',
              color:         active === key ? 'var(--amber)' : 'var(--ink-50)',
              cursor:        'pointer',
              transition:    'all var(--duration-fast)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-24) 0' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-30)' }}>
            No projects in this category yet.
          </p>
        </div>
      )}

      {/* Featured (full-width) */}
      {featured.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          {featured.map(p => (
            <div key={p.id} style={{ marginBottom: 'var(--space-6)' }}>
              <ProjectCard project={p} featured />
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <div className="projects-grid">
          {rest.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </>
  );
}
