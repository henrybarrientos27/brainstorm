import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email param" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { email },
    include: {
      summaries: true,
      insights: true,
      trustScore: true,
      coachingPrompt: true,
      forms: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const dataBlob = {
    name: client.name,
    trustScore: client.trustScore?.value ?? 50,
    summaries: client.summaries.map((s) => s.content),
    insights: client.insights.map((i) => ({ tags: i.tags, content: i.content })),
    coaching: client.coachingPrompt?.content ?? "",
    forms: client.forms.map((f) => ({ type: f.type, provider: f.provider })),
  };

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
    input: [
      {
        role: "system",
        content:
          "Generate a draft, compliance-conscious financial form for advisor review. " +
          "Never represent the draft as approved, filed, or legal advice.",
      },
      {
        role: "user",
        content: `Client data snapshot: ${JSON.stringify(dataBlob)}`,
      },
    ],
  });

  return NextResponse.json({ output: response.output_text });
}
