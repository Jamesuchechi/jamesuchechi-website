export const metadata = {
  title:       'Uses',
  description: 'The tools, hardware, and software I use daily.',
};

const USES = {
  hardware: [
    { name: 'MacBook Pro M3',           desc: 'Primary machine. Battery life is genuinely wild.' },
    { name: 'LG 27" 4K IPS Monitor',    desc: 'Easy on the eyes for long sessions.' },
    { name: 'Keychron K2 (Brown)',       desc: 'Tactile without being clicky enough to annoy everyone.' },
    { name: 'Logitech MX Master 3',     desc: 'The horizontal scroll wheel alone is worth it.' },
  ],
  terminal: [
    { name: 'Warp',                     desc: 'Terminal. The AI completions are actually useful.' },
    { name: 'Fish shell',               desc: 'Autosuggestions out of the box, no config required.' },
    { name: 'Neovim',                   desc: 'For serious editing. LazyVim config.' },
    { name: 'VS Code',                  desc: 'For everything else. Especially big projects.' },
    { name: 'tmux',                     desc: 'Session management.' },
  ],
  stack: [
    { name: 'Next.js',                  desc: 'Default for web apps. App router, RSC, the works.' },
    { name: 'Python',                   desc: 'Data pipelines, scripts, ML. Django for bigger backends.' },
    { name: 'PostgreSQL',               desc: 'Database of choice. Reliable, powerful, mature.' },
    { name: 'Prisma',                   desc: 'ORM that doesn\'t get in the way.' },
    { name: 'Tailwind (selectively)',   desc: 'Only when the design is loose. Prefer CSS variables for real design systems.' },
    { name: 'Framer Motion',            desc: 'Animation. Nothing else comes close.' },
    { name: 'Vercel',                   desc: 'Deployment. Zero drama.' },
  ],
  apps: [
    { name: 'Raycast',                  desc: 'Replaced Spotlight. Snippets, clipboard history, window management.' },
    { name: 'Obsidian',                 desc: 'Notes. Local-first, Markdown, linked thinking.' },
    { name: 'Figma',                    desc: 'Design. Sometimes I draw things before I build them.' },
    { name: 'TablePlus',                desc: 'Database GUI. Clean and fast.' },
    { name: 'Spark',                    desc: 'Email. Inbox zero is a lifestyle.' },
    { name: 'Linear',                   desc: 'Issue tracking for personal projects. Overpowered but nice.' },
  ],
  reading: [
    { name: 'The Pragmatic Programmer', desc: 'Thomas & Hunt. Reread it every couple of years.' },
    { name: 'Thinking in Systems',      desc: 'Donella Meadows. Changed how I see everything.' },
    { name: 'A Philosophy of Software Design', desc: 'John Ousterhout. The best book on software complexity.' },
    { name: 'Designing Data-Intensive Applications', desc: 'Kleppmann. The distributed systems bible.' },
  ],
};

function UseSection({ title, items }) {
  return (
    <section style={{ marginBottom: 'var(--space-12)' }}>
      <h2 style={{
        fontFamily:    'var(--font-display)',
        fontSize:      'var(--text-xl)',
        fontWeight:    '400',
        color:         'var(--ink)',
        marginBottom:  'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom:  '1px solid var(--border)',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display:       'grid',
              gridTemplateColumns: '200px 1fr',
              gap:           'var(--space-6)',
              padding:       'var(--space-4) 0',
              borderBottom:  i < items.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems:    'baseline',
            }}
          >
            <span style={{
              fontSize:   'var(--text-sm)',
              fontWeight: '500',
              color:      'var(--ink)',
            }}>
              {item.name}
            </span>
            <span style={{
              fontSize:   'var(--text-sm)',
              color:      'var(--ink-50)',
              lineHeight: 1.6,
            }}>
              {item.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function UsesPage() {
  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Uses</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>
          My setup
        </h1>
        <p className="body" style={{ color: 'var(--ink-50)' }}>
          Tools, hardware, and software I rely on daily. Updated occasionally.
        </p>
      </div>

      <UseSection title="Hardware"   items={USES.hardware} />
      <UseSection title="Terminal & Editor" items={USES.terminal} />
      <UseSection title="Stack"      items={USES.stack} />
      <UseSection title="Apps"       items={USES.apps} />
      <UseSection title="Books I recommend" items={USES.reading} />
    </div>
  );
}
