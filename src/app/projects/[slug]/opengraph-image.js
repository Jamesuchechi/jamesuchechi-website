import { redirect } from 'next/navigation';
import { prisma }   from '@/lib/prisma';

export const runtime     = 'nodejs';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { slug } = await params;

  let project = null;
  try {
    project = await prisma.project.findUnique({ where: { slug } });
  } catch {}

  const title       = project?.title   || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const description = project?.summary || '';
  const date        = project?.builtAt ? String(new Date(project.builtAt).getFullYear()) : '';

  const url = new URL('/api/og', 'https://jamesuchechi.com');
  url.searchParams.set('title',       title);
  url.searchParams.set('type',        'PROJECT');
  url.searchParams.set('description', description);
  url.searchParams.set('date',        date);

  return redirect(url.toString());
}