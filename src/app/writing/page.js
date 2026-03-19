import { getAllPosts }           from '@/lib/content';
export const dynamic = 'force-dynamic';
import { PostCard }               from '@/components/ui/PostCard';
import { WritingHeatmap }         from '@/components/ui/WritingHeatmap';

export const metadata = {
  title:       'Writing',
  description: 'Essays, tutorials, and short notes on engineering, data, and the craft of building things.',
};

export default async function WritingPage() {
  const posts   = await getAllPosts('writing');

  const essays    = posts.filter(p => p.type === 'essay');
  const tutorials = posts.filter(p => p.type === 'tutorial');
  const tils      = posts.filter(p => p.type === 'til');

  // Minimal data for heatmap (no content body needed)
  const heatmapData = posts.map(p => ({ date: p.date, title: p.title, slug: p.slug }));

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Writing</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)', maxWidth: '640px' }}>
          From the desk
        </h1>
        <p className="body" style={{ color: 'var(--ink-50)', maxWidth: '480px' }}>
          Essays, tutorials, and short notes. No newsletter, no algorithm —
          just writing when I have something worth saying.
        </p>
      </div>

      {/* Heatmap */}
      {posts.length > 0 && (
        <div style={{
          marginBottom: 'var(--space-16)',
          padding:      'var(--space-6)',
          background:   'var(--surface-1)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <WritingHeatmap posts={heatmapData} weeks={52} />
        </div>
      )}

      {/* Posts grouped by type */}
      {posts.length === 0 ? (
        <p className="label" style={{ color: 'var(--ink-30)' }}>No posts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {essays.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                <h2 className="heading-2">Essays</h2>
                <span className="label">{essays.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
                {essays.map((post, i) => <PostCard key={post.slug} post={post} variant="writing" featured={i === 0} />)}
              </div>
            </section>
          )}

          {tutorials.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                <h2 className="heading-2">Tutorials</h2>
                <span className="label">{tutorials.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
                {tutorials.map(post => <PostCard key={post.slug} post={post} variant="writing" />)}
              </div>
            </section>
          )}

          {tils.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                <h2 className="heading-2">Today I learned</h2>
                <span className="label">{tils.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tils.map(post => <PostCard key={post.slug} post={post} variant="writing" />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}