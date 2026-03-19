import Link    from 'next/link';
import { timeAgo } from '@/lib/dates';

/**
 * RelatedPosts — server component.
 * Finds posts that share tags with the current post.
 *
 * Props:
 *   currentSlug - exclude this post
 *   tags        - array of tag strings from current post
 *   allPosts    - pre-fetched from getAllPosts('writing')
 *   limit       - max posts to show (default 3)
 */
export function RelatedPosts({ currentSlug, tags = [], allPosts = [], limit = 3 }) {
  if (!tags.length || !allPosts.length) return null;

  // Score posts by tag overlap
  const scored = allPosts
    .filter(p => p.slug !== currentSlug && !p.draft)
    .map(p => ({
      post:  p,
      score: (p.tags || []).filter(t => tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);

  if (!scored.length) return null;

  return (
    <section style={{
      marginTop:   'var(--space-20)',
      paddingTop:  'var(--space-10)',
      borderTop:   '1px solid var(--border)',
    }}>
      <div style={{
        display:      'flex',
        alignItems:   'baseline',
        gap:          'var(--space-3)',
        marginBottom: 'var(--space-8)',
      }}>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         'var(--ink-30)',
        }}>
          Related
        </p>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {scored.map((post, i) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            style={{
              display:      'flex',
              alignItems:   'baseline',
              justifyContent: 'space-between',
              gap:          'var(--space-4)',
              padding:      'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color:        'inherit',
              border:       '1px solid transparent',
              transition:   'all var(--duration-fast)',
              animation:    `fade-up 400ms var(--ease-out) ${i * 60}ms both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background    = 'var(--surface-1)';
              e.currentTarget.style.borderColor   = 'var(--border)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background    = 'transparent';
              e.currentTarget.style.borderColor   = 'transparent';
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize:     'var(--text-sm)',
                fontWeight:   '500',
                color:        'var(--ink)',
                marginBottom: '3px',
                whiteSpace:   'nowrap',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
              }}>
                {post.title}
              </p>
              {/* Shared tags */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {(post.tags || [])
                  .filter(t => tags.includes(t))
                  .slice(0, 3)
                  .map(tag => (
                    <span key={tag} style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '10px',
                      color:         'var(--amber)',
                      letterSpacing: '0.04em',
                    }}>
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>

            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {post.readingTime && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
                  {post.readingTime}m
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
                {timeAgo(post.date)}
              </span>
              <span style={{ color: 'var(--ink-30)', fontSize: '12px' }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}