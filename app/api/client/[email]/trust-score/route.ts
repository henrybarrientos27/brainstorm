// File: app/api/client/[email]/trust-score/route.ts

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
                feedback: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const data = `
Client Info:
Name: ${client.name}

Summaries:
${client.summaries.map((s) => s.content).join("\n\n")}

Insights:
${client.insights.map((i) => `${i.tag}: ${i.content}`).join("\n")}

Feedback:
${client.feedback.map((f) => f.content).join("\n")}
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI that reviews client history and assigns a trust score from 1 to 100 based on consistency, transparency, tone, engagement, and behavioral alignment with financial goals.",
                },
                {
                    role: "user",
                    content: data,
                },
            ],
        });

        const response = completion.choices[0].message?.content || "";
        const scoreMatch = response.match(/\d+/);
        const value = scoreMatch ? parseInt(scoreMatch[0]) : null;

        await prisma.trustScore.create({
            data: {
                value,
                client: { connect: { email } },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Trust Score",
                details: "Generated trust score using AI.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, value });
    } catch (error) {
        console.error("Error generating trust score:", error);
        return NextResponse.json(
            { error: "Failed to generate trust score" },
            { status: 500 }
        );
    }
}
