import { notFound }  from 'next/navigation';
import Link           from 'next/link';
import { prisma }     from '@/lib/prisma';
import { TiltCard }   from '@/components/ui/TiltCard';

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where:  { published: true },
      select: { slug: true },
    });
    return projects.map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const p = await prisma.project.findUnique({ where: { slug } });
    if (!p) return { title: 'Project Not Found' };
    return {
      title:       p.title,
      description: p.summary,
      openGraph: { title: p.title, description: p.summary, type: 'article' },
    };
  } catch {
    return { title: 'Project' };
  }
}

async function getProject(slug) {
  try {
    return await prisma.project.findUnique({ where: { slug, published: true } });
  } catch { return null; }
}

async function getRelated(project) {
  try {
    return await prisma.project.findMany({
      where: {
        published: true,
        category:  project.category,
        id:        { not: project.id },
      },
      take:    3,
      orderBy: { order: 'asc' },
    });
  } catch { return []; }
}

const CATEGORY_LABELS = { web: 'Web', data: 'Data / ML', oss: 'Open Source', other: 'Other' };
const CATEGORY_COLORS = {
  web:   '#60a5fa',
  data:  '#a78bfa',
  oss:   '#34d399',
  other: 'var(--amber)',
};

export default async function ProjectDetailPage({ params }) {
  const { slug }   = await params;
  const project    = await getProject(slug);
  if (!project) notFound();

  const related = await getRelated(project);
  const catColor = CATEGORY_COLORS[project.category] || 'var(--amber)';

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        paddingTop:    'clamp(120px, 18vh, 180px)',
        paddingBottom: 'var(--space-16)',
        paddingLeft:   'var(--space-6)',
        paddingRight:  'var(--space-6)',
        maxWidth:      'var(--max-w-wide)',
        margin:        '0 auto',
        position:      'relative',
      }}>
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '-10%',
          width: '60%', height: '100%',
          background: `radial-gradient(ellipse at 20% 40%, ${catColor}12 0%, transparent 65%)`,
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        'var(--space-3)',
            marginBottom: 'var(--space-8)',
            animation:  'fade-up 500ms var(--ease-out) both',
          }}>
            <Link href="/projects" style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--ink-30)', textDecoration: 'none',
              letterSpacing: '0.06em',
              transition: 'color var(--duration-fast)',
            }}>
              ← Projects
            </Link>
            <span style={{ color: 'var(--ink-10)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
              {project.slug}
            </span>
          </div>

          {/* Category + Year */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
            animation: 'fade-up 500ms var(--ease-out) 60ms both',
          }}>
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         catColor,
              background:    `${catColor}15`,
              border:        `1px solid ${catColor}30`,
              borderRadius:  'var(--radius-full)',
              padding:       '4px 14px',
            }}>
              {CATEGORY_LABELS[project.category] || project.category}
            </span>
            {project.builtAt && (
              <time style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
                {new Date(project.builtAt).getFullYear()}
              </time>
            )}
            {project.featured && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--amber)', border: '1px solid rgba(201,146,42,0.3)',
                borderRadius: 'var(--radius-full)', padding: '3px 10px',
              }}>
                ✦ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="display-2"
            style={{
              marginBottom: 'var(--space-6)',
              maxWidth:     '820px',
              animation:    'fade-up 600ms var(--ease-out) 100ms both',
            }}
          >
            {project.title}
          </h1>

          {/* Summary */}
          <p style={{
            fontSize:     'var(--text-lg)',
            color:        'var(--ink-50)',
            lineHeight:   1.7,
            maxWidth:     '620px',
            marginBottom: 'var(--space-10)',
            animation:    'fade-up 600ms var(--ease-out) 160ms both',
          }}>
            {project.summary}
          </p>

          {/* CTA links */}
          <div style={{
            display:    'flex',
            gap:        'var(--space-4)',
            flexWrap:   'wrap',
            marginBottom: 'var(--space-12)',
            animation:  'fade-up 600ms var(--ease-out) 220ms both',
          }}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                View live ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                GitHub ↗
              </a>
            )}
          </div>

          {/* Tech stack pills */}
          {project.techStack?.length > 0 && (
            <div style={{
              display:   'flex',
              flexWrap:  'wrap',
              gap:       'var(--space-2)',
              animation: 'fade-up 600ms var(--ease-out) 280ms both',
            }}>
              {project.techStack.map((tech, i) => (
                <span
                  key={tech}
                  className="tag"
                  style={{
                    animation: `fade-up 400ms var(--ease-out) ${300 + i * 40}ms both`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COVER IMAGE ───────────────────────────────── */}
      {project.coverUrl && (
        <div style={{
          maxWidth:   'var(--max-w-wide)',
          margin:     '0 auto',
          padding:    '0 var(--space-6)',
          marginBottom: 'var(--space-16)',
          animation:  'fade-up 700ms var(--ease-out) 320ms both',
        }}>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow:     'hidden',
            border:       '1px solid var(--border)',
            boxShadow:    'var(--shadow-xl)',
            aspectRatio:  '16/9',
            position:     'relative',
            background:   'var(--surface-2)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverUrl}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Subtle vignette overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(13,13,11,0.15) 100%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      )}

      {/* ── CASE STUDY BODY ───────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-wide)',
        margin:   '0 auto',
        padding:  '0 var(--space-6)',
      }}>
        <div style={{
          display:    'grid',
          gridTemplateColumns: '1fr 280px',
          gap:        'var(--space-16)',
          alignItems: 'start',
        }}>
          {/* Main content */}
          <div>
            {/* Decorative amber rule */}
            <div style={{
              height:     '1px',
              background: 'linear-gradient(to right, var(--amber), transparent)',
              marginBottom: 'var(--space-10)',
            }} />

            {project.description ? (
              <div
                className="prose"
                style={{ maxWidth: 'none' }}
                dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br/>') }}
              />
            ) : (
              <div className="prose">
                <p style={{ color: 'var(--ink-50)', fontStyle: 'italic' }}>
                  More details coming soon. Visit the live site or GitHub for the full picture.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{
            position:    'sticky',
            top:         'calc(56px + var(--space-8))',
            display:     'flex',
            flexDirection: 'column',
            gap:         'var(--space-6)',
          }}>
            {/* Meta card */}
            <div style={{
              background:   'var(--surface-1)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding:      'var(--space-6)',
              borderLeft:   `2px solid ${catColor}`,
            }}>
              <p className="caption" style={{ marginBottom: 'var(--space-5)' }}>Project info</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <MetaRow label="Category" value={CATEGORY_LABELS[project.category] || project.category} />
                {project.builtAt && (
                  <MetaRow label="Year" value={new Date(project.builtAt).getFullYear()} />
                )}
                {project.liveUrl && (
                  <MetaRow
                    label="Live"
                    value={
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="amber-link" style={{ fontSize: '12px' }}>
                        View site ↗
                      </a>
                    }
                  />
                )}
                {project.githubUrl && (
                  <MetaRow
                    label="Code"
                    value={
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="amber-link" style={{ fontSize: '12px', color: 'var(--ink-30)' }}>
                        GitHub ↗
                      </a>
                    }
                  />
                )}
              </div>
            </div>

            {/* Tech stack card */}
            {project.techStack?.length > 0 && (
              <div style={{
                background:   'var(--surface-1)',
                border:       '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding:      'var(--space-6)',
              }}>
                <p className="caption" style={{ marginBottom: 'var(--space-4)' }}>Built with</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {project.techStack.map(tech => (
                    <span key={tech} className="tag" style={{ fontSize: '10px' }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to projects */}
            <Link
              href="/projects"
              style={{
                display:       'flex',
                alignItems:    'center',
                gap:           'var(--space-2)',
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                color:         'var(--ink-30)',
                letterSpacing: '0.06em',
                textDecoration:'none',
                padding:       'var(--space-3) var(--space-4)',
                background:    'var(--surface-1)',
                border:        '1px solid var(--border)',
                borderRadius:  'var(--radius-md)',
                transition:    'color var(--duration-fast), border-color var(--duration-fast)',
              }}
            >
              ← All projects
            </Link>
          </aside>
        </div>
      </div>

      {/* ── RELATED PROJECTS ──────────────────────────── */}
      {related.length > 0 && (
        <section style={{
          maxWidth:     'var(--max-w-wide)',
          margin:       'var(--space-24) auto 0',
          padding:      'var(--space-16) var(--space-6)',
          borderTop:    '1px solid var(--border)',
        }}>
          <div style={{
            display:    'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-10)',
          }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>More work</p>
              <h2 className="heading-1">Related projects</h2>
            </div>
            <Link href="/projects" className="nav-link">View all →</Link>
          </div>

          <div className="projects-grid">
            {related.map(p => (
              <RelatedCard key={p.id} project={p} catColors={CATEGORY_COLORS} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom spacing */}
      <div style={{ height: 'var(--space-24)' }} />

      <style>{`
        @media (max-width: 800px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)' }}>
        {value}
      </span>
    </div>
  );
}

function RelatedCard({ project, catColors }) {
  const color = catColors[project.category] || 'var(--amber)';
  return (
    <TiltCard intensity={8} scale={1.02} className="project-card">
      <div className="project-card__cover" style={{ height: '140px' }}>
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="project-card__cover-placeholder">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '300', color, opacity: 0.4 }}>
              {project.title[0]}
            </span>
          </div>
        )}
      </div>
      <div className="project-card__body">
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: '500', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
          {project.summary}
        </p>
        <Link href={`/projects/${project.slug}`} className="amber-link" style={{ fontSize: '11px' }}>
          View project →
        </Link>
      </div>
    </TiltCard>
  );
}