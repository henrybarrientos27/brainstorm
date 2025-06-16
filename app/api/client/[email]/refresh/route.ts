// app/api/client/[email]/refresh/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { email: emailParam },
      include: {
        summaries: true,
        insights: true,
        trustScore: true,
        coachingPrompt: true,
        timelineEvent: true,
        forms: true,
        activities: true,
        feedback: true,
        preferences: true,
        goals: true,
        notifications: true,
        progress: true,
        meetings: true,
        intent: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
