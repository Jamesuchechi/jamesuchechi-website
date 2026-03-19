import Link from 'next/link';

export const metadata = {
  title:       'Colophon',
  description: 'How this site is built — every tool, decision, and tradeoff documented.',
};

const STACK = [
  {
    category: 'Framework',
    items: [
      { name: 'Next.js 15', note: 'App Router, RSC, server actions. The full thing.', url: 'https://nextjs.org' },
      { name: 'React 19', note: 'Server components let the data layer live where it belongs.', url: 'https://react.dev' },
    ],
  },
  {
    category: 'Styling',
    items: [
      { name: 'Vanilla CSS', note: 'No Tailwind. Raw CSS custom properties for everything. Total control.', url: null },
      { name: 'Cormorant Garamond', note: 'Display typeface. Editorial and warm without being precious.', url: 'https://fonts.google.com/specimen/Cormorant' },
      { name: 'JetBrains Mono', note: 'Mono accent. Labels, captions, code. Distinctive without shouting.', url: 'https://www.jetbrains.com/lp/mono/' },
      { name: 'Geist', note: 'Body text. Clean and legible across sizes.', url: 'https://vercel.com/font' },
    ],
  },
  {
    category: 'Data',
    items: [
      { name: 'PostgreSQL', note: 'Hosted on Supabase. Reliable, powerful, mature.', url: 'https://supabase.com' },
      { name: 'Prisma', note: "ORM. Schema-first, great DX, doesn't get in the way.", url: 'https://prisma.io' },
      { name: 'MDX', note: 'Writing and garden notes. Local files, no CMS needed.', url: 'https://mdxjs.com' },
      { name: 'gray-matter', note: 'Frontmatter parsing for MDX files.', url: 'https://github.com/jonschlinkert/gray-matter' },
    ],
  },
  {
    category: 'Animation',
    items: [
      { name: 'Framer Motion', note: 'For complex spring physics. Used sparingly.', url: 'https://www.framer.com/motion/' },
      { name: 'CSS animations', note: 'Fade-ups, scroll reveals, keyframes. Most motion is CSS-only.', url: null },
      { name: 'requestAnimationFrame', note: 'Custom tilt cards, cursor glow, canvas background. All hand-rolled.', url: null },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'Vercel', note: 'Deployment. Zero config, instant previews, edge network.', url: 'https://vercel.com' },
      { name: 'Cloudinary', note: 'Image and video storage for the gallery.', url: 'https://cloudinary.com' },
      { name: 'Nodemailer', note: 'Contact form emails. Simple, direct, no third-party service.', url: null },
    ],
  },
  {
    category: 'Dev tools',
    items: [
      { name: 'Neovim', note: 'Primary editor. LazyVim config.', url: null },
      { name: 'VS Code', note: 'For large projects and pair programming.', url: null },
      { name: 'Fish shell', note: 'Autosuggestions out of the box.', url: null },
      { name: 'TablePlus', note: 'Database GUI. Fast and clean.', url: null },
    ],
  },
];

const DECISIONS = [
  {
    decision: 'No Tailwind',
    reason: 'Tailwind trades CSS knowledge for speed. For a personal site where every pixel matters, raw CSS variables give better control and a more cohesive result. The design system lives in one file.',
  },
  {
    decision: 'No CMS',
    reason: 'MDX files in the repo. Writing is code — version controlled, portable, no vendor lock-in. Frontmatter handles metadata. Works until the content volume makes it painful.',
  },
  {
    decision: 'No analytics service',
    reason: 'Simple page view counts in Postgres. No third-party scripts, no data leaving the server, no cookie banners. The numbers I care about are already in the DB.',
  },
  {
    decision: 'Custom cursor',
    reason: 'A small thing that signals intentionality. Auto-disabled on touch devices so it never interferes. The amber ring expanding on links is a subtle interaction affordance.',
  },
  {
    decision: 'Server components first',
    reason: "Data fetching happens on the server. Client components are opt-in ('use client'). This keeps bundle size small and database calls close to the source.",
  },
  {
    decision: 'No comment system',
    reason: 'Reply by email. Slower, but the conversations are better. Email creates a real context, not a reaction.',
  },
];

export default function ColophonPage() {
  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Meta</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>Colophon</h1>
        <p style={{ color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7, maxWidth: '520px' }}>
          Everything used to build this site — tools, typefaces, tradeoffs, and the
          reasoning behind them. Updated when things change.
        </p>
      </div>

      {/* Stack */}
      <div style={{ marginBottom: 'var(--space-20)' }}>
        {STACK.map((section, si) => (
          <div key={section.category} style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         'var(--amber)',
              marginBottom:  'var(--space-5)',
              paddingBottom: 'var(--space-3)',
              borderBottom:  '1px solid var(--border)',
            }}>
              {section.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map((item, ii) => (
                <div key={item.name} style={{
                  display:       'grid',
                  gridTemplateColumns: '180px 1fr',
                  gap:           'var(--space-6)',
                  padding:       'var(--space-4) 0',
                  borderBottom:  ii < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems:    'baseline',
                  animation:     `fade-up 400ms var(--ease-out) ${(si * 100) + (ii * 50)}ms both`,
                }}>
                  <div>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="colophon-link"
                      >
                        {item.name} ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)' }}>
                        {item.name}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6 }}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Decisions */}
      <div style={{
        borderTop:    '1px solid var(--border)',
        paddingTop:   'var(--space-16)',
        marginBottom: 'var(--space-16)',
      }}>
        <h2 style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'var(--amber)',
          marginBottom:  'var(--space-10)',
        }}>
          Design decisions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {DECISIONS.map((d, i) => (
            <div key={d.decision} style={{
              display:     'grid',
              gridTemplateColumns: '180px 1fr',
              gap:         'var(--space-6)',
              alignItems:  'start',
              animation:   `fade-up 400ms var(--ease-out) ${i * 60}ms both`,
            }}>
              <div style={{
                fontFamily:    'var(--font-display)',
                fontSize:      'var(--text-lg)',
                fontWeight:    '400',
                color:         'var(--ink)',
                lineHeight:    1.3,
                letterSpacing: '-0.01em',
              }}>
                {d.decision}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.7 }}>
                {d.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        padding:      'var(--space-6) var(--space-6)',
        background:   'var(--surface-1)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        borderLeft:   '2px solid var(--amber)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px',
          color: 'var(--ink-50)', lineHeight: 1.7, letterSpacing: '0.04em',
        }}>
          Source not public yet — but ask if you&apos;re curious about something specific.{' '}
          <a href="mailto:okparajamesuchechi@gmail.com" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
            okparajamesuchechi@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}