'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProjectForm }          from '@/components/ui/ProjectForm';

export default function EditProjectPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setProject(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function deleteProject() {
    if (!confirm(`Delete "${project?.title}"? This cannot be undone.`)) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    router.push('/admin/projects');
    router.refresh();
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-10)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ padding: 'var(--space-10)' }}>
        <p style={{ color: '#ef4444' }}>Project not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <p className="caption">Projects → Edit</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            {project?.title}
          </h1>
        </div>
        <button onClick={deleteProject} style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-full)', padding: '6px 16px', cursor: 'pointer',
        }}>
          Delete project
        </button>
      </div>
      <ProjectForm initial={project} />
    </div>
  );
}
