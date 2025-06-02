// File: app/api/client/[email]/insights/route.ts

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: { summaries: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const combinedText = client.summaries.map((s) => s.content).join("\n\n");

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI that extracts key behavioral and financial insights from transcript summaries. Label each insight with a tag like 'Risk Averse', 'Aggressive', 'Trust Concern', or 'Opportunity'. Return them as JSON objects with 'tag' and 'content'.",
                },
                {
                    role: "user",
                    content: combinedText,
                },
            ],
        });

        const json = completion.choices[0].message?.content || "[]";
        const insights = JSON.parse(json);

        for (const insight of insights) {
            await prisma.insight.create({
                data: {
                    tag: insight.tag,
                    content: insight.content,
                    client: { connect: { email } },
                },
            });
        }

        await prisma.activity.create({
            data: {
                type: "Insight",
                details: "Extracted insights using AI.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, insights });
    } catch (error) {
        console.error("Error generating insights:", error);
        return NextResponse.json(
            { error: "Failed to generate insights" },
            { status: 500 }
        );
    }
}
