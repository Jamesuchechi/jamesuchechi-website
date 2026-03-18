import { getAllPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jamesuchechi.com';

  const staticPages = [
    { url: siteUrl,           lastModified: new Date(), priority: 1.0   },
    { url: `${siteUrl}/now`,  lastModified: new Date(), priority: 0.9   },
    { url: `${siteUrl}/writing`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/garden`,  lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/uses`,    lastModified: new Date(), priority: 0.6 },
  ];

  const writingPages = getAllPosts('writing').map(post => ({
    url:          `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    priority:     0.7,
  }));

  const gardenPages = getAllPosts('garden').map(post => ({
    url:          `${siteUrl}/garden/${post.slug}`,
    lastModified: new Date(post.date),
    priority:     0.5,
  }));

  return [...staticPages, ...writingPages, ...gardenPages];
}
