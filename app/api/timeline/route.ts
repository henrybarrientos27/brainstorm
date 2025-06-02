import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { clientEmail } = await req.json();

    if (!clientEmail) {
      return NextResponse.json({ error: "Missing clientEmail" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
      include: {
        summaries: { orderBy: { createdAt: "asc" } },
        insights: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({
      timeline: {
        summaries: client.summaries,
        insights: client.insights,
      },
    });
  } catch (err) {
    console.error("Error fetching memory timeline:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
