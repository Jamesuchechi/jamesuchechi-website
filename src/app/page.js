import Link             from 'next/link';
import { getAllPosts }   from '@/lib/content';
import { PostCard }      from '@/components/ui/PostCard';
import { SpotifyWidget } from '@/components/ui/SpotifyWidget';
import { StatsSection }  from '@/components/ui/StatsSection';
import { TypingAnimation } from '@/components/ui/TypingAnimation';
import { AmbientSound }    from '@/components/ui/AmbientSound';
import nowData           from '@/content/now/now.json';

export const metadata = {
  title:       'James Uchechi — Software Engineer & Creator',
  description: 'Software engineer, data scientist, and occasional writer. Building at the intersection of code, data, and design.',
};

const MARQUEE_ITEMS = [
  'Next.js', '✦', 'Python', '✦', 'PostgreSQL', '✦', 'Data Engineering',
  '✦', 'Framer Motion', '✦', 'Prisma', '✦', 'TypeScript', '✦', 'React',
  '✦', 'Machine Learning', '✦', 'API Design', '✦', 'Systems Thinking', '✦',
];

export default function HomePage() {
  const allPosts    = getAllPosts('writing');
  const gardenNotes = getAllPosts('garden');
  const recentPosts = allPosts.slice(0, 3);
  const featuredPost = recentPosts[0];
  const otherPosts   = recentPosts.slice(1);

  const STATS = [
    { value: allPosts.length,    label: 'Articles written',  sublabel: 'Essays, tutorials & TILs', suffix: '+' },
    { value: gardenNotes.length, label: 'Garden notes',      sublabel: 'Ideas in various stages' },
    { value: allPosts.reduce((acc, p) => acc + (p.readingTime || 0), 0), label: 'Minutes of content', sublabel: 'Across all posts', suffix: ' min' },
    { value: new Date().getFullYear() - 2019, label: 'Years building', sublabel: 'Since first commit', suffix: '+' },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        paddingTop:    'clamp(120px, 20vh, 200px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        paddingLeft:   'var(--space-6)',
        paddingRight:  'var(--space-6)',
        maxWidth:      'var(--max-w-wide)',
        margin:        '0 auto',
        position:      'relative',
        zIndex:        1,
      }}>
        {/* Ambient glow blobs */}
        <div aria-hidden style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: '55%', height: '70%',
          background: 'radial-gradient(ellipse at 30% 40%, var(--amber-subtle) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '40%', right: '-5%',
          width: '40%', height: '60%',
          background: 'radial-gradient(ellipse at 70% 60%, rgba(201,146,42,0.04) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top row: status pill + ambient sound */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            marginBottom: 'var(--space-10)', flexWrap: 'wrap',
            animation: 'fade-up 600ms var(--ease-out) both',
          }}>
            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink-50)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)', padding: '5px 14px',
              background: 'var(--surface-1)',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#22c55e', flexShrink: 0,
              }} className="status-dot" />
              Available for work ·{' '}
              <span style={{ color: 'var(--amber)' }}>{nowData.location}</span>
            </div>

            {/* Ambient sound toggle */}
            <AmbientSound />
          </div>

          {/* Headline */}
          <h1 className="display-1" style={{
            marginBottom: 'var(--space-4)', maxWidth: '1000px',
            animation: 'fade-up 800ms var(--ease-out) 100ms both',
          }}>
            <span style={{ display: 'block' }}>James</span>
            <span style={{ display: 'block', color: 'var(--ink-30)', position: 'relative' }}>
              Uchechi
              <span aria-hidden style={{
                position: 'absolute', bottom: '4px', left: 0,
                width: '100%', height: '2px',
                background: 'linear-gradient(to right, var(--amber) 0%, var(--amber-light) 40%, transparent 100%)',
                opacity: 0.5,
              }} />
            </span>
            <span style={{ color: 'var(--amber)' }}>.</span>
          </h1>

          {/* Typing animation — role cycle */}
          <div style={{
            marginBottom: 'var(--space-6)',
            animation: 'fade-up 700ms var(--ease-out) 160ms both',
          }}>
            <TypingAnimation />
          </div>

          {/* Tagline */}
          <p className="body-lg" style={{
            maxWidth: '500px', color: 'var(--ink-50)',
            marginBottom: 'var(--space-10)',
            animation: 'fade-up 800ms var(--ease-out) 220ms both', lineHeight: 1.7,
          }}>
            I build web apps, data pipelines, and occasionally write about
            the process.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap',
            alignItems: 'center', marginBottom: 'var(--space-12)',
            animation: 'fade-up 800ms var(--ease-out) 300ms both',
          }}>
            <Link href="/writing"  className="btn-primary">Read my writing ↗</Link>
            <Link href="/projects" className="btn-ghost">View projects</Link>
            <Link href="/now"      className="btn-ghost">What I&apos;m doing now</Link>
          </div>

          {/* Spotify */}
          <div style={{ animation: 'fade-up 800ms var(--ease-out) 400ms both' }}>
            <SpotifyWidget />
          </div>
        </div>

        {/* Vertical year label — desktop only */}
        <div className="hero-number" aria-hidden>
          {new Date().getFullYear()} · Software Engineer
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <div className="marquee-wrap" aria-hidden>
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: item === '✦' ? 'var(--amber)' : 'var(--ink-30)',
              marginRight: 'var(--space-6)',
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <StatsSection stats={STATS} title="By the numbers" />
      </div>

      {/* ── WRITING ──────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section style={{
          maxWidth: 'var(--max-w-wide)', margin: '0 auto',
          padding: 'var(--space-24) var(--space-6)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-10)' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {otherPosts.map(post => <PostCard key={post.slug} post={post} variant="writing" />)}
            </div>
          )}
        </section>
      )}

      {/* ── NOW STRIP ────────────────────────────────── */}
      <section style={{
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: '-80px', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, var(--amber-subtle), transparent 70%)',
          pointerEvents: 'none', filter: 'blur(30px)',
        }} />
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Currently</p>
              <h2 className="heading-1">What I&apos;m up to</h2>
            </div>
            <Link href="/now" className="nav-link">Full now page →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-10)' }}>
            {/* Building */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} className="status-dot" />
                <p className="caption">Building</p>
              </div>
              {nowData.building.slice(0, 2).map((item, i) => (
                <div key={i} style={{ marginBottom: 'var(--space-5)', paddingLeft: 'var(--space-3)', borderLeft: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
            {/* Learning */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <span style={{ color: 'var(--amber)' }}>⬡</span>
                <p className="caption">Learning</p>
              </div>
              {nowData.learning.slice(0, 3).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0, fontSize: '10px' }}>→</span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-80)', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
            {/* Reading */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <span style={{ color: 'var(--amber)' }}>◎</span>
                <p className="caption">Reading</p>
              </div>
              {nowData.reading.map((book, i) => (
                <div key={i} style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{book.title}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', marginBottom: book.note ? '6px' : 0 }}>{book.author}</p>
                  {book.note && <p style={{ fontSize: '12px', color: 'var(--ink-50)', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{book.note}&rdquo;</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GARDEN ───────────────────────────────────── */}
      {gardenNotes.length > 0 && (
        <section style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: 'var(--space-24) var(--space-6)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-10)' }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Digital garden</p>
              <h2 className="heading-1">Notes in progress</h2>
            </div>
            <Link href="/garden" className="nav-link">Explore garden →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {gardenNotes.slice(0, 4).map(note => <PostCard key={note.slug} post={note} variant="garden" />)}
          </div>
        </section>
      )}

      {/* ── CONTACT ──────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-24) var(--space-6)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          background: 'radial-gradient(ellipse, var(--amber-subtle) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)',
        }} />
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)', marginBottom: 'var(--space-6)' }} className="status-dot" />
          <h2 className="display-3" style={{ marginBottom: 'var(--space-4)' }}>Let&apos;s talk</h2>
          <p style={{ color: 'var(--ink-50)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
            Open to interesting projects, collaborations, or just a good conversation about code, data, or ideas.
          </p>
          <a href="mailto:okparajamesuchechi@gmail.com" className="amber-link" style={{ fontSize: '13px' }}>
            okparajamesuchechi@gmail.com ↗
          </a>
        </div>
      </section>
    </>
  );
}