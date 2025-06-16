// app/api/client/[email]/forms/pull/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const clientEmail = "client@example.com"; // Replace with actual logic if needed

  try {
    // Find the client
    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get forms related to this client
    const forms = await prisma.form.findMany({
      where: { clientId: client.id },
    });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("Error pulling forms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
