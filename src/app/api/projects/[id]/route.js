import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

// PUT /api/projects/[id] — update project
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();
    const {
      title, slug, summary, description,
      coverUrl, liveUrl, githubUrl,
      techStack, category, featured, order, published, builtAt,
    } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title       !== undefined && { title:       title.trim() }),
        ...(slug        !== undefined && { slug:        slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(summary     !== undefined && { summary:     summary.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(coverUrl    !== undefined && { coverUrl:    coverUrl?.trim()    || null }),
        ...(liveUrl     !== undefined && { liveUrl:     liveUrl?.trim()     || null }),
        ...(githubUrl   !== undefined && { githubUrl:   githubUrl?.trim()   || null }),
        ...(techStack   !== undefined && {
          techStack: Array.isArray(techStack)
            ? techStack
            : techStack.split(',').map(s => s.trim()).filter(Boolean),
        }),
        ...(category    !== undefined && { category }),
        ...(featured    !== undefined && { featured }),
        ...(order       !== undefined && { order: parseInt(order) || 0 }),
        ...(published   !== undefined && { published }),
        ...(builtAt     !== undefined && { builtAt: builtAt ? new Date(builtAt) : null }),
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error('PUT /api/projects/[id] error:', err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/projects/[id] error:', err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// GET /api/projects/[id] — single project
export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
