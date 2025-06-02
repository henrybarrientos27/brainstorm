// File: app/api/client/[email]/forms/generate/route.ts

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
                coachingPrompts: true,
                forms: true,
                timelineEvents: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const prompt = `Generate a recommended list of financial forms the advisor should prepare for ${client.name}, based on their recent activity, insights, and discussions.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a financial assistant. Based on a client's summaries, insights, and behavior, generate a short list of necessary financial forms (e.g. risk tolerance, account opening, beneficiary designation). Respond in JSON with an array of form types.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const json = response.choices[0].message?.content || "[]";
        const formTypes = JSON.parse(json);

        for (const type of formTypes) {
            await prisma.form.create({
                data: {
                    type,
                    status: "recommended",
                    data: "",
                    client: { connect: { email } },
                },
            });
        }

        await prisma.activity.create({
            data: {
                type: "Form Recommendation",
                details: "AI generated recommended forms.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, recommended: formTypes });
    } catch (error) {
        console.error("Error generating forms:", error);
        return NextResponse.json(
            { error: "Failed to generate forms" },
            { status: 500 }
        );
    }
}
