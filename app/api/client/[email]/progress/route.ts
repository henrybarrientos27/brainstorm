// File: app/api/client/[email]/progress/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const { goal, status, notes } = await req.json();

  try {
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const progress = await prisma.progress.create({
      data: {
        goal,
        status,
        notes,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const progress = await prisma.progress.findMany({
      where: { client: { email } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
