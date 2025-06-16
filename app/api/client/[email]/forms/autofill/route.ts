import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
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

    return NextResponse.json(dataBlob);
  } catch (error) {
    console.error("Error in autofill route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
