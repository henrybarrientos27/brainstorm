import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, status, data, provider, url, email } = body;

    if (!type || !status || !data || !provider || !url || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const form = await prisma.form.create({
      data: {
        type,
        status,
        data,
        provider,
        url,
        client: {
          connect: {
            email,
          },
        },
      },
    });

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
