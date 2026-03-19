import { getAllPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jamesuchechi.com';

  const staticPages = [
    { url: siteUrl,           lastModified: new Date(), priority: 1.0   },
    { url: `${siteUrl}/now`,  lastModified: new Date(), priority: 0.9   },
    { url: `${siteUrl}/writing`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/garden`,  lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/uses`,    lastModified: new Date(), priority: 0.6 },
  ];

  const [writing, garden] = await Promise.all([
    getAllPosts('writing'),
    getAllPosts('garden')
  ]);

  const writingPages = writing.map(post => ({
    url:          `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    priority:     0.7,
  }));

  const gardenPages = garden.map(post => ({
    url:          `${siteUrl}/garden/${post.slug}`,
    lastModified: new Date(post.date),
    priority:     0.5,
  }));

  return [...staticPages, ...writingPages, ...gardenPages];
}
