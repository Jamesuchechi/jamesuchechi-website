import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/timeline/admin-list — ALL timeline entries including drafts (admin only)
export async function GET() {
  try {
    const entries = await prisma.timelineEntry.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch timeline entries' }, { status: 500 });
  }
}
