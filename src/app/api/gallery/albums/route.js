import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// POST /api/gallery/albums — create album
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, description, coverUrl, emoji, order, published } = body;

    if (!title?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title:       title.trim(),
        slug:        slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description?.trim() || null,
        coverUrl:    coverUrl?.trim()    || null,
        emoji:       emoji?.trim()       || null,
        order:       parseInt(order)     || 0,
        published:   published           ?? true,
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (err) {
    console.error('POST /api/gallery/albums error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'An album with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}

// GET /api/gallery/albums — all albums (admin, includes unpublished)
export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { _count: { select: { media: true } } },
    });
    return NextResponse.json(albums);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}
