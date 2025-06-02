import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    try {
        const { clientEmail } = await req.json();
        if (!clientEmail) return NextResponse.json({ error: "Missing clientEmail" }, { status: 400 });

        const client = await prisma.client.findUnique({
            where: { email: clientEmail },
            include: { summaries: true },
        });

        if (!client || client.summaries.length === 0) {
            return NextResponse.json({ error: "No summaries found for client" }, { status: 404 });
        }

        const fullText = client.summaries.map((s) => s.content).join("\n\n");

        const prompt = `
You are an assistant that identifies hidden client intentions based on past financial meeting summaries.
From the text below, extract 1-3 likely client goals, desires, or plans.

Examples:
- Thinking about early retirement
- Wants to invest in real estate
- Concerned about health care costs

Summaries:
${fullText}

Return a list of client intents.
`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 500,
        });

        const result = response.choices[0]?.message?.content?.trim();

        return NextResponse.json({ intents: result });
    } catch (err) {
        console.error("Intent detection error:", err);
        return NextResponse.json({ error: "Intent analysis failed" }, { status: 500 });
    }
}
