import { getAllPosts, getAllTags } from '@/lib/content';
import { PostCard }               from '@/components/ui/PostCard';

export const metadata = {
  title:       'Writing',
  description: 'Essays, tutorials, and short notes on engineering, data, and the craft of building things.',
};

export default function WritingPage() {
  const posts = getAllPosts('writing');
  const tags  = getAllTags('writing');

  const essays    = posts.filter(p => p.type === 'essay');
  const tutorials = posts.filter(p => p.type === 'tutorial');
  const tils      = posts.filter(p => p.type === 'til');

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>
          Writing
        </p>
        <h1
          className="display-2"
          style={{ marginBottom: 'var(--space-6)', maxWidth: '640px' }}
        >
          From the desk
        </h1>
        <p className="body" style={{ color: 'var(--ink-50)', maxWidth: '480px' }}>
          Essays, tutorials, and short notes. No newsletter, no algorithm —
          just writing when I have something worth saying.
        </p>
      </div>

      {/* All posts together if few, or by type */}
      {posts.length === 0 ? (
        <p className="label" style={{ color: 'var(--ink-30)' }}>No posts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>

          {/* Essays */}
          {essays.length > 0 && (
            <section>
              <div style={{
                display:       'flex',
                alignItems:    'baseline',
                gap:           'var(--space-3)',
                marginBottom:  'var(--space-6)',
                paddingBottom: 'var(--space-4)',
                borderBottom:  '1px solid var(--border)',
              }}>
                <h2 className="heading-2">Essays</h2>
                <span className="label">{essays.length}</span>
              </div>
              <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap:                 'var(--space-4)',
              }}>
                {essays.map((post, i) => (
                  <PostCard key={post.slug} post={post} variant="writing" featured={i === 0} />
                ))}
              </div>
            </section>
          )}

          {/* Tutorials */}
          {tutorials.length > 0 && (
            <section>
              <div style={{
                display:       'flex',
                alignItems:    'baseline',
                gap:           'var(--space-3)',
                marginBottom:  'var(--space-6)',
                paddingBottom: 'var(--space-4)',
                borderBottom:  '1px solid var(--border)',
              }}>
                <h2 className="heading-2">Tutorials</h2>
                <span className="label">{tutorials.length}</span>
              </div>
              <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap:                 'var(--space-4)',
              }}>
                {tutorials.map(post => (
                  <PostCard key={post.slug} post={post} variant="writing" />
                ))}
              </div>
            </section>
          )}

          {/* TILs */}
          {tils.length > 0 && (
            <section>
              <div style={{
                display:       'flex',
                alignItems:    'baseline',
                gap:           'var(--space-3)',
                marginBottom:  'var(--space-6)',
                paddingBottom: 'var(--space-4)',
                borderBottom:  '1px solid var(--border)',
              }}>
                <h2 className="heading-2">Today I learned</h2>
                <span className="label">{tils.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tils.map(post => (
                  <PostCard key={post.slug} post={post} variant="writing" />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
