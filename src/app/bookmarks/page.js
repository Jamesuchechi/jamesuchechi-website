import { prisma }          from '@/lib/prisma';
import { BookmarksClient } from '@/components/ui/BookmarksClient';

export const metadata = {
  title:       'Bookmarks',
  description: 'Links, articles, and tools I have saved — with my take on why they matter.',
};

async function getBookmarks() {
  try {
    return await prisma.bookmark.findMany({
      where:   { published: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks();

  // Collect all unique tags
  const allTags = [...new Set(bookmarks.flatMap(b => b.tags))].sort();

  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Link stash</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <h1 className="display-2" style={{ marginBottom: 0 }}>Bookmarks</h1>
          <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em' }}>
            {bookmarks.length} links
          </p>
        </div>
        <p style={{ marginTop: 'var(--space-6)', color: 'var(--ink-50)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
          Articles, tools, papers, and things I&apos;ve found worth reading — with a note on why.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-20)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-30)', letterSpacing: '-0.02em' }}>
            Nothing saved yet.
          </p>
        </div>
      ) : (
        <BookmarksClient bookmarks={bookmarks} allTags={allTags} />
      )}
    </div>
  );
}
