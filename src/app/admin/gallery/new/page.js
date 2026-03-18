import { AlbumForm } from '@/components/ui/AlbumForm';

export const metadata = { title: 'New Album · Admin' };

export default function NewAlbumPage() {
  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p className="caption">Gallery → New</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          New Album
        </h1>
      </div>
      <AlbumForm />
    </div>
  );
}
