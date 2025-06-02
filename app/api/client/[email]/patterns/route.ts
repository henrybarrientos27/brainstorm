// ✅ All additional cleaned routes: Persona, Patterns, Trust Score
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";


// Pattern Detection
// Pattern Detection
// Pattern Detection
export async function GETPatterns(
    _req: NextRequest,
    context: { params: { email: string } }
) {
    const email = decodeURIComponent(context.params.email);
    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                summaries: { orderBy: { createdAt: "desc" } },
            },
        });

        if (!client || !client.summaries.length) {
            return NextResponse.json({ error: "Client or summaries not found" }, { status: 404 });
        }

        const content = client.summaries.map((s) => s.content).join("\n\n");

        const result = await new OpenAI().chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You're a financial AI assistant. Analyze transcripts and extract notable behavioral patterns across meetings.",
                },
                {
                    role: "user",
                    content,
                },
            ],
        });

        const patterns = result.choices[0].message?.content || "None detected";
        return NextResponse.json({ patterns });
    } catch (_error) {
        console.error("Patterns error:", _error);
        return NextResponse.json({ error: "Failed to detect patterns." }, { status: 500 });
    }
}
