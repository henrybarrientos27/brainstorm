""// /app/api/client/[email]/forms/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

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

  const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.3 });

  const response = await chat.call([
    new SystemMessage(
      "You are a helpful assistant that generates compliance-friendly, pre-filled financial forms for advisors based on known client information."
    ),
    new HumanMessage(
      `Here is a snapshot of the client's current data: ${JSON.stringify(dataBlob)}`
    ),
  ]);

  return NextResponse.json({ output: response.text });
}
