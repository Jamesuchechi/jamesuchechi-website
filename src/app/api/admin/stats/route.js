import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/admin/stats — dashboard overview counts
export async function GET(request) {
  // Verify session cookie
  const session = request.cookies.get('admin_session')?.value;
  if (!session || session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [projects, usesItems, contacts, pageViews] = await Promise.all([
      prisma.project.count(),
      prisma.usesItem.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.pageView.aggregate({ _sum: { count: true } }),
    ]);

    return NextResponse.json({
      projects,
      usesItems,
      unreadContacts: contacts,
      totalViews: pageViews._sum.count || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
