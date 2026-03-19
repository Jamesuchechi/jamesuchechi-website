import { NextResponse }   from 'next/server';
import { prisma }         from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/posts — all posts (admin, includes unpublished)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;

    const posts = await prisma.post.findMany({
      where:   type ? { type } : {},
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts — create post
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, description, content, type, category, stage, tags, published, date } = body;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title:       title.trim(),
        slug:        slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description?.trim() || null,
        content:     content,
        type:        type     || 'writing',
        category:    category || null,
        stage:       stage    || null,
        tags:        Array.isArray(tags) ? tags : [],
        published:   published ?? true,
        date:        date ? new Date(date) : new Date(),
      },
    });

    revalidatePath('/writing');
    revalidatePath('/garden');
    revalidatePath('/');
    revalidatePath(`/writing/${post.slug}`);
    revalidatePath(`/garden/${post.slug}`);

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
