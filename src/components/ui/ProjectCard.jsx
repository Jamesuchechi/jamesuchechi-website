import Link from 'next/link';
import { TiltCard } from '@/components/ui/TiltCard';

const CATEGORY_LABELS = {
  web:   'Web',
  data:  'Data',
  oss:   'Open Source',
  other: 'Other',
};

export function ProjectCard({ project, featured = false }) {
  return (
    <TiltCard
      intensity={featured ? 5 : 9}
      scale={1.02}
      className={`project-card${featured ? ' project-card--featured' : ''}`}
    >
      {/* Top shimmer bar — animates in on hover via CSS */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, var(--amber), var(--amber-light), var(--amber))',
        backgroundSize: '200% auto',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform var(--duration-base) var(--ease-out)',
        animation: 'none',
      }} className="project-card__bar" />

      {/* Cover */}
      <div className="project-card__cover">
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="project-card__cover-placeholder">
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: '300',
              letterSpacing: '-0.02em',
              color: 'var(--amber)',
              opacity: 0.4,
            }}>
              {project.title[0]}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="project-card__body">
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span className="tag tag--amber">
            {CATEGORY_LABELS[project.category] || project.category}
          </span>
          {project.featured && <span className="tag">Featured</span>}
          {project.builtAt && (
            <time style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--ink-30)', letterSpacing: '0.04em', marginLeft: 'auto',
            }}>
              {new Date(project.builtAt).getFullYear()}
            </time>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:    featured ? 'var(--font-display)' : 'var(--font-body)',
          fontSize:      featured ? 'var(--text-2xl)'     : 'var(--text-lg)',
          fontWeight:    featured ? '400' : '500',
          lineHeight:    1.2,
          letterSpacing: featured ? '-0.02em' : '-0.01em',
          color:         'var(--ink)',
          marginBottom:  'var(--space-2)',
        }}>
          {project.title}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          marginBottom: 'var(--space-4)',
        }}>
          {project.summary}
        </p>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {project.techStack.slice(0, 5).map(tech => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="amber-link" onClick={e => e.stopPropagation()}>
              Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="amber-link" style={{ color: 'var(--ink-30)' }} onClick={e => e.stopPropagation()}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}