export const dynamic = 'force-static';

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jamesuchechi.com';
  return {
    rules:    { userAgent: '*', allow: '/' },
    sitemap:  `${siteUrl}/sitemap.xml`,
  };
}
