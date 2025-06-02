// File: app/api/client/[email]/goals/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;
  const body = await req.json();
  const { title, description, deadline } = body;

  if (!title || !description || !deadline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;

  try {
    const client = await prisma.client.findUnique({
      where: { email },
      include: { goals: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ goals: client.goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
