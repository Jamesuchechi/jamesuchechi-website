import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/guestbook — approved entries, newest first
export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      where:   { approved: true },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, name: true, message: true, createdAt: true },
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error('GET /api/guestbook error:', err);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

// Simple in-memory rate limit: 1 submission per IP per 15 min
const rateLimitMap = new Map();
const RATE_WINDOW  = 15 * 60 * 1000;

// POST /api/guestbook — submit new entry (public, goes pending)
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const lastTime = rateLimitMap.get(ip);
    if (lastTime && Date.now() - lastTime < RATE_WINDOW) {
      return NextResponse.json(
        { error: 'You can submit once every 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, message, email } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'name and message are required' }, { status: 400 });
    }
    if (message.trim().length > 500) {
      return NextResponse.json({ error: 'Message must be 500 characters or fewer' }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        name:    name.trim().slice(0, 80),
        message: message.trim(),
        email:   email?.trim() || null,
        approved: false,
      },
    });

    rateLimitMap.set(ip, Date.now());
    // Clean up old entries
    for (const [k, v] of rateLimitMap) {
      if (Date.now() - v > RATE_WINDOW) rateLimitMap.delete(k);
    }

    revalidatePath('/guestbook');
    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/guestbook error:', err);
    return NextResponse.json({ error: 'Failed to submit entry' }, { status: 500 });
  }
}
