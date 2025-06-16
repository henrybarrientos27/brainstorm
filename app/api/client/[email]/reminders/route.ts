// route.ts for /api/client/[email]/reminders
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const body = await req.json();
  const { message, note, dueDate } = body;

  try {
    const reminder = await prisma.reminder.create({
      data: {
        message,
        note,
        dueDate: new Date(dueDate),
        client: { connect: { email: emailParam } },
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}
