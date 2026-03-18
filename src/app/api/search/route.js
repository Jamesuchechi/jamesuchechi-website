import { NextResponse }    from 'next/server';
import { getSearchItems, search } from '@/lib/search';

// Simple server-side cache for the search index
let _indexCache = null;
let _lastFetch  = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function getIndex() {
  const now = Date.now();
  if (!_indexCache || (now - _lastFetch > CACHE_TTL)) {
    _indexCache = await getSearchItems();
    _lastFetch  = now;
  }
  return _indexCache;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const index   = await getIndex();
    const results = search(query, index);
    return NextResponse.json(results);
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
