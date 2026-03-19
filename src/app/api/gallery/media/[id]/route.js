import { NextResponse }    from 'next/server';
import { prisma }          from '@/lib/prisma';
import { revalidatePath }  from 'next/cache';

// PUT /api/gallery/media/[id] — update caption, location, order
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { caption, location, takenAt, order } = body;

    const media = await prisma.galleryMedia.update({
      where: { id },
      data: {
        ...(caption  !== undefined && { caption:  caption?.trim()  || null }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(takenAt  !== undefined && { takenAt:  takenAt ? new Date(takenAt) : null }),
        ...(order    !== undefined && { order:    parseInt(order) || 0 }),
      },
    });
    revalidatePath('/gallery');
    revalidatePath('/gallery/[slug]', 'page');
    return NextResponse.json(media);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// DELETE /api/gallery/media/[id] — delete from DB (Cloudinary cleanup via API)
export async function DELETE(_, { params }) {
  try {
    const { id }   = await params;
    const media    = await prisma.galleryMedia.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Attempt Cloudinary deletion if publicId is stored
    if (media.publicId) {
      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey    = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (cloudName && apiKey && apiSecret) {
          const timestamp = Math.floor(Date.now() / 1000);
          const str       = `public_id=${media.publicId}&timestamp=${timestamp}${apiSecret}`;
          // Use Web Crypto for SHA-1
          const msgBuffer  = new TextEncoder().encode(str);
          const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
          const hashArray  = Array.from(new Uint8Array(hashBuffer));
          const signature  = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const resourceType = media.type === 'video' ? 'video' : 'image';
          await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
            {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                public_id: media.publicId,
                api_key:   apiKey,
                timestamp,
                signature,
              }),
            }
          );
        }
      } catch {
        // Cloudinary deletion is best-effort; don't fail DB delete because of it
      }
    }

    await prisma.galleryMedia.delete({ where: { id } });
    revalidatePath('/gallery');
    revalidatePath('/gallery/[slug]', 'page');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
