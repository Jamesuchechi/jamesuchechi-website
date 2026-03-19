import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/posts/[id]
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/posts/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const { title, slug, description, content, type, category, stage, tags, published, date } = body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title       !== undefined && { title:       title.trim() }),
        ...(slug        !== undefined && { slug:        slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(content     !== undefined && { content }),
        ...(type        !== undefined && { type }),
        ...(category    !== undefined && { category }),
        ...(stage       !== undefined && { stage }),
        ...(tags        !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(published   !== undefined && { published }),
        ...(date        !== undefined && { date: new Date(date) }),
      },
    });

    revalidatePath('/writing');
    revalidatePath('/garden');
    revalidatePath('/');
    revalidatePath(`/writing/${post.slug}`);
    revalidatePath(`/garden/${post.slug}`);

    return NextResponse.json(post);
  } catch (err) {
    console.error('PUT /api/posts/[id] error:', err);
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.post.delete({ where: { id } });

    revalidatePath('/writing');
    revalidatePath('/garden');
    revalidatePath('/');
    revalidatePath(`/writing/${post.slug}`);
    revalidatePath(`/garden/${post.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err);
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
