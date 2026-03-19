import { NextResponse } from 'next/server';

// POST /api/gallery/upload-signature
// Returns a Cloudinary signed upload signature so the browser can upload directly
export async function POST() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Add CLOUDINARY_* env vars.' },
        { status: 503 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const body      = await request.json().catch(() => ({}));
    const { folder = 'jamesuchechi-uploads' } = body;

    // Build the string to sign
    const str = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // SHA-1 via Web Crypto (available in Edge + Node.js 18+)
    const msgBuffer  = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    const signature  = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    });
  } catch (err) {
    console.error('Signature error:', err);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
