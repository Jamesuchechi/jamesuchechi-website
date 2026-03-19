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

    // 1. Save to DB (Primary)
    const entry = await prisma.contact.create({
      data: { name: name.trim(), email: email.trim(), message: message.trim() },
    });
    console.log(`Contact entry created: ${entry.id}`);

    // 2. Email notification (Optional/Non-blocking)
    const canSendEmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (canSendEmail) {
      // We don't 'await' this so we can return the response faster, 
      // but we wrap in a try-catch to avoid background crashes.
      (async () => {
        try {
          const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
          });

          await transport.sendMail({
            from:    `"${name}" <${process.env.EMAIL_USER}>`, // Send as you, but with their name
            to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            replyTo: email, // Direct replies go to the sender
            subject: `✦ New message from ${name}`,
            text:    `From: ${name} <${email}>\n\n${message}`,
          });
          console.log('Contact notification email sent successfully');
        } catch (mailErr) {
          console.error('Email notification failed but DB save was successful:', mailErr);
        }
      })();
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('CRITICAL: Contact form failure:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please email directly.' },
      { status: 500 }
    );
  }
}
