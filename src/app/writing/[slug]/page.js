import { notFound }                   from 'next/navigation';
import { MDXRemote }                   from 'next-mdx-remote/rsc';
import Link                            from 'next/link';
import { getPostBySlug, getAllPosts }   from '@/lib/content';
import { formatDate, isoDate }         from '@/lib/dates';
import { ViewCounter }                 from '@/components/ui/ViewCounter';

export async function generateStaticParams() {
  return getAllPosts('writing').map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'writing');
  if (!post) return {};
  return {
    title:       post.title,
    description: post.description,
    openGraph: {
      title:         post.title,
      description:   post.description,
      type:          'article',
      publishedTime: post.date,
    },
  };
}

const TYPE_LABELS = {
  essay:    'Essay',
  tutorial: 'Tutorial',
  til:      'Today I Learned',
};

export default async function WritingPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'writing');
  if (!post) notFound();

  return (
    <article style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Back */}
      <Link href="/writing" style={{
        display:       'inline-flex', alignItems: 'center',
        gap:           'var(--space-2)',
        fontFamily:    'var(--font-mono)', fontSize: '12px',
        color:         'var(--ink-30)', textDecoration: 'none',
        marginBottom:  'var(--space-10)', letterSpacing: '0.06em',
        transition:    'color var(--duration-fast)',
      }}
        className="hover-ink"
      >
        ← Writing
      </Link>

      {/* Header */}
      <header style={{ marginBottom: 'var(--space-12)' }}>
        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap',
        }}>
          {post.type && (
            <span className="tag">{TYPE_LABELS[post.type] || post.type}</span>
          )}
          <time dateTime={isoDate(post.date)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '12px',
            color: 'var(--ink-30)', letterSpacing: '0.06em',
          }}>
            {formatDate(post.date)}
          </time>
          <span style={{ color: 'var(--ink-10)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>·</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '12px',
            color: 'var(--ink-30)', letterSpacing: '0.06em',
          }}>
            {post.readingTime} min read
          </span>
          <span style={{ color: 'var(--ink-10)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>·</span>
          <ViewCounter slug={post.slug} section="writing" />
        </div>

        {/* Title */}
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)', maxWidth: '640px' }}>
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p style={{
            fontSize: 'var(--text-lg)', color: 'var(--ink-50)',
            lineHeight: 1.6, maxWidth: '560px',
          }}>
            {post.description}
          </p>
        )}

        {/* Tags */}
        {(post.tags || []).length > 0 && (
          <div style={{
            display: 'flex', gap: 'var(--space-2)',
            flexWrap: 'wrap', marginTop: 'var(--space-6)',
          }}>
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Amber rule */}
        <div style={{
          height: '1px', marginTop: 'var(--space-10)',
          background: 'linear-gradient(to right, var(--amber), transparent)',
        }} />
      </header>

      {/* Content */}
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>

      {/* Footer */}
      <footer style={{
        marginTop:  'var(--space-20)',
        paddingTop: 'var(--space-8)',
        borderTop:  '1px solid var(--border)',
        display:    'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap:   'wrap',
        gap:        'var(--space-4)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px',
          color: 'var(--ink-30)', letterSpacing: '0.06em',
        }}>
          Written by James Uchechi · {formatDate(post.date)}
        </p>
        <a
          href={`mailto:okparajamesuchechi@gmail.com?subject=Re: ${post.title}`}
          className="amber-link"
        >
          Reply by email ↗
        </a>
      </footer>
    </article>
  );
}
