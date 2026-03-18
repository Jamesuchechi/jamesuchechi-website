import Link from 'next/link';
import { timeAgo } from '@/lib/dates';

const STAGE_CONFIG = {
  seedling:  { symbol: '🌱', label: 'Seedling'  },
  budding:   { symbol: '🌿', label: 'Budding'   },
  evergreen: { symbol: '🌳', label: 'Evergreen' },
};

const TYPE_CONFIG = {
  essay:    'Essay',
  tutorial: 'Tutorial',
  til:      'TIL',
};

export function PostCard({ post, variant = 'writing', featured = false }) {
  const href     = `/${variant}/${post.slug}`;
  const isGarden = variant === 'garden';
  const stage    = isGarden && post.stage ? STAGE_CONFIG[post.stage] : null;
  const typeLabel = !isGarden && post.type ? TYPE_CONFIG[post.type] : null;

  return (
    <Link
      href={href}
      className={`post-card${featured ? ' post-card--featured' : ''}`}
    >
      {featured && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px', background: 'var(--amber)',
        }} />
      )}

      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap',
      }}>
        {stage && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--amber)', background: 'var(--amber-subtle)',
            border: '1px solid rgba(201,146,42,0.2)',
            borderRadius: 'var(--radius-full)', padding: '2px 8px',
          }}>
            {stage.symbol} {stage.label}
          </span>
        )}
        {typeLabel && <span className="tag">{typeLabel}</span>}
        <time dateTime={post.date} style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--ink-30)', letterSpacing: '0.06em', marginLeft: 'auto',
        }}>
          {timeAgo(post.date)}
        </time>
      </div>

      <h3 style={{
        fontFamily:    featured ? 'var(--font-display)' : 'var(--font-body)',
        fontSize:      featured ? 'var(--text-2xl)'     : 'var(--text-lg)',
        fontWeight:    featured ? '400'                 : '500',
        lineHeight: 1.2, letterSpacing: featured ? '-0.02em' : '-0.01em',
        color: 'var(--ink)', marginBottom: 'var(--space-2)',
      }}>
        {post.title}
      </h3>

      {post.description && (
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.description}
        </p>
      )}

      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap',
      }}>
        {(post.tags || []).slice(0, 3).map(tag => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
        {post.readingTime && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--ink-30)', marginLeft: 'auto', letterSpacing: '0.04em',
          }}>
            {post.readingTime} min
          </span>
        )}
      </div>
    </Link>
  );
}
