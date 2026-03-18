import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/guestbook/admin-list — ALL entries including unapproved (admin only)
export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: [{ approved: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
