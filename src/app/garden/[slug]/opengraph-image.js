import { redirect }     from 'next/navigation';
import { getPostBySlug } from '@/lib/content';
import { formatDate }    from '@/lib/dates';

export const runtime     = 'nodejs';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { slug } = await params;
  const post     = getPostBySlug(slug, 'garden');

  const title       = post?.title       || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const description = post?.description || '';
  const date        = post?.date ? formatDate(post.date, { month: 'short', year: 'numeric' }) : '';
  const stage       = post?.stage ? post.stage.charAt(0).toUpperCase() + post.stage.slice(1) : 'GARDEN';

  const url = new URL('/api/og', 'https://jamesuchechi.com');
  url.searchParams.set('title',       title);
  url.searchParams.set('type',        stage);
  url.searchParams.set('description', description);
  url.searchParams.set('date',        date);

  return redirect(url.toString());
}