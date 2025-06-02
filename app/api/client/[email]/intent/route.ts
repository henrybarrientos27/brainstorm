// File: app/api/client/[email]/intent/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam;

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                summaries: true,
                insights: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const combinedText = `Summaries:\n${client.summaries
            .map((s) => s.content)
            .join("\n\n")}\n\nInsights:\n${client.insights
                .map((i) => i.content)
                .join("\n")}`;

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that detects the client's current intent based on summaries and insights. Return the intent as a short sentence.",
                },
                {
                    role: "user",
                    content: combinedText,
                },
            ],
        });

        const detectedIntent = aiResponse.choices[0].message.content;

        const intent = await prisma.intent.create({
            data: {
                message: detectedIntent || "Unknown",
                client: { connect: { email } },
            },
        });

        return NextResponse.json(intent);
    } catch (error) {
        console.error("Intent detection failed:", error);
        return NextResponse.json({ error: "Failed to detect intent" }, { status: 500 });
    }
}
