import { UsesForm } from '@/components/ui/UsesForm';

export const metadata = { title: 'New Uses Item · Admin' };

export default function NewUsesPage() {
  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p className="caption">Uses → New</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          New Uses Item
        </h1>
      </div>
      <UsesForm />
    </div>
  );
}
