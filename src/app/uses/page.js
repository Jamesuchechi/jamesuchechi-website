import { prisma }                from '@/lib/prisma';
import { ExpandableUsesItem }   from '@/components/ui/ExpandableUsesItem';

export const metadata = {
  title:       'Uses',
  description: 'The tools, hardware, and software I use daily. Click any item to read the full take.',
};

const CATEGORY_ORDER  = ['hardware', 'terminal', 'stack', 'apps', 'reading'];
const CATEGORY_LABELS = {
  hardware: 'Hardware',
  terminal: 'Terminal & Editor',
  stack:    'Stack',
  apps:     'Apps',
  reading:  'Books I recommend',
};

// Fallback data enriched with why/alternatives/verdict fields
const FALLBACK = {
  hardware: [
    {
      id:           'h1',
      name:         'MacBook Pro M3',
      description:  'Primary machine. Battery life is genuinely wild.',
      why:          'The M-series chips changed what portable performance means. No thermal throttling, no charger anxiety on normal days.',
      alternatives: 'Dell XPS (too hot), ThinkPad (great keyboard, worse GPU)',
      verdict:      'Best laptop I have ever owned. Not even close.',
    },
    {
      id:           'h2',
      name:         'LG 27" 4K IPS Monitor',
      description:  'Easy on the eyes for long sessions.',
      why:          'Color accuracy matters for design work. 4K at 27" is the sweet spot — dense but not tiny.',
      alternatives: 'Dell U2723D, Apple Studio Display',
      verdict:      'Great value. The Studio Display is better but $1000 better is debatable.',
    },
    {
      id:           'h3',
      name:         'Keychron K2 (Brown)',
      description:  'Tactile without being clicky enough to annoy everyone.',
      why:          'Mechanical keyboards are a rabbit hole. Browns hit the right balance of tactile feedback and not sounding like a typewriter.',
      alternatives: 'Keychron K8, Nuphy Air75',
      verdict:      'Bought it in 2021, still love it.',
    },
    {
      id:           'h4',
      name:         'Logitech MX Master 3',
      description:  'The horizontal scroll wheel alone is worth it.',
      why:          'The electromagnetic scroll wheel and the thumb scroll wheel for horizontal navigation are genuinely useful, not gimmicky.',
      alternatives: 'Apple Magic Mouse (bad ergonomics), MX Anywhere 3',
      verdict:      'Pricey but the ergonomics are unmatched for long sessions.',
    },
  ],
  terminal: [
    {
      id:           't1',
      name:         'Warp',
      description:  'Terminal. The AI completions are actually useful.',
      why:          'The block-based output model makes reading terminal history much cleaner. The AI inline suggestions catch flags I always forget.',
      alternatives: 'iTerm2 (good but old-feeling), Kitty (fast but minimal)',
      verdict:      'Switched and never looked back.',
    },
    {
      id:           't2',
      name:         'Fish shell',
      description:  'Autosuggestions out of the box, no config required.',
      why:          'Zero config for a sane default experience. History-based autosuggestions are built in. Not POSIX but for interactive use that rarely matters.',
      alternatives: 'Zsh + Oh-My-Zsh (too heavy), Bash (too bare)',
      verdict:      'I recommend this to everyone who asks about shells.',
    },
    {
      id:           't3',
      name:         'Neovim',
      description:  'For serious editing. LazyVim config.',
      why:          "Modal editing speed is real once it clicks. LazyVim gives a sensible default that doesn't take months to configure.",
      alternatives: 'Emacs (power but steep), Helix (promising)',
      verdict:      'Took 3 weeks to feel comfortable. Now I miss it in every other editor.',
    },
    {
      id:           't4',
      name:         'VS Code',
      description:  'For everything else. Especially big projects.',
      why:          'Debugging, large monorepos, and pair programming. The ecosystem is unmatched. Copilot integration is seamless when you want it.',
      alternatives: 'JetBrains IDEs (great for Java/Python but heavy)',
      verdict:      'The everyday workhorse. Not exciting but reliable.',
    },
  ],
  stack: [
    {
      id:           's1',
      name:         'Next.js',
      description:  'Default for web apps. App Router, RSC, the works.',
      why:          'The App Router mental model finally makes server/client boundaries explicit. RSC is genuinely different — not just another SSR.',
      alternatives: 'Remix (good, different tradeoffs), SvelteKit (love it for smaller things)',
      verdict:      'The default choice until something genuinely better arrives.',
    },
    {
      id:           's2',
      name:         'Python',
      description:  'Data pipelines, scripts, ML. Django for bigger backends.',
      why:          'The scientific stack is unmatched. Pandas, Polars, NumPy, scikit-learn — nothing else has this ecosystem for data work.',
      alternatives: 'R (academia-focused), Julia (fast but niche)',
      verdict:      'For data, there is no real competition yet.',
    },
    {
      id:           's3',
      name:         'PostgreSQL',
      description:  'Database of choice. Reliable, powerful, mature.',
      why:          'JSONB, full-text search, arrays, CTEs, window functions — it does almost everything. ACID compliance by default.',
      alternatives: 'MySQL (fine but Postgres is better), SQLite (great for embedded)',
      verdict:      'Start with Postgres, only leave if you have a very specific reason.',
    },
    {
      id:           's4',
      name:         'Prisma',
      description:  "ORM that doesn't get in the way.",
      why:          'Schema-first development. The type generation means runtime errors at query time become TypeScript errors at compile time.',
      alternatives: 'Drizzle (lighter, faster), raw SQL (sometimes the right call)',
      verdict:      'The DX is excellent. Migrations are easy. I keep coming back.',
    },
  ],
  apps: [
    {
      id:           'a1',
      name:         'Raycast',
      description:  'Replaced Spotlight. Snippets, clipboard history, window management.',
      why:          'Clipboard history alone saves me 20 minutes a day. Snippet expansion with variables is underrated. Extensions for everything.',
      alternatives: 'Alfred (good but expensive), Spotlight (too limited)',
      verdict:      'The single app I miss most on other machines.',
    },
    {
      id:           'a2',
      name:         'Obsidian',
      description:  'Notes. Local-first, Markdown, linked thinking.',
      why:          'Local files mean I own the data. Graph view is occasionally useful. The plugin ecosystem is enormous. Works offline always.',
      alternatives: 'Notion (powerful but cloud-only), Logseq (similar but different UX)',
      verdict:      'Set it up once properly and it becomes invisible — which is the goal.',
    },
    {
      id:           'a3',
      name:         'Figma',
      description:  'Design. Sometimes I draw things before I build them.',
      why:          'The collaborative editing and component system are best in class. Auto-layout finally makes responsive design approachable.',
      alternatives: 'Sketch (Mac-only, worse collab), Penpot (open source, improving)',
      verdict:      'The industry standard for a reason. Pricey but nothing else is as good.',
    },
    {
      id:           'a4',
      name:         'TablePlus',
      description:  'Database GUI. Clean and fast.',
      why:          'Instant connection, clean UI, good query editor. Native app performance. Works with Postgres, MySQL, SQLite, Redis.',
      alternatives: 'DBeaver (free but heavy), pgAdmin (powerful but ugly)',
      verdict:      'Worth every penny. I use it daily.',
    },
  ],
  reading: [
    {
      id:           'r1',
      name:         'The Pragmatic Programmer',
      description:  'Thomas & Hunt. Reread it every couple of years.',
      why:          'The advice is almost entirely non-language-specific. Principles like DRY, tracer bullets, and broken windows apply to every codebase.',
      alternatives: null,
      verdict:      'Essential. The 20th anniversary edition is updated but the core is timeless.',
    },
    {
      id:           'r2',
      name:         'Thinking in Systems',
      description:  'Donella Meadows. Changed how I see everything.',
      why:          'Systems thinking is a mental model that applies to codebases, organisations, ecosystems, and economies. Reading it once changes how you look at everything.',
      alternatives: null,
      verdict:      "One of maybe 5 books I'd recommend to anyone, not just engineers.",
    },
    {
      id:           'r3',
      name:         'A Philosophy of Software Design',
      description:  'John Ousterhout. The best book on software complexity.',
      why:          'Tackles the question most books avoid: what actually makes software complex, and how do you fight it by design?',
      alternatives: 'Clean Code (good but opinionated in bad ways), The Clean Architecture',
      verdict:      'Short, dense, full of insight. Disagree with some of it, which is also good.',
    },
    {
      id:           'r4',
      name:         'Designing Data-Intensive Applications',
      description:  'Kleppmann. The distributed systems bible.',
      why:          'No other book explains databases, messaging, stream processing, and consistency with this level of clarity and depth.',
      alternatives: null,
      verdict:      "Required reading before you design anything at scale. Or after, to understand what went wrong.",
    },
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

function UseSection({ title, items, index }) {
  return (
    <section style={{ marginBottom: 'var(--space-12)', animation: `fade-up 500ms var(--ease-out) ${index * 80}ms both` }}>
      <h2 style={{
        fontFamily:    'var(--font-display)',
        fontSize:      'var(--text-xl)',
        fontWeight:    '400',
        color:         'var(--ink)',
        marginBottom:  'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom:  '1px solid var(--border)',
        display:       'flex',
        alignItems:    'baseline',
        gap:           'var(--space-3)',
      }}>
        {title}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
          {items.length}
        </span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item) => (
          <ExpandableUsesItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default async function UsesPage() {
  const grouped = await getUsesData();
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
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Setup</p>
        <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>My setup</h1>
        <p className="body" style={{ color: 'var(--ink-50)', maxWidth: '460px' }}>
          Tools, hardware, and software I rely on daily.{' '}
          <strong style={{ color: 'var(--ink)', fontWeight: '500' }}>Click any item</strong>{' '}
          to read the full take — why I use it, what I tried instead, and my verdict.
        </p>
      </div>

      {sortedCategories.map((cat, i) => (
        <UseSection
          key={cat}
          title={CATEGORY_LABELS[cat] || cat}
          items={grouped[cat]}
          index={i}
        />
      ))}
    </div>
  );
}