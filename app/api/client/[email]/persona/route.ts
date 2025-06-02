// ✅ All additional cleaned routes: Persona, Patterns, Trust Score
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI();

// Persona Tagging
export async function GETPersona(
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

        const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You're a financial client behavior analyzer. Based on transcripts, tag their persona traits like 'Risk Averse', 'Guarded', etc.",
                },
                {
                    role: "user",
                    content,
                },
            ],
        });

        const traits = result.choices[0].message?.content || "Undetermined";
        return NextResponse.json({ traits });
    } catch (_error) {
        console.error("Persona error:", _error);
        return NextResponse.json({ error: "Failed to tag persona." }, { status: 500 });
    }
}