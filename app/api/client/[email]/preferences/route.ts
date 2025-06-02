// File: app/api/client/[email]/preferences/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const { riskTolerance, communicationStyle, preferredProducts } = await req.json();

  try {
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const preferences = await prisma.preferences.create({
      data: {
        riskTolerance,
        communicationStyle,
        preferredProducts,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const email: string = emailParam || "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const preferences = await prisma.preferences.findMany({
      where: { client: { email } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}
