// app/api/client/[email]/meetings/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, title, date, time, location } = await req.json();

    if (!email || !title || !date || !time || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        date: new Date(date),
        time,
        location,
        client: {
          connect: { email },
        },
      },
    });

    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    console.error("Meeting creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
