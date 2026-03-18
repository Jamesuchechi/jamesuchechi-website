import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/guestbook/[id] — admin: get any entry
export async function GET(_, { params }) {
  try {
    const { id }  = await params;
    const entry   = await prisma.guestbookEntry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

// PUT /api/guestbook/[id] — admin: approve/unapprove
export async function PUT(request, { params }) {
  try {
    const { id }  = await params;
    const { approved } = await request.json();
    const entry   = await prisma.guestbookEntry.update({
      where: { id },
      data:  { approved: Boolean(approved) },
    });
    return NextResponse.json(entry);
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE /api/guestbook/[id] — admin
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.guestbookEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
