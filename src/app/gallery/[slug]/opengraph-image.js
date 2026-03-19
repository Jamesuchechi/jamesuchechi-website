import { redirect } from 'next/navigation';
import { prisma }   from '@/lib/prisma';

export const runtime     = 'nodejs';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { slug } = await params;

  let album = null;
  try {
    album = await prisma.galleryAlbum.findUnique({ where: { slug } });
  } catch {}

  const title       = album?.title       || 'Gallery';
  const description = album?.description || 'A visual memory hub · James Uchechi';

  const url = new URL('/api/og', 'https://jamesuchechi.com');
  url.searchParams.set('title',       title);
  url.searchParams.set('type',        'GALLERY');
  url.searchParams.set('description', description);

  return redirect(url.toString());
}