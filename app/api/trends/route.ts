
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientEmail } = body;

    if (!clientEmail) {
      return NextResponse.json({ error: "Missing client email" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
      include: {
        summaries: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const insights = await prisma.insight.findMany({
      where: { clientId: client.id },
    });

    const allText = [
      ...client.summaries.map((s) => s.content),
      ...insights.map((i) => i.content),
    ].join("\n\n");

    const openaiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert assistant for financial advisors. Analyze the provided summaries and insights to detect client behavior trends, recurring themes, risk patterns, and relationship shifts. Output a clear and concise 'Client Trend Report' in bullet points or short paragraphs.",
        },
        {
          role: "user",
          content: `Here are all summaries and insights for ${client.name}:

${allText}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const trendReport = openaiRes.choices[0].message.content;

    return NextResponse.json({ trendReport });
  } catch (err) {
    console.error("Trend Report Error:", err);
    return NextResponse.json({ error: "Failed to generate trend report" }, { status: 500 });
  }
}
