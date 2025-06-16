// app/api/client/[email]/notifications/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, message, category } = await req.json();

    if (!email || !message || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        message,
        category,
        client: { connect: { email } },
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
