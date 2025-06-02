// File: app/api/client/forms/autofill/route.ts

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    const formType = req.nextUrl.searchParams.get("formType");

    if (!emailParam || !formType) {
        return NextResponse.json(
            { error: "Missing email or formType" },
            { status: 400 }
        );
    }

    const email: string = emailParam;

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                summaries: true,
                insights: true,
                trustScores: true,
                coachingPrompts: true,
                forms: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const dataBlob = {
            name: client.name,
            trustScore: client.trustScores[0]?.value || 50,
            summaries: client.summaries.map((s) => s.content),
            insights: client.insights.map((i) => ({ tag: i.tag, content: i.content })),
            coaching: client.coachingPrompts.map((c) => c.content),
        };

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert assistant that fills out financial forms such as SEI and Osaic paperwork. Return a fully filled JSON object for the given formType based on the client data provided.`,
                },
                {
                    role: "user",
                    content: `Form type: ${formType}\n\nClient Data: ${JSON.stringify(
                        dataBlob,
                        null,
                        2
                    )}`,
                },
            ],
        });

        const formJson = aiResponse.choices[0].message?.content || "{}";

        const savedForm = await prisma.form.create({
            data: {
                type: formType,
                status: "Generated",
                data: formJson,
                client: { connect: { email } },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Form AutoFill",
                details: `Auto-filled ${formType}`,
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, form: savedForm });
    } catch (error) {
        console.error("Form AutoFill error:", error);
        return NextResponse.json({ error: "Autofill failed" }, { status: 500 });
    }
}
