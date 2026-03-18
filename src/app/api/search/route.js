import { NextResponse }    from 'next/server';
import { buildSearchIndex, search } from '@/lib/search';

// Build index once at module level (cached between requests in prod)
let _index = null;
function getIndex() {
  if (!_index) _index = buildSearchIndex();
  return _index;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const results = search(query, getIndex());
  return NextResponse.json(results);
}
