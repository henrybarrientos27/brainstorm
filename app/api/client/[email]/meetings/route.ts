// File: app/api/client/[email]/meetings/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const { title, date, time, location, notes } = await req.json();

  try {
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        date,
        time,
        location,
        notes,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { client: { email } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}
