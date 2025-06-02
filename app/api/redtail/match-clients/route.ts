// File: app/api/redtail/match-clients/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text input" }, { status: 400 });
    }

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = text.match(emailRegex) || [];

    const uniqueEmails = [...new Set(foundEmails.map(e => e.toLowerCase()))];

    const matchedClients = await prisma.client.findMany({
      where: {
        OR: uniqueEmails.map(email => ({ email }))
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return NextResponse.json({ matchedClients });
  } catch (error) {
    console.error("Error matching Redtail clients:", error);
    return NextResponse.json({ error: "Failed to match clients" }, { status: 500 });
  }
}
