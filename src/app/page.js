import Link             from 'next/link';
import { getAllPosts }   from '@/lib/content';
import { PostCard }      from '@/components/ui/PostCard';
import { SpotifyWidget } from '@/components/ui/SpotifyWidget';
import nowData           from '@/content/now/now.json';

export const metadata = {
  title:       'James Uchechi — Software Engineer & Creator',
  description: 'Software engineer, data scientist, and occasional writer. Building at the intersection of code, data, and design.',
};

export default function HomePage() {
  const recentPosts  = getAllPosts('writing').slice(0, 3);
  const gardenNotes  = getAllPosts('garden').slice(0, 2);
  const featuredPost = recentPosts[0];
  const otherPosts   = recentPosts.slice(1);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        paddingTop:    'clamp(100px, 18vh, 180px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
        paddingLeft:   'var(--space-6)',
        paddingRight:  'var(--space-6)',
        maxWidth:      'var(--max-w-wide)',
        margin:        '0 auto',
        position:      'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '-10%',
          width: '60%', height: '100%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse at 20% 50%, var(--amber-subtle) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            gap: 'var(--space-2)', marginBottom: 'var(--space-8)',
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ink-50)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)', padding: '5px 14px',
            background: 'var(--surface-1)',
            animation: 'fade-up 600ms var(--ease-out) both',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#22c55e', flexShrink: 0,
            }} className="status-dot" />
            Available for work · {nowData.location}
          </div>

          {/* Headline */}
          <h1 className="display-1" style={{
            marginBottom: 'var(--space-8)', maxWidth: '900px',
            animation: 'fade-up 700ms var(--ease-out) 80ms both',
          }}>
            James<br />
            <span style={{ color: 'var(--ink-30)' }}>Uchechi</span>
            <span style={{ color: 'var(--amber)' }}>.</span>
          </h1>

          {/* Tagline */}
          <p className="body-lg" style={{
            maxWidth: '520px', color: 'var(--ink-50)',
            marginBottom: 'var(--space-10)',
            animation: 'fade-up 700ms var(--ease-out) 160ms both',
          }}>
            Software engineer and data scientist. I build web apps, data pipelines,
            and occasionally write about the process.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap',
            alignItems: 'center', marginBottom: 'var(--space-12)',
            animation: 'fade-up 700ms var(--ease-out) 240ms both',
          }}>
            <Link href="/writing" className="btn-primary">
              Read my writing ↗
            </Link>
            <Link href="/now" className="btn-ghost">
              What I'm doing now
            </Link>
          </div>

          {/* Spotify */}
          <div style={{ animation: 'fade-up 700ms var(--ease-out) 320ms both' }}>
            <SpotifyWidget />
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <div className="divider" />
      </div>

      {/* ── WRITING ──────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section style={{
          maxWidth: 'var(--max-w-wide)', margin: '0 auto',
          padding: 'var(--space-20) var(--space-6)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 'var(--space-10)',
          }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Recent writing</p>
              <h2 className="heading-1">From the desk</h2>
            </div>
            <Link href="/writing" className="nav-link">All posts →</Link>
          </div>

          {featuredPost && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <PostCard post={featuredPost} variant="writing" featured />
            </div>
          )}

          {otherPosts.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-4)',
            }}>
              {otherPosts.map(post => (
                <PostCard key={post.slug} post={post} variant="writing" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── NOW STRIP ────────────────────────────────────── */}
      <section style={{
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-12) var(--space-6)',
      }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-10)',
          }}>
            {/* Building */}
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Currently building</p>
              {nowData.building.slice(0, 2).map((item, i) => (
                <div key={i} style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: 'var(--space-1)' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>
              ))}
              <Link href="/now" className="amber-link">See full now page →</Link>
            </div>

            {/* Learning */}
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Currently learning</p>
              {nowData.learning.slice(0, 3).map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start',
                  gap: 'var(--space-2)', marginBottom: 'var(--space-3)',
                }}>
                  <span style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-80)', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* Reading */}
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Currently reading</p>
              {nowData.reading.map((book, i) => (
                <div key={i} style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>
                    {book.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--ink-30)', marginBottom: '4px', letterSpacing: '0.04em',
                  }}>
                    {book.author}
                  </p>
                  {book.note && (
                    <p style={{ fontSize: '12px', color: 'var(--ink-50)', fontStyle: 'italic' }}>
                      "{book.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GARDEN PREVIEW ───────────────────────────────── */}
      {gardenNotes.length > 0 && (
        <section style={{
          maxWidth: 'var(--max-w-wide)', margin: '0 auto',
          padding: 'var(--space-20) var(--space-6)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 'var(--space-10)',
          }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Digital garden</p>
              <h2 className="heading-1">Notes in progress</h2>
            </div>
            <Link href="/garden" className="nav-link">Explore garden →</Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {gardenNotes.map(note => (
              <PostCard key={note.slug} post={note} variant="garden" />
            ))}
          </div>
        </section>
      )}

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--space-20) var(--space-6)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 className="display-3" style={{ marginBottom: 'var(--space-4)' }}>
            Let's talk
          </h2>
          <p style={{
            color: 'var(--ink-50)', fontSize: 'var(--text-base)',
            marginBottom: 'var(--space-8)', lineHeight: 1.7,
          }}>
            Open to interesting projects, collaborations, or just a good conversation
            about code, data, or ideas.
          </p>
          <a
            href="mailto:okparajamesuchechi@gmail.com"
            className="amber-link"
            style={{ fontSize: '13px' }}
          >
            okparajamesuchechi@gmail.com ↗
          </a>
        </div>
      </section>

      <style>{`
        .status-dot {
          box-shadow: 0 0 6px rgba(34,197,94,0.5);
          animation: status-pulse 2s ease-in-out infinite;
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
          50%       { opacity: 0.7; box-shadow: 0 0 12px rgba(34,197,94,0.8); }
        }
      `}</style>
    </>
  );
}
