import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { clientEmail } = await req.json();

    if (!clientEmail) {
      return NextResponse.json({ error: "Missing client email" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
      include: {
        insights: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!client || client.insights.length === 0) {
      return NextResponse.json({ error: "No insights found for client" }, { status: 404 });
    }

    const combinedInsights = client.insights
      .map((i, index) => `Session ${index + 1} (${new Date(i.createdAt).toLocaleDateString()}): ${i.content}`)
      .join("\n\n");

    const prompt = `
You are an AI trained in financial psychology and behavior tracking.

Your task is to review multiple sessions' worth of insights about the same client and identify:

- Emotional or psychological patterns
- Shifts in mindset or confidence
- Recurring fears or goals
- Changes in trust signals
- Notable behavioral trends

Here is the timeline of insights:

${combinedInsights}

Return your response as a short paragraph summarizing the patterns you detect.
`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const patternSummary = gptResponse.choices[0]?.message?.content;

    return NextResponse.json({ patterns: patternSummary });
  } catch (err) {
    console.error("Error in /api/patterns route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
