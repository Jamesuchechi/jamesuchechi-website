import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/timeline/[id]
export async function GET(_, { params }) {
  try {
    const { id }  = await params;
    const entry   = await prisma.timelineEntry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

// PUT /api/timeline/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { title, description, category, date, icon, linkUrl, linkLabel, published } = body;

    const entry = await prisma.timelineEntry.update({
      where: { id },
      data: {
        ...(title       !== undefined && { title:       title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(category    !== undefined && { category }),
        ...(date        !== undefined && { date:        new Date(date) }),
        ...(icon        !== undefined && { icon:        icon?.trim()      || null }),
        ...(linkUrl     !== undefined && { linkUrl:     linkUrl?.trim()   || null }),
        ...(linkLabel   !== undefined && { linkLabel:   linkLabel?.trim() || null }),
        ...(published   !== undefined && { published }),
      },
    });
    revalidatePath('/timeline');
    revalidatePath('/');
    return NextResponse.json(entry);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE /api/timeline/[id]
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.timelineEntry.delete({ where: { id } });
    revalidatePath('/timeline');
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
