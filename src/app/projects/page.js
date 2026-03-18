import { prisma }          from '@/lib/prisma';
import { ProjectsClient }  from '@/components/ui/ProjectsClient';

export const metadata = {
  title:       'Projects',
  description: 'A selection of things I have built — web apps, data pipelines, and experiments.',
};

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where:   { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div style={{
      maxWidth: 'var(--max-w-wide)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>
          Selected work
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <h1 className="display-2" style={{ marginBottom: 0 }}>
            Projects
          </h1>
          <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em' }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <p style={{
          marginTop:  'var(--space-6)',
          color:      'var(--ink-50)',
          fontSize:   'var(--text-base)',
          lineHeight: 1.7,
          maxWidth:   '520px',
        }}>
          A curated selection of things I&apos;ve built — web applications, data pipelines,
          and experiments at the intersection of code and creativity.
        </p>
      </div>

      {projects.length === 0 ? (
        /* Empty state — shown before any projects are added via admin */
        <div style={{
          border:       '1px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding:      'var(--space-20)',
          textAlign:    'center',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-30)', marginBottom: 'var(--space-4)' }}>
            Nothing here yet.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
            Add your first project from{' '}
            <a href="/admin/projects/new" style={{ color: 'var(--amber)' }}>the admin →</a>
          </p>
        </div>
      ) : (
        <ProjectsClient initialProjects={projects} />
      )}
    </div>
  );
}
