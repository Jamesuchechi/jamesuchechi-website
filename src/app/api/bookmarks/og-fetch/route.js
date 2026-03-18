import { NextResponse } from 'next/server';

// POST /api/bookmarks/og-fetch — server-side fetch OG metadata for a URL
export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; jamesuchechi-bot/1.0)' },
      signal:  AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 422 });
    }

    const html = await res.text();

    function getMeta(property) {
      // og: first, then name=
      const ogMatch   = html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'));
      const nameMatch = html.match(new RegExp(`<meta[^>]+name=["']${property.replace('og:', '')}["'][^>]+content=["']([^"']+)["']`, 'i'));
      return ogMatch?.[1] || nameMatch?.[1] || null;
    }

    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    return NextResponse.json({
      title:       getMeta('og:title')          || titleTag?.trim() || '',
      description: getMeta('og:description')    || getMeta('description') || '',
      image:       getMeta('og:image')          || null,
      siteName:    getMeta('og:site_name')      || null,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
