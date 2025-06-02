// app/api/client/[email]/persona/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const email: string = emailParam;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const insights = await prisma.insight.findMany({ where: { clientId: client.id } });
    const summaries = await prisma.summary.findMany({ where: { clientId: client.id } });
    const feedbacks = await prisma.feedback.findMany({ where: { clientId: client.id } });
    const patterns = await prisma.pattern.findMany({ where: { clientId: client.id } });
    const history = await prisma.history.findMany({ where: { clientId: client.id } });

    const formatted = [
        "Insights:",
        ...insights.map(i => `- ${i.tags.join(", ")}: ${i.content}`),
        "\nSummaries:",
        ...summaries.map(s => `- ${s.content}`),
        "\nFeedback:",
        ...feedbacks.map(f => `- ${f.message} (rating: ${f.rating})`),
        "\nPatterns:",
        ...patterns.map(p => `- ${p.trait}`),
        "\nActivity History:",
        ...history.map(h => `- ${h.action} | ${JSON.stringify(h.metadata)}`),
    ].join("\n");

    const prompt = `Analyze the following information to identify the client's persona traits. Be consistent, infer trustworthiness, risk style, optimism, and decision style. Return a labeled list of traits with optional explanation:\n\n${formatted}`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You're an expert behavioral analyst for financial advisors." },
            { role: "user", content: prompt }
        ]
    });

    const personaOutput = response.choices[0].message.content || "";
    await prisma.persona.upsert({
        where: { clientId: client.id },
        update: { trait: personaOutput, score: 0 },
        create: { clientId: client.id, trait: personaOutput, score: 0 },
    });

    return NextResponse.json({ traits: personaOutput });
}
