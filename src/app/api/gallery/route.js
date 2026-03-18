import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/gallery — all published albums with media count
export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where:   { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { media: true } },
        media:  {
          orderBy: { order: 'asc' },
          take:    1,
          select:  { url: true, thumbnailUrl: true, type: true },
        },
      },
    });
    return NextResponse.json(albums);
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}
