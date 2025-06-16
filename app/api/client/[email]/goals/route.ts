// app/api/client/[email]/goals/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, title, description, dueDate, status } = await req.json();

    // Validate required fields
    if (!email || !title || !description || !dueDate || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
        client: {
          connect: { email },
        },
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
