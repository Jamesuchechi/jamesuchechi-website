import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/gallery/albums/[id]
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const album = await prisma.galleryAlbum.findUnique({
      where:   { id },
      include: { media: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }, _count: { select: { media: true } } },
    });
    if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

// PUT /api/gallery/albums/[id]
export async function PUT(request, { params }) {
  try {
    const { id }   = await params;
    const body     = await request.json();
    const { title, slug, description, coverUrl, emoji, order, published } = body;

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        ...(title       !== undefined && { title:       title.trim() }),
        ...(slug        !== undefined && { slug:        slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(coverUrl    !== undefined && { coverUrl:    coverUrl?.trim()    || null }),
        ...(emoji       !== undefined && { emoji:       emoji?.trim()       || null }),
        ...(order       !== undefined && { order:       parseInt(order) || 0 }),
        ...(published   !== undefined && { published }),
      },
    });
    return NextResponse.json(album);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}

// DELETE /api/gallery/albums/[id] — cascades media via schema
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
