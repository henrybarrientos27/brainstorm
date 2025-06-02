// File: app/api/client/[email]/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;

  try {
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        summaries: true,
        insights: true,
        trustScores: true,
        coachingPrompts: true,
        timeline: true,
        forms: true,
        activity: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error refreshing client dashboard:", error);
    return NextResponse.json({ error: "Failed to refresh dashboard" }, { status: 500 });
  }
}
