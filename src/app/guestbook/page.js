import { prisma }           from '@/lib/prisma';
import { GuestbookClient } from '@/components/ui/GuestbookClient';

export const metadata = {
  title:       'Guestbook',
  description: 'Leave a note — say hello, share a thought, or just let me know you stopped by.',
};

async function getEntries() {
  try {
    return await prisma.guestbookEntry.findMany({
      where:   { approved: true },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, name: true, message: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

export default async function GuestbookPage() {
  const entries = await getEntries();

  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Community</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <h1 className="display-2" style={{ marginBottom: 0 }}>Guestbook</h1>
          <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em' }}>
            {entries.length} {entries.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        <p style={{ marginTop: 'var(--space-6)', color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
          Say hello, share a thought, or just let me know you stopped by.
          Messages are reviewed before appearing.
        </p>
      </div>

      {/* Submission form + approved entries */}
      <GuestbookClient initialEntries={entries} />
    </div>
  );
}
