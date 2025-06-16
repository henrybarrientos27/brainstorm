// app/api/client/[email]/summary/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { email: emailParam },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const body = await req.json();
    const { transcript } = body;

    if (!transcript || transcript.trim() === "") {
      return NextResponse.json({ error: "Missing transcript content" }, { status: 400 });
    }

    // Generate summary content via OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional financial assistant. Summarize client meeting transcripts clearly and concisely in 1-3 sentences using a professional tone. Highlight goals, concerns, and decisions."
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    });

    const content = completion.choices[0].message.content?.trim() || "";

    // Generate a smart title
    function generateSmartTitle(text: string): string {
      if (!text || text.trim() === "") return "Client Summary";
      const sentence = text.split(/[.?!\n]/)[0].trim();
      const short = sentence.length > 60 ? sentence.slice(0, 57) + "..." : sentence;
      return short.charAt(0).toUpperCase() + short.slice(1);
    }

    const title = generateSmartTitle(content);

    const summary = await prisma.summary.create({
      data: {
        clientId: client.id,
        title,
        content,
      },
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error creating summary:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
