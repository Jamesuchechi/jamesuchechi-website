import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// PUT /api/bookmarks/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { url, title, description, note, tags, via, published } = body;

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        ...(url         !== undefined && { url:         url.trim() }),
        ...(title       !== undefined && { title:       title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(note        !== undefined && { note:        note?.trim()        || null }),
        ...(tags        !== undefined && {
          tags: Array.isArray(tags)
            ? tags.map(t => t.trim()).filter(Boolean)
            : tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
        ...(via       !== undefined && { via:       via?.trim()   || null }),
        ...(published !== undefined && { published }),
      },
    });
    revalidatePath('/bookmarks');
    revalidatePath('/');
    return NextResponse.json(bookmark);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

// DELETE /api/bookmarks/[id]
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.bookmark.delete({ where: { id } });
    revalidatePath('/bookmarks');
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}

// GET /api/bookmarks/[id]
export async function GET(_, { params }) {
  try {
    const { id }   = await params;
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(bookmark);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookmark' }, { status: 500 });
  }
}
