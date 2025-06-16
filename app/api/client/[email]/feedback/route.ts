// app/api/client/[email]/feedback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { message, rating } = await req.json();
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
      return NextResponse.json({ error: "Missing client email in query." }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Invalid or missing message." }, { status: 400 });
    }

    if (!rating || typeof rating !== 'number') {
      return NextResponse.json({ error: "Invalid or missing rating." }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        message,
        rating,
        client: {
          connect: { email: emailParam },
        },
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
