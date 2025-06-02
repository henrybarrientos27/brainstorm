// File: app/api/client/[email]/recommendations/route.ts

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
      include: { recommendations: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client.recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;
  const { message, type } = await req.json();

  try {
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        message,
        type,
        client: { connect: { email } },
      },
    });

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return NextResponse.json({ error: "Failed to create recommendation" }, { status: 500 });
  }
}
