import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/uses/[id]
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const item = await prisma.usesItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

// PUT /api/uses/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { name, description, category, url, imageUrl, featured, order } = body;

    const item = await prisma.usesItem.update({
      where: { id },
      data: {
        ...(name        !== undefined && { name:        name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(category    !== undefined && { category }),
        ...(url         !== undefined && { url:         url?.trim()      || null }),
        ...(imageUrl    !== undefined && { imageUrl:    imageUrl?.trim() || null }),
        ...(featured    !== undefined && { featured }),
        ...(order       !== undefined && { order: parseInt(order) || 0 }),
      },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error('PUT /api/uses/[id] error:', err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE /api/uses/[id]
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.usesItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
