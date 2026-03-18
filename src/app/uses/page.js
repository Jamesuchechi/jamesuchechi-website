import { prisma } from '@/lib/prisma';

export const metadata = {
  title:       'Uses',
  description: 'The tools, hardware, and software I use daily.',
};

const CATEGORY_ORDER  = ['hardware', 'terminal', 'stack', 'apps', 'reading'];
const CATEGORY_LABELS = {
  hardware: 'Hardware',
  terminal: 'Terminal & Editor',
  stack:    'Stack',
  apps:     'Apps',
  reading:  'Books I recommend',
};

// Fallback hardcoded data (used if DB is unavailable or empty)
const FALLBACK = {
  hardware: [
    { id: 'h1', name: 'MacBook Pro M3',        description: 'Primary machine. Battery life is genuinely wild.' },
    { id: 'h2', name: 'LG 27" 4K IPS Monitor', description: 'Easy on the eyes for long sessions.' },
    { id: 'h3', name: 'Keychron K2 (Brown)',    description: 'Tactile without being clicky enough to annoy everyone.' },
    { id: 'h4', name: 'Logitech MX Master 3',   description: 'The horizontal scroll wheel alone is worth it.' },
  ],
  terminal: [
    { id: 't1', name: 'Warp',       description: 'Terminal. The AI completions are actually useful.' },
    { id: 't2', name: 'Fish shell', description: 'Autosuggestions out of the box, no config required.' },
    { id: 't3', name: 'Neovim',     description: 'For serious editing. LazyVim config.' },
    { id: 't4', name: 'VS Code',    description: 'For everything else. Especially big projects.' },
    { id: 't5', name: 'tmux',       description: 'Session management.' },
  ],
  stack: [
    { id: 's1', name: 'Next.js',               description: "Default for web apps. App router, RSC, the works." },
    { id: 's2', name: 'Python',                description: 'Data pipelines, scripts, ML. Django for bigger backends.' },
    { id: 's3', name: 'PostgreSQL',            description: 'Database of choice. Reliable, powerful, mature.' },
    { id: 's4', name: 'Prisma',               description: "ORM that doesn't get in the way." },
    { id: 's5', name: 'Tailwind (selectively)', description: 'Only when the design is loose. Prefer CSS variables for real design systems.' },
    { id: 's6', name: 'Framer Motion',         description: 'Animation. Nothing else comes close.' },
    { id: 's7', name: 'Vercel',               description: 'Deployment. Zero drama.' },
  ],
  apps: [
    { id: 'a1', name: 'Raycast',   description: 'Replaced Spotlight. Snippets, clipboard history, window management.' },
    { id: 'a2', name: 'Obsidian',  description: 'Notes. Local-first, Markdown, linked thinking.' },
    { id: 'a3', name: 'Figma',     description: 'Design. Sometimes I draw things before I build them.' },
    { id: 'a4', name: 'TablePlus', description: 'Database GUI. Clean and fast.' },
    { id: 'a5', name: 'Spark',     description: 'Email. Inbox zero is a lifestyle.' },
    { id: 'a6', name: 'Linear',    description: 'Issue tracking for personal projects. Overpowered but nice.' },
  ],
  reading: [
    { id: 'r1', name: 'The Pragmatic Programmer', description: 'Thomas & Hunt. Reread it every couple of years.' },
    { id: 'r2', name: 'Thinking in Systems',       description: 'Donella Meadows. Changed how I see everything.' },
    { id: 'r3', name: 'A Philosophy of Software Design', description: 'John Ousterhout. The best book on software complexity.' },
    { id: 'r4', name: 'Designing Data-Intensive Applications', description: 'Kleppmann. The distributed systems bible.' },
  ],
};

async function getUsesData() {
  try {
    const items = await prisma.usesItem.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    if (items.length === 0) return FALLBACK;

    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  } catch {
    return FALLBACK;
  }
}

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
            key={item.id || i}
            className="uses-row"
          >
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--ink)' }}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--border)', textUnderlineOffset: '3px' }}>
                  {item.name}
                </a>
              ) : item.name}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.6 }}>
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function UsesPage() {
  const grouped = await getUsesData();

  // Sort categories by preferred order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

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

      {sortedCategories.map(cat => (
        <UseSection
          key={cat}
          title={CATEGORY_LABELS[cat] || cat}
          items={grouped[cat]}
        />
      ))}
    </div>
  );
}
