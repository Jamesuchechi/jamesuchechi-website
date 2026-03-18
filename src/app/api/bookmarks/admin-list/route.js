import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/bookmarks/admin-list — ALL bookmarks including drafts (admin only)
export async function GET() {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
