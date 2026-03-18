import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/now — Fetch all entries ordered by section and then order
export async function GET() {
  try {
    const entries = await prisma.nowEntry.findMany({
      orderBy: [
        { section: 'asc' },
        { order:   'asc' },
      ],
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error('GET /api/now error:', err);
    return NextResponse.json({ error: 'Failed to fetch now entries' }, { status: 500 });
  }
}

// POST /api/now — Create a new now entry (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { section, content, order } = body;

    if (!section || !content) {
      return NextResponse.json({ error: 'section and content are required' }, { status: 400 });
    }

    const entry = await prisma.nowEntry.create({
      data: {
        section,
        content,
        order: order || 0,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('POST /api/now error:', err);
    return NextResponse.json({ error: 'Failed to create now entry' }, { status: 500 });
  }
}
