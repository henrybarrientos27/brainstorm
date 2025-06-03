// app/api/coaching/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const insights = await prisma.insight.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: "desc" },
      take: 15
    });

    const formattedInsights = insights.map(i => `- ${i.content}`).join("\n");
    const coachingPrompt = `You are an elite financial advisor AI. Based on the following insights from recent client meetings, generate a detailed coaching prompt for the advisor before their next session. Be specific, client-personalized, and forward-looking:
\n\n${formattedInsights}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a strategic coaching assistant helping financial advisors prepare for meetings."
        },
        {
          role: "user",
          content: coachingPrompt
        }
      ]
    });

    const content = response.choices[0].message.content || "";

    const prompt = await prisma.coachingPrompt.create({
      data: {
        clientId: client.id,
        content
      }
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Coaching route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
