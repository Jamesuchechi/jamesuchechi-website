import { notFound }                  from 'next/navigation';
import { MDXRemote }                   from 'next-mdx-remote/rsc';
import Link                            from 'next/link';
import { getPostBySlug, getAllPosts }   from '@/lib/content';
import { formatDate, isoDate }         from '@/lib/dates';

export async function generateStaticParams() {
  return getAllPosts('garden').map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'garden');
  if (!post) return {};
  return {
    title:       post.title,
    description: post.description,
  };
}

const STAGE_CONFIG = {
  seedling:  { symbol: '🌱', label: 'Seedling',  note: 'Raw, early-stage thinking. Probably incomplete.'   },
  budding:   { symbol: '🌿', label: 'Budding',   note: 'Taking shape. Still actively developing.'          },
  evergreen: { symbol: '🌳', label: 'Evergreen', note: 'Stable thinking. Unlikely to change significantly.' },
};

export default async function GardenPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'garden');
  if (!post) notFound();

  const stage = post.stage ? STAGE_CONFIG[post.stage] : null;

  return (
    <article style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Back link */}
      <Link
        href="/garden"
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           'var(--space-2)',
          fontFamily:    'var(--font-mono)',
          fontSize:      '12px',
          color:         'var(--ink-30)',
          textDecoration: 'none',
          marginBottom:  'var(--space-10)',
          letterSpacing: '0.06em',
        }}
      >
        ← Garden
      </Link>

      {/* Stage banner */}
      {stage && (
        <div style={{
          display:       'flex',
          alignItems:    'flex-start',
          gap:           'var(--space-3)',
          padding:       'var(--space-4) var(--space-5)',
          background:    'var(--amber-subtle)',
          border:        '1px solid rgba(201,146,42,0.2)',
          borderRadius:  'var(--radius-lg)',
          marginBottom:  'var(--space-8)',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{stage.symbol}</span>
          <div>
            <p style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              color:         'var(--amber)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom:  '4px',
            }}>
              {stage.label}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.5 }}>
              {stage.note}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ marginBottom: 'var(--space-12)' }}>
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <time
            dateTime={isoDate(post.date)}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '12px',
              color:         'var(--ink-30)',
              letterSpacing: '0.06em',
            }}
          >
            {formatDate(post.date)}
          </time>
          <span style={{ color: 'var(--ink-10)' }}>·</span>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '12px',
            color:         'var(--ink-30)',
            letterSpacing: '0.06em',
          }}>
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="display-2" style={{ marginBottom: 'var(--space-4)', maxWidth: '620px' }}>
          {post.title}
        </h1>

        {post.description && (
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-50)', lineHeight: 1.6 }}>
            {post.description}
          </p>
        )}

        {(post.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
            {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
          </div>
        )}

        <div style={{
          height:     '1px',
          background: `linear-gradient(to right, var(--amber), transparent)`,
          marginTop:  'var(--space-10)',
        }} />
      </header>

      {/* Content */}
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
