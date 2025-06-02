// File: app/api/client/[email]/activity/log/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;
  const body = await req.json();
  const { type, details } = body;

  if (!type || !details) {
    return NextResponse.json({ error: "Missing type or details" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        details,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
