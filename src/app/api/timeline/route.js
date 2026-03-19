import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/timeline — all published entries, newest first
export async function GET() {
  try {
    const entries = await prisma.timelineEntry.findMany({
      where:   { published: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error('GET /api/timeline error:', err);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

// POST /api/timeline — create entry (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, category, date, icon, linkUrl, linkLabel, published } = body;

    if (!title?.trim() || !description?.trim() || !category || !date) {
      return NextResponse.json({ error: 'title, description, category, date are required' }, { status: 400 });
    }

    const entry = await prisma.timelineEntry.create({
      data: {
        title:       title.trim(),
        description: description.trim(),
        category,
        date:        new Date(date),
        icon:        icon?.trim()       || null,
        linkUrl:     linkUrl?.trim()    || null,
        linkLabel:   linkLabel?.trim()  || null,
        published:   published          ?? true,
      },
    });
    revalidatePath('/timeline');
    revalidatePath('/');
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('POST /api/timeline error:', err);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
