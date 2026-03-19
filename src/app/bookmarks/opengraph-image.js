import { redirect } from 'next/navigation';

export const runtime     = 'nodejs';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const url = new URL('/api/og', 'https://jamesuchechi.com');
  url.searchParams.set('title',       'Bookmarks');
  url.searchParams.set('type',        'COLLECTION');
  url.searchParams.set('description', 'A curated stash of interesting finds across the web.');

  return redirect(url.toString());
}