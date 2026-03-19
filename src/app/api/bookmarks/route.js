import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/bookmarks — all published, optional ?tag= filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    const where = { published: true };
    if (tag) where.tags = { has: tag };

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookmarks);
  } catch (err) {
    console.error('GET /api/bookmarks error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

// POST /api/bookmarks — create bookmark (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { url, title, description, note, tags, via, published } = body;

    if (!url?.trim() || !title?.trim()) {
      return NextResponse.json({ error: 'url and title are required' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        url:         url.trim(),
        title:       title.trim(),
        description: description?.trim() || null,
        note:        note?.trim()        || null,
        tags:        Array.isArray(tags)
                       ? tags.map(t => t.trim()).filter(Boolean)
                       : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
        via:         via?.trim()         || null,
        published:   published           ?? true,
      },
    });
    revalidatePath('/bookmarks');
    revalidatePath('/');
    return NextResponse.json(bookmark, { status: 201 });
  } catch (err) {
    console.error('POST /api/bookmarks error:', err);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}
