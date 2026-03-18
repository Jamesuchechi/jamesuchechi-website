import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';
import nodemailer       from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to DB
    await prisma.contact.create({
      data: { name: name.trim(), email: email.trim(), message: message.trim() },
    });

    // Email notification (optional — only if configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transport.sendMail({
        from:    process.env.EMAIL_USER,
        to:      process.env.ADMIN_EMAIL,
        subject: `New message from ${name} — jamesuchechi.com`,
        text:    `From: ${name} <${email}>\n\n${message}`,
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
