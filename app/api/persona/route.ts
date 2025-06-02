
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
      include: { summaries: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const insights = await prisma.insight.findMany({
      where: { clientId: client.id }
    });

    const allText = [
      ...client.summaries.map(s => s.content),
      ...insights.map(i => i.content)
    ].join("\n\n");

    const openaiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in behavioral psychology for financial advisors. Given this transcript history, respond ONLY with a JSON array of 3–5 persona traits that describe this client, such as 'Risk Averse', 'Goal-Oriented', or 'Skeptical'."
        },
        {
          role: "user",
          content: `Client name: ${client.name}

Conversation history:
${allText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = openaiRes.choices[0].message.content?.trim();

    // Try parsing the array
    let traits: string[] = [];
    try {
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) traits = parsed;
      }
    } catch (e) {
      console.error("Failed to parse persona traits from OpenAI", e);
    }

    return NextResponse.json({ personaTraits: traits });
  } catch (err) {
    console.error("Persona traits error:", err);
    return NextResponse.json({ error: "Failed to generate persona traits" }, { status: 500 });
  }
}
