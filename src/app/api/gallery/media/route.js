import { NextResponse }    from 'next/server';
import { prisma }          from '@/lib/prisma';
import { revalidatePath }  from 'next/cache';

// POST /api/gallery/media — save uploaded media item to DB
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      albumId, type, url, thumbnailUrl, publicId,
      caption, location, takenAt, width, height, order,
    } = body;

    if (!albumId || !url || !type) {
      return NextResponse.json({ error: 'albumId, url, and type are required' }, { status: 400 });
    }

    const media = await prisma.galleryMedia.create({
      data: {
        albumId,
        type,
        url,
        thumbnailUrl: thumbnailUrl || null,
        publicId:     publicId     || null,
        caption:      caption?.trim() || null,
        location:     location?.trim() || null,
        takenAt:      takenAt ? new Date(takenAt) : null,
        width:        width  ? parseInt(width)  : null,
        height:       height ? parseInt(height) : null,
        order:        parseInt(order) || 0,
      },
    });

    // If this is the first media, auto-set it as album cover
    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
    if (album && !album.coverUrl) {
      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data:  { coverUrl: thumbnailUrl || url },
      });
    }

    revalidatePath('/gallery');
    revalidatePath('/gallery/[slug]', 'page');
    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    console.error('POST /api/gallery/media error:', err);
    return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
  }
}
