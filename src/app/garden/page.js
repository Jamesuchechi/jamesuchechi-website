import { getAllPosts } from '@/lib/content';
import { PostCard }    from '@/components/ui/PostCard';

export const metadata = {
  title:       'Garden',
  description: 'A digital garden of notes, ideas, and thinking-in-progress.',
};

const STAGE_META = {
  seedling:  { symbol: '🌱', label: 'Seedlings',  desc: 'Raw, early-stage ideas'    },
  budding:   { symbol: '🌿', label: 'Budding',    desc: 'Taking shape, getting real' },
  evergreen: { symbol: '🌳', label: 'Evergreen',  desc: 'Stable, settled thinking'  },
};

export default async function GardenPage() {
  const notes     = await getAllPosts('garden');
  const seedlings = notes.filter(n => n.stage === 'seedling');
  const budding   = notes.filter(n => n.stage === 'budding');
  const evergreen = notes.filter(n => n.stage === 'evergreen');

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>
          Digital garden
        </p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)', maxWidth: '640px' }}>
          Notes & ideas
        </h1>
        <p className="body" style={{ color: 'var(--ink-50)', maxWidth: '480px', marginBottom: 'var(--space-6)' }}>
          This is a garden, not a blog. Notes here are in various stages of
          completeness — some are raw thoughts, some are nearly essays.
          Everything is a work in progress.
        </p>

        {/* Stage legend */}
        <div style={{
          display:  'flex',
          gap:      'var(--space-4)',
          flexWrap: 'wrap',
        }}>
          {Object.entries(STAGE_META).map(([stage, meta]) => (
            <div key={stage} style={{
              display:    'flex',
              alignItems: 'center',
              gap:        'var(--space-2)',
              padding:    'var(--space-2) var(--space-3)',
              background: 'var(--surface-1)',
              border:     '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
            }}>
              <span style={{ fontSize: '13px' }}>{meta.symbol}</span>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                color:         'var(--ink-50)',
                letterSpacing: '0.06em',
              }}>
                {meta.label} — {meta.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="label" style={{ color: 'var(--ink-30)' }}>
          The garden is being planted. Check back soon.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {[
            { items: evergreen, stage: 'evergreen' },
            { items: budding,   stage: 'budding'   },
            { items: seedlings, stage: 'seedling'  },
          ]
            .filter(({ items }) => items.length > 0)
            .map(({ items, stage }) => (
              <section key={stage}>
                <div style={{
                  display:       'flex',
                  alignItems:    'baseline',
                  gap:           'var(--space-3)',
                  marginBottom:  'var(--space-6)',
                  paddingBottom: 'var(--space-4)',
                  borderBottom:  '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '18px' }}>{STAGE_META[stage].symbol}</span>
                  <h2 className="heading-2">{STAGE_META[stage].label}</h2>
                  <span className="label">{items.length}</span>
                </div>
                <div style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap:                 'var(--space-4)',
                }}>
                  {items.map(note => (
                    <PostCard key={note.slug} post={note} variant="garden" />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
