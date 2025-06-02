// File: app/api/client/[email]/alerts/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;
  const { message, type } = await req.json();

  if (!message || !type) {
    return NextResponse.json({ error: "Missing alert message or type" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const alert = await prisma.alert.create({
      data: {
        type,
        message,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam;

  try {
    const alerts = await prisma.alert.findMany({
      where: {
        client: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
