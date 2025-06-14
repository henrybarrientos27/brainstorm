// app/api/client/[email]/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const email: string = emailParam || "";

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const transcriptData = await prisma.summary.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    const combinedText = transcriptData.map(s => s.content).join("\n");
    const prompt = `You are an advanced AI assistant trained to extract meaningful client behavioral and financial insights from advisor-client meeting transcripts. Carefully analyze the following recent transcript data and extract specific insights that a financial advisor should know to strengthen the relationship, understand the client’s goals, and anticipate future needs. Use bullet points.\n\n${combinedText}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You extract valuable financial insights from transcript summaries."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const insightText = response.choices[0].message.content || "";

    const insight = await prisma.insight.create({
      data: {
        clientId: client.id,
        content: insightText
      }
    });

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("POST insights error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const email: string = emailParam || "";

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const insights = await prisma.insight.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("GET insights error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
