// app/api/client/[email]/preferences/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, riskTolerance, communicationStyle } = await req.json();

    if (!email || !riskTolerance || !communicationStyle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const preferences = await prisma.preference.create({
      data: {
        riskTolerance,
        communicationStyle,
        client: {
          connect: { email },
        },
      },
    });

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Preference creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
