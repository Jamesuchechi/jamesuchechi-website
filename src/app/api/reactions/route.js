import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

const VALID_REACTIONS = ['learned', 'bookmarked', 'thinking'];

// GET /api/reactions?slug=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  try {
    const rows = await prisma.postReaction.findMany({ where: { slug } });
    const counts = { learned: 0, bookmarked: 0, thinking: 0 };
    rows.forEach(r => { if (counts[r.type] !== undefined) counts[r.type] = r.count; });
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({ learned: 0, bookmarked: 0, thinking: 0 });
  }
}

// POST /api/reactions
export async function POST(request) {
  try {
    const { slug, type } = await request.json();
    if (!slug || !VALID_REACTIONS.includes(type)) {
      return NextResponse.json({ error: 'Invalid slug or type' }, { status: 400 });
    }

    const row = await prisma.postReaction.upsert({
      where:  { slug_type: { slug, type } },
      update: { count: { increment: 1 } },
      create: { slug, type, count: 1 },
    });

    return NextResponse.json({ count: row.count });
  } catch (err) {
    console.error('Reaction error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}