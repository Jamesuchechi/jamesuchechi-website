import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// PUT /api/now/[id] — Update an entry
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { section, content, order } = body;

    const entry = await prisma.nowEntry.update({
      where: { id },
      data: {
        ...(section !== undefined && { section }),
        ...(content !== undefined && { content }),
        ...(order   !== undefined && { order: parseInt(order) || 0 }),
      },
    });
    revalidatePath('/now');
    revalidatePath('/');
    return NextResponse.json(entry);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE /api/now/[id] — Remove an entry
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.nowEntry.delete({ where: { id } });
    revalidatePath('/now');
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
