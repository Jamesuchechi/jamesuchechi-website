import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/uses — all uses items
export async function GET() {
  try {
    const items = await prisma.usesItem.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });

    // Group by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return NextResponse.json({ items, grouped });
  } catch (err) {
    console.error('GET /api/uses error:', err);
    return NextResponse.json({ error: 'Failed to fetch uses items' }, { status: 500 });
  }
}

// POST /api/uses — create uses item (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, category, url, imageUrl, featured, order } = body;

    if (!name?.trim() || !category?.trim()) {
      return NextResponse.json({ error: 'name and category are required' }, { status: 400 });
    }

    const item = await prisma.usesItem.create({
      data: {
        name:        name.trim(),
        description: description?.trim() || null,
        category:    category.trim(),
        url:         url?.trim()        || null,
        imageUrl:    imageUrl?.trim()   || null,
        featured:    featured           ?? false,
        order:       parseInt(order)    || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error('POST /api/uses error:', err);
    return NextResponse.json({ error: 'Failed to create uses item' }, { status: 500 });
  }
}
