// app/api/client/[email]/trust-score/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { email: emailParam },
      include: {
        insights: true,
        feedback: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const insights = client.insights
      .map((i) => `${i.tags.join(", ")}: ${i.content}`)
      .join("\n");

    const feedback = client.feedback
      .map((f) => `${f.message}`)
      .join("\n");

    const content = `You are an advanced trust detection engine for financial advisors.
A trust score is between 0 and 100:
- 0 means the client has no trust in the advisor
- 50 means neutral or unsure
- 100 means full trust and comfort

Analyze the following insights and feedback, and determine how much the client trusts the advisor. 
If the client sounds scared, skeptical, or unsure, the trust score should be lower.
If they sound positive, confident, or trusting, the score should be higher.

Insights:
${insights}

Feedback:
${feedback}

Respond with only the trust score number.`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content,
        },
      ],
      model: "gpt-4",
    });

    const numberOnly = response.choices[0].message.content?.match(/\d+/);
    const value = numberOnly ? parseInt(numberOnly[0], 10) : undefined;

    if (value === undefined || isNaN(value)) {
      return NextResponse.json({ error: "Failed to extract trust score" }, { status: 400 });
    }

    const score = await prisma.trustScore.create({
      data: {
        value,
        client: { connect: { email: emailParam } },
      },
    });

    return NextResponse.json(score);
  } catch (error) {
    console.error("Error generating trust score:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
