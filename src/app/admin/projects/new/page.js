import { ProjectForm } from '@/components/ui/ProjectForm';

export const metadata = { title: 'New Project · Admin' };

export default function NewProjectPage() {
  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p className="caption">Projects → New</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
          fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>
          New Project
        </h1>
      </div>
      <ProjectForm />
    </div>
  );
}
