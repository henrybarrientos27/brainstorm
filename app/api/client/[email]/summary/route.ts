// app/api/client/[email]/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  const email: string = emailParam;

  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const formData = await req.formData();
  const transcript = formData.get("transcript")?.toString();
  if (!transcript) return NextResponse.json({ error: "Missing transcript" }, { status: 400 });

  const prompt = `Analyze the following client meeting transcript and generate a structured summary. Include the key points discussed, any financial decisions made, next steps, and advisor recommendations. Use bullet points when possible. Ensure the tone is professional and consistent:

${transcript}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You're a professional financial assistant summarizing transcripts for compliance and client reference." },
      { role: "user", content: prompt }
    ]
  });

  const content = response.choices[0].message.content || "";

  const summary = await prisma.summary.create({
    data: {
      clientId: client.id,
      content
    }
  });

  return NextResponse.json({ summary });
}
