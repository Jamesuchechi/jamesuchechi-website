// ── API ROUTE: src/app/api/digest/route.js ──────────────────
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    await prisma.digestSubscriber.upsert({
      where:  { email: email.trim().toLowerCase() },
      update: { active: true },
      create: { email: email.trim().toLowerCase(), active: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Digest signup error:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { email } = await request.json();
    await prisma.digestSubscriber.update({
      where:  { email: email.trim().toLowerCase() },
      data:   { active: false },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}