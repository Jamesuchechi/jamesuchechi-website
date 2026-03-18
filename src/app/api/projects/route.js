import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// GET /api/projects — all published projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where = { published: true };
    if (category && category !== 'all') where.category = category;
    if (featured === 'true') where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error('GET /api/projects error:', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects — create project (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title, slug, summary, description,
      coverUrl, liveUrl, githubUrl,
      techStack, category, featured, order, published, builtAt,
    } = body;

    if (!title?.trim() || !slug?.trim() || !summary?.trim()) {
      return NextResponse.json(
        { error: 'title, slug, and summary are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title:       title.trim(),
        slug:        slug.trim().toLowerCase().replace(/\s+/g, '-'),
        summary:     summary.trim(),
        description: description?.trim() || null,
        coverUrl:    coverUrl?.trim()    || null,
        liveUrl:     liveUrl?.trim()     || null,
        githubUrl:   githubUrl?.trim()   || null,
        techStack:   Array.isArray(techStack)
                       ? techStack
                       : (techStack || '').split(',').map(s => s.trim()).filter(Boolean),
        category:    category            || 'web',
        featured:    featured            ?? false,
        order:       parseInt(order)     || 0,
        published:   published           ?? true,
        builtAt:     builtAt ? new Date(builtAt) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
