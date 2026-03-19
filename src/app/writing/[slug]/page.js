import { notFound }                   from 'next/navigation';
import { MDXRemote }                   from 'next-mdx-remote/rsc';
import Link                            from 'next/link';
import { getPostBySlug, getAllPosts }   from '@/lib/content';
import { formatDate, isoDate }         from '@/lib/dates';
import { ViewCounter }                 from '@/components/ui/ViewCounter';
import { ReadingProgress }             from '@/components/ui/ReadingProgress';
import { PostReactions }               from '@/components/ui/PostReactions';
import { RelatedPosts }                from '@/components/ui/RelatedPosts';
import { DigestSignup }                from '@/components/ui/DigestSignup';

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

const TYPE_LABELS = { essay: 'Essay', tutorial: 'Tutorial', til: 'Today I Learned' };
const TYPE_COLORS = { essay: 'var(--amber)', tutorial: '#60a5fa', til: '#34d399' };

export default async function WritingPostPage({ params }) {
  const { slug }    = await params;
  const post        = getPostBySlug(slug, 'writing');
  if (!post) notFound();

  const allPosts    = getAllPosts('writing');
  const typeColor   = TYPE_COLORS[post.type] || 'var(--amber)';

  return (
    <>
      <ReadingProgress />

      <article style={{
        maxWidth: 'var(--max-w-text)',
        margin:   '0 auto',
        padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
      }}>
        {/* Back */}
        <Link href="/writing" style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--ink-30)', textDecoration: 'none',
          marginBottom: 'var(--space-10)', letterSpacing: '0.06em',
          transition: 'color var(--duration-fast)',
          animation: 'fade-up 400ms var(--ease-out) both',
        }}>
          ← Writing
        </Link>

        {/* Header */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)', flexWrap: 'wrap',
            animation: 'fade-up 500ms var(--ease-out) 60ms both',
          }}>
            {post.type && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: typeColor, background: `${typeColor}15`,
                border: `1px solid ${typeColor}30`,
                borderRadius: 'var(--radius-full)', padding: '3px 12px',
              }}>
                {TYPE_LABELS[post.type] || post.type}
              </span>
            )}
            <time dateTime={isoDate(post.date)} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
              {formatDate(post.date)}
            </time>
            <span style={{ color: 'var(--ink-10)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
              {post.readingTime} min read
            </span>
            <span style={{ color: 'var(--ink-10)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>·</span>
            <ViewCounter slug={post.slug} section="writing" />
          </div>

          <h1 className="display-2" style={{ marginBottom: 'var(--space-6)', maxWidth: '640px', animation: 'fade-up 600ms var(--ease-out) 100ms both' }}>
            {post.title}
          </h1>

          {post.description && (
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-50)', lineHeight: 1.6, maxWidth: '560px', animation: 'fade-up 600ms var(--ease-out) 160ms both' }}>
              {post.description}
            </p>
          )}

          {(post.tags || []).length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-6)', animation: 'fade-up 600ms var(--ease-out) 200ms both' }}>
              {post.tags.map((tag, i) => (
                <span key={tag} className="tag" style={{ animation: `fade-up 400ms var(--ease-out) ${220 + i * 30}ms both` }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ height: '1px', marginTop: 'var(--space-10)', background: `linear-gradient(to right, ${typeColor}, transparent)`, animation: 'fade-up 600ms var(--ease-out) 250ms both' }} />
        </header>

        {/* Content */}
        <div className="prose" style={{ animation: 'fade-up 700ms var(--ease-out) 300ms both' }}>
          <MDXRemote source={post.content} />
        </div>

        {/* Reactions */}
        <PostReactions slug={post.slug} />

        {/* Related posts */}
        <RelatedPosts
          currentSlug={post.slug}
          tags={post.tags || []}
          allPosts={allPosts}
          limit={3}
        />

        {/* Digest signup */}
        <div style={{ marginTop: 'var(--space-16)' }}>
          <DigestSignup variant="card" />
        </div>

        {/* Footer */}
        <footer style={{
          marginTop:  'var(--space-16)',
          paddingTop: 'var(--space-8)',
          borderTop:  '1px solid var(--border)',
          display:    'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap:   'wrap',
          gap:        'var(--space-4)',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
            Written by James Uchechi · {formatDate(post.date)}
          </p>
          <a href={`mailto:okparajamesuchechi@gmail.com?subject=Re: ${post.title}`} className="amber-link">
            Reply by email ↗
          </a>
        </footer>
      </article>
    </>
  );
}