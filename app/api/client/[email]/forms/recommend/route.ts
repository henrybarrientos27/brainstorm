// File: app/api/client/[email]/forms/recommend/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(
  _req: NextRequest,
  context: { params: { email: string } }
) {
  const email = decodeURIComponent(context.params.email);

  try {
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        summaries: { orderBy: { createdAt: "desc" } },
        insights: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const summaries = client.summaries.map((s) => s.content).join("\n\n");
    const insights = client.insights.map((i) => i.content).join("\n\n");

    const prompt = `You are a financial advisor assistant AI. Based on the client summaries and insights below, recommend the financial forms that should be prepared (e.g., account opening, risk profile, beneficiary form, transfer form, etc.).

Return an array of JSON objects like this:
[
  {
    "name": "New Roth IRA Application",
    "type": "Account Opening",
    "provider": "SEI or Osaic"
  },
  ...
]

Client Summary:
${summaries}

Client Insights:
${insights}`;

    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You recommend and structure forms for financial clients." },
        { role: "user", content: prompt },
      ],
    });

    const raw = result.choices[0].message.content || "";

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ forms: parsed });
    } catch (err) {
      console.error("Form parse error:", raw);
      return NextResponse.json({ error: "Invalid AI format" }, { status: 500 });
    }
  } catch (err) {
    console.error("Recommend Forms Error:", err);
    return NextResponse.json({ error: "Failed to recommend forms." }, { status: 500 });
  }
}
