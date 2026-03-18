import { TimelineForm } from '@/components/ui/TimelineForm';

export const metadata = { title: 'New Milestone · Admin' };

export default function NewTimelinePage() {
  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p className="caption">Timeline → New</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          New Milestone
        </h1>
      </div>
      <TimelineForm />
    </div>
  );
}
