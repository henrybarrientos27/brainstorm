// File: app/api/client/[email]/coaching/route.ts

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
            include: {
                summaries: true,
                insights: true,
                trustScores: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const data = `
Client Name: ${client.name}
Summaries:
${client.summaries.map((s) => s.content).join("\n\n")}
Insights:
${client.insights.map((i) => `${i.tag}: ${i.content}`).join("\n")}
Trust Scores:
${client.trustScores.map((t) => `Score: ${t.value}`).join("\n")}
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI assistant coach. Review the client's profile, summaries, insights, and trust scores to generate a one-paragraph coaching prompt to help the advisor approach the client better in the next meeting.",
                },
                {
                    role: "user",
                    content: data,
                },
            ],
        });

        const response = completion.choices[0].message?.content || "";

        await prisma.coachingPrompt.create({
            data: {
                content: response,
                client: { connect: { email } },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Coaching Prompt",
                details: "Generated coaching prompt using AI.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, prompt: response });
    } catch (error) {
        console.error("Error generating coaching prompt:", error);
        return NextResponse.json(
            { error: "Failed to generate coaching prompt" },
            { status: 500 }
        );
    }
}
