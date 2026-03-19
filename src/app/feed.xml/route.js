import { getAllPosts } from '@/lib/content';

export const dynamic = 'force-static';

function escape(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const posts  = (await getAllPosts('writing')).slice(0, 20);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jamesuchechi.com';

  const items = posts.map(post => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${siteUrl}/writing/${post.slug}</link>
      <guid>${siteUrl}/writing/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escape(post.description || '')}</description>
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>James Uchechi — Writing</title>
    <link>${siteUrl}</link>
    <description>Essays, tutorials, and notes on engineering, data, and building things.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600',
    },
  });
}
