import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/gallery/[slug] — single album + ordered media
export async function GET(_, { params }) {
  try {
    const { slug } = await params;
    const album = await prisma.galleryAlbum.findUnique({
      where:   { slug, published: true },
      include: {
        media: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
        _count: { select: { media: true } },
      },
    });
    if (!album) return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    return NextResponse.json(album);
  } catch (err) {
    console.error('GET /api/gallery/[slug] error:', err);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}
