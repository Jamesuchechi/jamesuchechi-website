import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

export async function POST(request) {
  try {
    const { slug, section = 'page' } = await request.json();
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    const view = await prisma.pageView.upsert({
      where:  { slug_month: { slug, month } },
      update: { count: { increment: 1 } },
      create: { slug, section, month, count: 1 },
    });

    return NextResponse.json({ count: view.count });
  } catch (err) {
    console.error('View count error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ count: 0 });

  try {
    const rows = await prisma.pageView.findMany({ where: { slug } });
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    return NextResponse.json({ count: total });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
